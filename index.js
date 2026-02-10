// Smart Study Planner — Main Application Logic
// All data persisted via localStorage

// ── LocalStorage helpers ──
function load(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function loadPref(key, def) { try { return JSON.parse(localStorage.getItem('prefs'))?.[key] ?? def; } catch { return def; } }
function savePref(key, val) { const p = JSON.parse(localStorage.getItem('prefs') || '{}'); p[key] = val; localStorage.setItem('prefs', JSON.stringify(p)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// ── Data ──
let subjects = load('subjects');   // [{id, name, color, priority, hoursGoal}]
let schedule = load('schedule');   // [{id, subjectId, day, startTime, endTime}]
let tasks = load('tasks');         // [{id, title, subjectId, dueDate, priority, completed}]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = [];
for (let h = 7; h <= 21; h++) HOURS.push(`${h.toString().padStart(2, '0')}:00`);

// ── Tab Navigation ──
const navBtns = document.querySelectorAll('.nav-btn');
const tabs = document.querySelectorAll('.tab');
function switchTab(tab) {
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    tabs.forEach(t => t.classList.toggle('active', t.id === tab));
    savePref('activeTab', tab);
    if (tab === 'dashboard') renderDashboard();
    if (tab === 'subjects') renderSubjects();
    if (tab === 'schedule') renderSchedule();
    if (tab === 'tasks') renderTasks();
    if (tab === 'analytics') renderAnalytics();
}
navBtns.forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

// ── Helper: get subject by id ──
function getSubject(id) { return subjects.find(s => s.id === id); }
function subjectName(id) { const s = getSubject(id); return s ? s.name : 'None'; }
function subjectColor(id) { const s = getSubject(id); return s ? s.color : '#ccc'; }

// ── Populate subject dropdowns ──
function populateSubjectDropdowns() {
    ['sched-subject', 'task-subject'].forEach(selId => {
        const sel = document.getElementById(selId);
        const val = sel.value;
        const first = sel.options[0].outerHTML;
        sel.innerHTML = first + subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        sel.value = val;
    });
}

// =============================================
// A. DASHBOARD
// =============================================
function renderDashboard() {
    // Stats
    const today = new Date();
    const dayName = DAYS[today.getDay() === 0 ? 6 : today.getDay() - 1];
    const todaySchedule = schedule.filter(e => e.day === dayName);
    const pendingTasks = tasks.filter(t => !t.completed);
    const overdueTasks = pendingTasks.filter(t => new Date(t.dueDate) < new Date(today.toDateString()));

    document.getElementById('dash-stats').innerHTML = `
        <div class="stat-box"><div class="num">${subjects.length}</div><div class="label">Subjects</div></div>
        <div class="stat-box"><div class="num">${todaySchedule.length}</div><div class="label">Classes Today</div></div>
        <div class="stat-box"><div class="num">${pendingTasks.length}</div><div class="label">Pending Tasks</div></div>
        <div class="stat-box"><div class="num">${overdueTasks.length}</div><div class="label">Overdue</div></div>`;

    // Today's schedule
    const ds = document.getElementById('dash-schedule');
    if (todaySchedule.length === 0) { ds.innerHTML = '<p class="empty">No classes scheduled today.</p>'; }
    else {
        ds.innerHTML = todaySchedule.sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map(e => `<div class="task-row"><span class="color-dot" style="background:${subjectColor(e.subjectId)}"></span><div class="task-info"><div class="t-title">${subjectName(e.subjectId)}</div><div class="t-meta">${e.startTime} - ${e.endTime}</div></div></div>`).join('');
    }

    // Upcoming deadlines (next 7 days)
    const dd = document.getElementById('dash-deadlines');
    const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
    const upcoming = tasks.filter(t => !t.completed && new Date(t.dueDate) <= nextWeek)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    if (upcoming.length === 0) { dd.innerHTML = '<p class="empty">No upcoming deadlines.</p>'; }
    else {
        dd.innerHTML = upcoming.map(t => {
            const due = new Date(t.dueDate);
            const isOverdue = due < new Date(today.toDateString());
            return `<div class="task-row"><div class="task-info"><div class="t-title">${t.title}</div><div class="t-meta">${subjectName(t.subjectId)} • <span class="priority-badge ${t.priority}">${t.priority}</span></div></div><div class="t-due ${isOverdue ? 'overdue' : ''}">${isOverdue ? 'OVERDUE' : due.toLocaleDateString()}</div></div>`;
        }).join('');
    }

    // Subjects overview
    const dsub = document.getElementById('dash-subjects');
    if (subjects.length === 0) { dsub.innerHTML = '<p class="empty">No subjects added yet.</p>'; }
    else {
        dsub.innerHTML = subjects.map(s => `<div class="dash-subj-item"><span class="color-dot" style="background:${s.color}"></span> <strong>${s.name}</strong> — <span class="priority-badge ${s.priority}">${s.priority}</span> — ${s.hoursGoal}h/week</div>`).join('');
    }
}

// =============================================
// B. SUBJECT MANAGEMENT (CRUD)
// =============================================
const subjectForm = document.getElementById('subject-form');
const subjectCancel = document.getElementById('subject-cancel');

function renderSubjects() {
    const tbody = document.getElementById('subjects-body');
    const empty = document.getElementById('subjects-empty');
    if (subjects.length === 0) { tbody.innerHTML = ''; empty.style.display = ''; return; }
    empty.style.display = 'none';
    tbody.innerHTML = subjects.map(s => `
        <tr>
            <td><span class="color-dot" style="background:${s.color}"></span></td>
            <td>${s.name}</td>
            <td><span class="priority-badge ${s.priority}">${s.priority}</span></td>
            <td>${s.hoursGoal}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editSubject('${s.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSubject('${s.id}')">Delete</button>
            </td>
        </tr>`).join('');
    populateSubjectDropdowns();
}

subjectForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('subject-edit-id').value;
    const data = {
        id: id || uid(),
        name: document.getElementById('subject-name').value.trim(),
        color: document.getElementById('subject-color').value,
        priority: document.getElementById('subject-priority').value,
        hoursGoal: Number(document.getElementById('subject-hours').value)
    };
    if (id) { const idx = subjects.findIndex(s => s.id === id); if (idx >= 0) subjects[idx] = data; }
    else subjects.push(data);
    save('subjects', subjects);
    subjectForm.reset();
    document.getElementById('subject-edit-id').value = '';
    subjectCancel.style.display = 'none';
    document.getElementById('subject-color').value = '#667eea';
    renderSubjects();
});

window.editSubject = function (id) {
    const s = getSubject(id); if (!s) return;
    document.getElementById('subject-edit-id').value = s.id;
    document.getElementById('subject-name').value = s.name;
    document.getElementById('subject-color').value = s.color;
    document.getElementById('subject-priority').value = s.priority;
    document.getElementById('subject-hours').value = s.hoursGoal;
    subjectCancel.style.display = '';
    document.getElementById('subject-name').focus();
};

window.deleteSubject = function (id) {
    if (!confirm('Delete this subject? Related schedule entries will also be removed.')) return;
    subjects = subjects.filter(s => s.id !== id);
    schedule = schedule.filter(e => e.subjectId !== id);
    save('subjects', subjects); save('schedule', schedule);
    renderSubjects();
};

subjectCancel.addEventListener('click', () => {
    subjectForm.reset();
    document.getElementById('subject-edit-id').value = '';
    subjectCancel.style.display = 'none';
    document.getElementById('subject-color').value = '#667eea';
});

// =============================================
// C. SCHEDULE PLANNER (with conflict detection)
// =============================================
const schedForm = document.getElementById('schedule-form');
const conflictMsg = document.getElementById('sched-conflict');

function timeToMin(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }

function hasConflict(day, start, end, excludeId) {
    return schedule.filter(e => e.day === day && e.id !== excludeId).some(e => {
        const eStart = timeToMin(e.startTime), eEnd = timeToMin(e.endTime);
        const nStart = timeToMin(start), nEnd = timeToMin(end);
        return nStart < eEnd && nEnd > eStart;
    });
}

function renderSchedule() {
    populateSubjectDropdowns();
    const tbody = document.getElementById('timetable-body');
    tbody.innerHTML = HOURS.map(hour => {
        const hMin = timeToMin(hour);
        return `<tr><td><strong>${hour}</strong></td>${DAYS.map(day => {
            const entries = schedule.filter(e => e.day === day && timeToMin(e.startTime) <= hMin && timeToMin(e.endTime) > hMin);
            return `<td>${entries.map(e =>
                `<div class="sched-block" style="background:${subjectColor(e.subjectId)}" title="${subjectName(e.subjectId)} ${e.startTime}-${e.endTime}">${subjectName(e.subjectId).slice(0, 8)}<span class="remove" onclick="removeSched('${e.id}')">✕</span></div>`
            ).join('')}</td>`;
        }).join('')}</tr>`;
    }).join('');
}

schedForm.addEventListener('submit', e => {
    e.preventDefault();
    const subjectId = document.getElementById('sched-subject').value;
    const day = document.getElementById('sched-day').value;
    const start = document.getElementById('sched-start').value;
    const end = document.getElementById('sched-end').value;

    if (timeToMin(end) <= timeToMin(start)) {
        conflictMsg.textContent = 'End time must be after start time.';
        conflictMsg.style.display = ''; return;
    }
    if (hasConflict(day, start, end, null)) {
        conflictMsg.textContent = `⚠️ Schedule conflict! There is already a class during ${start}-${end} on ${day}.`;
        conflictMsg.style.display = ''; return;
    }
    conflictMsg.style.display = 'none';
    schedule.push({ id: uid(), subjectId, day, startTime: start, endTime: end });
    save('schedule', schedule);
    schedForm.reset();
    renderSchedule();
});

window.removeSched = function (id) {
    schedule = schedule.filter(e => e.id !== id);
    save('schedule', schedule);
    renderSchedule();
};

// =============================================
// D. TASK MANAGER (with deadline alerts)
// =============================================
const taskForm = document.getElementById('task-form');
let taskFilter = 'all';

function renderTasks() {
    populateSubjectDropdowns();
    checkDeadlineAlerts();

    const list = document.getElementById('tasks-list');
    const empty = document.getElementById('tasks-empty');
    let filtered = tasks;
    if (taskFilter === 'pending') filtered = tasks.filter(t => !t.completed);
    if (taskFilter === 'completed') filtered = tasks.filter(t => t.completed);

    if (filtered.length === 0) { list.innerHTML = ''; empty.style.display = ''; return; }
    empty.style.display = 'none';
    const today = new Date(new Date().toDateString());

    list.innerHTML = filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    }).map(t => {
        const due = new Date(t.dueDate);
        const isOverdue = !t.completed && due < today;
        return `<div class="task-row ${t.completed ? 'done' : ''}">
            <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask('${t.id}')">
            <div class="task-info">
                <div class="t-title">${t.title}</div>
                <div class="t-meta">${subjectName(t.subjectId)} • <span class="priority-badge ${t.priority}">${t.priority}</span></div>
            </div>
            <div class="t-due ${isOverdue ? 'overdue' : ''}">${isOverdue ? 'OVERDUE' : due.toLocaleDateString()}</div>
            <button class="btn btn-sm btn-danger" onclick="deleteTask('${t.id}')">✕</button>
        </div>`;
    }).join('');
}

function checkDeadlineAlerts() {
    const alertBox = document.getElementById('task-alerts');
    const today = new Date(new Date().toDateString());
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    const overdue = tasks.filter(t => !t.completed && new Date(t.dueDate) < today);
    const dueTomorrow = tasks.filter(t => !t.completed && new Date(t.dueDate).toDateString() === tomorrow.toDateString());
    const dueToday = tasks.filter(t => !t.completed && new Date(t.dueDate).toDateString() === today.toDateString());

    if (overdue.length === 0 && dueToday.length === 0 && dueTomorrow.length === 0) {
        alertBox.style.display = 'none'; return;
    }
    alertBox.style.display = '';
    let html = '';
    if (overdue.length) html += `<div class="alert alert-danger">🚨 <strong>${overdue.length} overdue task(s):</strong> ${overdue.map(t => t.title).join(', ')}</div>`;
    if (dueToday.length) html += `<div class="alert alert-warn">⚠️ <strong>${dueToday.length} task(s) due today:</strong> ${dueToday.map(t => t.title).join(', ')}</div>`;
    if (dueTomorrow.length) html += `<div class="alert alert-warn">📌 <strong>${dueTomorrow.length} task(s) due tomorrow:</strong> ${dueTomorrow.map(t => t.title).join(', ')}</div>`;
    alertBox.innerHTML = html;
}

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    tasks.push({
        id: uid(),
        title: document.getElementById('task-title').value.trim(),
        subjectId: document.getElementById('task-subject').value,
        dueDate: document.getElementById('task-due').value,
        priority: document.getElementById('task-priority').value,
        completed: false
    });
    save('tasks', tasks);
    taskForm.reset();
    renderTasks();
});

window.toggleTask = function (id) {
    const t = tasks.find(t => t.id === id);
    if (t) { t.completed = !t.completed; save('tasks', tasks); renderTasks(); }
};

window.deleteTask = function (id) {
    tasks = tasks.filter(t => t.id !== id);
    save('tasks', tasks);
    renderTasks();
};

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        taskFilter = btn.dataset.filter;
        renderTasks();
    });
});

// =============================================
// E. PROGRESS ANALYTICS
// =============================================
function renderAnalytics() {
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.completed).length;
    const pct = totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0;
    const totalSchedHours = schedule.reduce((sum, e) => sum + (timeToMin(e.endTime) - timeToMin(e.startTime)) / 60, 0);

    // Stats row
    document.getElementById('analytics-stats').innerHTML = `
        <div class="stat-box"><div class="num">${subjects.length}</div><div class="label">Total Subjects</div></div>
        <div class="stat-box"><div class="num">${totalSchedHours.toFixed(1)}h</div><div class="label">Scheduled/Week</div></div>
        <div class="stat-box"><div class="num">${doneTasks}/${totalTasks}</div><div class="label">Tasks Done</div></div>
        <div class="stat-box"><div class="num">${pct}%</div><div class="label">Completion Rate</div></div>`;

    // Study hours bar chart
    const hoursChart = document.getElementById('hours-chart');
    if (subjects.length === 0) { hoursChart.innerHTML = '<p class="empty">Add subjects to see chart.</p>'; }
    else {
        const maxHours = Math.max(...subjects.map(s => {
            return schedule.filter(e => e.subjectId === s.id).reduce((sum, e) => sum + (timeToMin(e.endTime) - timeToMin(e.startTime)) / 60, 0);
        }), 1);
        hoursChart.innerHTML = subjects.map(s => {
            const h = schedule.filter(e => e.subjectId === s.id).reduce((sum, e) => sum + (timeToMin(e.endTime) - timeToMin(e.startTime)) / 60, 0);
            const w = (h / maxHours * 100).toFixed(0);
            return `<div class="bar-row"><div class="label">${s.name}</div><div class="bar-bg"><div class="bar-fill" style="width:${w}%;background:${s.color}"></div></div><div class="bar-val">${h.toFixed(1)}h</div></div>`;
        }).join('');
    }

    // Completion donut
    const compChart = document.getElementById('completion-chart');
    const donePct = pct;
    const pendPct = 100 - donePct;
    compChart.innerHTML = `<div class="donut-wrap">
        <div class="donut" style="background:conic-gradient(#27ae60 0% ${donePct}%, #eee ${donePct}% 100%)"><div class="donut-center">${donePct}%</div></div>
        <div class="donut-legend"><div><span class="color-dot" style="background:#27ae60"></span> Completed (${doneTasks})</div><div><span class="color-dot" style="background:#eee;border:1px solid #ccc"></span> Pending (${totalTasks - doneTasks})</div></div>
    </div>`;

    // Breakdown table
    const bbody = document.getElementById('breakdown-body');
    const bempty = document.getElementById('breakdown-empty');
    if (subjects.length === 0) { bbody.innerHTML = ''; bempty.style.display = ''; return; }
    bempty.style.display = 'none';
    bbody.innerHTML = subjects.map(s => {
        const schedH = schedule.filter(e => e.subjectId === s.id).reduce((sum, e) => sum + (timeToMin(e.endTime) - timeToMin(e.startTime)) / 60, 0);
        const sTasks = tasks.filter(t => t.subjectId === s.id);
        const sDone = sTasks.filter(t => t.completed).length;
        const sPct = sTasks.length ? Math.round(sDone / sTasks.length * 100) : 0;
        return `<tr>
            <td><span class="color-dot" style="background:${s.color}"></span> ${s.name}</td>
            <td><span class="priority-badge ${s.priority}">${s.priority}</span></td>
            <td>${s.hoursGoal}</td>
            <td>${schedH.toFixed(1)}</td>
            <td>${sTasks.length}</td>
            <td>${sDone}</td>
            <td>${sPct}%</td>
        </tr>`;
    }).join('');
}

// ── Initialize ──
const startTab = loadPref('activeTab', 'dashboard');
switchTab(startTab);
