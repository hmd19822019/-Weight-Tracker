$code = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Windows.Forms;

public class WebcamCapture
{
    [DllImport("avicap32.dll")]
    protected static extern IntPtr capCreateCaptureWindowA(string lpszWindowName, int dwStyle, int x, int y, int nWidth, int nHeight, IntPtr hWndParent, int nID);
    
    [DllImport("user32.dll")]
    protected static extern bool SendMessage(IntPtr hWnd, int wMsg, IntPtr wParam, IntPtr lParam);
    
    [DllImport("user32.dll")]
    protected static extern bool DestroyWindow(IntPtr hWnd);
    
    const int WM_CAP_START = 0x400;
    const int WM_CAP_DRIVER_CONNECT = WM_CAP_START + 10;
    const int WM_CAP_DRIVER_DISCONNECT = WM_CAP_START + 11;
    const int WM_CAP_GRAB_FRAME = WM_CAP_START + 60;
    const int WM_CAP_COPY = WM_CAP_START + 30;
    
    public static void CaptureImage(string outputPath)
    {
        IntPtr hWnd = capCreateCaptureWindowA("WebcamCapture", 0, 0, 0, 640, 480, IntPtr.Zero, 0);
        
        if (hWnd == IntPtr.Zero)
        {
            throw new Exception("Failed to create capture window");
        }
        
        try
        {
            SendMessage(hWnd, WM_CAP_DRIVER_CONNECT, IntPtr.Zero, IntPtr.Zero);
            System.Threading.Thread.Sleep(1000);
            SendMessage(hWnd, WM_CAP_GRAB_FRAME, IntPtr.Zero, IntPtr.Zero);
            SendMessage(hWnd, WM_CAP_COPY, IntPtr.Zero, IntPtr.Zero);
            
            if (Clipboard.ContainsImage())
            {
                Image img = Clipboard.GetImage();
                img.Save(outputPath, ImageFormat.Jpeg);
                Console.WriteLine("Photo captured successfully");
            }
            else
            {
                throw new Exception("No image in clipboard");
            }
            
            SendMessage(hWnd, WM_CAP_DRIVER_DISCONNECT, IntPtr.Zero, IntPtr.Zero);
        }
        finally
        {
            DestroyWindow(hWnd);
        }
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing, System.Windows.Forms

try {
    [WebcamCapture]::CaptureImage("D:\openclaw-workspace\webcam_capture.jpg")
} catch {
    Write-Host "Error: $_"
    exit 1
}
