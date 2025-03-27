import * as SibApiV3Sdk from 'sib-api-v3-typescript';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

interface EmailOptions {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  sender?: { name: string; email: string };
}

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
  sender = { name: 'Event System', email: 'events@yoursystem.com' }
}: EmailOptions) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = to;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Email template for event registration
export const createRegistrationEmail = (
  userName: string,
  eventName: string,
  qrCode: string,
  eventDate: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Event Registration Confirmation</h2>
      <p>Hello ${userName},</p>
      <p>Your registration for <strong>${eventName}</strong> has been confirmed!</p>
      <p>Event Date: ${eventDate}</p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="${qrCode}" alt="QR Code" style="max-width: 200px;"/>
      </div>
      <p>Please present this QR code at the venue entrance.</p>
      <p><em>Note: This QR code is unique and can only be used once.</em></p>
    </div>
  `;
};

// Email template for event approval notification
export const createApprovalEmail = (
  adminName: string,
  eventName: string,
  decision: 'approved' | 'rejected',
  reason?: string
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Event ${decision.charAt(0).toUpperCase() + decision.slice(1)} Notification</h2>
      <p>Hello ${adminName},</p>
      <p>Your event <strong>${eventName}</strong> has been ${decision}.</p>
      ${reason ? `<p>Reason: ${reason}</p>` : ''}
      ${decision === 'approved' 
        ? '<p>You can now proceed with the event preparations.</p>' 
        : '<p>Please review the feedback and make necessary adjustments before resubmitting.</p>'}
    </div>
  `;
}; 