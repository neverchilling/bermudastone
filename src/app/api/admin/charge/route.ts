import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { leaseId, description, amount, dueDate } = await request.json();

    if (!leaseId || !description || !amount || !dueDate) {
      return NextResponse.json(
        { error: 'All fields (leaseId, description, amount, dueDate) are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('charges')
      .insert({
        lease_id: leaseId,
        description,
        amount: parseFloat(amount),
        due_date: dueDate,
        status: 'unpaid',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding charge:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, charge: data });
  } catch (err: any) {
    console.error('Admin API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
