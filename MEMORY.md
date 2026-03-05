# MEMORY.md - 长期记忆

## 关于我
- 名字：Kiro
- 角色：AI开发助手
- 工作空间：D:\openclaw-workspace

## 关于用户
- 开发者，使用中文交流
- 时区：Asia/Shanghai (GMT+8)
- 工作风格：务实、直接、重视稳定性

## 重要项目

### 体重管理应用 (Weight Tracker)
- **路径**：D:\openclaw-workspace\weight-tracker-app
- **技术栈**：Cordova + Android
- **稳定版本**：916c13d (构建#22)
- **GitHub**：https://github.com/hmd19822019/-Weight-Tracker

**功能状态**：
- ✅ 数据记录（体重、体脂率、照片）
- ✅ 数据导入（CSV + Excel）
- ⚠️ 数据导出（受Android WebView限制）
- ✅ 图表分析、目标管理、成就系统

**已知限制**：
- Android Cordova WebView对文件下载支持有限
- cordova-plugin-file会导致白屏问题
- 导出功能无法完美实现，已接受现状

## 重要经验教训

### 2026-03-05：数据导出功能的失败尝试
**教训**：
1. **及时止损** - 同一方案失败2次就该放弃
2. **稳定优先** - 能启动比功能完整更重要
3. **听取反馈** - 用户说"别乱改"时立即停止
4. **接受限制** - 不是所有问题都能通过技术解决

**具体错误**：
- 反复尝试cordova-plugin-file导致10+次白屏
- 没有在第一次成功后及时停止
- 忽视了Android WebView的根本限制

**正确做法**：
- 在稳定版本上打tag
- 新功能在分支上开发
- 2次失败后立即回退
- 接受"功能受限"的现实

### Cordova Android开发注意事项
1. **避免使用Cordova插件** - 容易导致白屏或启动问题
2. **文件操作受限** - `<a download>`在WebView中不可靠
3. **优先使用纯Web API** - 兼容性和稳定性更好
4. **测试要在真机上** - 模拟器行为可能不同

## 开发原则

### 稳定性优先
- 能启动 > 功能完整
- 简单可靠 > 功能强大
- 用户能用 > 技术完美

### 快速失败
- 同一方案最多尝试2次
- 失败后立即回退到稳定版本
- 不要在不稳定的基础上继续开发

### 版本管理
- 稳定版本立即打tag
- 新功能在分支上开发
- 测试通过再合并主分支

## 工具和技能

### 熟悉的技术
- JavaScript/HTML/CSS
- Cordova/Android开发
- Git版本管理
- GitHub Actions CI/CD

### 需要注意的
- Android WebView的限制
- Cordova插件的稳定性问题
- 及时止损的重要性

---

*最后更新：2026-03-05*
