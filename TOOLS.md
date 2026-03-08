# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Agent Browser 注意事项

### 中文输入问题
agent-browser 的 `fill` 和 `type` 命令不支持中文字符输入，会导致超时。

**解决方案**：使用 `eval` 命令执行 JavaScript

```bash
# 错误方式（会超时）
agent-browser fill @e1 "中文内容"

# 正确方式
agent-browser eval "document.querySelector('#input-id').value = '中文内容'"
agent-browser eval "document.querySelector('#button-id').click()"
```

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
