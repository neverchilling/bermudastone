import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { propertyName, unitNumber, tenantName, tenantEmail, monthlyRent } = await request.json();

    if (!propertyName || !unitNumber || !tenantName || !tenantEmail || !monthlyRent) {
      return NextResponse.json(
        { error: 'All fields are required to create a new unit/lease.' },
        { status: 400 }
      );
    }

    const { data: newLease, error: leaseError } = await supabase
      .from('leases')
      .insert({
        property_name: propertyName,
        unit_number: unitNumber,
        tenant_name: tenantName,
        tenant_email: tenantEmail,
        monthly_rent: parseFloat(monthlyRent),
      })
      .select()
      .single();

    if (leaseError) {
      console.error('Error creating lease:', leaseError);
      return NextResponse.json({ error: leaseError.message }, { status: 500 });
    }

    // Auto-create initial first month rent charge
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('charges').insert({
      lease_id: newLease.id,
      description: 'First Month Rent',
      amount: parseFloat(monthlyRent),
      due_date: today,
      status: 'unpaid',
    });

    return NextResponse.json({ success: true, lease: newLease });
  } catch (err: any) {
    console.error('API error creating lease:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
