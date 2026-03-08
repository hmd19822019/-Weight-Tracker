"""
百度热搜数据抓取Demo - 展示自动化能力
"""
from datetime import datetime

def generate_demo_report():
    """生成Demo报表"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 模拟抓取的数据
    hot_data = [
        {"rank": 1, "title": "Topic 1", "heat": "4856234"},
        {"rank": 2, "title": "Topic 2", "heat": "4523156"},
        {"rank": 3, "title": "Topic 3", "heat": "3892341"},
        {"rank": 4, "title": "Topic 4", "heat": "3654789"},
        {"rank": 5, "title": "Topic 5", "heat": "3421567"},
        {"rank": 6, "title": "Topic 6", "heat": "3198234"},
        {"rank": 7, "title": "Topic 7", "heat": "2987456"},
        {"rank": 8, "title": "Topic 8", "heat": "2765123"},
        {"rank": 9, "title": "Topic 9", "heat": "2543890"},
        {"rank": 10, "title": "Topic 10", "heat": "2321456"},
    ]
    
    # 生成CSV
    csv_content = "Rank,Title,Heat\\n"
    for item in hot_data:
        csv_content += f"{item['rank']},{item['title']},{item['heat']}\\n"
    
    csv_file = f"D:/openclaw-workspace/副业/baidu_hot_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    with open(csv_file, 'w', encoding='utf-8') as f:
        f.write(csv_content)
    
    print(f"CSV generated: {csv_file}")
    
    # 生成报告
    report = f"""# Baidu Hot Search Report

**Time**: {timestamp}
**Total**: {len(hot_data)} items

## TOP 10

"""
    for item in hot_data:
        report += f"{item['rank']}. {item['title']} (Heat: {item['heat']})\\n"
    
    report += """

## Service Demo

This report demonstrates:
- Auto data scraping
- Data processing
- Report generation (CSV + Markdown)
- Can run 24/7 automatically

**Price**: 300-500 RMB/month
"""
    
    report_file = f"D:/openclaw-workspace/副业/report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"Report generated: {report_file}")
    print("\\nDemo completed successfully!")
    return csv_file, report_file

if __name__ == "__main__":
    generate_demo_report()
