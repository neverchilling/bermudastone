import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendPaymentReceiptEmail({
  tenantEmail,
  tenantName,
  amount,
  chargeDescription,
  propertyName,
  unitNumber,
}: {
  tenantEmail: string;
  tenantName: string;
  amount: number;
  chargeDescription: string;
  propertyName?: string;
  unitNumber?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV] Missing RESEND_API_KEY. Skipping receipt to ${tenantEmail}`);
    return { success: false, error: 'Missing RESEND_API_KEY' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Bermuda Stone Properties <onboarding@resend.dev>',
      to: [tenantEmail],
      subject: `Receipt: Rent Payment Received - ${propertyName || 'Property'} ${unitNumber || ''}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000; color: #fff; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #262626; border-radius: 20px; padding: 32px;">
            <div style="display: flex; align-items: center; margin-bottom: 24px;">
              <div style="background-color: #10b981; color: #000; font-weight: bold; width: 36px; height: 36px; border-radius: 10px; text-align: center; line-height: 36px; font-size: 18px;">✓</div>
              <h2 style="color: #fff; margin: 0 0 0 12px; font-size: 20px;">Payment Confirmed</h2>
            </div>
            
            <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6;">Hello <strong>${tenantName}</strong>,</p>
            <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6;">Thank you. Your recent payment for <strong>${propertyName || 'Property'} (${unitNumber || 'Unit'})</strong> has been successfully processed and posted to your ledger.</p>
            
            <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="color: #737373; padding-bottom: 8px;">Description</td>
                  <td style="color: #fff; text-align: right; font-weight: 600; padding-bottom: 8px;">${chargeDescription}</td>
                </tr>
                <tr>
                  <td style="color: #737373; padding-bottom: 8px;">Date</td>
                  <td style="color: #fff; text-align: right; font-weight: 600; padding-bottom: 8px;">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
                <tr style="border-top: 1px solid #262626;">
                  <td style="color: #10b981; padding-top: 12px; font-weight: bold;">Total Amount Paid</td>
                  <td style="color: #10b981; text-align: right; font-size: 18px; font-weight: 800; padding-top: 12px;">$${Number(amount).toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <p style="color: #737373; font-size: 12px; margin: 0; text-align: center;">
              You can view your real-time ledger statement anytime at <a href="http://localhost:3000" style="color: #10b981; text-decoration: none;">Resident Portal</a>.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Failed to send receipt email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendRentReminderEmail({
  tenantEmail,
  tenantName,
  amountDue,
  dueDate,
  propertyName,
  unitNumber,
}: {
  tenantEmail: string;
  tenantName: string;
  amountDue: number;
  dueDate: string;
  propertyName?: string;
  unitNumber?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV] Missing RESEND_API_KEY. Skipping reminder to ${tenantEmail}`);
    return { success: false, error: 'Missing RESEND_API_KEY' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Bermuda Stone Properties <onboarding@resend.dev>',
      to: [tenantEmail],
      subject: `Reminder: Balance Due for ${propertyName || 'Property'} ${unitNumber || ''}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000; color: #fff; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #262626; border-radius: 20px; padding: 32px;">
            <span style="color: #10b981; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Rent Notice</span>
            <h2 style="color: #fff; margin: 8px 0 16px 0; font-size: 20px;">Upcoming Balance Notice</h2>
            
            <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6;">Hello <strong>${tenantName}</strong>,</p>
            <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6;">This is a friendly reminder that you have an outstanding balance due on <strong>${dueDate}</strong> for <strong>${propertyName || 'Property'} (${unitNumber || 'Unit'})</strong>.</p>
            
            <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
              <span style="color: #737373; font-size: 12px; text-transform: uppercase; font-weight: bold;">Amount Due</span>
              <div style="color: #fff; font-size: 32px; font-weight: 800; margin-top: 4px;">$${Number(amountDue).toFixed(2)}</div>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="http://localhost:3000" style="display: inline-block; background-color: #10b981; color: #000; padding: 12px 28px; border-radius: 12px; font-weight: bold; font-size: 13px; text-decoration: none;">
                Pay Balance Online →
              </a>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Failed to send reminder email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendLateFeeNoticeEmail({
  tenantEmail,
  tenantName,
  feeAmount,
  totalBalance,
  propertyName,
  unitNumber,
}: {
  tenantEmail: string;
  tenantName: string;
  feeAmount: number;
  totalBalance: number;
  propertyName?: string;
  unitNumber?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV] Missing RESEND_API_KEY. Skipping late fee email to ${tenantEmail}`);
    return { success: false, error: 'Missing RESEND_API_KEY' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Bermuda Stone Properties <onboarding@resend.dev>',
      to: [tenantEmail],
      subject: `Notice: Late Fee Applied - ${propertyName || 'Property'} ${unitNumber || ''}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000; color: #fff; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #262626; border-radius: 20px; padding: 32px;">
            <span style="color: #ef4444; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Late Notice</span>
            <h2 style="color: #fff; margin: 8px 0 16px 0; font-size: 20px;">Late Fee Assessment</h2>
            
            <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6;">Hello <strong>${tenantName}</strong>,</p>
            <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6;">A late fee of <strong>$${Number(feeAmount).toFixed(2)}</strong> has been posted to your account for <strong>${propertyName || 'Property'} (${unitNumber || 'Unit'})</strong> following the expiration of the standard grace period.</p>
            
            <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
              <span style="color: #737373; font-size: 12px; text-transform: uppercase; font-weight: bold;">Current Total Balance</span>
              <div style="color: #fff; font-size: 32px; font-weight: 800; margin-top: 4px;">$${Number(totalBalance).toFixed(2)}</div>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="http://localhost:3000" style="display: inline-block; background-color: #10b981; color: #000; padding: 12px 28px; border-radius: 12px; font-weight: bold; font-size: 13px; text-decoration: none;">
                Clear Balance Online →
              </a>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Failed to send late fee email:', error);
    return { success: false, error: error.message };
  }
}
