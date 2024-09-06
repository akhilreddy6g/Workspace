import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";

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

app.get("/", async (req,res)=>{
    try {
        const data = await db.query('SELECT * FROM activities');
        res.json(data.rows);
    } catch (error) {
        res.json(`Something went wrong: ${error}`);
    };
});

app.post("/add-activity", async (req, res)=>{
    const {actName,actDescr,priority,startTime,endTime} = req.body.data;
    try {
        await db.query(
        "INSERT INTO activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)", 
        [actName, actDescr, priority, startTime, endTime]);
        console.log("Successfully added the activity");
        res.status(200).json({ message: `Successfully inserted the activity the activity`});
    } catch (error) {
        res.json(`Something went wrong: ${error}`);
    };
});

app.delete("/delete-activity/:id", async(req, res)=>{
    const id = req.params.id;
    try {
        const record = await db.query("SELECT * FROM activities WHERE activity_id = $1", [id]);
        if(record.rows.length>0){
            await db.query("DELETE FROM activities WHERE activity_id = $1", [id]);
            console.log("Successfully deleted the activity with id", id);
            res.status(200).json({ message: `Successfully deleted the activity with id ${id}`});
        } else {
            res.json({ message: `Unsuccessful in deleting the activity with id ${id}`});
        }
    } catch (error) {
        res.json(`Something went wrong: ${error}`);
    };
});

app.patch("/edit-activity", async(req, res)=>{
    console.log("req.data............................................................", req.body);
    const {actName, actStart, actEnd, actPriority, id} = req.body.data;
    console.log("actName, priority, start, end, id :", actName, actStart, actEnd, actPriority, id);
    var activityName = actName.slice(0, 50);
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if(actName.length>0 && actStart.length>0 && actEnd.length>0 && timeRegex.test(actStart) && timeRegex.test(actEnd) && !isNaN(actPriority) && actPriority.trim() !== '') {
        try {
            console.log("entered inside");
            var priority = actPriority
            if(priority>10){priority = 10}
            if(priority<0){priority = 0}
            await db.query("UPDATE activities SET activity_name = $1, activity_priority = $2, activity_start_time = $3, activity_end_time = $4 WHERE activity_id = $5", [activityName, priority, actStart, actEnd, id]);
            res.status(200).json({ message: `Successfully updated the activity with id ${id}`});
            console.log("successfully updated the record");
        } catch (error) {
            console.log("unsuccessful in updating the record:", error);
            res.json({ message: `Unsuccessful in updating the activity with id ${id}: ${error}`});
        }
    } else {
        console.log("unsuccessful in updating the record, please enter the inputs in correct format");
        res.json({ message: `Unsuccessful in updating the activity with id ${id}`});
    }
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});