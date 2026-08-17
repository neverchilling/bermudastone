import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { chargeId } = await request.json();

    if (!chargeId) {
      return NextResponse.json({ error: 'Charge ID is required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('charges')
      .delete()
      .eq('id', chargeId);

    if (error) {
      console.error('Error deleting charge:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Charge deleted successfully.' });
  } catch (err: any) {
    console.error('API error deleting charge:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
