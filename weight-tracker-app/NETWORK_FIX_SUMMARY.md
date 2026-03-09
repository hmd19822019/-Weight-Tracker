# 网络请求问题修复总结

## 🐛 问题
拍照识别功能失败，提示 "fail to fetch"

## 🔍 根因
1. **缺少网络白名单配置** - Cordova应用需要明确允许外部网络访问
2. **缺少CSP配置** - Content Security Policy限制了网络请求
3. **缺少必要插件** - 没有安装 `cordova-plugin-whitelist`

## ✅ 已修复

### 1. 添加CSP配置 (`www/index.html`)
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: https://ssl.gstatic.com 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content: blob:; connect-src * https://aip.baidubce.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;">
```

### 2. 更新 `config.xml`
```xml
<!-- 网络访问权限 -->
<access origin="*" />
<allow-navigation href="*" />

<!-- 允许访问百度AI API -->
<access origin="https://aip.baidubce.com" />
```

### 3. 安装必要插件
```bash
cordova plugin add cordova-plugin-whitelist@1.3.4
cordova plugin add cordova-plugin-network-information
```

### 4. 添加详细日志
在 `foodRecognizer.js` 中添加了详细的console.log，方便调试：
- Token获取过程
- API请求状态
- 响应数据
- 错误详情

## 📝 提交信息
- **Commit**: 446cbf3
- **文件变更**: 72个文件，8532行新增
- **主要修改**:
  - `www/index.html` - 添加CSP
  - `config.xml` - 添加网络权限
  - `www/js/foodRecognizer.js` - 添加详细日志
  - 安装2个Cordova插件

## 🚀 下一步

### 手动推送代码
由于网络不稳定，请手动推送：
```bash
cd D:\openclaw-workspace\weight-tracker-app
git push
```

### 测试步骤
1. 等待GitHub Actions编译完成
2. 下载新的APK
3. 安装到手机
4. 打开应用，切换到"饮食"Tab
5. 点击"拍照识别"
6. 如果还有问题，使用Chrome远程调试查看console日志：
   - 手机连接电脑
   - Chrome访问 `chrome://inspect`
   - 选择应用查看日志

### 如何查看日志
如果还是失败，需要查看详细日志：

**方法1：Chrome远程调试**
1. 手机开启USB调试
2. 连接电脑
3. Chrome浏览器访问 `chrome://inspect`
4. 找到你的应用，点击"inspect"
5. 查看Console标签的日志

**方法2：Logcat**
```bash
adb logcat | grep -i "chromium"
```

## 🔧 可能还需要的修复

如果上述修复后还是失败，可能需要：

### 1. Android网络安全配置
创建 `platforms/android/app/src/main/res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">aip.baidubce.com</domain>
    </domain-config>
</network-security-config>
```

### 2. 修改AndroidManifest.xml
添加：
```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    android:usesCleartextTraffic="true">
```

## 📊 调试信息

新版本会输出以下日志：
- "开始识别食物..."
- "获取新的Access Token..." 或 "使用缓存的Token"
- "发送Token请求..."
- "Token响应状态: XXX"
- "Token响应数据: {...}"
- "Token获取成功"
- "图片数据长度: XXX"
- "发送请求到百度API..."
- "收到响应，状态: XXX"
- "API响应: {...}"

根据这些日志可以判断问题出在哪一步。

---

**当前状态**: 代码已提交到本地，等待推送到GitHub
**Commit**: 446cbf3
**时间**: 2026-03-08 23:40
