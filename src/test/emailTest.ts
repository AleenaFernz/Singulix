import { sendEmail, createRegistrationEmail, createApprovalEmail } from '../lib/emailService';
import { triggerEmail } from '../lib/supabase';

// Test direct email sending
export const testDirectEmail = async (recipientEmail: string, recipientName: string) => {
  try {
    // Test registration email
    const registrationResult = await sendEmail({
      to: [{ email: recipientEmail, name: recipientName }],
      subject: 'Test Event Registration',
      htmlContent: createRegistrationEmail(
        recipientName,
        'Test Event 2024',
        'https://via.placeholder.com/200x200?text=Test+QR+Code',
        '2024-04-01'
      )
    });

    console.log('Registration email result:', registrationResult);

    // Test approval email
    const approvalResult = await sendEmail({
      to: [{ email: recipientEmail, name: recipientName }],
      subject: 'Test Event Approval',
      htmlContent: createApprovalEmail(
        recipientName,
        'Test Event 2024',
        'approved',
        'Great event proposal!'
      )
    });

    console.log('Approval email result:', approvalResult);

    return { success: true, results: { registrationResult, approvalResult } };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error };
  }
};

// Test email through Supabase
export const testSupabaseEmail = async (recipientEmail: string, recipientName: string) => {
  try {
    // Queue registration email
    const registrationResult = await triggerEmail('registration', {
      userEmail: recipientEmail,
      userName: recipientName,
      eventName: 'Test Event 2024',
      qrCode: 'https://via.placeholder.com/200x200?text=Test+QR+Code',
      eventDate: '2024-04-01'
    });

    console.log('Registration email queued:', registrationResult);

    // Queue approval email
    const approvalResult = await triggerEmail('approval', {
      userEmail: recipientEmail,
      userName: recipientName,
      eventName: 'Test Event 2024',
      decision: 'approved',
      reason: 'Great event proposal!'
    });

    console.log('Approval email queued:', approvalResult);

    return { success: true, results: { registrationResult, approvalResult } };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error };
  }
}; 