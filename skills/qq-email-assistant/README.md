# QQ Email Assistant Skill

QQ邮箱收发助手，支持通过SMTP发送邮件和通过IMAP接收邮件。

## 安装

将此skill文件夹放到OpenClaw的skills目录：
```
D:\openclaw-workspace\skills\qq-email-assistant\
```

安装依赖：
```bash
cd D:\openclaw-workspace\skills\qq-email-assistant
npm install
```

## 配置

### 方式1：环境变量（推荐）

设置环境变量：
```bash
export QQ_EMAIL="your@qq.com"
export QQ_EMAIL_AUTH="your-auth-code"
```

### 方式2：直接修改脚本

编辑 `scripts/send-email.mjs` 和 `scripts/receive-email.mjs`，修改默认配置。

## 使用

### 发送邮件

```bash
node scripts/send-email.mjs "收件人@example.com" "邮件主题" "邮件内容"
```

### 接收邮件

```bash
node scripts/receive-email.mjs 10  # 获取最新10封
```

## 在OpenClaw中使用

安装后，直接对OpenClaw说：
- "帮我发一封邮件给xxx"
- "查看我的邮箱"
- "收取最新的邮件"

OpenClaw会自动调用这个skill。

## 获取QQ邮箱授权码

1. 访问 https://mail.qq.com
2. 设置 → 账户
3. 找到"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
4. 开启"IMAP/SMTP服务"
5. 点击"生成授权码"（需要短信验证）
6. 复制16位授权码

## 文件结构

```
qq-email-assistant/
├── SKILL.md                    # Skill说明文档
├── package.json                # Node.js依赖配置
├── README.md                   # 使用说明
└── scripts/
    ├── send-email.mjs          # 发送邮件脚本
    └── receive-email.mjs       # 接收邮件脚本
```

## 版本

- v1.0.0 - 2026-03-08
  - 初始版本
  - 支持发送和接收QQ邮箱邮件
