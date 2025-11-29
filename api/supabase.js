import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://ftwalbzaeltqnhdarbru.supabase.co";
const SUPABASE_KEY = "sb_pubL1shable_sHY9DNz5D8Kk1EzPrL8RTQ_wh7jAZsk";

export const supabase = createclient(SUPABASE_URL,SUPABASE_KEY);
// SAVE RESULT TO SUPABASE
const { data, error } = await supabase
  .from("quiz_scores")
  .insert([
    {
      name: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      score: score,
      total: questions.length,
      created_at: new Date()
    }
  ]);

if (error) {
  console.error("Supabase Error:", error);
} else {
  console.log("Score saved:", data);
}