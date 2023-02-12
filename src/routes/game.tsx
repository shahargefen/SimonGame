import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/alive", (req, res) => res.send("I'm alive"));

app.post("/start", (req, res) => {
  if (fs.existsSync("./topTable.txt")) {
    const text = fs.readFileSync("./topTable.txt", "utf-8");
    res.send({ text });
  } else {
    fs.writeFileSync("./topTable.txt", "0");
    res.send({ text: "0" });
  }
});

app.post("/end", (req, res) => {
  const score = req.body.score;

  try {
    const text = fs.readFileSync("./topTable.txt", "utf-8");
    if (parseInt(text) < parseInt(score)) {
      fs.writeFileSync("./topTable.txt", score);
    }
  } catch (error) {
    console.error(error);
    res.send({ message: "An error occured while reading or writing to the file." });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});