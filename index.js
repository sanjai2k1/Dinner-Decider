import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());
const api_url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const db = new pg.Client({
  user: "postgres",
  password: "1234",
  database: "dinner decider",
  host: "localhost",
  port: "5432",
});

db.connect();

app.get("/dinners", async (req, res) => {
  const data = await db.query("select * from dinners order by id");
  let dinners = [];
  data.rows.forEach((dinner) => dinners.push(dinner));
  res.json(dinners);
});

app.put("/post", async (req, res) => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    const name = req.body.dinnerName;
  const full = name.split(" ").join("+");
 
  const response = await fetch(api_url +full);

  const data = await response.json();

  let img = "";
  if (data.meals == null) {
    img =
      "data:image/jpeg;base64,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";
  } else {
    img = data.meals[0].strMealThumb;
  }
  await db.query(
    "insert into dinners (dinnerName,rating,description,address,imagesrc,date) values ($1,$2,$3,$4,$5,$6);",
    [
      req.body.dinnerName,
      req.body.rating,
      req.body.description,
      req.body.address,
      img,
      date,
    ]
  );

  res.sendStatus(200);
});

app.delete("/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.query("delete from dinners where id = $1", [id]);
  res.sendStatus(200);
});

app.get("/edit/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await db.query("select * from dinners where id = $1;", [id]);
  const dinner = response.rows[0];
  res.json(dinner);
});

app.patch("/update/:id", async (req, res) => {
  const today = new Date();
  const id = parseInt(req.params.id);
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  await db.query(
    "update dinners set rating = $1,date = $2, description = $3 where id = $4",
    [req.body.rating, date, req.body.description, id]
  );

  res.sendStatus(200);
});

app.get("/decide", async (req, res) => {
  const data = await db.query("select count(id) from dinners; ");
  const max = data.rows[0].count;
  const min = 0;
  const ind = Math.floor(Math.random() * (max - min) + min);
  const response = await db.query("select * from dinners;");
  res.json(response.rows[ind]);
});

app.listen(port, () => {
  console.log(`listeing on port : ${port}`);
});


# Dinner-Decider
*A CRUD web app using Express js to upload your favorite dinners and choose a random dinner whenever needed!.*

### Concepts Used
  - HTML
  - Bootstrap
  - Express Js
  - ejs
  - axios
  - Api
  - Postgresql
# ScreenShots