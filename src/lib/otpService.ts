import { supabase } from './supabase';
import { sendEmail } from './emailService';

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create OTP email template
const createOTPEmail = (otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p><em>If you didn't request this code, please ignore this email.</em></p>
    </div>
  `;
};

// Send OTP email
export const sendOTP = async (email: string) => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('otp_verifications')
      .insert([
        {
          email,
          otp,
          expires_at: expiresAt.toISOString(),
          is_verified: false
        }
      ]);

    if (dbError) throw dbError;

    // Send OTP email
    const emailResult = await sendEmail({
      to: [{ email }],
      subject: 'Email Verification Code',
      htmlContent: createOTPEmail(otp)
    });

    if (!emailResult.success) throw emailResult.error;

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error };
  }
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string) => {
  try {
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .eq('is_verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    if (!data) {
      return { success: false, error: 'Invalid OTP' };
    }

    // Check if OTP is expired
    if (new Date(data.expires_at) < new Date()) {
      return { success: false, error: 'OTP has expired' };
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('otp_verifications')
      .update({ is_verified: true })
      .eq('id', data.id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error };
  }
};