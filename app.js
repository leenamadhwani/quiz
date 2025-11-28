async function loadQuestions() {
  const res = await fetch('/api/getQuestions');
  const { questions } = await res.json();

  const quizContainer = document.getElementById('quiz');
  quizContainer.innerHTML = '';

  questions.forEach((q, i) => {
    quizContainer.innerHTML += `
      <div class="question-block">
        <p>${i + 1}. ${q.question}</p>
        <label><input type="radio" name="q${i}" value="a"> ${q.option_a}</label><br>
        <label><input type="radio" name="q${i}" value="b"> ${q.option_b}</label><br>
        <label><input type="radio" name="q${i}" value="c"> ${q.option_c}</label><br>
        <label><input type="radio" name="q${i}" value="d"> ${q.option_d}</label>
      </div>
    `;
  });
}

async function submitQuiz() {
  let score = 0;
  const res = await fetch('/api/getQuestions');
  const { questions } = await res.json();

  questions.forEach((q, i) => {
    const selected = document.querySelector('input[name="q${i}"]:checked');
    if (selected && selected.value === q.answer) score++;
  });

  const name = prompt("Your name:");
  const email = prompt("Your email:");

  await fetch('/api/saveScore', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, score })
  });

  alert( 'Score: $ {score}/${questions.length}');
}

window.onload = loadQuestions;