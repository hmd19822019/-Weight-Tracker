# 签名密钥设置指南

## 问题说明

每次构建都生成新的签名密钥会导致：
- ❌ 无法覆盖安装旧版本
- ❌ 提示"与现有应用签名不一致"
- ❌ 必须卸载旧版本才能安装新版本

## 解决方案

使用固定的签名密钥，存储在GitHub Secrets中。

## 设置步骤

### 方式1：首次构建后获取密钥（推荐）

1. **触发一次构建**
   - 推送代码到main分支
   - 等待GitHub Actions构建完成

2. **查看构建日志**
   - 进入 Actions → 最新的workflow运行
   - 展开 "Setup signing key" 步骤
   - 找到输出的base64编码的密钥（一长串字符）

3. **添加到GitHub Secrets**
   - 进入仓库 Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - 添加以下secrets：
     - Name: `KEYSTORE_BASE64`
     - Value: 从日志中复制的base64字符串
     - Name: `KEYSTORE_PASSWORD`
     - Value: `WeightTracker2024`
     - Name: `KEY_PASSWORD`
     - Value: `WeightTracker2024`

4. **重新构建**
   - 再次推送代码或手动触发workflow
   - 之后的所有构建都会使用相同的签名

### 方式2：本地生成密钥

如果你本地有Java环境：

```bash
# 生成密钥
keytool -genkey -v -keystore weight-tracker.keystore \
  -alias weight-tracker \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "WeightTracker2024" \
  -keypass "WeightTracker2024" \
  -dname "CN=Weight Tracker, OU=Development, O=Weight Tracker App, L=Shanghai, ST=Shanghai, C=CN"

# 转换为base64（Linux/Mac）
base64 -w 0 weight-tracker.keystore

# 转换为base64（Windows PowerShell）
[Convert]::ToBase64String([IO.File]::ReadAllBytes("weight-tracker.keystore"))
```

然后将输出的base64字符串添加到GitHub Secrets。

## 验证

设置完成后：
1. 构建日志会显示 "Using keystore from secrets"
2. 新版本可以直接覆盖安装旧版本
3. 不会再提示签名不一致

## 注意事项

⚠️ **重要**：
- 密钥一旦设置，不要更改
- 如果丢失密钥，所有已安装的应用都无法更新
- 建议备份密钥文件到安全的地方

## 当前状态

- ✅ 构建脚本已更新
- ⏳ 等待首次构建生成密钥
- ⏳ 需要将密钥添加到GitHub Secrets

## 快速链接

- GitHub Secrets设置: https://github.com/hmd19822019/-Weight-Tracker/settings/secrets/actions
- Actions日志: https://github.com/hmd19822019/-Weight-Tracker/actions
