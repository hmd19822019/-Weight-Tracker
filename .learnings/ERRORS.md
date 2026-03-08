# ERRORS.md - 错误记录

## [2026-03-08] Agent Browser fill/type 中文输入超时

**Command**: `agent-browser fill @e13 "健康减肥计划"`
**Error**: `Action on "健康减肥计划" timed out. The element may be blocked, still loading, or not interactable.`
**Exit Code**: 1

### 环境
- OS: Windows 10
- agent-browser: npm global install
- 页面: https://www.baidu.com

### 原因
agent-browser 的 fill/type 命令不支持中文字符输入

### 解决方案
使用 eval 命令绕过：
```bash
agent-browser eval "document.querySelector('#kw').value = '健康减肥计划'"
```

### 状态
已解决，已记录到 TOOLS.md 和 LEARNINGS.md
