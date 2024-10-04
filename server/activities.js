import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import cron from 'node-cron';

const app = express();
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    password: '1234',
    database: 'workspace',
    port: '5432'
});

db.connect();

const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.get("/activities", async (req,res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM activities ORDER BY activity_start_time');
        console.log("Successfully retrieved daily activities");
        res.json(data.rows);
    } catch (error) {
        console.log("UnSuccessful in retrieving the daily activities");
        res.status(404).json({ message: `Unsuccessful in retrieving the daily activities: ${error}`});
    };
});

app.get("/activities/:filter", async(req, res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const filter = req.params.filter;
    try {
        const data = await db.query(`SELECT * FROM activities ORDER BY ${filter}`);
        console.log(`Successfully retrieved daily activities through ${filter} filter`);
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the daily activities through ${filter} filter`);
        res.status(404).json({ message: `Unsuccessful in retrieving the daily activities through filter: ${error}`});
    };
})

app.get("/activity/:id", async (req,res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        const data = await db.query("SELECT * FROM activities WHERE activity_uuid = $1", [id]);
        console.log(`Successfully retrieved daily activities through id ${id}`);
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the activity with id ${id}: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the activity with id ${id}: ${error}`});
    };
});

app.post("/add-activity", async (req, res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const {actName,actDescr,priority,startTime,endTime} = req.body.data;
    try {
        await db.query(
        "INSERT INTO activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)", 
        [actName, actDescr, priority, startTime, endTime]);
        console.log("Successfully added the daily activity");
        res.status(200).json({ message: `Successfully added the daily activity`});
    } catch (error) {
        console.log(`Unsuccessful in adding the activity: ${error}`);
        res.status(500).json(`Unsuccessful in adding the activity: ${error}`);
    };
});

app.delete("/delete-activity/:id", async(req, res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        const record = await db.query("SELECT * FROM activities WHERE activity_uuid = $1", [id]);
        if(record.rows.length>0){
            await db.query("DELETE FROM activities WHERE activity_uuid = $1", [id]);
            console.log("Successfully deleted the daily activity with id", id);
            res.status(200).json({ message: `Successfully deleted the daily activity with id ${id}`});
        } else {
            console.log(`Unsuccessful in deleting the daily activity with id ${id}`);
            res.json({ message: `Unsuccessful in deleting the daily activity with id ${id}`});
        }
    } catch (error) {
        console.log(`Unsuccessful in deleting the daily activity with id ${id}: ${error}`);
        res.json(`Unsuccessful in deleting the daily activity with id ${id}: ${error}`);
    };
});

app.patch("/edit-activity", async(req, res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const {actName, actStart, actEnd, actPriority, id} = req.body.data;
    try {
        await db.query("UPDATE activities SET activity_name = $1, activity_priority = $2, activity_start_time = $3, activity_end_time = $4 WHERE activity_uuid = $5", [actName, actPriority, actStart, actEnd, id]);
        console.log(`Successfully updated the daily activity with id ${id}`);
        res.status(200).json({ message: `Successfully updated the daily activity with id ${id}`});
    } catch (error) {
        console.log(`Unsuccessful in updating the daily activity with ${id}: ${error}`);
        res.json({ message: `Unsuccessful in updating the daily activity with id ${id}: ${error}`});
    };
});

app.get("/current-activities", async (req,res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM current_day_activities ORDER BY activity_start_time');
        console.log("Successfully retrieved the current day activities");
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the current day activities: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the current day activities: ${error}`});
    };
});

app.get("/current-day-missed-activities", async (req,res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM current_day_activities WHERE activity_status=0 ORDER BY activity_start_time');
        console.log("Successful retrieved the current day missed activities");
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the current day missed activities: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the current day missed activities: ${error}`});
    };
});


app.get("/combined-activities", async (req,res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM activities UNION SELECT * FROM current_day_activities ORDER BY activity_start_time, activity_end_time');
        console.log("Successfully retrieved the combined activities");
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the combined activities: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the combined activities: ${error}`});
    };
});

app.post("/add-current-day-activity", async (req,res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const {actName,actDescr,priority,startTime,endTime} = req.body.data;
    try {
        await db.query(
        "INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)", 
        [actName, actDescr, priority, startTime, endTime]);
        console.log("Successfully added the current day activity");
        res.status(200).json({ message: `Successfully inserted the the current day activity`});
    } catch (error) {
        console.log(`Unsuccessful in adding the current day activity: ${error}`);
        res.status(500).json(`Unsuccessful in adding the current day activity: ${error}`);
    };
});

app.post("/update-da-status", async (req,res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const {actId, actStatus} = req.body.data;
    try {
        await db.query(
        "UPDATE activities SET activity_status = $1 WHERE activity_uuid=$2", 
        [actStatus, actId]);
        console.log("Successfully updated the daily activity status");
        res.status(200).json({ message: `Successfully updated the daily activity status`});
    } catch (error) {
        console.log(`Unsuccessful in updating the daily activity status: ${error}`);
        res.status(500).json(`Unsuccessful in updating the daily activity status: ${error}`);
    };
});

app.post("/update-ca-status", async (req,res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const {actId, actStatus} = req.body.data;
    try {
        await db.query(
        "UPDATE current_day_activities SET activity_status=$1 WHERE activity_uuid=$2", 
        [actStatus, actId]);
        console.log("Successfully updated the current day activity status");
        res.status(200).json({ message: `Successfully updated the current day activity status`});
    } catch (error) {
        console.log(`Unsuccessful in updating the current day activity status: ${error}`);
        res.status(500).json(`Unsuccessful in updating the current day activity status: ${error}`);
    };
});

app.delete("/delete-current-activities", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        await db.query("DELETE FROM current_day_activities")
        console.log("Successfully deleted the current day activities");
        res.status(200).json({ message: `Successfully deleted the current day activities`});
    } catch (error) {
        console.log(`Unsuccessful in deleting the current day activities: ${error}`);
        res.status(404).json(`Unsuccessful in deleting the current day activities: ${error}`);
    };
});

app.patch("/reset-daily-activities-status", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        await db.query("UPDATE activities SET activity_status = NULL");
        console.log("Status of daily activities successfully reset");
        res.status(200).json({ message: `Status of daily activities successfully reset`});
    } catch (error) {
        console.log(`Unsuccessful in resetting the status of daily activities: ${error}`);
        res.status(404).json(`Unsuccessful in resetting the status of daily activities: ${error}`);
    }
});

app.get("/missed-activities", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM missed_activities');
        console.log("Successfully retrieved the missed activities");
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the missed activities: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the missed activities: ${error}`});
    };
});

app.get("/missed-activity/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        const data = await db.query('SELECT * FROM missed_activities WHERE activity_uuid = $1', [id]);
        console.log("Successfully retrieved the missed activities");
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the missed activities: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the missed activities: ${error}`});
    };
});

app.get("/missed-activities-dates", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT DISTINCT activity_date from missed_activities ORDER BY activity_date DESC');
        console.log("Successfully retrieved the dates of missed activities");
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the dates of the missed activities: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the dates of the missed activities: ${error}`});
    };
});

app.post("/add-missed-activities/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        const data = await db.query('SELECT * FROM missed_activities WHERE activity_uuid=$1', [id]);
        const record = data.rows[0];
        await db.query("INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)", 
        [record.activity_name, record.activity_description,record.activity_priority, record.activity_start_time, record.activity_end_time]);
        console.log(`Successfully added the missed activity with id ${id} back`);
        res.status(200).json({ message: `Successfully added the missed activity with id ${id} back`});
    } catch (error) {
        console.error(error);
        console.log(`Unsuccessful in adding the missed activity with id ${id} back: ${error}.`);
        res.status(500).json({ message: `Unsuccessful in adding the missed activity with id ${id} back: ${error}.` });
    };
});

app.delete("/delete-missed-activity/:id", async(req, res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        await db.query("DELETE FROM missed_activities WHERE activity_uuid=$1", [id]);
        console.log(`Successfully deleted the missed activity with ${id}.`);
        res.status(200).json({ message: `Successfully deleted the missed activity with id ${id}.`});
    } catch (error) {
        console.error(error);
        console.log(`Unsuccessful in deleting the missed activity with ${id}: ${error}.`);
        res.status(500).json({ message: `Unsuccessful in deleting the missed activity with id ${id}: ${error}.` });
    };
});

app.patch("/edit-missed-activity", async(req, res)=>{
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const {actName, actStart, actEnd, actPriority, id} = req.body.data;
    try {
        await db.query("UPDATE missed_activities SET activity_name = $1, activity_priority = $2, activity_start_time = $3, activity_end_time = $4 WHERE activity_uuid = $5", [actName, actPriority, actStart, actEnd, id]);
        console.log(`Successfully updated the missed activity with id ${id}`);
        res.status(200).json({ message: `Successfully updated the missed activity with id ${id}`});
    } catch (error) {
        console.log(`Unsuccessful in updating the missed activity with ${id}: ${error}`);
        res.json({ message: `Unsuccessful in updating the missed activity with id ${id}: ${error}`});
    };
});

cron.schedule('0 0 * * *', async () => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    console.log('Running daily job at 12:00 AM');
    try {
        const records = await db.query("SELECT * FROM current_day_Activities WHERE activity_status IS NULL OR activity_status=0");
        if (records.rows.length > 0) {
            const now = new Date();
            now.setDate(now.getDate() - 1)
            const missedActivities = records.rows.map(record => ({
                ...record, activity_date: now.toISOString().split('T')[0]
            }));
            for (const element of missedActivities) {
                await db.query("INSERT INTO missed_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, activity_date) VALUES ($1, $2, $3, $4, $5, $6)", 
                [element.activity_name, element.activity_description, element.activity_priority, element.activity_start_time, element.activity_end_time, element.activity_date]);
            };
            console.log("Successfully added current missed activities into missed activities");
            await db.query("DELETE FROM current_day_activities");
        } else {
            console.log("No missing activities");
        };
         await db.query("UPDATE activities SET activity_status = NULL");
    } catch (error) {
        console.error('Error in daily job:', error);
    };
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});