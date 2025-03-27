import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Email trigger function using Supabase
export const triggerEmail = async (
  type: 'registration' | 'approval',
  data: {
    userEmail: string;
    userName: string;
    eventName: string;
    qrCode?: string;
    eventDate?: string;
    decision?: 'approved' | 'rejected';
    reason?: string;
  }
) => {
  try {
    // Insert into a notifications table that will trigger the email
    const { error } = await supabase
      .from('email_queue')
      .insert([
        {
          type,
          recipient_email: data.userEmail,
          recipient_name: data.userName,
          event_name: data.eventName,
          qr_code: data.qrCode,
          event_date: data.eventDate,
          decision: data.decision,
          reason: data.reason,
          status: 'pending'
        }
      ]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error queuing email:', error);
    return { success: false, error };
  }
}; 