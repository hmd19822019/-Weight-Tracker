// ===================================
// 应用状态
// ===================================
const APP = {
    data: [],
    waterLog: {},
    chart: null,
    chartType: 'line',
    timeRange: 30,
    filter: 'all',
    searchQuery: '',
    editId: null,
    photoData: null,
    settings: {
        height: 175,
        gender: 'male',
        age: 25,
        targetWeight: null,
        targetDate: null,
        waterTarget: 2000,
        reminderTime: '20:00',
        reminderFrequency: 'daily',
        theme: 'light'
    }
};

// ===================================
// 成就定义
// ===================================
const ACHIEVEMENTS = [
    { id: 'first_record', icon: '🌟', title: '第一步', desc: '记录第一条体重', check: d => d.length >= 1 },
    { id: 'week_streak', icon: '🔥', title: '坚持一周', desc: '连续记录7天', check: (d, s) => getStreak(d) >= 7 },
    { id: 'month_streak', icon: '💪', title: '月度达人', desc: '连续记录30天', check: (d, s) => getStreak(d) >= 30 },
    { id: 'records_10', icon: '📝', title: '初有成效', desc: '累计记录10条', check: d => d.length >= 10 },
    { id: 'records_50', icon: '📚', title: '数据收集者', desc: '累计记录50条', check: d => d.length >= 50 },
    { id: 'records_100', icon: '🏅', title: '百炼成钢', desc: '累计记录100条', check: d => d.length >= 100 },
    { id: 'lose_1kg', icon: '🎯', title: '小目标达成', desc: '成功减重1kg', check: d => getMaxLoss(d) >= 1 },
    { id: 'lose_5kg', icon: '🏆', title: '显著变化', desc: '成功减重5kg', check: d => getMaxLoss(d) >= 5 },
    { id: 'goal_reached', icon: '👑', title: '终极目标', desc: '达到目标体重', check: (d, s) => s.targetWeight && d.length > 0 && d[0].weight <= s.targetWeight },
    { id: 'water_master', icon: '💧', title: '水分达人', desc: '单日饮水达标', check: (d, s, w) => Object.values(w).some(v => v >= s.waterTarget) },
    { id: 'bmi_normal', icon: '💚', title: '健康体重', desc: 'BMI进入正常范围', check: (d, s) => { if (!d.length) return false; const b = d[0].weight / ((s.height/100) ** 2); return b >= 18.5 && b < 24; } },
    { id: 'photo_first', icon: '📸', title: '定格瞬间', desc: '第一次添加照片', check: d => d.some(r => r.photo) }
];

// ===================================
// 初始化
// ===================================
document.addEventListener('deviceready', initApp, false);
document.addEventListener('DOMContentLoaded', () => { if (!window.cordova) initApp(); }, false);

function initApp() {
    load();
    applyTheme();
    updateDate();
    bindEvents();
    updateAllUI();
}

// ===================================
// 数据持久化
// ===================================
function load() {
    try { APP.data = JSON.parse(localStorage.getItem('wd') || '[]'); } catch (e) { APP.data = []; }
    try { APP.waterLog = JSON.parse(localStorage.getItem('wl') || '{}'); } catch (e) { APP.waterLog = {}; }
    try { APP.settings = { ...APP.settings, ...JSON.parse(localStorage.getItem('ws') || '{}') }; } catch (e) {}
    APP.data.forEach((r, i) => { if (!r.id) r.id = Date.now() + i; });
    sortData();
}

function save() { localStorage.setItem('wd', JSON.stringify(APP.data)); }
function saveWater() { localStorage.setItem('wl', JSON.stringify(APP.waterLog)); }
function saveSettings() { localStorage.setItem('ws', JSON.stringify(APP.settings)); }

function sortData() { APP.data.sort((a, b) => new Date(b.date) - new Date(a.date)); }

// ===================================
// 主题
// ===================================
function applyTheme() {
    const t = APP.settings.theme;
    if (t === 'auto') {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', t);
    }
}

// ===================================
// 日期显示
// ===================================
function updateDate() {
    const el = document.getElementById('currentDate');
    if (el) el.textContent = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

// ===================================
// 事件绑定
// ===================================
function bindEvents() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', onTabClick));

    // Record
    document.getElementById('saveBtn').addEventListener('click', saveRecord);
    document.querySelectorAll('.template-btn').forEach(b => b.addEventListener('click', onTemplate));

    // Photo
    document.getElementById('photoBtn').addEventListener('click', () => document.getElementById('photoInput').click());
    document.getElementById('photoInput').addEventListener('change', onPhotoSelect);
    document.getElementById('photoRemove').addEventListener('click', removePhoto);

    // Water
    document.querySelectorAll('.water-btn').forEach(b => b.addEventListener('click', () => addWater(parseInt(b.dataset.amount))));
    document.getElementById('waterReset').addEventListener('click', resetWater);

    // History
    document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', onFilter));
    document.getElementById('searchInput').addEventListener('input', e => { APP.searchQuery = e.target.value.trim(); renderHistory(); });

    // Chart
    document.querySelectorAll('.chart-type-btn').forEach(b => b.addEventListener('click', onChartType));
    document.querySelectorAll('.time-range-btn').forEach(b => b.addEventListener('click', onTimeRange));

    // Reports
    document.getElementById('weeklyReportBtn').addEventListener('click', () => generateReport('week'));
    document.getElementById('monthlyReportBtn').addEventListener('click', () => generateReport('month'));
    document.getElementById('customReportBtn').addEventListener('click', () => generateReport('all'));

    // Settings
    document.getElementById('settingsBtn').addEventListener('click', () => openPanel('settingsPanel'));
    document.getElementById('closeSettings').addEventListener('click', () => closePanel('settingsPanel'));

    // Achievement
    document.getElementById('achievementBtn').addEventListener('click', () => { renderAchievements(); openPanel('achievementPanel'); });
    document.getElementById('closeAchievement').addEventListener('click', () => closePanel('achievementPanel'));

    // Backup
    document.getElementById('backupBtn').addEventListener('click', createBackup);

    // Settings fields
    const settingsMap = {
        userHeight: { key: 'height', parse: v => parseInt(v) || 175 },
        userGender: { key: 'gender', parse: v => v },
        userAge: { key: 'age', parse: v => parseInt(v) || 25 },
        targetWeight: { key: 'targetWeight', parse: v => parseFloat(v) || null },
        targetDate: { key: 'targetDate', parse: v => v || null },
        waterTarget: { key: 'waterTarget', parse: v => parseInt(v) || 2000 },
        reminderTime: { key: 'reminderTime', parse: v => v },
        reminderFrequency: { key: 'reminderFrequency', parse: v => v },
        themeSelect: { key: 'theme', parse: v => v }
    };

    Object.entries(settingsMap).forEach(([elId, cfg]) => {
        const el = document.getElementById(elId);
        if (!el) return;
        el.value = APP.settings[cfg.key] || '';
        el.addEventListener('change', e => {
            APP.settings[cfg.key] = cfg.parse(e.target.value);
            saveSettings();
            if (cfg.key === 'theme') applyTheme();
            updateAllUI();
        });
    });

    // Data management
    document.getElementById('importBtn').addEventListener('click', importData);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('autoBackupBtn').addEventListener('click', createBackup);
    document.getElementById('clearAllBtn').addEventListener('click', clearAll);

    // Edit modal
    document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
    document.getElementById('saveEditBtn').addEventListener('click', saveEdit);
    document.getElementById('deleteEditBtn').addEventListener('click', deleteFromEdit);
    document.getElementById('editModal').addEventListener('click', e => { if (e.target.id === 'editModal') closeEditModal(); });

    // Report modal
    document.getElementById('closeReportModal').addEventListener('click', () => closeModal('reportModal'));
    document.getElementById('shareReportBtn').addEventListener('click', shareReport);
    document.getElementById('exportReportBtn').addEventListener('click', exportReport);
    document.getElementById('reportModal').addEventListener('click', e => { if (e.target.id === 'reportModal') closeModal('reportModal'); });
}

// ===================================
// Tab 切换
// ===================================
function onTabClick(e) {
    const tab = e.currentTarget.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === tab + '-tab'));
    if (tab === 'stats') updateStats();
    if (tab === 'insights') updateInsights();
}

// ===================================
// 保存记录
// ===================================
function saveRecord() {
    const w = parseFloat(document.getElementById('weightInput').value);
    const bf = parseFloat(document.getElementById('bodyFatInput').value);
    const note = document.getElementById('noteInput').value.trim();

    if (isNaN(w) || w < 20 || w > 300) {
        toast('请输入有效的体重 (20-300kg)', 'error');
        return;
    }

    const record = {
        id: Date.now(),
        date: new Date().toISOString(),
        weight: w,
        bodyFat: isNaN(bf) ? null : bf,
        note: note,
        photo: APP.photoData || null
    };

    APP.data.unshift(record);
    sortData();
    save();

    // Reset
    document.getElementById('weightInput').value = '';
    document.getElementById('bodyFatInput').value = '';
    document.getElementById('noteInput').value = '';
    removePhoto();
    document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('selected'));

    toast('记录已保存 ✓', 'success');
    checkNewAchievements();
    updateAllUI();
}

// ===================================
// 模板
// ===================================
function onTemplate(e) {
    const tpl = e.currentTarget.dataset.template;
    const map = {
        morning: '早上测量',
        noon: '中午测量',
        evening: '晚上测量',
        'before-exercise': '运动前测量',
        'after-exercise': '运动后测量',
        medical: '体检测量'
    };
    document.querySelectorAll('.template-btn').forEach(b => b.classList.toggle('selected', b.dataset.template === tpl));
    document.getElementById('noteInput').value = map[tpl] || '';
    document.getElementById('weightInput').focus();
}

// ===================================
// 照片
// ===================================
function onPhotoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
        // 压缩图片
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxW = 800;
            let w = img.width, h = img.height;
            if (w > maxW) { h = h * maxW / w; w = maxW; }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            APP.photoData = canvas.toDataURL('image/jpeg', 0.7);
            document.getElementById('photoPreviewImg').src = APP.photoData;
            document.getElementById('photoPreview').style.display = 'block';
            document.getElementById('photoBtn').style.display = 'none';
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    APP.photoData = null;
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('photoBtn').style.display = 'flex';
    document.getElementById('photoInput').value = '';
}

// ===================================
// 水分追踪
// ===================================
function todayKey() { return new Date().toISOString().slice(0, 10); }

function getTodayWater() { return APP.waterLog[todayKey()] || 0; }

function addWater(ml) {
    const key = todayKey();
    APP.waterLog[key] = (APP.waterLog[key] || 0) + ml;
    saveWater();
    renderWater();
    toast(`+${ml}ml 💧`, 'info');
    checkNewAchievements();
}

function resetWater() {
    APP.waterLog[todayKey()] = 0;
    saveWater();
    renderWater();
}

function renderWater() {
    const current = getTodayWater();
    const target = APP.settings.waterTarget;
    const pct = Math.min((current / target) * 100, 100);
    document.getElementById('waterProgressFill').style.width = pct + '%';
    document.getElementById('waterCurrent').textContent = current;
    document.getElementById('waterTarget').textContent = target;
}

// ===================================
// 筛选
// ===================================
function onFilter(e) {
    APP.filter = e.currentTarget.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === APP.filter));
    renderHistory();
}

// ===================================
// 图表类型
// ===================================
function onChartType(e) {
    APP.chartType = e.currentTarget.dataset.chart;
    document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.toggle('active', b.dataset.chart === APP.chartType));
    updateStats();
}

function onTimeRange(e) {
    APP.timeRange = e.currentTarget.dataset.range === 'all' ? Infinity : parseInt(e.currentTarget.dataset.range);
    document.querySelectorAll('.time-range-btn').forEach(b => b.classList.toggle('active', b.dataset.range === e.currentTarget.dataset.range));
    updateStats();
}

// ===================================
// 全局 UI 更新
// ===================================
function updateAllUI() {
    renderRecordTab();
    renderHistory();
    renderWater();
    updateAchievementBadge();
}

// ===================================
// 记录页渲染
// ===================================
function renderRecordTab() {
    const d = APP.data;
    const s = APP.settings;

    // 连续天数
    const streak = getStreak(d);
    document.getElementById('streakCount').textContent = streak;

    if (!d.length) {
        document.getElementById('todayWeight').textContent = '--';
        document.getElementById('todayChange').textContent = '';
        document.getElementById('weekChange').textContent = '--';
        document.getElementById('monthChange').textContent = '--';
        document.getElementById('bmiValue').textContent = '--';
        document.getElementById('bodyFatValue').textContent = '--';
        return;
    }

    const latest = d[0];
    document.getElementById('todayWeight').textContent = latest.weight.toFixed(1) + ' kg';

    // 较上次变化
    const changeEl = document.getElementById('todayChange');
    if (d.length >= 2) {
        const diff = latest.weight - d[1].weight;
        changeEl.textContent = (diff > 0 ? '↑ +' : diff < 0 ? '↓ ' : '→ ') + diff.toFixed(1) + ' kg';
        changeEl.className = 'weight-change ' + (diff > 0 ? 'up' : diff < 0 ? 'down' : 'same');
    } else {
        changeEl.textContent = '';
    }

    // 本周变化
    renderPeriodChange('weekChange', 7);
    // 本月变化
    renderPeriodChange('monthChange', 30);

    // BMI
    const h = s.height / 100;
    const bmi = latest.weight / (h * h);
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);

    // 体脂率
    document.getElementById('bodyFatValue').textContent = latest.bodyFat != null ? latest.bodyFat.toFixed(1) + '%' : '--';
}

function renderPeriodChange(elId, days) {
    const el = document.getElementById(elId);
    if (APP.data.length < 2) { el.textContent = '--'; el.style.color = ''; return; }

    const now = new Date();
    const cutoff = new Date(now.getTime() - days * 86400000);
    const older = [...APP.data].reverse().find(r => new Date(r.date) <= cutoff);
    if (!older) { el.textContent = '--'; el.style.color = ''; return; }

    const diff = APP.data[0].weight - older.weight;
    el.textContent = (diff > 0 ? '+' : '') + diff.toFixed(1) + 'kg';
    el.style.color = diff > 0 ? '#F39C12' : diff < 0 ? '#27AE60' : '';
}

// ===================================
// 历史页渲染
// ===================================
function renderHistory() {
    const c = document.getElementById('historyContainer');
    let data = filterData();

    if (APP.searchQuery) {
        const q = APP.searchQuery.toLowerCase();
        data = data.filter(r => (r.note || '').toLowerCase().includes(q));
    }

    if (!data.length) {
        c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>暂无记录</p></div>';
        return;
    }

    // 按月分组
    const groups = {};
    data.forEach(r => {
        const d = new Date(r.date);
        const key = d.getFullYear() + '年' + (d.getMonth() + 1) + '月';
        (groups[key] = groups[key] || []).push(r);
    });

    c.innerHTML = '';
    Object.entries(groups).forEach(([month, records]) => {
        c.appendChild(createMonthGroup(month, records));
    });
}

function filterData() {
    const now = new Date();
    let d = [...APP.data];

    switch (APP.filter) {
        case 'today':
            d = d.filter(r => new Date(r.date).toDateString() === now.toDateString());
            break;
        case 'week':
            const wk = new Date(now.getTime() - 7 * 86400000);
            d = d.filter(r => new Date(r.date) >= wk);
            break;
        case 'month':
            const mo = new Date(now.getTime() - 30 * 86400000);
            d = d.filter(r => new Date(r.date) >= mo);
            break;
        case 'photos':
            d = d.filter(r => r.photo);
            break;
    }

    return d;
}

function createMonthGroup(month, records) {
    const g = document.createElement('div');
    g.className = 'month-group';

    const ws = records.map(r => r.weight);
    const avg = (ws.reduce((a, b) => a + b, 0) / ws.length).toFixed(1);
    const mn = Math.min(...ws).toFixed(1);
    const mx = Math.max(...ws).toFixed(1);

    g.innerHTML = `
        <div class="month-header">
            <span class="month-title">${month}</span>
            <div class="month-stats">
                <span class="month-stat-item">均 <strong>${avg}</strong></span>
                <span class="month-stat-item">${mn}~${mx}</span>
            </div>
            <span class="month-toggle">▼</span>
        </div>
        <div class="month-content"></div>
    `;

    const header = g.querySelector('.month-header');
    const content = g.querySelector('.month-content');
    const toggle = g.querySelector('.month-toggle');

    header.addEventListener('click', () => {
        content.classList.toggle('collapsed');
        toggle.classList.toggle('collapsed');
    });

    records.forEach((r, i) => {
        const prev = records[i + 1];
        content.appendChild(createHistoryItem(r, prev));
    });

    return g;
}

function createHistoryItem(r, prev) {
    const div = document.createElement('div');
    div.className = 'history-item';

    const d = new Date(r.date);
    const dateStr = (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');

    let changeHtml = '';
    if (prev) {
        const diff = r.weight - prev.weight;
        const cls = diff > 0 ? 'up' : diff < 0 ? 'down' : 'same';
        changeHtml = `<span class="history-item-change ${cls}">${diff > 0 ? '+' : ''}${diff.toFixed(1)}</span>`;
    }

    let metaHtml = '';
    if (r.note) metaHtml += `<span class="history-item-note">${r.note}</span>`;
    if (r.bodyFat != null) metaHtml += `<span class="history-item-fat">${r.bodyFat}%</span>`;
    if (r.photo) metaHtml += `<span class="history-item-photo-dot" title="有照片"></span>`;

    div.innerHTML = `
        <div class="history-item-left">
            <div class="history-item-date">${dateStr}</div>
            <div class="history-item-info">
                <div class="history-item-weight">${r.weight.toFixed(1)} kg</div>
                <div class="history-item-meta">${metaHtml}</div>
            </div>
        </div>
        ${changeHtml}
    `;

    div.addEventListener('click', () => openEditModal(r));
    return div;
}

// ===================================
// 统计页
// ===================================
function updateStats() {
    if (!APP.data.length) return;

    const data = getChartData();
    renderChart(data);
    renderStatCards(data);
    renderGoalProgress();
}

function getChartData() {
    let d = [...APP.data];
    if (APP.timeRange !== Infinity) {
        const cutoff = new Date(Date.now() - APP.timeRange * 86400000);
        d = d.filter(r => new Date(r.date) >= cutoff);
    }
    return d.slice().reverse(); // 升序
}

function renderChart(data) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    if (APP.chart) APP.chart.destroy();

    const labels = data.map(r => {
        const d = new Date(r.date);
        return (d.getMonth() + 1) + '/' + d.getDate();
    });
    const weights = data.map(r => r.weight);
    const bodyFats = data.map(r => r.bodyFat);
    const hasBodyFat = bodyFats.some(v => v != null);

    const datasets = [];

    if (APP.chartType === 'combined' && hasBodyFat) {
        datasets.push({
            label: '体重 (kg)',
            data: weights,
            borderColor: '#4A90D9',
            backgroundColor: 'rgba(74,144,217,.1)',
            borderWidth: 2,
            fill: true,
            tension: .4,
            pointRadius: 3,
            pointBackgroundColor: '#4A90D9',
            yAxisID: 'y'
        });
        datasets.push({
            label: '体脂率 (%)',
            data: bodyFats,
            borderColor: '#8E44AD',
            backgroundColor: 'rgba(142,68,173,.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: .4,
            pointRadius: 3,
            pointBackgroundColor: '#8E44AD',
            yAxisID: 'y1'
        });
    } else {
        const type = APP.chartType === 'combined' ? 'line' : APP.chartType;
        datasets.push({
            label: '体重 (kg)',
            data: weights,
            borderColor: '#4A90D9',
            backgroundColor: type === 'bar' ? 'rgba(74,144,217,.7)' : 'rgba(74,144,217,.1)',
            borderWidth: 2,
            fill: type === 'line',
            tension: .4,
            pointRadius: 3,
            pointBackgroundColor: '#4A90D9',
            pointBorderColor: '#fff',
            pointBorderWidth: 1.5
        });
    }

    const chartType = APP.chartType === 'combined' ? 'line' : APP.chartType;

    const scales = {
        y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,.04)' } },
        x: { grid: { display: false } }
    };

    if (APP.chartType === 'combined' && hasBodyFat) {
        scales.y1 = {
            position: 'right',
            beginAtZero: false,
            grid: { display: false },
            ticks: { callback: v => v + '%' }
        };
    }

    // 目标线
    if (APP.settings.targetWeight) {
        datasets.push({
            label: '目标',
            data: Array(labels.length).fill(APP.settings.targetWeight),
            borderColor: '#E74C3C',
            borderWidth: 1.5,
            borderDash: [8, 4],
            pointRadius: 0,
            fill: false
        });
    }

    APP.chart = new Chart(ctx, {
        type: chartType,
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: datasets.length > 1, position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        afterLabel(ctx) {
                            if (ctx.datasetIndex !== 0) return '';
                            const r = data[ctx.dataIndex];
                            let extra = '';
                            if (r.bodyFat != null) extra += `体脂: ${r.bodyFat}%\n`;
                            if (r.note) extra += `备注: ${r.note}`;
                            return extra;
                        }
                    }
                }
            },
            scales
        }
    });

    // 趋势信息
    const trendEl = document.getElementById('trendInfo');
    if (data.length >= 2) {
        const diff = data[data.length - 1].weight - data[0].weight;
        const pct = ((diff / data[0].weight) * 100).toFixed(1);
        trendEl.textContent = (diff > 0 ? '↑ +' : diff < 0 ? '↓ ' : '→ ') + diff.toFixed(1) + 'kg (' + pct + '%)';
    } else {
        trendEl.textContent = '数据不足';
    }
}

function renderStatCards(data) {
    if (!data.length) return;

    const ws = data.map(r => r.weight);
    const avg = ws.reduce((a, b) => a + b, 0) / ws.length;
    const mn = Math.min(...ws);
    const mx = Math.max(...ws);

    document.getElementById('avgWeight').textContent = avg.toFixed(1) + ' kg';
    document.getElementById('avgWeightDetail').textContent = '基于 ' + data.length + ' 条记录';

    const trendEl = document.getElementById('weightTrend');
    if (data.length >= 2) {
        const diff = data[data.length - 1].weight - data[0].weight;
        trendEl.textContent = (diff > 0 ? '+' : '') + diff.toFixed(1) + ' kg';
        trendEl.style.color = diff > 0 ? '#F39C12' : diff < 0 ? '#27AE60' : '';
        document.getElementById('trendDetail').textContent = diff > 0 ? '体重增加' : diff < 0 ? '体重减少' : '保持不变';
    } else {
        trendEl.textContent = '--';
    }

    document.getElementById('weightRange').textContent = (mx - mn).toFixed(1) + ' kg';
    document.getElementById('rangeDetail').textContent = mn.toFixed(1) + ' ~ ' + mx.toFixed(1);

    document.getElementById('recordCount').textContent = APP.data.length;
    const firstDate = new Date(APP.data[APP.data.length - 1].date);
    const days = Math.floor((Date.now() - firstDate) / 86400000);
    document.getElementById('recordDetail').textContent = '已记录 ' + days + ' 天';
}

function renderGoalProgress() {
    const card = document.getElementById('goalProgressCard');
    if (!APP.settings.targetWeight || !APP.data.length) {
        card.style.display = 'none';
        return;
    }

    card.style.display = 'block';

    const current = APP.data[0].weight;
    const target = APP.settings.targetWeight;
    const start = APP.data[APP.data.length - 1].weight;

    document.getElementById('goalStart').textContent = start.toFixed(1) + 'kg';
    document.getElementById('goalCurrent').textContent = current.toFixed(1) + 'kg';
    document.getElementById('goalTarget').textContent = target.toFixed(1) + 'kg';

    const total = Math.abs(start - target);
    const done = Math.abs(start - current);
    const pct = total > 0 ? Math.min((done / total) * 100, 100) : 0;

    document.getElementById('goalPercentage').textContent = pct.toFixed(0) + '%';
    document.getElementById('goalProgressFill').style.width = pct + '%';

    document.getElementById('goalCompleted').textContent = done.toFixed(1) + 'kg';
    document.getElementById('goalRemaining').textContent = Math.abs(current - target).toFixed(1) + 'kg';

    // 预计完成日期
    if (APP.data.length >= 7) {
        const recent = APP.data.slice(0, 7);
        const avgChange = (recent[0].weight - recent[6].weight) / 7;
        if (Math.abs(avgChange) > 0.01) {
            const daysLeft = Math.abs((current - target) / avgChange);
            const estDate = new Date(Date.now() + daysLeft * 86400000);
            document.getElementById('goalEstimate').textContent = estDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        } else {
            document.getElementById('goalEstimate').textContent = '保持当前';
        }
    } else {
        document.getElementById('goalEstimate').textContent = '数据不足';
    }
}

// ===================================
// 洞察页
// ===================================
function updateInsights() {
    renderInsights();
    renderBMI();
    renderPhotoComparison();
    renderPrediction();
}

function renderInsights() {
    const c = document.getElementById('insightsContent');
    if (!APP.data.length) {
        c.innerHTML = '<div class="insight-loading">暂无数据</div>';
        return;
    }

    const insights = generateInsights();
    c.innerHTML = insights.map(ins => `
        <div class="insight-item ${ins.type}">
            <div class="insight-icon">${ins.icon}</div>
            <div class="insight-text">${ins.text}</div>
        </div>
    `).join('');
}

function generateInsights() {
    const d = APP.data;
    const s = APP.settings;
    const insights = [];

    if (d.length < 2) {
        insights.push({ type: 'info', icon: '💡', text: '继续记录，积累更多数据后将获得个性化建议' });
        return insights;
    }

    const latest = d[0];
    const h = s.height / 100;
    const bmi = latest.weight / (h * h);

    // BMI 建议
    if (bmi < 18.5) {
        insights.push({ type: 'warning', icon: '⚠️', text: '您的BMI偏低（<strong>' + bmi.toFixed(1) + '</strong>），建议增加营养摄入，适当增重' });
    } else if (bmi >= 18.5 && bmi < 24) {
        insights.push({ type: 'good', icon: '✅', text: '您的BMI在正常范围（<strong>' + bmi.toFixed(1) + '</strong>），继续保持健康的生活方式' });
    } else if (bmi >= 24 && bmi < 28) {
        insights.push({ type: 'warning', icon: '⚠️', text: '您的BMI偏高（<strong>' + bmi.toFixed(1) + '</strong>），建议控制饮食，增加运动' });
    } else {
        insights.push({ type: 'warning', icon: '🚨', text: '您的BMI过高（<strong>' + bmi.toFixed(1) + '</strong>），建议咨询医生，制定减重计划' });
    }

    // 趋势分析
    if (d.length >= 7) {
        const week = d.slice(0, 7);
        const weekChange = week[0].weight - week[6].weight;
        if (weekChange < -0.5) {
            insights.push({ type: 'good', icon: '📉', text: '过去一周体重下降 <strong>' + Math.abs(weekChange).toFixed(1) + 'kg</strong>，效果显著！' });
        } else if (weekChange > 0.5) {
            insights.push({ type: 'warning', icon: '📈', text: '过去一周体重上升 <strong>' + weekChange.toFixed(1) + 'kg</strong>，注意控制饮食' });
        } else {
            insights.push({ type: 'info', icon: '➡️', text: '过去一周体重基本稳定，继续保持' });
        }
    }

    // 波动分析
    if (d.length >= 14) {
        const recent = d.slice(0, 14).map(r => r.weight);
        const std = Math.sqrt(recent.reduce((sum, w) => sum + Math.pow(w - recent.reduce((a, b) => a + b) / recent.length, 2), 0) / recent.length);
        if (std > 1.5) {
            insights.push({ type: 'warning', icon: '🎢', text: '近期体重波动较大（标准差 <strong>' + std.toFixed(1) + 'kg</strong>），建议规律作息和饮食' });
        } else if (std < 0.5) {
            insights.push({ type: 'good', icon: '🎯', text: '近期体重非常稳定（标准差 <strong>' + std.toFixed(1) + 'kg</strong>），保持得很好！' });
        }
    }

    // 水分摄入
    const todayWater = getTodayWater();
    if (todayWater >= s.waterTarget) {
        insights.push({ type: 'good', icon: '💧', text: '今日饮水已达标（<strong>' + todayWater + 'ml</strong>），保持充足水分有助于新陈代谢' });
    } else if (todayWater > 0) {
        insights.push({ type: 'tip', icon: '💧', text: '今日还需饮水 <strong>' + (s.waterTarget - todayWater) + 'ml</strong> 才能达标' });
    }

    // 连续记录
    const streak = getStreak(d);
    if (streak >= 30) {
        insights.push({ type: 'good', icon: '🔥', text: '已连续记录 <strong>' + streak + ' 天</strong>，坚持就是胜利！' });
    } else if (streak >= 7) {
        insights.push({ type: 'good', icon: '🔥', text: '已连续记录 <strong>' + streak + ' 天</strong>，继续保持！' });
    }

    // 目标进度
    if (s.targetWeight) {
        const diff = latest.weight - s.targetWeight;
        if (Math.abs(diff) <= 0.5) {
            insights.push({ type: 'good', icon: '🎉', text: '恭喜！您已接近目标体重，只差 <strong>' + Math.abs(diff).toFixed(1) + 'kg</strong>' });
        } else if (diff > 0) {
            insights.push({ type: 'info', icon: '🎯', text: '距离目标体重还有 <strong>' + diff.toFixed(1) + 'kg</strong>，加油！' });
        } else {
            insights.push({ type: 'good', icon: '🏆', text: '已达到目标体重！可以考虑设置新的目标' });
        }
    }

    // 体脂率
    if (latest.bodyFat != null) {
        const bf = latest.bodyFat;
        const gender = s.gender;
        let bfStatus = '';
        if (gender === 'male') {
            if (bf < 10) bfStatus = '过低';
            else if (bf < 20) bfStatus = '正常';
            else if (bf < 25) bfStatus = '偏高';
            else bfStatus = '过高';
        } else {
            if (bf < 20) bfStatus = '过低';
            else if (bf < 30) bfStatus = '正常';
            else if (bf < 35) bfStatus = '偏高';
            else bfStatus = '过高';
        }
        insights.push({ type: bfStatus === '正常' ? 'good' : 'info', icon: '📊', text: '当前体脂率 <strong>' + bf.toFixed(1) + '%</strong>，属于' + bfStatus + '范围' });
    }

    return insights;
}

function renderBMI() {
    if (!APP.data.length) return;

    const latest = APP.data[0];
    const h = APP.settings.height / 100;
    const bmi = latest.weight / (h * h);

    document.getElementById('currentBMI').textContent = bmi.toFixed(1);

    let status = '', cls = '';
    if (bmi < 18.5) { status = '偏瘦'; cls = 'underweight'; }
    else if (bmi < 24) { status = '正常'; cls = 'normal'; }
    else if (bmi < 28) { status = '偏胖'; cls = 'overweight'; }
    else { status = '肥胖'; cls = 'obese'; }

    const statusEl = document.getElementById('bmiStatus');
    statusEl.textContent = status;
    statusEl.className = 'bmi-status ' + cls;

    // 指示器位置
    const minBMI = 15, maxBMI = 35;
    const pos = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;
    document.getElementById('bmiMarker').style.left = Math.max(0, Math.min(100, pos)) + '%';
}

function renderPhotoComparison() {
    const c = document.getElementById('photoComparisonContent');
    const photos = APP.data.filter(r => r.photo).slice(0, 4);

    if (!photos.length) {
        c.innerHTML = '<div class="photo-empty">暂无照片记录</div>';
        return;
    }

    c.innerHTML = photos.map(r => {
        const d = new Date(r.date);
        const label = d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' · ' + r.weight.toFixed(1) + 'kg';
        return `
            <div class="comparison-photo">
                <img src="${r.photo}" alt="照片">
                <div class="comparison-label">${label}</div>
            </div>
        `;
    }).join('');
}

function renderPrediction() {
    const c = document.getElementById('predictionContent');
    if (APP.data.length < 7) {
        c.innerHTML = '<div class="prediction-loading">至少需要7天数据才能进行预测</div>';
        return;
    }

    const recent = APP.data.slice(0, 14);
    const avgChange = (recent[0].weight - recent[recent.length - 1].weight) / recent.length;

    const predictions = [];
    [7, 14, 30].forEach(days => {
        const pred = recent[0].weight - avgChange * days;
        predictions.push({ days, weight: pred });
    });

    c.innerHTML = `
        <div style="font-size: 13px; color: var(--text-2); line-height: 1.8;">
            <p style="margin-bottom: 12px;">基于近期趋势（日均变化 <strong>${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}kg</strong>），预测：</p>
            ${predictions.map(p => `
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                    <span>${p.days}天后</span>
                    <strong style="color: var(--primary);">${p.weight.toFixed(1)} kg</strong>
                </div>
            `).join('')}
            <p style="margin-top: 12px; font-size: 11px; color: var(--text-3);">* 预测仅供参考，实际结果受多种因素影响</p>
        </div>
    `;
}

// ===================================
// 报告生成
// ===================================
function generateReport(type) {
    let data = [];
    let title = '';

    const now = new Date();
    if (type === 'week') {
        const cutoff = new Date(now.getTime() - 7 * 86400000);
        data = APP.data.filter(r => new Date(r.date) >= cutoff);
        title = '周报 (' + cutoff.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' - ' + now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ')';
    } else if (type === 'month') {
        const cutoff = new Date(now.getTime() - 30 * 86400000);
        data = APP.data.filter(r => new Date(r.date) >= cutoff);
        title = '月报 (' + cutoff.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' - ' + now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ')';
    } else {
        data = APP.data;
        title = '全部记录报告';
    }

    if (!data.length) {
        toast('该时间段内没有数据', 'error');
        return;
    }

    const ws = data.map(r => r.weight);
    const avg = ws.reduce((a, b) => a + b, 0) / ws.length;
    const mn = Math.min(...ws);
    const mx = Math.max(...ws);
    const change = data[0].weight - data[data.length - 1].weight;

    const h = APP.settings.height / 100;
    const bmi = data[0].weight / (h * h);

    let html = `
        <div class="report-content">
            <div class="report-section">
                <h4>📊 数据概览</h4>
                <div class="report-stat"><span class="report-stat-label">记录总数</span><span class="report-stat-value">${data.length} 条</span></div>
                <div class="report-stat"><span class="report-stat-label">当前体重</span><span class="report-stat-value">${data[0].weight.toFixed(1)} kg</span></div>
                <div class="report-stat"><span class="report-stat-label">平均体重</span><span class="report-stat-value">${avg.toFixed(1)} kg</span></div>
                <div class="report-stat"><span class="report-stat-label">体重范围</span><span class="report-stat-value">${mn.toFixed(1)} ~ ${mx.toFixed(1)} kg</span></div>
                <div class="report-stat"><span class="report-stat-label">总变化</span><span class="report-stat-value" style="color: ${change < 0 ? 'var(--success)' : change > 0 ? 'var(--warning)' : 'var(--text-2)'}">${change > 0 ? '+' : ''}${change.toFixed(1)} kg</span></div>
            </div>
            <div class="report-section">
                <h4>💪 健康指标</h4>
                <div class="report-stat"><span class="report-stat-label">BMI</span><span class="report-stat-value">${bmi.toFixed(1)}</span></div>
    `;

    if (data[0].bodyFat != null) {
        html += `<div class="report-stat"><span class="report-stat-label">体脂率</span><span class="report-stat-value">${data[0].bodyFat.toFixed(1)}%</span></div>`;
    }

    html += `</div>`;

    if (APP.settings.targetWeight) {
        const diff = data[0].weight - APP.settings.targetWeight;
        html += `
            <div class="report-section">
                <h4>🎯 目标进度</h4>
                <div class="report-stat"><span class="report-stat-label">目标体重</span><span class="report-stat-value">${APP.settings.targetWeight.toFixed(1)} kg</span></div>
                <div class="report-stat"><span class="report-stat-label">距离目标</span><span class="report-stat-value">${diff > 0 ? '还需减重 ' + diff.toFixed(1) : '已达成'} kg</span></div>
            </div>
        `;
    }

    html += `</div>`;

    document.getElementById('reportTitle').textContent = title;
    document.getElementById('reportContent').innerHTML = html;
    openModal('reportModal');
}

function shareReport() {
    const title = document.getElementById('reportTitle').textContent;
    const content = document.getElementById('reportContent').innerText;
    const text = title + '\n\n' + content + '\n\n来自智能体重管理应用';

    if (navigator.share) {
        navigator.share({ title, text }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => toast('报告已复制到剪贴板', 'success')).catch(() => toast('复制失败', 'error'));
    }
}

function exportReport() {
    toast('PDF导出功能开发中...', 'info');
}

// ===================================
// 编辑模态框
// ===================================
function openEditModal(r) {
    APP.editId = r.id;
    document.getElementById('editWeight').value = r.weight;
    document.getElementById('editBodyFat').value = r.bodyFat || '';
    document.getElementById('editNote').value = r.note || '';
    openModal('editModal');
}

function closeEditModal() {
    closeModal('editModal');
    APP.editId = null;
}

function saveEdit() {
    const r = APP.data.find(x => x.id === APP.editId);
    if (!r) return;

    const w = parseFloat(document.getElementById('editWeight').value);
    const bf = parseFloat(document.getElementById('editBodyFat').value);
    const note = document.getElementById('editNote').value.trim();

    if (isNaN(w) || w < 20 || w > 300) {
        toast('请输入有效的体重', 'error');
        return;
    }

    r.weight = w;
    r.bodyFat = isNaN(bf) ? null : bf;
    r.note = note;

    sortData();
    save();
    closeEditModal();
    toast('已更新', 'success');
    updateAllUI();
}

function deleteFromEdit() {
    if (!confirm('确定删除这条记录？')) return;
    APP.data = APP.data.filter(r => r.id !== APP.editId);
    save();
    closeEditModal();
    toast('已删除', 'success');
    updateAllUI();
}

// ===================================
// 成就系统
// ===================================
function getStreak(data) {
    if (!data.length) return 0;
    let streak = 1;
    const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date().toDateString();
    if (new Date(sorted[0].date).toDateString() !== today) return 0;

    for (let i = 1; i < sorted.length; i++) {
        const d1 = new Date(sorted[i - 1].date);
        const d2 = new Date(sorted[i].date);
        const diff = Math.floor((d1 - d2) / 86400000);
        if (diff === 1) streak++;
        else break;
    }
    return streak;
}

function getMaxLoss(data) {
    if (data.length < 2) return 0;
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    let maxW = sorted[0].weight;
    let maxLoss = 0;
    sorted.forEach(r => {
        if (r.weight > maxW) maxW = r.weight;
        const loss = maxW - r.weight;
        if (loss > maxLoss) maxLoss = loss;
    });
    return maxLoss;
}

function checkNewAchievements() {
    const unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
    const newOnes = [];

    ACHIEVEMENTS.forEach(a => {
        if (unlocked.includes(a.id)) return;
        if (a.check(APP.data, APP.settings, APP.waterLog)) {
            unlocked.push(a.id);
            newOnes.push(a);
        }
    });

    if (newOnes.length) {
        localStorage.setItem('achievements', JSON.stringify(unlocked));
        newOnes.forEach(a => toast(`🏆 解锁成就：${a.title}`, 'success'));
        updateAchievementBadge();
    }
}

function updateAchievementBadge() {
    const unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
    const badge = document.getElementById('achievementBadge');
    if (unlocked.length) {
        badge.textContent = unlocked.length;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

function renderAchievements() {
    const unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
    const c = document.getElementById('achievementContent');

    c.innerHTML = `
        <div class="achievement-list">
            ${ACHIEVEMENTS.map(a => {
                const isUnlocked = unlocked.includes(a.id);
                return `
                    <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${a.icon}</div>
                        <div class="achievement-info">
                            <div class="achievement-title">${a.title}</div>
                            <div class="achievement-desc">${a.desc}</div>
                            ${isUnlocked ? '<div class="achievement-progress">✓ 已解锁</div>' : '<div class="achievement-progress">🔒 未解锁</div>'}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ===================================
// 数据管理
// ===================================
function exportData() {
    if (!APP.data.length) {
        toast('没有数据可导出', 'error');
        return;
    }

    let csv = '\ufeff日期,体重(kg),体脂率(%),备注\n';
    APP.data.forEach(r => {
        const d = new Date(r.date).toLocaleString('zh-CN');
        const bf = r.bodyFat != null ? r.bodyFat.toFixed(1) : '';
        const note = (r.note || '').replace(/,/g, '，');
        csv += `${d},${r.weight.toFixed(1)},${bf},${note}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `体重记录_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast('已导出', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
            const text = ev.target.result;
            const lines = text.split('\n');
            let count = 0;

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(',');
                if (parts.length >= 2) {
                    const w = parseFloat(parts[1]);
                    if (!isNaN(w) && w >= 20 && w <= 300) {
                        APP.data.push({
                            id: Date.now() + i,
                            date: new Date().toISOString(),
                            weight: w,
                            bodyFat: parseFloat(parts[2]) || null,
                            note: parts[3] || '',
                            photo: null
                        });
                        count++;
                    }
                }
            }

            if (count > 0) {
                sortData();
                save();
                updateAllUI();
                toast(`成功导入 ${count} 条记录`, 'success');
            } else {
                toast('未找到有效数据', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function createBackup() {
    const backup = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        data: APP.data,
        settings: APP.settings,
        waterLog: APP.waterLog,
        achievements: JSON.parse(localStorage.getItem('achievements') || '[]')
    };

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `体重记录备份_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast('备份已创建', 'success');
}

function clearAll() {
    if (!confirm('确定要清空所有数据吗？此操作不可恢复！\n\n建议先导出备份。')) return;
    if (!confirm('再次确认：真的要删除所有记录吗？')) return;

    APP.data = [];
    APP.waterLog = {};
    save();
    saveWater();
    localStorage.removeItem('achievements');

    toast('所有数据已清空', 'success');
    updateAllUI();
}

// ===================================
// 工具函数
// ===================================
function openPanel(id) {
    document.getElementById(id).classList.add('active');
}

function closePanel(id) {
    document.getElementById(id).classList.remove('active');
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function toast(msg, type = 'info') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.className = `toast ${type}`, 3000);
}
