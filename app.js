
const quizData = [
  {
    id: 1,
    question: "What is your preferred work style?",
    options: ["Teamwork", "Individual", "Mixed"],
    answer: 2
  },
  {
    id: 2,
    question: "How do you usually solve problems?",
    options: ["By Logic", "By Creativity", "By Trying Options"],
    answer: 0
  },
  {
    id: 3,
    question: "Which field interests you the most?",
    options: ["Technology", "Management", "Design"],
    answer: 0
  },
  {
    id: 4,
    question: "How comfortable are you with coding?",
    options: ["Beginner", "Intermediate", "Advanced"],
    answer: 1
  },
  {
    id: 5,
    question: "Preferred learning style?",
    options: ["Videos", "Reading", "Hands-on"],
    answer: 2
  }
];

function $(sel){ return document.querySelector(sel) }
function $all(sel){ return Array.from(document.querySelectorAll(sel)) }


if (typeof window !== 'undefined' && location.pathname.endsWith('quiz.html')) {

  const qArea = $('#qArea');
  const progressBar = $('#progressBar');
  const progressText = $('#progressText');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const submitBtn = $('#submitBtn');
  const restartBtn = $('#restartBtn');
  const downloadCertBtn = $('#downloadCertBtn');

  const userNameEl = $('#userName');
  const userEmailEl = $('#userEmail');
  const totalQEl = $('#totalQ');
  const attemptedEl = $('#attempted');
  const scoreEl = $('#score');
  const resultCard = $('#resultCard');


  let currentIndex = 0;
  const answers = new Array(quizData.length).fill(null);
  let calculatedScore = null;


  function init(){
    const name = localStorage.getItem('username') || 'Guest';
    const email = localStorage.getItem('email') || '--';
    userNameEl.textContent = name;
    userEmailEl.textContent = email;
    totalQEl.textContent = quizData.length;
    renderQuestion(currentIndex);
    updateProgress();
    bindEvents();
    loadSavedIfAny();
  }

  function loadSavedIfAny(){
    try{
      const saved = JSON.parse(localStorage.getItem('quizResult'));
      if(saved && saved.answers && saved.answers.length === quizData.length){

        for(let i=0;i<quizData.length;i++){
          answers[i] = (saved.answers[i] === null ? null : saved.answers[i]);
        }
        calculatedScore = saved.score;
        attemptedEl.textContent = answers.filter(a=>a!==null).length;
        if(calculatedScore !== null) {
          scoreEl.textContent = `${calculatedScore}/${quizData.length}`;
          showResultCard();
        }
      }
    }catch(e){ }
  }

  function bindEvents(){
    prevBtn.addEventListener('click', ()=> { if(currentIndex>0){ currentIndex--; renderQuestion(currentIndex); }});
    nextBtn.addEventListener('click', ()=> { if(currentIndex<quizData.length-1){ currentIndex++; renderQuestion(currentIndex); }});
    submitBtn.addEventListener('click', submitQuiz);
    restartBtn.addEventListener('click', restartQuiz);
    downloadCertBtn.addEventListener('click', downloadCertificate);
  }

  function renderQuestion(i){
    const q = quizData[i];
    qArea.innerHTML = `
      <div class="question">${i+1}. ${q.question}</div>
      <div class="options" id="optionsWrap"></div>
    `;
    const optionsWrap = $('#optionsWrap');
    q.options.forEach((opt, idx) => {
      const div = document.createElement('label');
      div.className = 'option';
      if(answers[i] === idx) div.classList.add('selected');
      div.innerHTML = `
        <input type="radio" name="q${i}" value="${idx}" ${answers[i]===idx? 'checked' : ''} />
        <div>${opt}</div>
      `;
      div.addEventListener('click', (e)=>{

        answers[i] = idx;

        $all('.option').forEach(o=>o.classList.remove('selected'));
        div.classList.add('selected');

        attemptedEl.textContent = answers.filter(a=>a!==null).length;
      });
      optionsWrap.appendChild(div);
    });

    prevBtn.disabled = (i===0);
    nextBtn.disabled = (i===quizData.length-1);

    updateProgress();
  }

  function updateProgress(){
    const pct = Math.round(((currentIndex+1)/quizData.length)*100);
    progressBar.style.width = pct + '%';
    progressText.textContent = pct + '%';
  }

  function submitQuiz(){

    let score=0;
    for(let i=0;i<quizData.length;i++){
      const ans = answers[i];
      if(ans !== null && ans === quizData[i].answer) score++;
    }
    calculatedScore = score;

    const quizResult = {
      username: localStorage.getItem('username') || 'Guest',
      email: localStorage.getItem('email') || '',
      answers: answers,
      score: score,
      total: quizData.length,
      date: new Date().toISOString()
    };
    localStorage.setItem('quizResult', JSON.stringify(quizResult));

    attemptedEl.textContent = answers.filter(a=>a!==null).length;
    scoreEl.textContent = `${score}/${quizData.length}`;

    showResultCard();
    downloadCertBtn.style.display = 'inline-block';
  }

  function showResultCard(){
    resultCard.style.display = 'block';
    const s = calculatedScore !== null ? `${calculatedScore}/${quizData.length}` : '-';
    resultCard.innerHTML = `
      <div style="padding:18px;border-radius:12px;background:linear-gradient(90deg, rgba(255,255,255,0.98), rgba(255,255,255,0.96));">
        <div style="font-size:18px;font-weight:800">Result</div>
        <div style="margin-top:8px;font-size:28px;color:#222;font-weight:800">${s}</div>
        <div style="margin-top:10px;font-size:13px;color:#666">You can download your certificate below.</div>
      </div>
    `;
  }

  function restartQuiz(){
    if(!confirm('Restart quiz? This will clear answers stored locally for this attempt.')) return;
    for(let i=0;i<answers.length;i++) answers[i] = null;
    calculatedScore = null;
    localStorage.removeItem('quizResult');
    attemptedEl.textContent = 0;
    scoreEl.textContent = '-';
    downloadCertBtn.style.display = 'none';
    resultCard.style.display = 'none';
    renderQuestion(0);
  }

  async function downloadCertificate(){
    try{
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit:'pt', format:'a4' });

      const name = localStorage.getItem('username') || 'Participant';
      const quizResult = JSON.parse(localStorage.getItem('quizResult') || '{}');
      const score = quizResult.score ?? calculatedScore ?? 0;
      const total = quizResult.total ?? quizData.length;
      const date = new Date().toLocaleDateString();

      doc.setFillColor(255,255,255);
      doc.rect(20, 20, 555, 770, 'F');

      doc.setFillColor(255, 121, 121);
      doc.rect(40, 40, 515, 110, 'F');
      doc.setFillColor(255, 189, 116);
      doc.rect(40, 40+110, 515, 10, 'F');

      doc.setFontSize(26);
      doc.setTextColor(255,255,255);
      doc.setFont('helvetica','bold');
      doc.text('Certificate of Completion', 60, 95);

      doc.setFontSize(14);
      doc.setTextColor(40,40,40);
      doc.setFont('helvetica','normal');
      doc.text('This is to certify that', 60, 170);

      doc.setFontSize(22);
      doc.setFont('helvetica','bold');
      doc.text(name, 60, 205);

      doc.setFontSize(14);
      doc.setFont('helvetica','normal');
      doc.text(`has successfully completed the quiz.`, 60, 235);
      doc.text(`Score: ${score} / ${total}`, 60, 255);
      doc.text(`Date: ${date}`, 60, 275);

      doc.setFontSize(12);
      doc.text('Issued by: Colorful Quiz', 60, 315);


      const filename = `${name.replace(/\s+/g,'_')}_certificate.pdf`;
      doc.save(filename);
    }catch(err){
      alert('Certificate generation failed: ' + err.message);
    }
  }

  init();
}

if (typeof window !== 'undefined' && location.pathname.endsWith('profile.html')) {

  document.addEventListener('DOMContentLoaded', ()=>{
    const el = document.createElement('div');
    el.style.maxWidth='760px'; el.style.margin='40px auto'; el.style.fontFamily='Inter,Arial';
    const saved = JSON.parse(localStorage.getItem('quizResult') || '{}');
    el.innerHTML = `
      <h2>Profile</h2>
      <div><strong>Name:</strong> ${saved.username || 'N/A'}</div>
      <div><strong>Email:</strong> ${saved.email || 'N/A'}</div>
      <div><strong>Score:</strong> ${saved.score ?? '-'} / ${saved.total ?? '-'}</div>
      <div style="margin-top:12px;"><button onclick="location.href='quiz.html'">Go to Quiz</button></div>
    `;
    document.body.appendChild(el);
  });
}
