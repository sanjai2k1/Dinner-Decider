import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URl = "http://localhost:4000";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URl}/dinners`);
    res.render("index.ejs", { dinners: response.data });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.get("/decide", async (req, res) => {
  try {
    const response = await axios.get(`${API_URl}/decide`);
    res.render("decide.ejs", { dinner: response.data });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/edit", async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios.get(`${API_URl}/edit/${req.body.editItemId}`);
    res.render("new.ejs", { dinner: response.data });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/add", async (req, res) => {
  try {
    const response = await axios.put(`${API_URl}/post`, {
      dinnerName: req.body.dinnerName,
      rating: req.body.rating,
      description: req.body.description,
      address: req.body.address,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/delete", async (req, res) => {
  try {
    console.log(req.body.deleteItemId);
    const response = await axios.delete(
      `${API_URl}/delete/${req.body.deleteItemId}`
    );
    res.redirect("/");
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/update/:id", async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios.patch(
      `${API_URl}/update/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
