import dns from 'node:dns'

try {
  dns.setDefaultResultOrder('ipv4first')
} catch {}

type SendEmailPayload = {
  toEmail: string
  toName?: string
  subject: string
  htmlContent: string
}

export async function sendBrevoEmail({
  toEmail,
  toName,
  subject,
  htmlContent,
}: SendEmailPayload): Promise<{ success: boolean; messageId?: string; error?: string; simulated?: boolean }> {
  const apiKey = process.env.BREVO_API_KEY?.trim()
  let senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || ''
  let senderName = process.env.BREVO_SENDER_NAME?.trim() || 'Anisha Masale'

  // Clean sender email if formatted as "Name <email@domain.com>"
  const angleMatch = senderEmail.match(/<([^>]+)>/)
  if (angleMatch) {
    const extractedName = senderEmail.replace(/<[^>]+>/, '').trim()
    if (extractedName && (!process.env.BREVO_SENDER_NAME || process.env.BREVO_SENDER_NAME === 'Anisha Masale')) {
      senderName = extractedName
    }
    senderEmail = angleMatch[1].trim()
  }

  // Dev fallback when keys are not configured yet
  if (!apiKey || !senderEmail) {
    console.warn('\n============================================================')
    console.warn('⚠️  [BREVO DEV FALLBACK] Brevo API Key or Sender Email is missing!')
    console.warn(`📩  To: ${toEmail} (${toName || 'Customer'})`)
    console.warn(`📌  Subject: ${subject}`)
    console.warn('💡  Add BREVO_API_KEY and BREVO_SENDER_EMAIL in .env.local to send live emails.')
    console.warn('============================================================\n')
    return { success: true, simulated: true }
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: toEmail,
            name: toName || toEmail.split('@')[0],
          },
        ],
        subject,
        htmlContent,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Brevo API Error]', data)
      return {
        success: false,
        error: data.message || `Brevo returned status ${response.status}`,
      }
    }

    return {
      success: true,
      messageId: data.messageId,
    }
  } catch (error: any) {
    console.error('[Brevo Network Error]', error)
    return {
      success: false,
      error: error.message || 'Failed to connect to Brevo email service',
    }
  }
}

/**
 * 1. Send Account Signup Verification OTP
 */
export async function sendSignupOtpEmail({
  email,
  name,
  otp,
}: {
  email: string
  name: string
  otp: string
}) {
  const subject = `Your Anisha Masale Verification Code: ${otp}`

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2A1612;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6F2; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(123, 17, 26, 0.08); border: 1px solid #E8DFD5;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #7B111A 0%, #4D0910 100%); padding: 32px 24px; text-align: center;">
              <div style="font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: 2px; text-transform: uppercase;">
                ANISHA MASALE
              </div>
              <div style="font-size: 11px; color: #D4AF37; letter-spacing: 3px; margin-top: 4px; text-transform: uppercase; font-weight: 600;">
                Pure Spices · Royal Heritage
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #2A1612;">
                Verify Your Account
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #6E5951;">
                Namaste <strong>${name || 'Customer'}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #6E5951;">
                Thank you for choosing Anisha Masale. Please enter the following 6-digit verification code to complete your registration and activate your account:
              </p>

              <!-- OTP Code Display Card -->
              <div style="background-color: #FAF6F2; border: 2px dashed #C89B65; border-radius: 14px; padding: 22px 16px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #8C7567; margin-bottom: 8px;">
                  Your Verification OTP
                </div>
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #7B111A; font-family: monospace; line-height: 1;">
                  ${otp}
                </div>
                <div style="font-size: 12px; color: #A68B7C; margin-top: 10px;">
                  ⏳ Valid for <strong>10 minutes</strong>
                </div>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.5; color: #8C7567;">
                If you did not initiate this registration, please ignore this email. Your email address will not be registered without this code.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF6F2; border-top: 1px solid #E8DFD5; padding: 24px 32px; text-align: center;">
              <div style="font-size: 12px; font-weight: 600; color: #6E5951;">
                Anisha Masale · Handcrafted Indian Spices
              </div>
              <div style="font-size: 11px; color: #A68B7C; margin-top: 6px;">
                © ${new Date().getFullYear()} Anisha Masale. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return sendBrevoEmail({
    toEmail: email,
    toName: name,
    subject,
    htmlContent,
  })
}

/**
 * 2. Send Password Reset Link Email
 */
export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: {
  email: string
  name?: string
  resetUrl: string
}) {
  const subject = 'Reset Your Anisha Masale Password'

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2A1612;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6F2; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(123, 17, 26, 0.08); border: 1px solid #E8DFD5;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #7B111A 0%, #4D0910 100%); padding: 32px 24px; text-align: center;">
              <div style="font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: 2px; text-transform: uppercase;">
                ANISHA MASALE
              </div>
              <div style="font-size: 11px; color: #D4AF37; letter-spacing: 3px; margin-top: 4px; text-transform: uppercase; font-weight: 600;">
                Pure Spices · Royal Heritage
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #2A1612;">
                Password Reset Request
              </h2>
              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #6E5951;">
                Namaste <strong>${name || 'Customer'}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #6E5951;">
                We received a request to reset your Anisha Masale account password. Click the button below to choose a new password:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #7B111A 0%, #8A131E 100%); color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 15px 36px; border-radius: 50px; box-shadow: 0 6px 18px rgba(123, 17, 26, 0.25); letter-spacing: 0.5px;">
                  Reset My Password
                </a>
              </div>

              <div style="background-color: #FAF6F2; border-radius: 10px; padding: 14px 18px; margin: 24px 0; font-size: 12px; color: #6E5951; line-height: 1.5;">
                ⏰ <strong>Note:</strong> This link is secure and valid for <strong>15 minutes</strong>. It can only be used once.
              </div>

              <p style="margin: 20px 0 8px 0; font-size: 12px; color: #8C7567;">
                If the button above does not work, copy and paste this link into your browser:
              </p>
              <div style="word-break: break-all; font-size: 11px; color: #7B111A; background-color: #F8F5F2; padding: 10px; border-radius: 6px; border: 1px solid #E8DFD5;">
                <a href="${resetUrl}" style="color: #7B111A; text-decoration: underline;">${resetUrl}</a>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 1.5; color: #8C7567;">
                If you did not request this password reset, you can safely ignore this email. Your current password remains secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF6F2; border-top: 1px solid #E8DFD5; padding: 24px 32px; text-align: center;">
              <div style="font-size: 12px; font-weight: 600; color: #6E5951;">
                Anisha Masale · Handcrafted Indian Spices
              </div>
              <div style="font-size: 11px; color: #A68B7C; margin-top: 6px;">
                © ${new Date().getFullYear()} Anisha Masale. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return sendBrevoEmail({
    toEmail: email,
    toName: name,
    subject,
    htmlContent,
  })
}
