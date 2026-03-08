/**
 * 动态加载饮食Tab内容
 */
(function() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            // 加载food-tab.html内容
            const response = await fetch('food-tab.html');
            const html = await response.text();
            
            // 找到insights-tab后面插入
            const insightsTab = document.getElementById('insights-tab');
            if (insightsTab && insightsTab.parentNode) {
                // 创建临时容器
                const temp = document.createElement('div');
                temp.innerHTML = html;
                
                // 插入到insights-tab后面
                const foodTab = temp.firstElementChild;
                insightsTab.parentNode.insertBefore(foodTab, insightsTab.nextSibling);
                
                console.log('饮食Tab加载成功');
            }
        } catch (error) {
            console.error('加载饮食Tab失败:', error);
        }
    });
})();
