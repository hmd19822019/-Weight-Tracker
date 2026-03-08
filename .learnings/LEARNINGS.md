# LEARNINGS.md - 持续改进记录

## [2026-03-08] 技能优先原则违规

**Category**: `best_practice`
**Severity**: High
**Source**: 用户纠正

### 背景
用户要求打开浏览器搜索百度。我直接使用了底层 `browser` 工具，而没有先读取 `Agent Browser` 技能的 SKILL.md。

### 错误行为
1. 跳过了技能匹配步骤
2. 直接使用底层工具
3. 遇到问题后才被用户提醒应该使用技能

### 正确行为
1. 识别任务类型（浏览器自动化）
2. 匹配到 Agent Browser 技能
3. 读取 SKILL.md
4. 按照技能文档执行

### 根因分析
- 系统提示中有技能优先规则，但执行时"忘记"了
- 对底层工具更熟悉，形成了路径依赖
- 缺乏自动检查机制

### 改进措施
1. ✅ 强化 AGENTS.md 中的规则（已完成）
2. ✅ 记录到 .learnings/LEARNINGS.md（本文件）
3. 🔲 开发 capability-evolver 自动检测机制

### 影响
- 浪费了时间在底层工具上
- 遇到了中文输入问题，而技能文档可能有相关提示
- 用户体验不佳

**See Also**: ERRORS.md - Agent Browser 中文输入问题

---

## [2026-03-08] Agent Browser 中文输入解决方案

**Category**: `best_practice`
**Severity**: Medium
**Pattern-Key**: `agent-browser-chinese-input`

### 问题
agent-browser 的 `fill` 和 `type` 命令不支持中文字符输入，会超时。

### 解决方案
使用 `eval` 命令执行 JavaScript：
```bash
agent-browser eval "document.querySelector('#kw').value = '中文内容'"
agent-browser eval "document.querySelector('#su').click()"
```

### 已推广到
- ✅ TOOLS.md - Agent Browser 注意事项
- ✅ memory/2026-03-08.md - 每日记忆
