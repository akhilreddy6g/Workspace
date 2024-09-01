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
app.get("/", async (req,res)=>{
    try {
        const data = await db.query('SELECT * FROM activities');
        res.json(data.rows);
    } catch (error) {
        res.json(`Something went wrong: ${error}`);
    };
})

app.post("/", async (req, res)=>{
    const actnName = req.body.info;
    const actDescr = req.body.desc;
    const priority = req.body.priority;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    try {
        if (actnName.length == 0 || startTime.length==0 || endTime.length==0){
            res.redirect("http://localhost:5173/daily-activities");
        } else{
            await db.query(
            "INSERT INTO activities (activity_name, activity_description, activity_priority, activity_start_time, activity_end_time) VALUES ($1, $2, $3, $4, $5)", 
            [actnName, actDescr, priority, startTime, endTime]);
            res.redirect("http://localhost:5173/daily-activities");};
    } catch (error) {
        res.json(`Something went wrong: ${error}`);
    };
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});