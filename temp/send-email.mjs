import nodemailer from 'nodemailer';

async function sendEmail() {
  // 创建SMTP传输器
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    secure: false, // 使用STARTTLS
    auth: {
      user: '30431338@qq.com',
      pass: 'vauouqfsbczlbjah'
    }
  });

  // 邮件选项
  const mailOptions = {
    from: '30431338@qq.com',
    to: 'business@infoq.geekbang.org',
    subject: '测试',
    text: '测试',
    html: '<p>测试</p>'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('邮件发送成功！');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('邮件发送失败:', error.message);
    console.error('详细错误:', error);
    process.exit(1);
  }
}

sendEmail();
