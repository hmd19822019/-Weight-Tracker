# Feature Requests Log

记录用户请求的功能和能力。

---

## [FEAT-20260307-001] speech_to_text

**Logged**: 2026-03-07T15:31:00+08:00  
**Priority**: medium  
**Status**: pending  
**Area**: infra

### Requested Capability
语音消息转文字功能

### User Context
用户发送了语音消息（6秒OGG格式），需要转换为文字以便处理

### Complexity Estimate
medium

### Suggested Implementation
方案1：安装speech-to-text skill（需要解决ClawHub速率限制）
方案2：集成OpenAI Whisper API（需要API key）
方案3：使用summarize CLI（支持音频，但需要brew安装）

### Metadata
- Frequency: first_time
- Related Features: message_processing
- Tags: audio, transcription, whisper

---

## [FEAT-20260307-002] exa_web_search

**Logged**: 2026-03-07T23:28:00+08:00  
**Priority**: medium  
**Status**: in_progress  
**Area**: infra

### Requested Capability
配置exa-web-search-free（免费AI搜索）

### User Context
需要免费的web搜索能力，不依赖Brave API key

### Complexity Estimate
simple

### Suggested Implementation
1. 安装mcporter：`npm install -g mcporter`
2. 配置exa：`mcporter config add exa https://mcp.exa.ai/mcp`
3. 测试搜索：`mcporter call 'exa.web_search_exa(query: "test", numResults: 5)'`

### Metadata
- Frequency: first_time
- Related Features: web_search
- Tags: search, exa, mcp, free
- Status: npm install正在进行中

---
