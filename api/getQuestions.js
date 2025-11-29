import {supabase} from "./supabase.js";

export default async function getQuestions(req, res) {
  const { data, error } = await supabase
    .from("questions")
    .select("*");

  if (error) {
    return res.status(400).json( error );
  }

  res.json(data);
}