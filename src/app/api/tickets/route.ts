import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { leaseId, tenantName, tenantEmail, propertyName, unitNumber, category, priority, description } = await request.json();

    if (!leaseId || !category || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase.from('tickets').insert([
      {
        lease_id: leaseId,
        tenant_name: tenantName || 'Tenant',
        tenant_email: tenantEmail || '',
        property_name: propertyName || '',
        unit_number: unitNumber || '',
        category,
        priority: priority || 'medium',
        description,
        status: 'open',
      },
    ]).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, ticket: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
