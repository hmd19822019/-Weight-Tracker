/**
 * 饮食Tab功能模块
 */

class FoodTab {
    constructor() {
        this.currentRecognitionResult = null;
        this.todayFoodRecords = [];
        this.init();
    }

    init() {
        this.loadTodayRecords();
        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        // 拍照按钮
        document.getElementById('takeFoodPhoto')?.addEventListener('click', () => {
            document.getElementById('foodPhotoInput').click();
        });

        // 照片选择
        document.getElementById('foodPhotoInput')?.addEventListener('change', (e) => {
            this.handlePhotoSelected(e.target.files[0]);
        });

        // 移除照片
        document.getElementById('removeFoodPhoto')?.addEventListener('click', () => {
            this.clearPhoto();
        });

        // 确认添加食物
        document.getElementById('confirmFood')?.addEventListener('click', () => {
            this.confirmAddFood();
        });

        // 重新识别
        document.getElementById('retryRecognition')?.addEventListener('click', () => {
            this.retryRecognition();
        });

        // 手动添加
        document.getElementById('addManualFood')?.addEventListener('click', () => {
            this.addManualFood();
        });
    }

    async handlePhotoSelected(file) {
        if (!file) return;

        try {
            // 显示预览
            const base64 = await foodRecognizer.getImageFromFile(file);
            document.getElementById('foodPhotoImg').src = base64;
            document.getElementById('foodPhotoPreview').style.display = 'block';
            document.getElementById('takeFoodPhoto').style.display = 'none';

            // 显示识别中状态
            document.getElementById('recognitionResult').style.display = 'block';
            document.getElementById('resultLoading').style.display = 'block';
            document.getElementById('resultContent').style.display = 'none';

            // 压缩图片
            const compressed = await foodRecognizer.compressImage(base64);

            // 识别食物
            const result = await foodRecognizer.recognizeFood(compressed);

            // 显示结果
            this.displayRecognitionResult(result);

        } catch (error) {
            console.error('识别失败:', error);
            this.showToast('识别失败: ' + error.message, 'error');
            this.clearPhoto();
        }
    }

    displayRecognitionResult(result) {
        document.getElementById('resultLoading').style.display = 'none';

        if (!result.success) {
            this.showToast('未识别到食物，请重试', 'warning');
            this.clearPhoto();
            return;
        }

        this.currentRecognitionResult = result;

        // 显示食物信息
        document.getElementById('foodName').textContent = result.food.name;
        document.getElementById('foodConfidence').textContent = 
            (result.food.probability * 100).toFixed(1) + '%';
        document.getElementById('foodCalorie').textContent = result.food.calorie;

        // 显示其他可能的食物
        if (result.alternatives && result.alternatives.length > 0) {
            const alternativeList = document.getElementById('alternativeList');
            alternativeList.innerHTML = result.alternatives.map(alt => 
                `<span class="alternative-item">${alt.name} (${(alt.probability * 100).toFixed(0)}%)</span>`
            ).join('');
            document.getElementById('alternativeFoods').style.display = 'block';
        }

        document.getElementById('resultContent').style.display = 'block';
    }

    confirmAddFood() {
        if (!this.currentRecognitionResult) return;

        const food = this.currentRecognitionResult.food;
        
        // 添加到今日记录
        const record = {
            id: Date.now(),
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            name: food.name,
            calorie: food.calorie,
            timestamp: Date.now()
        };

        this.todayFoodRecords.push(record);
        this.saveTodayRecords();
        this.updateDisplay();
        this.clearPhoto();

        this.showToast(`已添加 ${food.name}`, 'success');
    }

    retryRecognition() {
        this.clearPhoto();
        document.getElementById('foodPhotoInput').click();
    }

    clearPhoto() {
        document.getElementById('foodPhotoInput').value = '';
        document.getElementById('foodPhotoPreview').style.display = 'none';
        document.getElementById('takeFoodPhoto').style.display = 'flex';
        document.getElementById('recognitionResult').style.display = 'none';
        this.currentRecognitionResult = null;
    }

    addManualFood() {
        const name = document.getElementById('manualFoodName').value.trim();
        const calorie = parseInt(document.getElementById('manualFoodCalorie').value);

        if (!name || !calorie || calorie < 0) {
            this.showToast('请输入食物名称和热量', 'warning');
            return;
        }

        const record = {
            id: Date.now(),
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            name: name,
            calorie: calorie,
            timestamp: Date.now()
        };

        this.todayFoodRecords.push(record);
        this.saveTodayRecords();
        this.updateDisplay();

        // 清空输入
        document.getElementById('manualFoodName').value = '';
        document.getElementById('manualFoodCalorie').value = '';

        this.showToast(`已添加 ${name}`, 'success');
    }

    deleteRecord(id) {
        this.todayFoodRecords = this.todayFoodRecords.filter(r => r.id !== id);
        this.saveTodayRecords();
        this.updateDisplay();
        this.showToast('已删除', 'success');
    }

    updateDisplay() {
        // 更新总热量
        const totalCalories = this.todayFoodRecords.reduce((sum, r) => sum + r.calorie, 0);
        document.getElementById('totalCalories').textContent = totalCalories;

        // 更新进度条
        const target = parseInt(document.getElementById('calorieTarget').textContent) || 2000;
        const percentage = Math.min((totalCalories / target) * 100, 100);
        document.getElementById('calorieProgressFill').style.width = percentage + '%';

        // 更新日期
        document.getElementById('foodDate').textContent = 
            new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });

        // 更新记录列表
        this.updateRecordsList();
    }

    updateRecordsList() {
        const container = document.getElementById('foodRecordsList');
        
        if (this.todayFoodRecords.length === 0) {
            container.innerHTML = `
                <div class="empty-records">
                    <p>今天还没有饮食记录</p>
                    <p class="empty-hint">拍照或手动添加食物开始记录</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.todayFoodRecords
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(record => `
                <div class="food-record-item">
                    <div class="food-record-info">
                        <div class="food-record-name">${record.name}</div>
                        <div class="food-record-time">${record.time}</div>
                    </div>
                    <div class="food-record-calorie">${record.calorie} kcal</div>
                    <button class="food-record-delete" onclick="foodTab.deleteRecord(${record.id})">删除</button>
                </div>
            `).join('');
    }

    loadTodayRecords() {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('foodRecords_' + today);
        this.todayFoodRecords = saved ? JSON.parse(saved) : [];
    }

    saveTodayRecords() {
        const today = new Date().toDateString();
        localStorage.setItem('foodRecords_' + today, JSON.stringify(this.todayFoodRecords));
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = 'toast show ' + type;
            setTimeout(() => {
                toast.className = 'toast';
            }, 3000);
        }
    }
}

// 初始化饮食Tab
let foodTab;
document.addEventListener('DOMContentLoaded', () => {
    // 等待Tab切换到饮食页时再初始化
    const observer = new MutationObserver(() => {
        const foodTabPanel = document.getElementById('food-tab');
        if (foodTabPanel && foodTabPanel.classList.contains('active') && !foodTab) {
            foodTab = new FoodTab();
        }
    });

    observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
    });
});
