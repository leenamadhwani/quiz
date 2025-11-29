import express from "express";
import cors from "cors";
import getQuestions from "./getQuestions.js";
import registerUser from "./registerUser.js";
import { supabase } from "./supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// SUPABASE SETUP
const supabase = createClient(
  "https://jjyhcowldfftuaenkjnh.supabase.co",   // your URL
  "sb_publishable_sNY9MDn25D8kKIEpRlbR7Q_whTjA2sK"      // replace this
);

// 1️⃣ Get Questions
app.get("/getQuestions", async (req,res) =>  {
  const { data, error } = await supabase.from("questions").select("*");
  if (error) return res.status(400).json(error);
  res.json(data);
});

// 2️⃣ Save Score
app.post("/saveScore", async (req, res) => {
  const { name, email, score } = req.body;
  const { error } = await supabase.from("scores").insert([{ name, email, score }]);

  if (error) return res.status(400).json(error);
  res.json({ message: "Score saved successfully!" });
});

// 3️⃣ Register User
app.post("/registerUser", async (req, res) => {
  const { name, email } = req.body;
  const { error } = await supabase.from("users").insert([{ name, email }]);

  if (error) return res.status(400).json(error);
  res.json({ message: "User registered!" });
});

// ROOT
app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

// START
app.listen(3000, () => console.log("Server running on port 3000"));