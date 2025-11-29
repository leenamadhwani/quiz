import { supabase } from "./supabase.js";
export default async function saveScore(req, res) {
  res.json({ message: "Score saved (temporary)" });
}