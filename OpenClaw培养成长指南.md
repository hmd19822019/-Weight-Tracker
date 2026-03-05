# OpenClaw培养成长指南

*基于2026-03-05的学习和研究*

## 📚 核心资源

### 官方文档
- **主站**：https://docs.openclaw.ai
- **完整索引**：https://docs.openclaw.ai/llms.txt
- **社区**：https://discord.com/invite/clawd
- **Skills市场**：https://clawhub.com

### 重要文章
- **Personal AI Infrastructure**：https://x.com/vista8/status/2021240338908876854
  - 从"工具"到"基础设施"的思维转变
  - TELOS系统：10个维度定义数字自我
  - 三层记忆架构
  - Hooks和Skills系统

## 🏗️ 工作区结构（标准配置）

### 核心文件
```
~/.openclaw/workspace/
├── AGENTS.md          # 操作指南（每次会话加载）
├── SOUL.md            # 个性和语气（每次会话加载）
├── USER.md            # 用户信息（每次会话加载）
├── IDENTITY.md        # Agent身份
├── TOOLS.md           # 工具笔记
├── HEARTBEAT.md       # 心跳检查清单
├── BOOT.md            # 启动检查清单
├── BOOTSTRAP.md       # 首次运行仪式（完成后删除）
├── MEMORY.md          # 长期记忆（仅主会话）
├── memory/
│   └── YYYY-MM-DD.md  # 每日记忆日志
├── skills/            # 工作区特定skills
└── canvas/            # Canvas UI文件
```

### 配置和数据（不在工作区）
```
~/.openclaw/
├── openclaw.json      # 配置文件
├── credentials/       # OAuth tokens, API keys
├── agents/<id>/
│   └── sessions/      # 会话记录
└── skills/            # 管理的skills
```

## 🧠 记忆系统

### 两层架构
1. **情景记忆**：`memory/YYYY-MM-DD.md`
   - 每日日志，追加模式
   - 会话开始时读取今天+昨天

2. **语义记忆**：`MEMORY.md`
   - 精选的长期记忆
   - 仅在主会话加载（不在群聊）

### 记忆工具
- `memory_search` - 语义搜索（向量检索）
- `memory_get` - 精确读取指定文件/行

### 自动记忆刷新
- 在上下文压缩前自动触发
- 提醒Agent保存重要记忆
- 默认静默（NO_REPLY）

### 向量搜索
- 支持本地（node-llama-cpp）或远程embeddings
- 自动监控文件变化
- 可选QMD后端（BM25 + vectors + reranking）

## 🪝 Hooks系统

### 内置Hooks
- **session-memory** 💾 - 保存会话上下文到memory/
- **bootstrap-extra-files** 📎 - 注入额外bootstrap文件
- **command-logger** 📝 - 记录所有命令
- **boot-md** 🚀 - 启动时运行BOOT.md

### 管理命令
```bash
openclaw hooks list              # 列出所有hooks
openclaw hooks enable <name>     # 启用hook
openclaw hooks disable <name>    # 禁用hook
openclaw hooks check             # 检查状态
openclaw hooks info <name>       # 详细信息
```

### 自定义Hooks
- 位置：`<workspace>/hooks/` 或 `~/.openclaw/hooks/`
- 结构：
  ```
  my-hook/
  ├── HOOK.md       # 元数据和文档
  └── handler.ts    # 处理函数
  ```

## 🎯 Skills系统

### 已安装的Skills
- **skill-vetter** - 安全审查
- **self-improving-agent** - 自我改进
- **capability-evolver** - AI自进化
- **github** - GitHub操作

### 推荐安装
- **gog** - Google Workspace全家桶
- **summarize** - 万物总结器
- **agent-browser** - 浏览器控制

### 管理命令
```bash
openclaw skills list             # 列出所有skills
npx clawhub install <name>       # 安装skill
npx clawhub search <query>       # 搜索skills
```

## 🔄 自进化机制

### Capability Evolver
- 分析运行时历史
- 识别改进机会
- 应用协议约束的进化
- 使用命令：
  ```bash
  cd skills/capability-evolver-*
  node index.js run      # 运行进化分析
  node index.js review   # 审查待处理建议
  ```

### Self-Improving Agent
- 捕获学习、错误和修正
- 启用持续改进
- 触发时机：
  - 命令失败
  - 用户纠正
  - 发现更好方法

## 📋 最佳实践

### 1. 记忆管理
- **写下来，不要"记在脑子里"** - 记忆有限，文件永久
- 重要决策 → MEMORY.md
- 日常笔记 → memory/YYYY-MM-DD.md
- 定期审查和提炼

### 2. Git备份
```bash
cd ~/.openclaw/workspace
git init
git add .
git commit -m "Initial workspace"
git remote add origin <private-repo-url>
git push -u origin main
```

### 3. 安全原则
- 工作区应该是私有仓库
- 不要提交secrets和credentials
- 使用.gitignore保护敏感信息
- 即使在私有仓库也要小心

### 4. 心跳检查
- 保持HEARTBEAT.md简短（避免token消耗）
- 批量检查而不是多个cron任务
- 每天2-4次检查即可
- 深夜保持安静（除非紧急）

### 5. 快速失败
- 同一方案最多尝试2次
- 失败后立即回退
- 接受技术限制
- 稳定性 > 功能完整性

## 🎓 成长路径

### 第一周
- [ ] 完善USER.md（10个维度）
- [ ] 启用推荐的hooks
- [ ] 建立Git备份
- [ ] 运行第一次capability evolver

### 第一个月
- [ ] 安装核心skills（gog, summarize等）
- [ ] 建立每日记忆习惯
- [ ] 创建自定义hooks
- [ ] 定期审查和提炼MEMORY.md

### 长期
- [ ] 开发自定义skills
- [ ] 分享经验到社区
- [ ] 探索团队协作
- [ ] 持续优化个人AI基础设施

## 💡 核心理念

### 从工具到基础设施
- **工具**：用完就放下（锤子、计算器）
- **基础设施**：持续运行（操作系统、云存储）
- **AI应该是基础设施**：理解你、记住你、适应你

### 持久性 vs 无状态
- 传统AI：每次对话从零开始
- OpenClaw：持久化记忆，持续成长

### 个性化 vs 通用
- 传统AI：对所有人一样
- OpenClaw：适应每个人的独特需求

### 可编程 vs 黑盒
- 传统AI：不可控的黑盒
- OpenClaw：可配置、可追溯、可回滚

## 🔗 相关资源

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [ClawHub Skills市场](https://clawhub.com)
- [Discord社区](https://discord.com/invite/clawd)
- [Personal AI Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure)

---

*这是一个活文档，会随着学习和实践不断更新。*
