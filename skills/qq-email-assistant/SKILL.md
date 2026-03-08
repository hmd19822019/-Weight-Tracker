---
name: qq-email-assistant
description: QQ邮箱收发助手。支持发送和接收QQ邮箱邮件。当用户提到：(1) 发送邮件、发邮件、(2) 查看邮件、收邮件、收信、(3) 检查收件箱、(4) 回复邮件时触发。
---

# QQ Email Assistant

QQ邮箱收发助手，支持通过SMTP发送邮件和通过IMAP接收邮件。

## 配置要求

使用前需要：
1. QQ邮箱地址
2. QQ邮箱授权码（不是QQ密码）
   - 获取方式：mail.qq.com → 设置 → 账户 → 开启IMAP/SMTP服务 → 生成授权码

## 发送邮件

使用 `send-email.mjs` 脚本发送邮件：

```bash
node {baseDir}/scripts/send-email.mjs <收件人> <主题> <内容>
```

**参数**：
- 收件人：邮箱地址
- 主题：邮件主题
- 内容：邮件正文

**示例**：
```bash
node scripts/send-email.mjs "test@example.com" "测试主题" "测试内容"
```

## 接收邮件

使用 `receive-email.mjs` 脚本接收邮件：

```bash
node {baseDir}/scripts/receive-email.mjs [数量]
```

**参数**：
- 数量：可选，默认10封，获取最新N封邮件

**示例**：
```bash
node scripts/receive-email.mjs 20  # 获取最新20封
```

**输出格式**：
- 序号
- 发件人
- 主题
- 日期
- 正文预览（前200字符）

## 配置说明

脚本中的邮箱配置：
- SMTP服务器：smtp.qq.com:587
- IMAP服务器：imap.qq.com:993
- 认证：使用授权码

## 注意事项

1. 授权码不是QQ密码，需要单独生成
2. 发送邮件会立即加入发送队列
3. 接收邮件只读取，不会标记为已读
4. 脚本需要nodemailer和imap依赖包

## 依赖安装

```bash
npm install nodemailer imap mailparser
```
