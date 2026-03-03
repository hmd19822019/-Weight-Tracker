// 应用状态
let weightData = [];
let weightChart = null;

// 初始化
document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('DOMContentLoaded', onDOMLoaded, false);

function onDOMLoaded() {
    // 在浏览器中测试时使用
    if (!window.cordova) {
        initApp();
    }
}

function onDeviceReady() {
    // 在 Cordova 环境中使用
    initApp();
}

function initApp() {
    loadData();
    updateDate();
    setupEventListeners();
    updateUI();
}

// 加载数据
function loadData() {
    const saved = localStorage.getItem('weightData');
    if (saved) {
        try {
            weightData = JSON.parse(saved);
            // 按日期降序排序
            weightData.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (e) {
            console.error('Failed to parse saved data:', e);
            weightData = [];
        }
    }
}

// 保存数据
function saveData() {
    localStorage.setItem('weightData', JSON.stringify(weightData));
}

// 更新日期显示
function updateDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('zh-CN', options);
}

// 设置事件监听
function setupEventListeners() {
    document.getElementById('saveBtn').addEventListener('click', saveWeight);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('clearBtn').addEventListener('click', clearData);
}

// 保存体重记录
function saveWeight() {
    const weightInput = document.getElementById('weightInput');
    const noteInput = document.getElementById('noteInput');

    const weight = parseFloat(weightInput.value);
    const note = noteInput.value.trim();

    if (isNaN(weight) || weight < 20 || weight > 300) {
        showToast('请输入有效的体重值 (20-300kg)', 'error');
        return;
    }

    const now = new Date();
    const dateStr = now.toISOString();

    // 检查今天是否已有记录
    const todayRecord = weightData.find(item => {
        const itemDate = new Date(item.date);
        return itemDate.toDateString() === now.toDateString();
    });

    if (todayRecord) {
        if (confirm('今天已有记录，是否覆盖？')) {
            todayRecord.weight = weight;
            todayRecord.note = note;
            todayRecord.date = dateStr;
            showToast('记录已更新', 'success');
        } else {
            return;
        }
    } else {
        weightData.unshift({
            date: dateStr,
            weight: weight,
            note: note
        });
        showToast('记录已保存', 'success');
    }

    saveData();
    updateUI();

    // 清空输入
    weightInput.value = '';
    noteInput.value = '';
    weightInput.focus();
}

// 更新 UI
function updateUI() {
    const hasData = weightData.length > 0;

    // 显示/隐藏各个区域
    document.getElementById('emptyState').style.display = hasData ? 'none' : 'block';
    document.getElementById('statsSection').style.display = hasData ? 'grid' : 'none';
    document.getElementById('chartSection').style.display = hasData ? 'block' : 'none';
    document.getElementById('historySection').style.display = hasData ? 'block' : 'none';

    if (hasData) {
        updateStats();
        updateChart();
        updateHistory();
    }
}

// 更新统计信息
function updateStats() {
    if (weightData.length === 0) return;

    const latest = weightData[0];
    const weights = weightData.map(item => item.weight);

    // 当前体重
    document.getElementById('currentWeight').textContent = latest.weight + ' kg';

    // 较上次变化
    if (weightData.length > 1) {
        const prev = weightData[1];
        const change = latest.weight - prev.weight;
        const changeEl = document.getElementById('weightChange');
        if (change > 0) {
            changeEl.textContent = '+' + change.toFixed(1) + ' kg';
            changeEl.style.color = 'var(--warning-color)';
        } else if (change < 0) {
            changeEl.textContent = change.toFixed(1) + ' kg';
            changeEl.style.color = 'var(--success-color)';
        } else {
            changeEl.textContent = '0.0 kg';
            changeEl.style.color = 'var(--text-secondary)';
        }
    } else {
        document.getElementById('weightChange').textContent = '--';
    }

    // 平均体重
    const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
    document.getElementById('avgWeight').textContent = avg.toFixed(1) + ' kg';
}

// 更新图表
function updateChart() {
    const canvas = document.getElementById('weightChart');
    const ctx = canvas.getContext('2d');

    // 准备数据（按日期升序）
    const chartData = [...weightData].sort((a, b) => new Date(a.date) - new Date(b.date));

    // 取最后 30 条记录（或全部，如果少于 30 条）
    const displayData = chartData.slice(-30);

    const labels = displayData.map(item => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const data = displayData.map(item => item.weight);

    // 销毁旧图表
    if (weightChart) {
        weightChart.destroy();
    }

    // 创建新图表
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '体重 (kg)',
                data: data,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#2196F3',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            const item = displayData[index];
                            if (item.note) {
                                return `备注: ${item.note}`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 更新历史记录列表
function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    weightData.forEach((item, index) => {
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div>
                <div class="weight">${item.weight} kg</div>
                <div class="note">${item.note || '无备注'}</div>
            </div>
            <div class="date">${dateStr}</div>
            <button class="delete-btn" onclick="deleteRecord(${index})">×</button>
        `;

        historyList.appendChild(div);
    });
}

// 删除记录
function deleteRecord(index) {
    if (confirm('确定要删除这条记录吗？')) {
        weightData.splice(index, 1);
        saveData();
        updateUI();
        showToast('记录已删除', 'success');
    }
}

// 导出数据
function exportData() {
    if (weightData.length === 0) {
        showToast('没有数据可导出', 'error');
        return;
    }

    // 准备 CSV 内容
    let csv = '日期,体重,备注\n';
    weightData.forEach(item => {
        const date = new Date(item.date).toLocaleString('zh-CN');
        const note = item.note.replace(/,/g, '，'); // 替换逗号以避免 CSV 问题
        csv += `${date},${item.weight},${note}\n`;
    });

    // 创建下载
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `体重记录_${new Date().toLocaleDateString('zh-CN')}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('数据已导出', 'success');
}

// 清空所有数据
function clearData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
        weightData = [];
        saveData();
        updateUI();
        showToast('所有数据已清空', 'success');
    }
}

// 显示 Toast 提示
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';

    setTimeout(() => {
        toast.className = 'toast ' + type;
    }, 3000);
}
