#!/bin/bash

# 这个脚本会生成一个固定的密钥并输出base64

echo "正在生成密钥..."

# 检查是否有Java
if ! command -v keytool &> /dev/null; then
    echo "错误: 未找到keytool命令"
    echo "请确保已安装Java JDK"
    exit 1
fi

# 生成密钥
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass android \
  -keypass android \
  -dname "CN=Weight Tracker,O=Weight Tracker,C=CN"

echo ""
echo "=========================================="
echo "密钥已生成！"
echo "=========================================="
echo ""
echo "请复制下面的base64字符串："
echo "=========================================="

# 输出base64
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    base64 -i my-release-key.keystore
else
    # Linux
    base64 -w 0 my-release-key.keystore
fi

echo ""
echo "=========================================="
echo ""
echo "添加到GitHub Secrets:"
echo "Name: KEYSTORE_BASE64"
echo "Value: (上面的base64字符串)"
echo "URL: https://github.com/hmd19822019/-Weight-Tracker/settings/secrets/actions"
echo "=========================================="
