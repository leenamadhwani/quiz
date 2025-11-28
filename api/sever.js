import express from "express";
import cors from "cors";
import getQuestions from "./getQuestions.js";
import saveScore from "./saveScore.js";
import registerUser from "./registerUser.js";

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.get("/getQuestions", getQuestions);
app.post("/saveScore", saveScore);
app.post("/registerUser", registerUser);

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));