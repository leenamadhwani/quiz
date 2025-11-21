// ----------------------------
// SUPABASE CONNECTION
// ----------------------------
const SUPABASE_URL = "https://itwalbzaeltqnhdarbru.supabase.co";
const SUPABASE_KEY = "sb_publishable_sNY9MDn25D8kKIEpRlbR7Q_whTjA2sK";  // paste your public key here

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ----------------------------
// QUIZ QUESTIONS (STATIC)
// ----------------------------
const questions = [
  {
    q: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks Text Mark Language", "None"],
    answer: 0
  },
  {
    q: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: 3
  },
  {
    q: "CSS stands for?",
    options: ["Cascade Style Sheets", "Color and Style Sheets", "Cascading Style Sheets", "None"],
    answer: 2
  }
];

let index = 0;
let score = 0;

// ELEMENTS
const questionBox = document.getElementById("question");
const optionsBox = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("score");
const resultDiv = document.getElementById("resultDiv");
const downloadBtn = document.getElementById("downloadCert");

// ----------------------------
// LOAD QUESTION
// ----------------------------
function loadQuestion() {
  let q = questions[index];
  questionBox.innerHTML = (index + 1) + ". " + q.q;

  optionsBox.innerHTML = "";
  q.options.forEach((opt, i) => {
    optionsBox.innerHTML += `
      <button class="option-btn" onclick="checkAnswer(${i})">${opt}</button>
    `;
  });
}

loadQuestion();

// ----------------------------
// CHECK ANSWER
// ----------------------------
function checkAnswer(selected) {
  if (selected === questions[index].answer) {
    score++;
  }

  index++;

  if (index < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

    // ----------------------
// ----------------------
// SHOW RESULT
// ----------------------
async function showResult() {
  // hide quiz and show result card
  document.getElementById("quizBox").style.display = "none";
  resultDiv.style.display = "block";

  // show score using template literal (backticks are important)
  scoreBox.innerHTML = '${score} / ${questions.length}';
}
// SAVE RESULT TO SUPABASE
const { "data, error" } = await supabase
  .from("quiz_scores")
  .insert([
    {
      name: localStorage.getItem("name") || "Guest",
      email: localStorage.getItem("email") || "",
      score: score,
      total: questions.length,
      created_at: new Date().toISOString()
    }
  ]);

if (error) {
  console.error("Supabase save error:", error);
} else {
  console.log("Saved to Supabase:", data);
}
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




// ----------------------------
// CERTIFICATE DOWNLOAD
// ----------------------------
downloadBtn.addEventListener("click", function () {
  const certText = `
  Certificate of Completion
  -------------------------
  You scored: ${score}/${questions.length}
  `;

  const blob = new Blob([certText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "Certificate.txt";
  a.click();
});
// ------------------------------------------------------------
// NEW SUPABASE QUIZ SYSTEM (DO NOT REMOVE OLD CODE)
// ------------------------------------------------------------

// 1) LOAD QUIZ QUESTIONS FROM SUPABASE
async function loadQuestionsFromSupabase() {
  try {
    let { data, error } = await supabaseClient
      .from("quiz_questions")
      .select("*");

    if (error) {
      console.error("Error loading questions:", error);
      return;
    }

    const quizBox = document.getElementById("quiz-box");
    quizBox.innerHTML = ""; // clear older content

    data.forEach((q) => {
      quizBox.innerHTML += `
        <div class="question-block">
          <h3>${q.id}. ${q.question}</h3>

          <label><input type="radio" name="q${q.id}" value="A"> ${q.option_a}</label><br>
          <label><input type="radio" name="q${q.id}" value="B"> ${q.option_b}</label><br>
          <label><input type="radio" name="q${q.id}" value="C"> ${q.option_c}</label><br>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}

// Auto-load quizzes when page opens
window.addEventListener("load", loadQuestionsFromSupabase);


// ------------------------------------------------------------
// 2) SUBMIT QUIZ AND CHECK ANSWERS
// ------------------------------------------------------------
async function submitQuizAnswers() {
  let { data: answers, error } = await supabaseClient
    .from("quiz_answers")
    .select("*");

  if (error) {
    console.error("Error loading answers:", error);
    return;
  }

  let score = 0;

  answers.forEach((ans) => {
    let userAns = document.querySelector(
      input[name="q${ans.question_id}"]:"checked"
    );

    if (userAns && userAns.value === ans.correct_option) {
      score++;
    }
  });

  alert("Your Score: " + score);

  // save score for certificate
  window.finalScore = score;
}

// ------------------------------------------------------------
// 3) DOWNLOAD CERTIFICATE
// ------------------------------------------------------------
async function downloadCertificate() {
  const certText = `
  ------------- CERTIFICATE -------------
  Name: ${localStorage.getItem("userName") || "Student"}
  Score: ${window.finalScore || 0}
  ---------------------------------------
  `;

  const blob = new Blob([certText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "Certificate.txt";
  a.click();
}