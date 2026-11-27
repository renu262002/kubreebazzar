import nodemailer, { type Transporter } from 'nodemailer';

export interface EmailSendResult {
  sent: boolean;
  configured: boolean;
  error?: string;
}

function createTransporter(): { transporter: Transporter; from: string } | null {
  const raw = (process.env.EMAIL_SERVICE_CONFIG || '').trim();
  if (!raw) return null;

  try {
    if (raw.startsWith('smtp://') || raw.startsWith('smtps://')) {
      const from = (process.env.EMAIL_FROM || 'KubreeBazzar <no-reply@kubreebazzar.com>').trim();
      return {
        transporter: nodemailer.createTransport(raw),
        from,
      };
    }
    const cfg = JSON.parse(raw) as {
      host?: string;
      port?: number;
      secure?: boolean;
      user?: string;
      pass?: string;
      from?: string;
    };
    if (!cfg.host || !cfg.user || !cfg.pass) return null;
    return {
      transporter: nodemailer.createTransport({
        host: cfg.host,
        port: Number(cfg.port || 465),
        secure: cfg.secure !== false,
        auth: {
          user: cfg.user,
          pass: cfg.pass,
        },
      }),
      from: cfg.from || `KubreeBazzar <${cfg.user}>`,
    };
  } catch {
    return null;
  }
}

export function isEmailServiceConfigured(): boolean {
  return Boolean(createTransporter());
}

export async function sendTransactionalEmail(params: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<EmailSendResult> {
  const created = createTransporter();
  if (!created) {
    return { sent: false, configured: false };
  }
  try {
    await created.transporter.sendMail({
      from: created.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html || params.text,
    });
    return { sent: true, configured: true };
  } catch (err) {
    return {
      sent: false,
      configured: true,
      error: err instanceof Error ? err.message : 'SMTP delivery failed',
    };
  }
}
