# 图标生成说明

## 当前图标

已创建 `icon.svg` - 现代化的体重秤图标设计

### 设计元素：
- 🎨 蓝色渐变背景（专业健康感）
- ⚖️ 体重秤主体（白色，带显示屏）
- 📊 上升趋势箭头（绿色，象征进步）
- 📈 趋势曲线（白色，数据可视化）
- 💎 圆角设计（现代感）

## 生成不同尺寸的PNG图标

### 方式1：使用在线工具（推荐）

1. 访问：https://www.appicon.co/ 或 https://icon.kitchen/
2. 上传 `icon.svg`
3. 选择 Android 平台
4. 下载生成的图标包
5. 解压到 `res/` 目录

### 方式2：使用ImageMagick（本地）

如果安装了ImageMagick：

```bash
# 生成不同尺寸
magick icon.svg -resize 36x36 res/android/ldpi.png
magick icon.svg -resize 48x48 res/android/mdpi.png
magick icon.svg -resize 72x72 res/android/hdpi.png
magick icon.svg -resize 96x96 res/android/xhdpi.png
magick icon.svg -resize 144x144 res/android/xxhdpi.png
magick icon.svg -resize 192x192 res/android/xxxhdpi.png
magick icon.svg -resize 512x512 res/icon.png
```

### 方式3：使用cordova-res（自动）

```bash
npm install -g cordova-res
cordova-res android --icon-source icon.svg
```

## 所需尺寸

- ldpi: 36x36
- mdpi: 48x48
- hdpi: 72x72
- xhdpi: 96x96
- xxhdpi: 144x144
- xxxhdpi: 192x192
- 默认: 512x512

## 临时方案

如果暂时无法生成PNG，可以：
1. 将 `icon.svg` 重命名为 `icon.png`（某些工具支持）
2. 或使用默认图标（Cordova会自动处理）

## 自动生成（GitHub Actions）

已在workflow中添加图标生成步骤，推送后会自动生成所有尺寸。
