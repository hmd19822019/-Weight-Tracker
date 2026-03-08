# Capability Evolver - 技能优先规则检测

## 检测目标

自动检测是否违反了"技能优先"原则：
- 任务匹配到技能但没有先读取 SKILL.md
- 直接使用底层工具而跳过技能

## 检测方法

### 1. 分析会话历史
扫描 `memory/YYYY-MM-DD.md` 中的工具调用序列：
- 如果发现 `browser` 工具调用，但之前没有 `read` Agent Browser SKILL.md
- 如果发现 `exec` 调用 gh 命令，但之前没有 `read` GitHub SKILL.md

### 2. 模式匹配
```javascript
const violations = [];
const toolCalls = extractToolCalls(sessionHistory);
const skillReads = extractSkillReads(sessionHistory);

for (const call of toolCalls) {
  const matchedSkill = findMatchingSkill(call.tool, call.context);
  if (matchedSkill && !skillReads.includes(matchedSkill)) {
    violations.push({
      tool: call.tool,
      skill: matchedSkill,
      timestamp: call.timestamp
    });
  }
}
```

### 3. 自动记录
发现违规时：
1. 追加到 `.learnings/LEARNINGS.md`
2. 更新 `memory/YYYY-MM-DD.md`
3. 可选：发送通知

## 运行频率

建议每天运行一次（通过 cron）：
```bash
# 每天晚上 23:00 检查
0 23 * * * cd ~/.openclaw/workspace && node skills/capability-evolver-1.27.2/index.js
```

## 改进建议

当检测到违规模式时，evolver 可以：
1. 在 AGENTS.md 中强化规则（已完成）
2. 创建 pre-action hook 来阻止违规
3. 更新系统提示，增加检查步骤
