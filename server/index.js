import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.get("/", (req,res)=>{
    res.json("Initial Setup");
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
})