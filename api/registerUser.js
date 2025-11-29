import { supabase } from "./supabase.js";
export default async function registerUser(req, res,Supabase) {
  res.json({ message: "User registered (temporary)" });
}