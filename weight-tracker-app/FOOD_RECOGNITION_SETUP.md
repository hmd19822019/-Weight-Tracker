# 食物热量识别功能 - 配置指南

## 📋 配置步骤

### 1. 获取百度AI密钥

已完成注册后，你应该有：
- API Key: `xxxxxxxxxxxxxxxxxxxx`
- Secret Key: `yyyyyyyyyyyyyyyyyyyy`

### 2. 配置密钥

打开文件：`www/js/foodRecognizer.js`

找到第9-10行：
```javascript
this.API_KEY = 'YOUR_API_KEY_HERE';
this.SECRET_KEY = 'YOUR_SECRET_KEY_HERE';
```

替换为你的实际密钥：
```javascript
this.API_KEY = '你的API_KEY';
this.SECRET_KEY = '你的SECRET_KEY';
```

### 3. 在index.html中引入

在 `</body>` 标签前添加：
```html
<script src="js/foodRecognizer.js"></script>
```

## 🎯 使用方法

### 基础用法

```javascript
// 1. 从文件选择器获取图片
const fileInput = document.getElementById('foodPhotoInput');
const file = fileInput.files[0];

// 2. 转换为Base64
const base64 = await foodRecognizer.getImageFromFile(file);

// 3. 压缩图片（可选，减少上传时间）
const compressed = await foodRecognizer.compressImage(base64);

// 4. 识别食物
const result = await foodRecognizer.recognizeFood(compressed);

// 5. 处理结果
if (result.success) {
    console.log('食物名称:', result.food.name);
    console.log('热量:', result.food.calorie, 'kcal/100g');
    console.log('置信度:', result.food.probability);
} else {
    console.log('识别失败:', result.message);
}
```

### 完整示例

```html
<!-- HTML -->
<input type="file" id="foodPhoto" accept="image/*" capture="camera">
<button id="recognizeBtn">识别食物</button>
<div id="result"></div>

<script>
document.getElementById('recognizeBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('foodPhoto');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('请先选择照片');
        return;
    }
    
    try {
        // 显示加载状态
        document.getElementById('result').innerHTML = '识别中...';
        
        // 获取并压缩图片
        const base64 = await foodRecognizer.getImageFromFile(file);
        const compressed = await foodRecognizer.compressImage(base64);
        
        // 识别
        const result = await foodRecognizer.recognizeFood(compressed);
        
        if (result.success) {
            document.getElementById('result').innerHTML = `
                <h3>${result.food.name}</h3>
                <p>热量: ${result.food.calorie} kcal/100g</p>
                <p>置信度: ${(result.food.probability * 100).toFixed(1)}%</p>
            `;
        } else {
            document.getElementById('result').innerHTML = '未识别到食物';
        }
    } catch (error) {
        document.getElementById('result').innerHTML = '识别失败: ' + error.message;
    }
});
</script>
```

## 📊 返回数据结构

```javascript
{
    success: true,
    food: {
        name: "煎蛋",           // 食物名称
        probability: 0.95,      // 置信度 (0-1)
        calorie: 150,           // 热量 (kcal/100g)
        // 可能还有其他营养信息
    },
    alternatives: [            // 其他可能的识别结果
        { name: "炒蛋", probability: 0.85 },
        { name: "蛋饼", probability: 0.75 }
    ]
}
```

## ⚠️ 注意事项

1. **网络要求**
   - 需要网络连接
   - 建议在WiFi环境下使用

2. **图片要求**
   - 格式：JPG、PNG
   - 大小：建议 < 4MB
   - 内容：食物清晰可见

3. **免费额度**
   - 每天500次免费调用
   - 超出后：0.002元/次

4. **识别准确率**
   - 常见食物：85%+
   - 复杂菜品：70%+
   - 建议提供确认/修改功能

## 🔧 故障排查

### 问题1：获取Token失败
- 检查API Key和Secret Key是否正确
- 检查网络连接
- 查看浏览器控制台错误信息

### 问题2：识别失败
- 检查图片是否清晰
- 确认图片中有食物
- 尝试重新拍照

### 问题3：热量为0或不准确
- 百度API可能没有该食物的热量数据
- 可以手动输入或使用本地数据库补充

## 📝 下一步

1. 配置好密钥后，我会帮你：
   - 添加饮食Tab UI
   - 集成拍照功能
   - 添加饮食记录列表
   - 实现热量统计

2. 把你的API Key和Secret Key发给我，我帮你配置好

---

**当前状态**：
- ✅ 核心识别模块已完成
- ⏳ 等待API密钥配置
- ⏳ UI界面待添加
