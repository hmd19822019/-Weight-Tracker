# 图标占位文件

由于GitHub Actions环境限制，暂时使用Cordova默认图标。

如需自定义图标：

1. 使用在线工具生成图标：
   - 访问 https://icon.kitchen/
   - 上传 icon.svg
   - 下载生成的资源包
   - 解压到项目根目录

2. 或本地生成后提交：
   ```bash
   npm install -g cordova-res
   cordova-res android --icon-source icon.svg
   git add resources/
   git commit -m "Add generated icons"
   git push
   ```

当前使用Cordova默认图标，功能不受影响。
