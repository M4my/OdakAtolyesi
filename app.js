let mode = 'pomodoro';
let timer;
let startTime;
let isRunning = false;
let elapsed = 0;
let duration = 0;
let isOnBreak = false;

function updateDisplay(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    document.getElementById("display").textContent = `${pad(minutes)}:${pad(seconds)}`;
  }
  

  function pad(num) {
    return num.toString().padStart(2, '0');
  }
  

function setMode(newMode) {
  mode = newMode;
  isOnBreak = false;
  updateSettingsVisibility();
  reset();
}

function updateSettingsVisibility() {
  const settingsDiv = document.getElementById("timeSettings");
  if (mode === 'pomodoro') {
    settingsDiv.style.display = 'block';
  } else {
    settingsDiv.style.display = 'none';
  }
}

function start() {
    if (isRunning) return;
    isRunning = true;
  
    if (mode === 'pomodoro') {
      const pomodoroMinutes = parseInt(document.getElementById('pomodoroDuration').value);
      const breakMinutes = parseInt(document.getElementById('breakDuration').value);
      duration = (isOnBreak ? breakMinutes : pomodoroMinutes) * 60 * 1000;
    }
  
    startTime = Date.now() - elapsed;
  
    timer = setInterval(() => {
      elapsed = Date.now() - startTime;
  
      if (mode === 'pomodoro') {
        const remaining = duration - elapsed;
        updateDisplay(remaining);
  
        if (remaining <= 0) {
          clearInterval(timer);
          isRunning = false;
  
          if (!isOnBreak) {
            saveSession(duration / 60000);
            saveDailyData(duration / 60000);
            isOnBreak = true;
            alert("Pomodoro tamamlandı! Molaya geçiliyor.");
            reset();
            start(); // Mola başlat
          } else {
            alert("Mola bitti!");
            isOnBreak = false;
            reset();
          }
        }
      } else {
        updateDisplay(elapsed);
      }
    }, 1000);
  }
  
  

function pause() {
  clearInterval(timer);
  isRunning = false;
}

function reset() {
    clearInterval(timer);
    isRunning = false;
    elapsed = 0;
  
    if (mode === 'pomodoro') {
      const time = (isOnBreak
        ? parseInt(document.getElementById('breakDuration').value)
        : parseInt(document.getElementById('pomodoroDuration').value)) * 60000;
      updateDisplay(time);
    } else {
      updateDisplay(0);
    }
  }
  
  

function finish() {
  if (elapsed > 0) {
    let minutes = mode === 'pomodoro'
      ? (duration - Math.max(0, duration - elapsed)) / 60000
      : elapsed / 60000;
    saveSession(Math.round(minutes));
    saveDailyData(Math.round(minutes));
    alert("Süre kaydedildi.");
    reset();
  }
}

function saveSession(minutes) {
  const today = new Date().toISOString().split('T')[0];
  const db = JSON.parse(localStorage.getItem('pomodoroDB')) || {};

  if (!db[today]) db[today] = 0;
  db[today] += minutes;

  localStorage.setItem('pomodoroDB', JSON.stringify(db));
  updateStats();
}

function saveSettings() {
  alert("Ayarlar kaydedildi.");
  reset();
}

function updateStats() {
  const db = JSON.parse(localStorage.getItem('pomodoroDB')) || {};
  const today = new Date().toISOString().split('T')[0];

  let streak = 0;
  let todayTime = db[today] || 0;
  let weekTime = 0;
  let monthTime = 0;

  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (db[key]) {
      if (i < 7) weekTime += db[key];
      monthTime += db[key];
      if (i === streak) streak++;
    } else if (i === streak) break;
  }

  document.getElementById('streak').textContent = streak;
  document.getElementById('todayTime').textContent = formatTime(todayTime);
  document.getElementById('weekTime').textContent = formatTime(weekTime);
  document.getElementById('monthTime').textContent = formatTime(monthTime);
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} saat ${remainingMinutes}`;
}

function showTab(tabId) {
  // Tüm tabları gizle
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  
  // İlgili tabı göster
  document.getElementById(tabId).classList.add('active');

  // Eğer stats tabı açılıyorsa, container'ı gizle
  const tabs = document.querySelector('.tabs');
  const container = document.querySelector('.container');
  const contributionContainer = document.getElementById('contribution-container');
  if (tabId === 'stats') {
    tabs.style.top = '200px';
    container.style.display = 'none';
    contributionContainer.style.display = 'block';
  } else {
    tabs.style.top = '270px';
    container.style.display = 'block';
    contributionContainer.style.display = 'none';
  }

  // İstatistikler tabı açıldığında güncelle
  if (tabId === 'stats') updateStats();
}

function saveDailyData(minutes) {
  const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi (YYYY-MM-DD formatında)
  const dailyData = JSON.parse(localStorage.getItem('dailyPomodoroData')) || {}; // Mevcut verileri al

  // Bugünkü süreyi ekle veya güncelle
  if (dailyData[today]) {
    dailyData[today] += minutes; // Mevcut süreye ekle
  } else {
    dailyData[today] = minutes; // Yeni bir giriş oluştur
  }

  // Güncellenmiş veriyi LocalStorage'a kaydet
  localStorage.setItem('dailyPomodoroData', JSON.stringify(dailyData));
}


function logDailyData() {
  const dailyData = JSON.parse(localStorage.getItem('dailyPomodoroData')) || {};
  console.log('Günlük Çalışma Süreleri:', dailyData);
}

updateDisplay(0);
updateStats();
updateSettingsVisibility();


function toggleMusicPanel() {
    const panel = document.getElementById('music-panel');
    panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
  }
  
  function playMusic(file) {
    const audio = document.getElementById('audioPlayer');
    audio.src = file;
    audio.play();
  }
  
  function stopMusic() {
    const audio = document.getElementById('audioPlayer');
    audio.pause();
    audio.currentTime = 0;
  }

  function setVolume(value) {
    const audio = document.getElementById('audioPlayer');
    audio.volume = parseFloat(value);
  }

  function resumeMusic() {
    const audio = document.getElementById('audioPlayer');
    if (audio.paused) {
        audio.play(); // Müzik duraklatılmışsa devam ettir
    }
}
  
  

function renderContributionGraph() {
  const dailyData = JSON.parse(localStorage.getItem('dailyPomodoroData')) || {};
  const graph = document.getElementById('contribution-graph');
  const details = document.getElementById('day-details');
  graph.innerHTML = ''; // Önce grafiği temizle

  const today = new Date();
  const daysInYear = 365;

  for (let i = 0; i < daysInYear; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    const minutes = dailyData[dateKey] || 0;

    // Katkı seviyesi belirleme
    let level = 0;
    if (minutes > 0) level = 1;
    if (minutes > 60) level = 2;
    if (minutes > 120) level = 3;
    if (minutes > 240) level = 4;

    // Gün kutusunu oluştur
    const dayBox = document.createElement('div');
    dayBox.setAttribute('data-level', level);
    dayBox.setAttribute('title', `${dateKey}: ${minutes} dakika`);
    dayBox.addEventListener('click', () => {
      details.textContent = `${dateKey}: ${minutes} dakika çalıştınız.`;
    });

    graph.appendChild(dayBox);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderContributionGraph();
});