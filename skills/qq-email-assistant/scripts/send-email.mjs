import nodemailer from 'nodemailer';

// 从命令行参数获取配置
const [, , to, subject, text] = process.argv;

if (!to || !subject || !text) {
  console.error('用法: node send-email.mjs <收件人> <主题> <内容>');
  console.error('示例: node send-email.mjs "test@example.com" "测试" "这是测试邮件"');
  process.exit(1);
}

// 从环境变量读取配置（更安全）
const config = {
  user: process.env.QQ_EMAIL || '30431338@qq.com',
  pass: process.env.QQ_EMAIL_AUTH || 'vauouqfsbczlbjah'
};

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    secure: false,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });

  const mailOptions = {
    from: config.user,
    to,
    subject,
    text,
    html: `<p>${text}</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ 邮件发送成功！');
    console.log('收件人:', to);
    console.log('主题:', subject);
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ 邮件发送失败:', error.message);
    process.exit(1);
  }
}

sendEmail();
