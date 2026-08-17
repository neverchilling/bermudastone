import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendLateFeeNoticeEmail } from '@/lib/email';

export async function GET(request: Request) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: overdueCharges, error: fetchError } = await supabase
      .from('charges')
      .select(`
        id, 
        lease_id, 
        description, 
        amount, 
        due_date, 
        status,
        leases ( tenant_name, tenant_email )
      `)
      .eq('status', 'unpaid')
      .lt('due_date', today);

    if (fetchError) {
      console.error('Error fetching overdue charges:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!overdueCharges || overdueCharges.length === 0) {
      return NextResponse.json({ message: 'No overdue rent charges found.' });
    }

    const addedLateFees = [];

    for (const charge of overdueCharges) {
      const monthIdentifier = charge.due_date.substring(0, 7);
      const lateFeeDescription = `Late Fee - Rent (${monthIdentifier})`;

      const { data: existingFee } = await supabase
        .from('charges')
        .select('id')
        .eq('lease_id', charge.lease_id)
        .eq('description', lateFeeDescription)
        .single();

      if (!existingFee) {
        const { data: newFee, error: insertError } = await supabase
          .from('charges')
          .insert({
            lease_id: charge.lease_id,
            description: lateFeeDescription,
            amount: 50.0,
            due_date: today,
            status: 'unpaid',
          })
          .select()
          .single();

        if (!insertError && newFee) {
          addedLateFees.push(newFee);

          // Send notification email to tenant
          const leaseData = (charge as any).leases;
          if (leaseData?.tenant_email) {
            await sendLateFeeNoticeEmail(
              leaseData.tenant_email,
              leaseData.tenant_name,
              50.0,
              lateFeeDescription
            );
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      processedOverdueCount: overdueCharges.length,
      newLateFeesApplied: addedLateFees.length,
      fees: addedLateFees,
    });
  } catch (err: any) {
    console.error('Cron job error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
