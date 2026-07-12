/* =====================================================================
   Academic Planner Logic
   - Task CRUD (add / toggle complete / delete) persisted to localStorage
   - Filtering by status and course
   - Progress ring + stats
   - Ambient Focus Synth: pure Web Audio API sound generator
     (binaural beats / brown noise "rain" / deep ambient drone)
===================================================================== */

const TASKS_STORAGE_KEY = 'cos106_tasks';

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fall through to defaults */ }
  return INITIAL_TASKS.slice();
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();
let selectedFilter = 'all';

function uniqueCourses() {
  return [...new Set(tasks.map((t) => t.course))];
}

function populateFilterOptions() {
  const select = document.getElementById('task-filter-select');
  // Remove any previously injected course options (keep first 3 static options)
  while (select.options.length > 3) select.remove(3);
  uniqueCourses().forEach((courseName) => {
    const opt = document.createElement('option');
    opt.value = courseName;
    opt.textContent = courseName;
    select.appendChild(opt);
  });
  select.value = selectedFilter;
}

function getFilteredTasks() {
  if (selectedFilter === 'all') return tasks;
  if (selectedFilter === 'pending') return tasks.filter((t) => !t.completed);
  if (selectedFilter === 'completed') return tasks.filter((t) => t.completed);
  return tasks.filter((t) => t.course === selectedFilter);
}

function renderTasks() {
  const container = document.getElementById('task-list-container');
  const filtered = getFilteredTasks();
  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="task-empty">
        <span data-icon="clipboardList"></span>
        <h4>No Tasks Found</h4>
        <p>Adjust your course filters or add a new schedule item above.</p>
      </div>`;
  } else {
    filtered.forEach((task) => {
      const priorityClass = task.priority === 'high' ? 'priority-high' : task.priority === 'medium' ? 'priority-medium' : 'priority-low';
      const div = document.createElement('div');
      div.className = 'task-item' + (task.completed ? ' completed' : '');
      div.id = `task-item-${task.id}`;
      div.innerHTML = `
        <div class="task-item-left">
          <button class="task-check${task.completed ? ' done' : ''}" data-id="${task.id}" title="${task.completed ? 'Mark Pending' : 'Mark Completed'}">
            <span data-icon="${task.completed ? 'checkCircle2' : 'circle'}"></span>
          </button>
          <div class="task-info">
            <span class="task-title">${task.title}</span>
            <div class="task-meta">
              <span class="course-chip">${task.course}</span>
              <span class="due-date"><span data-icon="calendar"></span>${task.dueDate || 'No date set'}</span>
              <span class="priority ${priorityClass}"><span data-icon="alertTriangle"></span>${task.priority}</span>
            </div>
          </div>
        </div>
        <button class="task-delete" data-id="${task.id}" title="Delete Item"><span data-icon="trash2"></span></button>
      `;
      container.appendChild(div);
    });
  }

  // Render icons within the freshly injected markup
  container.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.getAttribute('data-icon')); });

  // Wire up toggle/delete handlers
  container.querySelectorAll('.task-check').forEach((btn) => {
    btn.addEventListener('click', () => toggleTaskCompleted(btn.getAttribute('data-id')));
  });
  container.querySelectorAll('.task-delete').forEach((btn) => {
    btn.addEventListener('click', () => deleteTask(btn.getAttribute('data-id')));
  });
}

function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('progress-ring-label').textContent = `${completionRate}%`;

  const circumference = 264; // 2 * PI * 42, matches SVG radius
  const offset = circumference - (completionRate / 100) * circumference;
  document.getElementById('progress-ring-fill').style.strokeDashoffset = offset;

  const noteText = document.getElementById('planner-note-text');
  noteText.textContent = completionRate === 100 && total > 0
    ? 'Excellent job! All assignments complete!'
    : `You have ${pending} active tasks left to complete.`;
}

function toggleTaskCompleted(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTasks(tasks);
  renderTasks();
  renderStats();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
  populateFilterOptions();
  renderTasks();
  renderStats();
}

function addTask(newTask) {
  tasks = [{ id: Date.now().toString(), completed: false, ...newTask }, ...tasks];
  saveTasks(tasks);
  populateFilterOptions();
  renderTasks();
  renderStats();
}

document.addEventListener('DOMContentLoaded', () => {
  populateFilterOptions();
  renderTasks();
  renderStats();

  document.getElementById('task-filter-select').addEventListener('change', (e) => {
    selectedFilter = e.target.value;
    renderTasks();
  });

  document.getElementById('add-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title-input').value.trim();
    if (!title) return;
    const course = document.getElementById('task-course-select').value;
    const dueDate = document.getElementById('task-date-input').value;
    const priority = document.getElementById('task-priority-select').value;

    addTask({ title, course, dueDate, priority });

    e.target.reset();
    document.getElementById('task-priority-select').value = 'medium';
  });
});

/* =====================================================================
   Ambient Focus Synth (pure Web Audio API — no external audio files)
===================================================================== */
(function initFocusSynth() {
  let isPlaying = false;
  let soundType = 'binaural';
  let volume = 0.5;
  let isMuted = false;

  let audioCtx = null;
  let mainGain = null;
  let soundNodes = [];

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      mainGain = audioCtx.createGain();
      mainGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function stopSounds() {
    soundNodes.forEach((node) => {
      try { node.stop(); } catch (e) {}
      try { node.disconnect(); } catch (e) {}
    });
    soundNodes = [];
  }

  function playSound() {
    initAudio();
    stopSounds();
    if (!isPlaying) return;

    const ctx = audioCtx;
    mainGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);

    if (soundType === 'binaural') {
      const osc1 = ctx.createOscillator();
      const panner1 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(200, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      const panner2 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(210, ctx.currentTime);

      const osc3 = ctx.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(100, ctx.currentTime);

      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.3, ctx.currentTime);

      if (panner1 && panner2) {
        panner1.pan.setValueAtTime(-1, ctx.currentTime);
        panner2.pan.setValueAtTime(1, ctx.currentTime);
        osc1.connect(panner1).connect(mainGain);
        osc2.connect(panner2).connect(mainGain);
      } else {
        osc1.connect(mainGain);
        osc2.connect(mainGain);
      }
      osc3.connect(droneGain).connect(mainGain);

      osc1.start(); osc2.start(); osc3.start();
      soundNodes = [osc1, osc2, osc3, droneGain];
    } else if (soundType === 'rain') {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      noiseNode.connect(filter).connect(mainGain);
      noiseNode.start();
      soundNodes = [noiseNode, filter];
    } else if (soundType === 'ambient') {
      const chords = [130.81, 164.81, 196.00, 261.63];
      const oscs = chords.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.25, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);

        lfo.connect(lfoGain).connect(osc.frequency);
        lfo.start();
        osc.connect(mainGain);
        osc.start();
        return osc;
      });
      soundNodes = oscs;
    }
  }

  function updateVolume() {
    if (mainGain && audioCtx) {
      const vol = isMuted ? 0 : volume * 0.15;
      mainGain.gain.setValueAtTime(vol, audioCtx.currentTime);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const playToggle = document.getElementById('focus-beats-play-toggle');
    const typeButtons = document.querySelectorAll('.beats-type-btn');
    const muteBtn = document.getElementById('mute-toggle-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeLabel = document.getElementById('volume-label');

    function refreshPlayButton() {
      playToggle.innerHTML = isPlaying
        ? `${icon('pause')} Stop Sound`
        : `${icon('play')} Start Sound`;
    }
    function refreshMuteIcon() {
      muteBtn.innerHTML = icon((isMuted || volume === 0) ? 'volumeX' : 'volume2');
    }
    function refreshVolumeLabel() {
      volumeLabel.textContent = isMuted ? 'Muted' : `${Math.round(volume * 100)}%`;
    }
    function refreshTypeButtons() {
      typeButtons.forEach((btn) => {
        const isActive = btn.getAttribute('data-type') === soundType && isPlaying;
        btn.classList.toggle('active', isActive);
      });
    }

    playToggle.addEventListener('click', () => {
      isPlaying = !isPlaying;
      refreshPlayButton();
      refreshTypeButtons();
      playSound();
    });

    typeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        soundType = btn.getAttribute('data-type');
        if (!isPlaying) { isPlaying = true; refreshPlayButton(); }
        refreshTypeButtons();
        playSound();
      });
    });

    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      refreshMuteIcon();
      refreshVolumeLabel();
      updateVolume();
    });

    volumeSlider.addEventListener('input', (e) => {
      volume = parseFloat(e.target.value);
      if (isMuted) isMuted = false;
      refreshMuteIcon();
      refreshVolumeLabel();
      updateVolume();
    });

    refreshPlayButton();
    refreshMuteIcon();
    refreshVolumeLabel();

    // Stop synth cleanly if the user navigates away
    window.addEventListener('beforeunload', stopSounds);
  });
})();
/// === Omo mehn, this thing nearly take my life, I was about to go insane trying to figure out how to make a simple synth with the Web Audio API. The amount youtube videos I watched ehn... 😭 === ///