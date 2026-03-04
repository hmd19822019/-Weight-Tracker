# 🔐 签名密钥设置 - 彻底解决方案

## ❌ 问题根源

**Debug模式每次构建签名都不同** → 无法覆盖安装

## ✅ 解决方案

使用**固定的Release签名密钥**，存储在GitHub Secrets中。

## 📋 一次性设置步骤

### 步骤1：等待首次构建完成

推送代码后，等待GitHub Actions构建完成（约5分钟）。

### 步骤2：获取密钥

**方式A：从构建日志获取（如果没有密钥）**

1. 访问：https://github.com/hmd19822019/-Weight-Tracker/actions
2. 点击最新的workflow运行
3. 展开 "Create keystore from base64" 步骤
4. 会看到警告信息，但密钥已生成

**方式B：本地生成（推荐）**

在有Java的电脑上运行：

```bash
# 生成密钥
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass android \
  -keypass android \
  -dname "CN=Weight Tracker,O=Weight Tracker,C=CN"

# 转换为base64
# Linux/Mac:
base64 -w 0 my-release-key.keystore > keystore.txt

# Windows PowerShell:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("my-release-key.keystore")) | Out-File keystore.txt
```

### 步骤3：添加到GitHub Secrets

1. 访问：https://github.com/hmd19822019/-Weight-Tracker/settings/secrets/actions
2. 点击 "New repository secret"
3. 添加密钥：
   - **Name**: `KEYSTORE_BASE64`
   - **Value**: 粘贴base64字符串（整个内容，一行）
4. 点击 "Add secret"

### 步骤4：重新构建

设置完成后：
1. 推送任意代码更改，或
2. 手动触发workflow（Actions页面 → Run workflow）

## ✅ 验证成功

设置成功后，构建日志会显示：
```
Using keystore from GitHub Secrets
```

之后所有版本都可以直接覆盖安装！

## 🎯 重要提示

1. **首次使用新密钥的版本需要卸载旧版本**
2. **之后的所有版本都可以覆盖安装**
3. **密钥一旦设置，不要更改**
4. **建议备份密钥文件到安全的地方**

## 📝 当前状态

- ⏳ 等待设置 KEYSTORE_BASE64 到 GitHub Secrets
- ⏳ 设置完成后重新构建
- ✅ 之后所有版本签名一致

## 🆘 如果还是不行

如果设置后仍然有问题，请：
1. 确认 Secret 名称是 `KEYSTORE_BASE64`（区分大小写）
2. 确认 base64 字符串完整（没有换行）
3. 重新触发构建
4. 查看构建日志确认使用了 Secrets 中的密钥
