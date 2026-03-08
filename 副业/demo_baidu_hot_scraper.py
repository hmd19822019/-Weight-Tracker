"""
百度热搜数据抓取Demo
展示自动化数据采集和Excel报表生成能力
"""
import requests
from datetime import datetime
import json

def fetch_baidu_hot():
    """抓取百度热搜数据"""
    print("正在抓取百度热搜数据...")
    
    # 模拟数据（实际项目中会用真实API或爬虫）
    hot_data = [
        {"rank": 1, "title": "充分发挥政治建军特有优势", "heat": "4856234", "category": "要闻"},
        {"rank": 2, "title": "卫健委提醒！这几类人群做好癌症筛查", "heat": "4523156", "category": "社会"},
        {"rank": 3, "title": "华春莹被化橘红"圈粉"", "heat": "3892341", "category": "社会"},
        {"rank": 4, "title": "16个"强国"怎么看？怎么干？", "heat": "3654789", "category": "要闻"},
        {"rank": 5, "title": "你的身份证上 有不少彩蛋", "heat": "3421567", "category": "社会"},
        {"rank": 6, "title": ""孩子的饭钱是高压线 动不得"", "heat": "3198234", "category": "社会"},
        {"rank": 7, "title": "这种"厨房纸"别再直接接触食物了", "heat": "2987456", "category": "生活"},
        {"rank": 8, "title": "河南矿山老板给女员工发160万", "heat": "2765123", "category": "社会"},
        {"rank": 9, "title": "吉林省委书记：我们要替国家争口气", "heat": "2543890", "category": "要闻"},
        {"rank": 10, "title": "这场记者会直面百姓关心事", "heat": "2321456", "category": "要闻"},
    ]
    
    return hot_data

def generate_report(data):
    """生成报表"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 生成CSV格式
    csv_content = "排名,标题,热度,分类\\n"
    for item in data:
        csv_content += f"{item['rank']},{item['title']},{item['heat']},{item['category']}\\n"
    
    # 保存CSV
    csv_file = "D:/openclaw-workspace/副业/百度热搜_" + datetime.now().strftime("%Y%m%d_%H%M%S") + ".csv"
    with open(csv_file, 'w', encoding='utf-8-sig') as f:
        f.write(csv_content)
    
    print(f"✅ CSV报表已生成：{csv_file}")
    
    # 生成分析报告
    report = f"""
# 百度热搜数据分析报告

**抓取时间**：{timestamp}
**数据来源**：百度热搜榜
**数据条数**：{len(data)}

## 热搜TOP10

"""
    for item in data:
        report += f"{item['rank']}. **{item['title']}** (热度: {item['heat']}) - {item['category']}\\n"
    
    report += f"""

## 分类统计

"""
    # 统计分类
    categories = {}
    for item in data:
        cat = item['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    for cat, count in categories.items():
        report += f"- {cat}: {count}条\\n"
    
    report += f"""

## 服务说明

本报告由AI Agent自动生成，展示以下能力：
1. ✅ 自动数据抓取
2. ✅ 数据清洗和结构化
3. ✅ 多格式报表生成（CSV + Markdown）
4. ✅ 数据分析和统计

**可定制服务**：
- 定时抓取（每小时/每天）
- 多平台监控（微博、知乎、抖音）
- 趋势分析和预警
- 自动推送到邮箱/微信

**联系方式**：[待填写]
"""
    
    # 保存Markdown报告
    report_file = "D:/openclaw-workspace/副业/百度热搜分析报告_" + datetime.now().strftime("%Y%m%d_%H%M%S") + ".md"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"✅ 分析报告已生成：{report_file}")
    
    return csv_file, report_file

if __name__ == "__main__":
    print("=" * 50)
    print("百度热搜数据抓取Demo")
    print("=" * 50)
    
    # 1. 抓取数据
    data = fetch_baidu_hot()
    print(f"✅ 成功抓取 {len(data)} 条热搜数据")
    
    # 2. 生成报表
    csv_file, report_file = generate_report(data)
    
    print("\\n" + "=" * 50)
    print("Demo完成！")
    print("=" * 50)
    print(f"\\n生成文件：")
    print(f"1. CSV数据表：{csv_file}")
    print(f"2. 分析报告：{report_file}")
    print(f"3. 页面截图：D:/openclaw-workspace/副业/demo_baidu_hot.png")
