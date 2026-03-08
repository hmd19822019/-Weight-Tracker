/**
 * 食物热量识别模块
 * 使用百度AI菜品识别API
 */

class FoodCalorieRecognizer {
    constructor() {
        // 百度AI API配置
        this.API_KEY = 'rC8Q20risUV8o53zpNaf24rJ';
        this.SECRET_KEY = 'cLEmnlmZPL6xQwHG9nON9Mvsd1Vyav5H=';
        this.accessToken = null;
        this.tokenExpireTime = 0;
    }

    /**
     * 获取Access Token
     */
    async getAccessToken() {
        // 检查token是否过期
        if (this.accessToken && Date.now() < this.tokenExpireTime) {
            return this.accessToken;
        }

        try {
            const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.API_KEY}&client_secret=${this.SECRET_KEY}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.access_token) {
                this.accessToken = data.access_token;
                // token有效期30天，提前1天刷新
                this.tokenExpireTime = Date.now() + (29 * 24 * 60 * 60 * 1000);
                
                // 保存到localStorage
                localStorage.setItem('baidu_access_token', this.accessToken);
                localStorage.setItem('baidu_token_expire', this.tokenExpireTime);
                
                return this.accessToken;
            } else {
                throw new Error('获取Access Token失败');
            }
        } catch (error) {
            console.error('获取Access Token错误:', error);
            throw error;
        }
    }

    /**
     * 识别食物
     * @param {string} imageBase64 - 图片的Base64编码（不含data:image前缀）
     * @returns {Promise<Object>} 识别结果
     */
    async recognizeFood(imageBase64) {
        try {
            const token = await this.getAccessToken();
            const url = `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${token}`;

            // 移除Base64前缀（如果有）
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `image=${encodeURIComponent(base64Data)}&top_num=5`
            });

            const data = await response.json();

            if (data.error_code) {
                throw new Error(data.error_msg || '识别失败');
            }

            // 解析结果
            return this.parseRecognitionResult(data);
        } catch (error) {
            console.error('食物识别错误:', error);
            throw error;
        }
    }

    /**
     * 解析识别结果
     */
    parseRecognitionResult(data) {
        if (!data.result || data.result.length === 0) {
            return {
                success: false,
                message: '未识别到食物'
            };
        }

        const topResult = data.result[0];
        
        // 百度API返回的数据结构
        return {
            success: true,
            food: {
                name: topResult.name,
                probability: topResult.probability,
                // 百度API会返回热量信息（如果有）
                calorie: topResult.calorie || this.estimateCalorie(topResult.name),
                // 其他可能的营养信息
                ...topResult
            },
            alternatives: data.result.slice(1, 5).map(item => ({
                name: item.name,
                probability: item.probability
            }))
        };
    }

    /**
     * 估算热量（如果API没有返回）
     * 这是一个简化的估算，实际应该查询食物数据库
     */
    estimateCalorie(foodName) {
        // 常见食物热量数据库（每100克）
        const calorieDB = {
            '米饭': 116,
            '面条': 137,
            '馒头': 221,
            '鸡蛋': 144,
            '牛奶': 54,
            '苹果': 52,
            '香蕉': 89,
            '鸡肉': 167,
            '猪肉': 395,
            '牛肉': 125,
            '鱼': 100,
            '豆腐': 81,
            '青菜': 15,
            '西红柿': 18,
            '土豆': 76,
            '面包': 312,
            '饼干': 433,
            '蛋糕': 347,
            '巧克力': 586,
            '薯片': 548
        };

        // 模糊匹配
        for (let [key, value] of Object.entries(calorieDB)) {
            if (foodName.includes(key)) {
                return value;
            }
        }

        // 默认返回150（中等热量）
        return 150;
    }

    /**
     * 从文件选择器获取图片并转换为Base64
     */
    async getImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = (error) => {
                reject(error);
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * 压缩图片（减少上传大小）
     */
    async compressImage(base64, maxWidth = 800) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 按比例缩放
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // 转换为Base64（JPEG格式，质量0.8）
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = base64;
        });
    }
}

// 导出实例
window.foodRecognizer = new FoodCalorieRecognizer();
