import cv2
import time

# 打开摄像头
cam = cv2.VideoCapture(0)

if not cam.isOpened():
    print("无法打开摄像头")
    exit()

# 设置分辨率
cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# 尝试调整曝光和亮度
cam.set(cv2.CAP_PROP_EXPOSURE, -5)  # 自动曝光
cam.set(cv2.CAP_PROP_BRIGHTNESS, 128)

# 预热并丢弃前几帧
print("摄像头预热中...")
for i in range(10):
    ret, frame = cam.read()
    time.sleep(0.1)

# 拍照
ret, frame = cam.read()

if ret:
    cv2.imwrite('D:/openclaw-workspace/webcam_capture3.jpg', frame)
    print(f"照片已保存，分辨率: {frame.shape}")
    print(f"像素值范围: min={frame.min()}, max={frame.max()}, mean={frame.mean():.2f}")
else:
    print("无法读取帧")

cam.release()
