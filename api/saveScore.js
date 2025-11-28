import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { name, email, score } = req.body;

  const { data, error } = await supabase
    .from('quiz_results')
    .insert([{ user_name: name, user_email: email, score }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: "Score saved!", data });
}