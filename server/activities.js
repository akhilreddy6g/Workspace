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

function localDate(value){
    const actDate = new Date(value);
    const options = { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const localDate = new Intl.DateTimeFormat('en-US', options).format(actDate);
    const date = localDate.toString().split(',')[0];
    return date
  }

db.connect();

const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.get("/activities", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM activities ORDER BY activity_start_time');
        if (data.rows.length === 0) {
            console.log("No activities found for the current day.");
            return res.status(404).json({ message: "No activities found for the current day." });
        }
        console.log("Successfully retrieved daily activities");
        res.status(200).json(data.rows);
    } catch (error) {
        console.error(`Error occurred while retrieving daily activities: ${error.message}`);
        if (error.code === 'ECONNREFUSED') {
            console.log("Database connection refused.");
            return res.status(503).json({ message: "Service unavailable. Unable to connect to the database." });
        }
        res.status(500).json({ message: `Error retrieving daily activities: ${error.message}` });
    }
});

app.get("/activities/:filter", async(req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const filter = req.params.filter;
    try {
        const data = await db.query(`SELECT * FROM activities ORDER BY ${filter}`);
        console.log(`Successfully retrieved daily activities through ${filter} filter`);
        res.json(data.rows);
    } catch (error) {
        console.error(`Unsuccessful in retrieving the daily activities through ${filter} filter: ${error.message}`);
        res.status(400).json({ message: `Unsuccessful in retrieving the daily activities through ${filter} filter: ${error.message}` });
    }
});

app.get("/activity/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        const data = await db.query("SELECT * FROM activities WHERE activity_uuid = $1", [id]);
        if (data.rows.length === 0) {
            console.log(`No activity found with id ${id}`);
            return res.status(404).json({ message: `No activity found with id ${id}` });
        }
        console.log(`Successfully retrieved daily activity with id ${id}`);
        res.json(data.rows);
    } catch (error) {
        console.error(`Unsuccessful in retrieving the activity with id ${id}: ${error.message}`);
        res.status(500).json({ message: `Unsuccessful in retrieving the activity with id ${id}: ${error.message}` });
    }
});

app.post("/add-activity", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const { actName, actDescr, priority, startTime, endTime } = req.body.data;
    try {
        await db.query(
            "INSERT INTO activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)", 
            [actName, actDescr, priority, startTime, endTime]
        );
        console.log("Successfully added the daily activity with name:", actName);
        res.status(200).json({ message: `Successfully added the daily activity with name: ${actName}` });
    } catch (error) {
        console.error(`Unsuccessful in adding the daily activity with name ${actName}: ${error.message}`);
        res.status(500).json({ message: `Unsuccessful in adding the daily activity with name ${actName}: ${error.message}` });
    }
});

app.post("/update-da-status", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const { actId, actStatus } = req.body.data;
    try {
        await db.query(
            "UPDATE activities SET activity_status = $1 WHERE activity_uuid = $2", 
            [actStatus, actId]
        );
        console.log("Successfully updated the activity status of daily activity with id:", actId);
        res.status(200).json({ message: `Successfully updated the activity status of daily activity with id: ${actId}` });
    } catch (error) {
        console.error(`Unsuccessful in updating the activity status of daily activity with id: ${actId}: ${error.message}`);
        res.status(500).json({ message: `Unsuccessful in updating the activity status of daily activity with id: ${actId}: ${error.message}` });
    }
});

app.patch("/edit-activity", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const { actName, actStart, actEnd, actPriority, id } = req.body.data;
    try {
        await db.query(
            "UPDATE activities SET activity_name = $1, activity_priority = $2, activity_start_time = $3, activity_end_time = $4 WHERE activity_uuid = $5", 
            [actName, actPriority, actStart, actEnd, id]
        );
        console.log(`Successfully updated the daily activity with id ${id}`);
        res.status(200).json({ message: `Successfully updated the daily activity with id ${id}` });
    } catch (error) {
        console.error(`Unsuccessful in updating the daily activity with id ${id}: ${error.message}`);
        res.status(500).json({ message: `Unsuccessful in updating the daily activity with id ${id}: ${error.message}` });
    }
});

app.patch("/reset-daily-activities-status", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        await db.query("UPDATE activities SET activity_status = NULL");
        console.log("Status of daily activities successfully reset");
        res.status(200).json({ message: "Status of daily activities successfully reset" });
    } catch (error) {
        console.error(`Unsuccessful in resetting the status of daily activities: ${error.message}`);
        res.status(404).json({ message: `Unsuccessful in resetting the status of daily activities: ${error.message}` });
    }
});

app.delete("/delete-activity/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        const record = await db.query("SELECT * FROM activities WHERE activity_uuid = $1", [id]);
        if (record.rows.length > 0) {
            await db.query("DELETE FROM activities WHERE activity_uuid = $1", [id]);
            console.log("Successfully deleted the daily activity with id", id);
            res.status(200).json({ message: `Successfully deleted the daily activity with id ${id}` });
        } else {
            console.log(`No activity found with id ${id}`);
            res.status(404).json({ message: `No activity found with id ${id}` });
        }
    } catch (error) {
        console.error(`Unsuccessful in deleting the daily activity with id ${id}: ${error.message}`);
        res.status(500).json({ message: `Unsuccessful in deleting the daily activity with id ${id}: ${error.message}` });
    }
});

app.get("/current-activities", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM current_day_activities ORDER BY activity_start_time');
        console.log("Successfully retrieved today's activities");
        res.json(data.rows);
    } catch (error) {
        console.error(`Unsuccessful in retrieving today's activities: ${error.message}`);
        res.status(404).json({ message: `Unsuccessful in retrieving today's activities: ${error.message}` });
    }
});

app.get("/current-day-missed-activities", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM current_day_activities WHERE activity_status=0 ORDER BY activity_start_time');
        console.log("Successfully retrieved today's missed activities");
        res.json(data.rows);
    } catch (error) {
        console.error(`Unsuccessful in retrieving today's missed activities: ${error.message}`);
        res.status(404).json({ message: `Unsuccessful in retrieving today's missed activities: ${error.message}` });
    }
});

app.post("/add-current-day-activity", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const { actName, actDescr, priority, startTime, endTime } = req.body.data;
    try {
        await db.query(
            "INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)", 
            [actName, actDescr, priority, startTime, endTime]
        );
        console.log(`Successfully added the activity with name ${actName} to today's schedule`);
        res.status(200).json({ message: `Successfully added the activity with name ${actName} to today's schedule` });
    } catch (error) {
        console.error(`Unsuccessful in adding the activity with name ${actName} to today's schedule: ${error.message}`);
        res.status(500).json({ message: `Unsuccessful in adding the activity with name ${actName} to today's schedule: ${error.message}` });
    }
});

app.post("/update-ca-status", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const { actId, actStatus } = req.body.data;
    try {
        await db.query(
            "UPDATE current_day_activities SET activity_status=$1 WHERE activity_uuid=$2", 
            [actStatus, actId]
        );
        console.log("Successfully updated the activity status of today's activity with id:", actId);
        res.status(200).json({ message: `Successfully updated the activity status of today's activity with id: ${actId}` });
    } catch (error) {
        console.error(`Unsuccessful in updating the activity status of today's activity with id: ${actId}: ${error.message}`);
        res.status(500).json({ message: `Unsuccessful in updating the activity status of today's activity with id: ${actId}: ${error.message}` });
    }
});

app.delete("/delete-current-activity/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        await db.query("DELETE FROM current_day_activities WHERE activity_uuid = $1", [id]);
        console.log(`Successfully deleted today's activity with id: ${id}`);
        res.status(200).json({ message: `Successfully deleted today's activity with id: ${id}` });
    } catch (error) {
        console.error(`Unsuccessful in deleting today's activity with id: ${id}: ${error.message}`);
        res.status(500).json({ message: `Unsuccessful in deleting today's activity with id: ${id}: ${error.message}` });
    }
});

app.delete("/delete-current-activities", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        await db.query("DELETE FROM current_day_activities");
        console.log("Successfully deleted today's activities");
        res.status(200).json({ message: "Successfully deleted today's activities" });
    } catch (error) {
        console.error(`Unsuccessful in deleting today's activities: ${error.message}`);
        res.status(500).json({ message: `Unsuccessful in deleting today's activities: ${error.message}` });
    }
});

app.get("/combined-activities", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM activities UNION SELECT * FROM current_day_activities ORDER BY activity_start_time, activity_end_time');
        console.log("Successfully retrieved today's and daily activities");
        res.json(data.rows);
    } catch (error) {
        console.error(`Unsuccessful in retrieving today's and daily activities: ${error.message}`);
        res.status(404).json({ message: `Unsuccessful in retrieving today's and daily activities: ${error.message}` });
    }
});

app.get("/missed-activities", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT * FROM missed_activities');
        console.log("Successfully retrieved the missed activities");
        res.json(data.rows);
    } catch (error) {
        console.error(`Unsuccessful in retrieving the missed activities: ${error.message}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the missed activities: ${error.message}` });
    }
});

app.get("/missed-activity/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        const data = await db.query('SELECT * FROM missed_activities WHERE activity_uuid = $1', [id]);
        console.log(`Successfully retrieved the missed activities with id: ${id}`);
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the missed activities with id: ${id}: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the missed activities with id: ${id}: ${error}` });
    }
});

app.get("/missed-activities-dates", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    try {
        const data = await db.query('SELECT DISTINCT activity_date FROM missed_activities ORDER BY activity_date DESC');
        console.log("Successfully retrieved the dates of missed activities");
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the dates of the missed activities: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the dates of the missed activities: ${error}` });
    }
});

app.post("/add-missed-activities/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        const data = await db.query('SELECT * FROM missed_activities WHERE activity_uuid=$1', [id]);
        if (data.rows.length === 0) {
            console.log(`No missed activity found with id ${id}`);
            return res.status(404).json({ message: `No missed activity found with id ${id}` });
        }
        const record = data.rows[0];
        await db.query(
            "INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)", 
            [record.activity_name, record.activity_description, record.activity_priority, record.activity_start_time, record.activity_end_time]
        );
        return res.status(200).json({ message: `Successfully added the missed activity with id ${id} back to the current schedule` });
    } catch (error) {
        if (error.code === '23505') {
            console.log(`Duplicate activity error: The activity with id ${id} already exists in the current schedule.`);
            return res.status(409).json({ message: `The activity with id ${id} already exists in the current schedule.` });
        }
        console.error(`Error while adding missed activity with id ${id} back to current schedule: ${error.message}`);
        return res.status(500).json({ message: `Error while adding missed activity with id ${id} back to current schedule: ${error.message}` });
    }
});

app.patch("/edit-missed-activity", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const { actName, actStart, actEnd, actPriority, id } = req.body.data;
    try {
        await db.query(
            "UPDATE missed_activities SET activity_name = $1, activity_priority = $2, activity_start_time = $3, activity_end_time = $4 WHERE activity_uuid = $5",
            [actName, actPriority, actStart, actEnd, id]
        );
        console.log(`Successfully updated the missed activity with id ${id}`);
        res.status(200).json({ message: `Successfully updated the missed activity with id ${id}` });
    } catch (error) {
        console.log(`Unsuccessful in updating the missed activity with id ${id}: ${error}`);
        res.json({ message: `Unsuccessful in updating the missed activity with id ${id}: ${error}` });
    }
});

app.delete("/delete-missed-activity/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        await db.query("DELETE FROM missed_activities WHERE activity_uuid=$1", [id]);
        console.log(`Successfully deleted the missed activity with id ${id}.`);
        res.status(200).json({ message: `Successfully deleted the missed activity with id ${id}.` });
    } catch (error) {
        console.error(`Unsuccessful in deleting the missed activity with id ${id}: ${error}`);
        res.status(500).json({ message: `Unsuccessful in deleting the missed activity with id ${id}: ${error}` });
    }
});

app.get("/upcoming-activities/:actDate", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const date = localDate(req.params.actDate);
    try {
        const data = await db.query("SELECT * FROM upcoming_activities WHERE activity_date=$1 ORDER BY activity_start_time", [date]);
        console.log(`Successfully retrieved upcoming activities on date ${date}`);
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the upcoming activities on date ${date}: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the upcoming activities on date ${date}: ${error}` });
    }
});

app.get("/upcoming-activity/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const id = req.params.id;
    try {
        const data = await db.query("SELECT * FROM upcoming_activities WHERE activity_uuid=$1 ORDER BY activity_start_time", [id]);
        console.log(`Successfully retrieved upcoming activity with id ${id}`);
        res.json(data.rows);
    } catch (error) {
        console.log(`Unsuccessful in retrieving the upcoming activity with id ${id}: ${error}`);
        res.status(404).json({ message: `Unsuccessful in retrieving the upcoming activity with id ${id}: ${error}` });
    }
});

app.post("/add-upcoming-activities", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const { actName, actDescr, priority, startTime, endTime, actDate } = req.body;
    const updatedActDate = new Date(actDate);
    updatedActDate.setHours(updatedActDate.getHours() - 4);
    const finalDate = updatedActDate.toISOString().split('T')[0];
    try {
        await db.query(
            "INSERT INTO upcoming_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, activity_date) VALUES ($1, $2, $3, $4, $5, $6)",
            [actName, actDescr, priority, startTime, endTime, finalDate]
        );
        console.log(`Successfully added the upcoming activity with name ${actName} on ${updatedActDate}.`);
        res.status(200).json({ message: `Successfully added the upcoming activity with name ${actName} on ${updatedActDate}.` });
    } catch (error) {
        console.error(`Unsuccessful in adding the upcoming activity with name ${actName} on ${updatedActDate}: ${error}`);
        res.status(500).json({ message: `Unsuccessful in adding the upcoming activity with name ${actName} on ${updatedActDate}: ${error}` });
    }
});

app.post("/add-upcoming-activity/:actDate/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const actDate = localDate(req.params.actDate);
    const id = req.params.id;
    try {
        const data = await db.query("SELECT * FROM upcoming_activities WHERE activity_date=$1 AND activity_uuid=$2", [actDate, id]);
        const record = data.rows[0];
        await db.query(
            "INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)",
            [record.activity_name, record.activity_description, record.activity_priority, record.activity_start_time, record.activity_end_time]
        );
        console.log(`Successfully added the upcoming activity with id: ${id} to today's schedule`);
        res.status(200).json({ message: `Successfully added the upcoming activity with id ${id} to today's schedule` });
    } catch (error) {
        console.error(`Unsuccessful in adding the upcoming activity with id ${id} to today's schedule: ${error}`);
        res.status(500).json({ message: `Unsuccessful in adding the upcoming activity with id ${id} to today's schedule: ${error}` });
    }
});

app.patch("/edit-upcoming-activity", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const { actName, actStart, actEnd, actPriority, id } = req.body.data;
    try {
        await db.query(
            "UPDATE upcoming_activities SET activity_name = $1, activity_priority = $2, activity_start_time = $3, activity_end_time = $4 WHERE activity_uuid = $5",
            [actName, actPriority, actStart, actEnd, id]
        );
        console.log(`Successfully updated the upcoming activity with id ${id}`);
        res.status(200).json({ message: `Successfully updated the upcoming activity with id ${id}` });
    } catch (error) {
        console.log(`Unsuccessful in updating the upcoming activity with id ${id}: ${error}`);
        res.json({ message: `Unsuccessful in updating the upcoming activity with id ${id}: ${error}` });
    }
});

app.delete("/delete-upcoming-activity/:actDate/:id", async (req, res) => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    const actDate = localDate(req.params.actDate);
    const id = req.params.id;
    try {
        await db.query("DELETE FROM upcoming_activities WHERE activity_date=$1 AND activity_uuid=$2", [actDate, id]);
        console.log(`Successfully deleted the upcoming activity with id ${id} scheduled on ${actDate}.`);
        res.status(200).json({ message: `Successfully deleted the upcoming activity with id ${id} scheduled on ${actDate}.` });
    } catch (error) {
        console.error(`Unsuccessful in deleting the upcoming activity with id ${id} scheduled on ${actDate}: ${error}`);
        res.status(500).json({ message: `Unsuccessful in deleting the upcoming activity with id ${id} scheduled on ${actDate}: ${error}` });
    }
});


cron.schedule('2 0 * * *', async () => {
    console.log("<––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––>");
    console.log('Running daily job at 12:00 AM');
    
    try {
        const records = await db.query("SELECT * FROM current_day_activities WHERE activity_status IS NULL OR activity_status=0");
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
                        "INSERT INTO missed_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time, activity_date) VALUES ($1, $2, $3, $4, $5, $6)", 
                        [element.activity_name, element.activity_description, element.activity_priority, element.activity_start_time, element.activity_end_time, element.activity_date]
                    );
                } catch (insertError) {
                    console.error(`Failed to insert missed activity for ${element.activity_name}:`, insertError);
                }
            }
            console.log("Successfully added today's missed activities to missed_activities");
            try {
                await db.query("DELETE FROM current_day_activities");
                console.log("Successfully deleted current day activities");
            } catch (deleteError) {
                console.error("Failed to delete current day activities:", deleteError);
            }

        } else {
            console.log("No missing activities");
        }
        try {
            const now1 = new Date();
            const upcActDate = now1.toISOString().split('T')[0];

            const upcRecords = (await db.query("SELECT * FROM upcoming_activities WHERE activity_date=$1", [upcActDate])).rows;
            for (const element of upcRecords) {
                try {
                    await db.query(
                        "INSERT INTO current_day_activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)", 
                        [element.activity_name, element.activity_description, element.activity_priority, element.activity_start_time, element.activity_end_time]
                    );
                } catch (insertError) {
                    console.error(`Failed to insert upcoming activity for ${element.activity_name}:`, insertError);
                }
            }
            try {
                await db.query("DELETE FROM upcoming_activities WHERE activity_date=$1", [upcActDate]);
                console.log("Successfully deleted today's upcoming activities");
            } catch (deleteError) {
                console.error("Failed to delete upcoming activities:", deleteError);
            }
        } catch (upcError) {
            console.error("Failed to fetch upcoming activities:", upcError);
        }
        try {
            await db.query("UPDATE activities SET activity_status = NULL");
            console.log("Successfully reset activity statuses");
        } catch (updateError) {
            console.error("Failed to update activity statuses:", updateError);
        }
    } catch (error) {
        console.error('Error in daily job:', error);
    }
});


app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});