import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import cors from "cors";
import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config();

const app = express();
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET ;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET ;
const SALT_ROUNDS = 10;
const port = 3000;
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    password: '1234',
    database: 'workspace',
    port: '5432'
});
const logPrefix = "<–––––––––––––––Request Start–––––––––––––––>";
const logSuffix = "<––––––––––––––––Request End––––––––––––––––>";
db.connect();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true                
  }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

function localDate(value){
    const actDate = new Date(value);
    const options = { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const localDate = new Intl.DateTimeFormat('en-US', options).format(actDate);
    const date = localDate.toString().split(',')[0];
    return date
  }

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token==null) return res.status(401).json({ message: 'Access token missing' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token expired or invalid' });
      }
      req.user = user;
      next();
    });
  };

  app.post("/authenticate/:email", async (req, res) => {
    const startTimeRequest = Date.now();
    const email = req.params.email;
    const password = req.query.password;
    console.log(logPrefix);
    if (!password || !email) {
        return res.status(200).json({ error: 'Email and password are required.' });
    }
    console.info({message: 'Incoming authentication request', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        const user = await db.query("SELECT * FROM users WHERE user_email=$1", [email]);
        if (user.rows.length === 0) {
            console.warn({ message: "Invalid email / email does not exist", email: email, statusCode: 403});
            console.log(logSuffix);
            return res.status(200).json({ isAuthenticated: false, message: 'Invalid email / email does not exist' });
        }
        const isPasswordValid = bcrypt.compare(password, user.rows[0].user_password);
        if (!isPasswordValid) {
            console.warn({ message: "Invalid credentials", email: email, statusCode: 403});
            console.log(logSuffix);
            return res.status(200).json({ isAuthenticated: false, message: 'Invalid credentials' });
        }
        const refreshToken = jwt.sign({ email: user.rows[0].user_email }, REFRESH_SECRET, { expiresIn: '30d' });
        const accessToken = jwt.sign({ email: user.rows[0].user_email }, JWT_SECRET, { expiresIn: '15m' });
        res.cookie('_auth', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 1000 * 60 * 60 * 24 * 30});
        console.info({ message: "Authentication successful", email: email, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms` });
        console.log(logSuffix);
        return res.status(200).json({ isAuthenticated: true, token: accessToken});
    } catch (error) {
        console.error({ message: "Authentication error", error: error.message, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms` });
        console.log(logSuffix);
        return res.status(200).json({ message: 'Internal server error' });
    };
});

app.post("/refresh-token", (req, res) => {
    const startTimeRequest = Date.now();
    const refreshToken = req.cookies._auth;
    console.log(logPrefix);
    console.info({ message: 'Incoming request to refresh token', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, cookies: req.cookies, userAgent: req.headers['user-agent'] });
    if (!refreshToken) {
        console.warn({ message: "Refresh token not provided", statusCode: 401, requestDuration: `${Date.now() - startTimeRequest}ms` });
        console.log(logSuffix);
        return res.status(401).json({ message: 'Refresh token not provided' });
    };
    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) {
            console.error({ message: "Invalid or expired refresh token", error: err.message, statusCode: 401, requestDuration: `${Date.now() - startTimeRequest}ms` });
            console.log(logSuffix);
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        };
        const newAccessToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '15m' });
        console.info({ message: "New access token generated successfully using refresh token", email: user.email, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms` });
        console.log(logSuffix);
        return res.status(200).json({ token: newAccessToken });
    });
});

app.post("/logout", (req, res) => {
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to log out', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, userAgent: req.headers['user-agent'] });
    res.clearCookie('_auth', { httpOnly: true, secure: true, sameSite: 'Strict' });
    console.info({ message: "User successfully logged out", statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms` });
    console.log(logSuffix);
    return res.status(200).json({ message: 'Logged out successfully' });
});

app.post("/register/:email", async (req, res) => {
    const email = req.params.email;
    const password = req.query.password;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming registration request', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, bodyData: req.body, userAgent: req.headers['user-agent'] });
    try {
        const user = await db.query("SELECT * FROM users WHERE user_email=$1", [email]);
        if (user.rows.length === 0) {
            const hashedPassword = bcrypt.hash(password, SALT_ROUNDS);
            await db.query(
                "INSERT INTO users (user_email, user_password) VALUES ($1, $2)",
                [email, hashedPassword]
            );
            const refreshToken = jwt.sign({ email: email }, REFRESH_SECRET, { expiresIn: '30d' });
            const accessToken = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '15m' });
            res.cookie('_auth', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 1000 * 60 * 60 * 24 * 30});
            console.info({ message: "User registered successfully", email: email, statusCode: 201, requestDuration: `${Date.now() - startTimeRequest}ms` });
            console.log(logSuffix);
            return res.status(200).json({ isAuthenticated: true, token: accessToken});
        } else {
            console.warn({ message: "Registration failed - User already exists", email: email, statusCode: 409, requestDuration: `${Date.now() - startTimeRequest}ms` });
            console.log(logSuffix);
            return res.status(200).json({ message: "Registration failed! User already exists", isAuthenticated: false });
        }
    } catch (error) {
        console.error({ message: "Error registering user", error: error.message, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms` });
        console.log(logSuffix);
        return res.status(500).json({ message: "Error registering user", isAuthenticated: false });
    };
});

app.get("/activities/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const filter = req.query.filter != null ? req.query.filter : 'activity_start_time';
    const startTime = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request for fetching activities', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, queryParams: req.query, params: req.params, filter: filter, userAgent: req.headers['user-agent'] });
    try {
        const data = await db.query(`SELECT * FROM activities WHERE user_email=$1 ORDER BY ${filter}`, [email]);
        if (data.rows.length === 0) {
            const logMessage = `No activities found for email ${email} with ${filter} filter`;
            console.warn({message: logMessage, statusCode: 404, requestDuration: `${Date.now() - startTime}ms`, });
            console.log(logSuffix);
            return res.status(200).json({ message: logMessage });
        };
        console.info({ message: `Successfully retrieved activities for email ${email} using ${filter} filter`, statusCode: 200, requestDuration: `${Date.now() - startTime}ms`, rowCount: data.rows.length, });
        console.log(logSuffix);
        res.json(data.rows);
    } catch (error) {
        const errorMessage = `Error retrieving activities for email ${email} using ${filter} filter`;
        console.error({ message: errorMessage, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTime}ms`, });
        console.log(logSuffix);
        return res.status(200).json({ message: errorMessage });
    };
});


app.get("/activity/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const id = req.query.id;
    const startTime = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request for fetching activity', timestamp: new Date().toISOString(), method: req.method,path: req.originalUrl, queryParams: req.query,params: req.params, userAgent: req.headers['user-agent'],
    });
    try {
        const data = await db.query("SELECT * FROM activities WHERE activity_uuid = $1 AND user_email = $2", [id, email]);
        if (data.rows.length === 0) {
            const logMessage = `No activity found with id ${id} and email ${email}`;
            console.warn({message: logMessage, statusCode: 404, requestDuration: `${Date.now() - startTime}ms`, });
            console.log(logSuffix);
            return res.status(200).json({ message: logMessage });
        }
        console.info({message: `Successfully retrieved daily activity with id ${id}`, statusCode: 200, requestDuration: `${Date.now() - startTime}ms`});
        console.log(logSuffix);
        res.json(data.rows);
    } catch (error) {
        const errorMessage = `Error retrieving activity with id ${id} for email ${email}`;
        console.error({ message: errorMessage, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTime}ms`,
        });
        console.log(logSuffix);
        res.status(200).json({ message: errorMessage });
    };
});

app.post("/add-activity/:email", verifyToken, async (req, res) => {
    const { actName, actDescr, priority, startTime, endTime } = req.body.data;
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to add activity', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, requestBody: req.body.data, userAgent: req.headers['user-agent']});
    try {
        await db.query(
            "INSERT INTO activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, user_email) VALUES ($1, $2, $3, $4, $5, $6)", 
            [actName, actDescr, priority, startTime, endTime, email]
        );
        console.info({ message: `Successfully added activity with name: ${actName}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`,email});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully added the daily activity with name: ${actName}`, flag:true });
    } catch (error) {
        console.error({ message: `Failed to add activity with name: ${actName}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in adding the daily activity with name ${actName}: ${error.message}`, flag:false });
    };
});

app.post("/update-da-status/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const actId = req.query.id;
    const actStatus = req.query.status;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to update activity status', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, queryParams: req.query, params: req.params, userAgent: req.headers['user-agent']});
    try {
        await db.query(
            "UPDATE activities SET activity_status = $1 WHERE activity_uuid = $2 AND user_email = $3", 
            [actStatus, actId, email]
        );
        console.info({ message: `Successfully updated the activity status for activity ID: ${actId}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`, email, newStatus: actStatus,});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully updated the activity status for activity ID: ${actId}` });
    } catch (error) {
        console.error({message: `Failed to update the activity status for activity ID: ${actId}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in updating the activity status for activity ID: ${actId}: ${error.message}` });
    };
});

app.patch("/edit-activity/:email", verifyToken, async (req, res) => {
    const { actName, actStart, actEnd, actPriority, id } = req.body.data;
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to edit activity', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, requestBody: req.body.data, userAgent: req.headers['user-agent']});
    try {
        await db.query(
            "UPDATE activities SET activity_name = $1, activity_priority = $2, activity_start_time = $3, activity_end_time = $4 WHERE activity_uuid = $5 AND user_email = $6", 
            [actName, actPriority, actStart, actEnd, id, email]
        );
        console.info({ message: `Successfully updated activity with ID: ${id}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`, email, updatedFields: { actName, actStart, actEnd, actPriority }});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully updated the daily activity with ID: ${id}` });
    } catch (error) {
        console.error({message: `Failed to update activity with ID: ${id}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`,});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in updating the daily activity with ID: ${id}: ${error.message}` });
    };
});

app.delete("/delete-activity/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const id = req.query.id;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to delete activity', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        const record = await db.query("SELECT * FROM activities WHERE activity_uuid = $1 AND user_email = $2", [id, email]);
        if (record.rows.length > 0) {
            await db.query("DELETE FROM activities WHERE activity_uuid = $1 AND user_email = $2", [id, email]);
            console.info({message: `Successfully deleted activity with ID: ${id}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`, email});
            console.log(logSuffix);
            res.status(200).json({ message: `Successfully deleted the daily activity with id ${id}` });
        } else {
            console.warn({ message: `No activity found with ID: ${id}`, statusCode: 404, email, requestDuration: `${Date.now() - startTimeRequest}ms`});
            console.log(logSuffix);
            res.status(200).json({ message: `No activity found with id ${id}` });
        }
    } catch (error) {
        console.error({ message: `Failed to delete activity with ID: ${id}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`,});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in deleting the daily activity with id ${id}: ${error.message}` });
    };
});

app.get("/current-activities/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({message: 'Incoming request to retrieve current activities', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query('SELECT * FROM current_day_activities WHERE user_email=$1 ORDER BY activity_start_time', [email]);
        console.info({ message: `Successfully retrieved current activities for email: ${email}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`, numberOfActivities: data.rows.length});
        console.log(logSuffix);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error({ message: `Failed to retrieve current activities for email: ${email}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in retrieving today's activities: ${error.message}` });
    };
});

app.get("/current-day-missed-activities/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to retrieve missed activities', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query('SELECT * FROM current_day_activities WHERE user_email = $1 AND activity_status = 0 ORDER BY activity_start_time', [email]);
        console.info({ message: `Successfully retrieved missed activities for email: ${email}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`, numberOfMissedActivities: data.rows.length});
        console.log(logSuffix);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error({ message: `Failed to retrieve missed activities for email: ${email}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in retrieving today's missed activities: ${error.message}` });
    };
});

app.post("/add-current-day-activity/:email", verifyToken, async (req, res) => {
    const { actName, actDescr, priority, startTime, endTime } = req.body.data;
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({message: 'Incoming request to add current day activity', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, requestBody: req.body.data, userAgent: req.headers['user-agent']});
    try {
        await db.query(
            "INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, user_email) VALUES ($1, $2, $3, $4, $5, $6)", 
            [actName, actDescr, priority, startTime, endTime, email]
        );
        console.info({message: `Successfully added activity "${actName}" to current day schedule`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`, activityDetails: { actName, actDescr, priority, startTime, endTime, email }});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully added the activity "${actName}" to today's schedule`, flag: true });
    } catch (error) {
        console.error({ message: `Failed to add activity "${actName}" to current day schedule`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in adding the activity "${actName}" to today's schedule: ${error.message}`, flag: false });
    };
});

app.post("/update-ca-status/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const actId = req.query.id;
    const actStatus = req.query.status;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to update activity status', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        await db.query(
            "UPDATE current_day_activities SET activity_status=$1 WHERE activity_uuid=$2 AND user_email=$3", 
            [actStatus, actId, email]
        );
        console.info({ message: `Successfully updated status of activity with ID: ${actId}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`, updatedStatus: actStatus});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully updated the activity status of today's activity with id: ${actId}` });
    } catch (error) {
        console.error({ message: `Failed to update status of activity with ID: ${actId}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in updating the activity status of today's activity with id: ${actId}: ${error.message}` });
    };
});

app.delete("/delete-current-activity/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const id = req.query.id;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to delete current activity', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        const result = await db.query("DELETE FROM current_day_activities WHERE activity_uuid = $1 AND user_email = $2", [id, email]);
        if (result.rowCount > 0) {
            console.info({ message: `Successfully deleted current activity with ID: ${id}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
            console.log(logSuffix);
            res.status(200).json({ message: `Successfully deleted today's activity with id: ${id}` });
        } else {
            console.warn({ message: `No activity found with ID: ${id}`, statusCode: 404, requestDuration: `${Date.now() - startTimeRequest}ms`});
            console.log(logSuffix);
            res.status(200).json({ message: `No activity found with id: ${id}` });
        }
    } catch (error) {
        console.error({ message: `Failed to delete activity with ID: ${id}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in deleting today's activity with id: ${id}: ${error.message}` });
    };
});

app.delete("/delete-current-activities/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to delete all current day activities', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, userAgent: req.headers['user-agent']});
    try {
        await db.query("DELETE FROM current_day_activities WHERE user_email=$1", [email]);
        console.info({ message: `Successfully deleted all current day activities for email: ${email}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: "Successfully deleted today's activities" });
    } catch (error) {
        console.error({ message: `Failed to delete all current day activities for email: ${email}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in deleting today's activities: ${error.message}` });
    };
});

app.get("/combined-activities/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({message: 'Incoming request to retrieve combined daily and current day activities', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query('SELECT * FROM activities WHERE user_email = $1 UNION SELECT * FROM current_day_activities WHERE user_email = $1 ORDER BY activity_start_time, activity_end_time', [email]);
        console.info({message: `Successfully retrieved combined daily and current day activities for email: ${email}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error({ message: `Failed to retrieve combined daily and current day activities for email: ${email}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in retrieving today's and daily activities: ${error.message}` });
    };
});

app.get("/missed-activities/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to retrieve missed activities', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query('SELECT * FROM missed_activities WHERE user_email = $1', [email]);
        console.info({ message: `Successfully retrieved missed activities for email: ${email}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error({ message: `Failed to retrieve missed activities for email: ${email}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in retrieving missed activities: ${error.message}` });
    };
});

app.get("/missed-activity/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const id = req.query.id;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to retrieve a missed activity by ID', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query('SELECT * FROM missed_activities WHERE user_email = $1 AND activity_uuid = $2', [email, id]);
        if (data.rows.length > 0) {
            console.info({ message: `Successfully retrieved missed activity with ID: ${id}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
            console.log(logSuffix);
            res.status(200).json(data.rows);
        } else {
            console.warn({ message: `No missed activity found with ID: ${id}`, statusCode: 404, requestDuration: `${Date.now() - startTimeRequest}ms`});
            console.log(logSuffix);
            res.status(200).json({ message: `No missed activity found with id: ${id}` });
        }
    } catch (error) {
        console.error({ message: `Failed to retrieve missed activity with ID: ${id}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in retrieving the missed activity with id: ${id}: ${error.message}` });
    };
});

app.get("/missed-activities-dates/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to retrieve dates of missed activities', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query('SELECT DISTINCT activity_date FROM missed_activities WHERE user_email = $1 ORDER BY activity_date DESC', [email]);
        console.info({ message: `Successfully retrieved missed activity dates for email: ${email}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error({ message: `Failed to retrieve missed activity dates for email: ${email}`, error: error.message, stack: error.stack, statusCode: 404, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in retrieving missed activity dates: ${error.message}` });
    };
});

app.post("/add-missed-activities/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const id = req.query.id;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to add missed activity back to the current schedule', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query('SELECT * FROM missed_activities WHERE activity_uuid=$1 AND user_email=$2', [id, email]);
        if (data.rows.length === 0) {
            console.warn({ message: `No missed activity found with ID: ${id}`, statusCode: 404, requestDuration: `${Date.now() - startTimeRequest}ms` });
            return res.status(200).json({ message: `No missed activity found with id: ${id}` });
        };
        const record = data.rows[0];
        await db.query(
            "INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, user_email) VALUES ($1, $2, $3, $4, $5, $6)", 
            [record.activity_name, record.activity_description, record.activity_priority, record.activity_start_time, record.activity_end_time, email]
        );
        console.info({ message: `Successfully added missed activity with ID: ${id} back to the current schedule`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        return res.status(200).json({ message: `Successfully added the missed activity with id ${id} back to the current schedule` });
    } catch (error) {
        if (error.code === '23505') {
            console.warn({ message: `Duplicate activity: Activity with ID: ${id} already exists in the current schedule`, statusCode: 409, requestDuration: `${Date.now() - startTimeRequest}ms`});
            return res.status(200).json({ message: `The activity with id ${id} already exists in the current schedule.` });
        }
        console.error({ message: `Failed to add missed activity with ID: ${id} back to the current schedule`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        return res.status(200).json({ message: `Error while adding missed activity with id ${id} back to the current schedule: ${error.message}` });
    };
});

app.patch("/edit-missed-activity/:email", verifyToken, async (req, res) => {
    const { actName, actStart, actEnd, actPriority, id } = req.body.data;
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to edit missed activity', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, bodyData: req.body.data, userAgent: req.headers['user-agent']});
    try {
        await db.query(
            "UPDATE missed_activities SET activity_name = $1, activity_priority = $2, activity_start_time = $3, activity_end_time = $4 WHERE activity_uuid = $5 AND user_email = $6",
            [actName, actPriority, actStart, actEnd, id, email]
        );
        console.info({ message: `Successfully updated missed activity with id: ${id}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully updated missed activity with id ${id}` });
    } catch (error) {
        console.error({ message: `Failed to update missed activity with id: ${id}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in updating the missed activity with id ${id}: ${error.message}` });
    }
});

app.delete("/delete-missed-activity/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const id = req.query.id;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to delete missed activity', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        await db.query("DELETE FROM missed_activities WHERE activity_uuid=$1 AND user_email=$2", [id, email]);
        console.info({ message: `Successfully deleted missed activity with id: ${id}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully deleted missed activity with id ${id}` });
    } catch (error) {
        console.error({ message: `Failed to delete missed activity with id: ${id}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in deleting the missed activity with id ${id}: ${error.message}` });
    };
});

app.get("/upcoming-activities/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const date = localDate(req.query.date);
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to retrieve upcoming activities', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query("SELECT * FROM upcoming_activities WHERE user_email=$1 AND activity_date=$2 ORDER BY activity_start_time", [email, date]);
        console.info({ message: `Successfully retrieved upcoming activities on date: ${date}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms` });
        console.log(logSuffix);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error({ message: `Failed to retrieve upcoming activities on date: ${date}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in retrieving the upcoming activities on date ${date}: ${error.message}` });
    }
});

app.get("/upcoming-activity/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const id = req.query.id;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to retrieve an upcoming activity by ID', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query("SELECT * FROM upcoming_activities WHERE activity_uuid=$1 AND user_email=$2 ORDER BY activity_start_time", [id, email]);
        console.info({ message: `Successfully retrieved upcoming activity with id: ${id}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error({ message: `Failed to retrieve upcoming activity with id: ${id}`, error: error.message, stack: error.stack, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in retrieving the upcoming activity with id ${id}: ${error.message}` });
    };
});

app.post("/add-upcoming-activities/:email", verifyToken, async (req, res) => {
    const { actName, actDescr, priority, startTime, endTime, actDate } = req.body;
    const email = req.params.email;
    const updatedActDate = new Date(actDate);
    updatedActDate.setHours(updatedActDate.getHours() - 4);
    const finalDate = updatedActDate.toISOString().split('T')[0];
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({message: 'Incoming request to add upcoming activities',timestamp: new Date().toISOString(),method: req.method,path: req.originalUrl,params: req.params,bodyData: req.body, adjustedDate: finalDate, userAgent: req.headers['user-agent']});
    try {
        await db.query(
            "INSERT INTO upcoming_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, activity_date, user_email) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [actName, actDescr, priority, startTime, endTime, finalDate, email]
        );
        console.info({ message: `Successfully added the upcoming activity: ${actName} on ${finalDate}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully added the upcoming activity with name ${actName} on ${finalDate}.`, flag: true });
    } catch (error) {
        console.error({ message: `Unsuccessful in adding the upcoming activity: ${actName} on ${finalDate}`, error: error.message, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in adding the upcoming activity with name ${actName} on ${finalDate}: ${error.message}`, flag:false });
    }
});

app.post("/add-upcoming-activity/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const actDate = localDate(req.query.date);
    const id = req.query.id;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to add an upcoming activity to today’s schedule', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent']});
    try {
        const data = await db.query("SELECT * FROM upcoming_activities WHERE activity_date=$1 AND activity_uuid=$2 AND user_email=$3", [actDate, id, email]);
        const record = data.rows[0];
        await db.query(
            "INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, user_email) VALUES ($1, $2, $3, $4, $5, $6)",
            [record.activity_name, record.activity_description, record.activity_priority, record.activity_start_time, record.activity_end_time, email]
        );
        console.info({ message: `Successfully added the upcoming activity with id: ${id} to today’s schedule`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully added the upcoming activity with id ${id} to today's schedule` });
    } catch (error) {
        console.error({ message: `Failed to add the upcoming activity with id ${id} to today’s schedule`, error: error.message, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms`
        });
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in adding the upcoming activity with id ${id} to today's schedule: ${error.message}` });
    };
});

app.patch("/edit-upcoming-activity/:email", verifyToken, async (req, res) => {
    const { actName, actStart, actEnd, actPriority, id } = req.body.data;
    const email = req.params.email;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to edit an upcoming activity', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, bodyData: req.body.data, userAgent: req.headers['user-agent']});
    try {
        await db.query(
            "UPDATE upcoming_activities SET activity_name = $1, activity_priority = $2, activity_start_time = $3, activity_end_time = $4 WHERE activity_uuid = $5 AND user_email = $6",
            [actName, actPriority, actStart, actEnd, id, email]
        );
        console.info({ message: `Successfully updated the upcoming activity with id ${id}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully updated the upcoming activity with id ${id}` });
    } catch (error) {
        console.error({ message: `Failed to update the upcoming activity with id: ${id}`, error: error.message, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms` });
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in updating the upcoming activity with id ${id}: ${error.message}` });
    };
});

app.delete("/delete-upcoming-activity/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const actDate = localDate(req.query.date);
    const id = req.query.id;
    const startTimeRequest = Date.now();
    console.log(logPrefix);
    console.info({ message: 'Incoming request to delete an upcoming activity', timestamp: new Date().toISOString(), method: req.method, path: req.originalUrl, params: req.params, queryParams: req.query, userAgent: req.headers['user-agent'] });
    try {
        await db.query("DELETE FROM upcoming_activities WHERE user_email = $1 AND activity_date=$2 AND activity_uuid=$3", [email, actDate, id]);
        console.info({ message: `Successfully deleted the upcoming activity with id: ${id}, scheduled on ${actDate}`, statusCode: 200, requestDuration: `${Date.now() - startTimeRequest}ms`});
        console.log(logSuffix);
        res.status(200).json({ message: `Successfully deleted the upcoming activity with id ${id} scheduled on ${actDate}.` });
    } catch (error) {
        console.error({ message: `Failed to delete the upcoming activity with id: ${id}, scheduled on ${actDate}`, error: error.message, statusCode: 500, requestDuration: `${Date.now() - startTimeRequest}ms` });
        console.log(logSuffix);
        res.status(200).json({ message: `Unsuccessful in deleting the upcoming activity with id ${id} scheduled on ${actDate}: ${error.message}` });
    };
});

cron.schedule('2 0 * * *', async () => {
    const jobStartTime = Date.now();
    console.log(logPrefix);
    console.log('Running daily job at 12:00 AM');
    console.info({ message: "Daily cron job started", timestamp: new Date().toISOString(), job: "Daily Task", scheduledTime: "12:00 AM" });
    try {
        const records = await db.query("SELECT * FROM current_day_activities WHERE activity_status IS NULL OR activity_status=0");
        console.info({ message: `Fetched ${records.rows.length} current day activities with status null or 0`, statusCode: 200, });
        if (records.rows.length > 0) {
            const now = new Date();
            now.setDate(now.getDate() - 1);
            const missedActivities = records.rows.map(record => ({
                ...record, 
                activity_date: now.toISOString().split('T')[0]  
            }));

            for (const element of missedActivities) {
                try {
                    await db.query(
                        "INSERT INTO missed_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, activity_date, user_email) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
                        [element.activity_name, element.activity_description, element.activity_priority, element.activity_start_time, element.activity_end_time, element.activity_date, element.user_email]
                    );
                    console.info({ message: `Inserted missed activity: ${element.activity_name} for user: ${element.user_email}`, statusCode: 201, });
                } catch (insertError) {
                    console.error({ message: `Failed to insert missed activity: ${element.activity_name} for user: ${element.user_email}`, error: insertError.message, });
                }
            }
            console.log("Successfully added today's missed activities to `missed_activities`.");
            try {
                await db.query("DELETE FROM current_day_activities");
                console.info({ message: "Successfully deleted current day activities", statusCode: 200, });
            } catch (deleteError) {
                console.error({ message: "Failed to delete current day activities", error: deleteError.message, });
            }
        } else {
            console.info({ message: "No missing activities to process", statusCode: 204, });
        }
        try {
            const now1 = new Date();
            const upcActDate = now1.toISOString().split('T')[0];
            const upcRecords = (await db.query("SELECT * FROM upcoming_activities WHERE activity_date=$1", [upcActDate])).rows;
            console.info({ message: `Fetched ${upcRecords.length} upcoming activities for today (${upcActDate})`, statusCode: 200, });
            for (const element of upcRecords) {
                try {
                    await db.query(
                        "INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, user_email) VALUES ($1, $2, $3, $4, $5, $6)", 
                        [element.activity_name, element.activity_description, element.activity_priority, element.activity_start_time, element.activity_end_time, element.user_email]
                    );
                    console.info({ message: `Inserted upcoming activity: ${element.activity_name}`, statusCode: 201, });
                } catch (insertError) {
                    console.error({ message: `Failed to insert upcoming activity: ${element.activity_name}`, error: insertError.message, });
                }
            }
            try {
                await db.query("DELETE FROM upcoming_activities WHERE activity_date=$1", [upcActDate]);
                console.info({ message: "Successfully deleted today's upcoming activities", statusCode: 200, });
            } catch (deleteError) {
                console.error({ message: "Failed to delete today's upcoming activities", error: deleteError.message, });
            }
        } catch (upcError) {
            console.error({ message: "Failed to fetch upcoming activities", error: upcError.message, });
        }
        try {
            await db.query("UPDATE activities SET activity_status = NULL");
            console.info({ message: "Successfully reset activity statuses", statusCode: 200, });
        } catch (updateError) {
            console.error({ message: "Failed to update activity statuses", error: updateError.message, });
        };
    } catch (error) {
        console.error({ message: "Error during daily cron job execution", error: error.message, });
    } finally {
        console.info({ message: "Daily cron job finished", jobDuration: `${Date.now() - jobStartTime}ms`, timestamp: new Date().toISOString() });
    };
});


app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});