import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch unpaid charges past due date
    const { data: overdueCharges, error } = await supabase
      .from('charges')
      .select('id, amount, due_date, status, lease_id, leases(tenant_name, tenant_email, property_name, unit_number)')
      .eq('status', 'unpaid')
      .lt('due_date', today);

    if (error) {
      throw error;
    }

    const processed = [];

    for (const charge of overdueCharges || []) {
      // Send reminder email if Resend is configured
      if (resend && (charge as any)?.leases?.tenant_email) {
        const leaseInfo = (charge as any).leases;
        try {
          await resend.emails.send({
            from: 'Bermuda Stone Properties <billing@bermudastoneproperties.com>',
            to: [leaseInfo.tenant_email],
            subject: `Payment Reminder - Past Due Rent (${leaseInfo.unit_number || 'Unit'})`,
            html: `<p>Hello ${leaseInfo.tenant_name || 'Resident'},</p><p>This is a reminder that your balance of <strong>$${charge.amount}</strong> was due on ${charge.due_date}. Please log in to your resident portal to settle your balance.</p>`,
          });
        } catch (emailErr) {
          console.error('Failed to send late fee email:', emailErr);
        }
      }
      processed.push(charge.id);
    }

    return NextResponse.json({
      success: true,
      overdueCount: overdueCharges?.length || 0,
      processedIds: processed,
    });
  } catch (err: any) {
    console.error('Cron job error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process late fees' },
      { status: 500 }
    );
  }
}
