import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // API router / endpoints
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
      }

      console.log('Received contact submission:', { name, email });

      // We securely send an email to sarfrajshaik08@gmail.com
      const recipient = 'sarfrajshaik08@gmail.com';

      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass) {
        return res.status(400).json({ 
          error: 'Email delivery is not yet configured. Please configure your "SMTP_USER" and "SMTP_PASS" environment variables in the AI Studio Settings (under Secrets panel) to enable real delivery to sarfrajshaik08@gmail.com.' 
        });
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const fromName = name.replace(/[^a-zA-Z0-9 ]/g, ''); // sanitize name for header safety
      const mailOptions = {
        from: `"${fromName}" <${smtpUser}>`, // Use smtpUser as the sender to prevent SPF alignment issues, with replyTo set to input email
        replyTo: `"${fromName}" <${email}>`,
        to: recipient,
        subject: `Portfolio Contact Request from ${name}`,
        text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
            <h2 style="color: #0284c7; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">New Portfolio Inquiry</h2>
            <p style="margin-bottom: 20px; font-size: 14px; color: #374151;">You have received a new contact form submission from your academic portfolio website.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; color: #374151;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 100px; color: #4b5563;">Name:</td>
                <td style="padding: 8px 0; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #4b5563;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
              </tr>
            </table>

            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #0284c7; font-size: 14px; color: #1f2937; margin-top: 10px; line-height: 1.5; white-space: pre-wrap;">
              <strong>Message:</strong><br/><br/>
              ${message.replace(/\n/g, '<br/>')}
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">Sent securely via local portfolio server integration.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ 
        success: true, 
        message: 'Message delivered successfully!', 
        transport: 'Email sent successfully via SMTP server.'
      });
    } catch (error: any) {
      console.error('Error dispatching email:', error);
      return res.status(500).json({ error: error.message || 'Internal server error while sending email.' });
    }
  });

  // Serve static assets or use Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fullstack dev server listening on http://localhost:${PORT}`);
  });
}

startServer();
