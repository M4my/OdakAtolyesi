let duration = 25 * 60; // 25 dk
let timeLeft = duration;
let interval;

function startPomodoro() {
  clearInterval(interval);
  interval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    updateProgressBar();

    if (timeLeft <= 0) {
      clearInterval(interval);
      saveSession(duration);
      startBreak(); // otomatik mola
    }
  }, 1000);
}

function updateTimerDisplay() {
  const min = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const sec = (timeLeft % 60).toString().padStart(2, '0');
  document.getElementById("timer").textContent = `${min}:${sec}`;
}

function updateProgressBar() {
  const progress = ((duration - timeLeft) / duration) * 100;
  document.getElementById("progress-bar").style.height = `${progress}%`;
}

// 🧠 Veriyi kaydet
function saveSession(seconds) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  let data = JSON.parse(localStorage.getItem("studyData")) || {
    totalStudyTime: 0,
    studyDays: {},
    streak: 0
  };

  data.totalStudyTime += seconds;
  if (!data.studyDays[today]) {
    data.studyDays[today] = 0;
  }
  data.studyDays[today] += seconds;

  // 🔥 streak hesapla
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];

  if (data.studyDays[yStr]) {
    data.streak += 1;
  } else {
    data.streak = 1;
  }

  localStorage.setItem("studyData", JSON.stringify(data));
  updateStats();
}

// Panel 4 verilerini güncelle
function updateStats() {
  const data = JSON.parse(localStorage.getItem("studyData")) || {
    totalStudyTime: 0,
    studyDays: {},
    streak: 0
  };

  const totalMin = Math.floor(data.totalStudyTime / 60);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  const daysWorked = Object.keys(data.studyDays).length;
  const avg = Math.floor(totalMin / (daysWorked || 1));

  document.getElementById("total-time").textContent = `${hours}h ${mins}m`;
  document.getElementById("avg-time").textContent = `${avg}m`;
  document.getElementById("streak").textContent = `${data.streak}`;
}

function startBreak() {
  timeLeft = 5 * 60; // 5 dk mola
  updateTimerDisplay();
  document.getElementById("timer").textContent = "Break Started!";
}

updateStats();
