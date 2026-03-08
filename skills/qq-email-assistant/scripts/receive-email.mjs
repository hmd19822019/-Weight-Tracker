import Imap from 'imap';
import { simpleParser } from 'mailparser';

// 从命令行参数获取数量
const limit = parseInt(process.argv[2]) || 10;

// 从环境变量读取配置
const config = {
  user: process.env.QQ_EMAIL || '30431338@qq.com',
  password: process.env.QQ_EMAIL_AUTH || 'vauouqfsbczlbjah',
  host: 'imap.qq.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

async function fetchEmails() {
  return new Promise((resolve, reject) => {
    const imap = new Imap(config);
    const emails = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        const total = box.messages.total;
        const start = Math.max(1, total - limit + 1);
        const end = total;

        if (total === 0) {
          console.log('📭 收件箱为空');
          imap.end();
          resolve([]);
          return;
        }

        const fetch = imap.seq.fetch(`${start}:${end}`, {
          bodies: '',
          struct: true
        });

        fetch.on('message', (msg, seqno) => {
          msg.on('body', (stream) => {
            simpleParser(stream, (err, parsed) => {
              if (err) return;

              emails.push({
                序号: seqno,
                发件人: parsed.from?.text || '未知',
                主题: parsed.subject || '(无主题)',
                日期: parsed.date?.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) || '未知',
                正文预览: (parsed.text || parsed.html || '(无内容)').substring(0, 200)
              });
            });
          });
        });

        fetch.once('error', reject);
        fetch.once('end', () => imap.end());
      });
    });

    imap.once('error', reject);
    imap.once('end', () => resolve(emails));

    imap.connect();
  });
}

(async () => {
  try {
    console.log(`📬 正在获取最新 ${limit} 封邮件...\n`);
    const emails = await fetchEmails();
    
    if (emails.length === 0) {
      console.log('没有邮件');
      return;
    }

    console.log(`收件箱最新 ${emails.length} 封邮件：\n`);
    emails.forEach(email => {
      console.log('─'.repeat(60));
      console.log(`序号: ${email.序号}`);
      console.log(`发件人: ${email.发件人}`);
      console.log(`主题: ${email.主题}`);
      console.log(`日期: ${email.日期}`);
      console.log(`正文预览: ${email.正文预览}...`);
    });
    console.log('─'.repeat(60));
    
  } catch (error) {
    console.error('❌ 收取邮件失败:', error.message);
    process.exit(1);
  }
})();
