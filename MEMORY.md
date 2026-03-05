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

### 2026-03-05：OpenClaw官方文档学习
**来源**：https://docs.openclaw.ai

**工作区文件结构**（标准配置）：
- `AGENTS.md` - 操作指南和行为规则（每次会话加载）
- `SOUL.md` - 个性、语气和边界（每次会话加载）
- `USER.md` - 用户信息和称呼方式（每次会话加载）
- `IDENTITY.md` - Agent的名字、风格和emoji
- `TOOLS.md` - 本地工具和约定的笔记
- `HEARTBEAT.md` - 心跳检查清单（保持简短）
- `BOOT.md` - 启动时执行的检查清单
- `BOOTSTRAP.md` - 首次运行仪式（完成后删除）
- `memory/YYYY-MM-DD.md` - 每日记忆日志
- `MEMORY.md` - 精选的长期记忆（仅在主会话加载）
- `skills/` - 工作区特定的skills
- `canvas/` - Canvas UI文件

**记忆系统**：
- 两层记忆：每日日志（情景记忆）+ 长期记忆（语义记忆）
- 工具：`memory_search`（语义搜索）+ `memory_get`（精确读取）
- 自动记忆刷新：在上下文压缩前自动提醒保存记忆
- 向量搜索：支持本地或远程embeddings

**Hooks系统**：
- 事件驱动的自动化系统
- 内置hooks：
  - `session-memory` - 保存会话上下文
  - `bootstrap-extra-files` - 注入额外的bootstrap文件
  - `command-logger` - 记录所有命令
  - `boot-md` - 启动时运行BOOT.md
- 可以自定义hooks（TypeScript）
- 三个发现目录：workspace/hooks > ~/.openclaw/hooks > bundled

**Git备份建议**：
- 工作区应该是私有Git仓库
- 定期提交和推送
- 不要提交secrets和credentials
- 使用.gitignore保护敏感信息

**关键原则**：
- 工作区是Agent的家，是唯一的工作目录
- 所有记忆都是纯Markdown文件
- 文件是真相的来源，模型只"记住"写入磁盘的内容
- 如果想让某事持久化，必须写入文件

### 2026-03-05：Personal AI Infrastructure的启发
**来源**：https://x.com/vista8/status/2021240338908876854

**核心理念**：
- 把AI从"工具"升级为"基础设施"
- 持久性 vs 无状态
- 个性化 vs 通用
- 可编程 vs 黑盒

**TELOS系统**：10个维度定义数字自我
1. 核心身份
2. 价值观
3. 背景
4. 技能
5. 沟通风格
6. 目标
7. 知识领域
8. 工作方式
9. 关系与背景
10. 兴趣

**三层记忆架构**：
- 短期记忆：当前对话
- 情景记忆：具体记录
- 语义记忆：提炼的知识

**Hooks系统**：让AI主动感知环境
- user-prompt-submit-hook
- assistant-response-hook
- tool-call-hook

**已应用**：
- 扩展了USER.md为TELOS风格的10个维度
- OpenClaw的skills系统本质上就是PAI的Skills概念
- memory/目录和MEMORY.md对应情景记忆和语义记忆

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
