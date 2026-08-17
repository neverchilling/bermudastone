import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { leaseId } = await request.json();

    if (!leaseId) {
      return NextResponse.json({ error: 'Lease ID is required.' }, { status: 400 });
    }

    // 1. Delete associated charges for this lease first
    const { error: chargesError } = await supabase
      .from('charges')
      .delete()
      .eq('lease_id', leaseId);

    if (chargesError) {
      console.error('Error deleting lease charges:', chargesError);
      return NextResponse.json({ error: chargesError.message }, { status: 500 });
    }

    // 2. Delete the lease itself
    const { error: leaseError } = await supabase
      .from('leases')
      .delete()
      .eq('id', leaseId);

    if (leaseError) {
      console.error('Error deleting lease:', leaseError);
      return NextResponse.json({ error: leaseError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Lease and associated records deleted.' });
  } catch (err: any) {
    console.error('API error deleting lease:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
