import nodemailer from 'nodemailer';
import type { ContactSubmission } from '@shared/schema';

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendConsultationNotification(submission: ContactSubmission): Promise<boolean> {
  console.log('🔄 Attempting to send email notification for:', submission.name);
  
  // Check if environment variables are set
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Gmail credentials not found in environment variables');
    return false;
  }
  
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          New Consultation Request
        </h2>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Client Information</h3>
          <p><strong>Name:</strong> ${submission.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
          <p><strong>Package Interest:</strong> ${submission.package || 'No specific package mentioned'}</p>
          <p><strong>Submitted:</strong> ${new Date(submission.createdAt).toLocaleString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #374151;">Message</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${submission.message}</p>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; font-size: 14px; color: #1e40af;">
            📊 <strong>Next Steps:</strong> Review this submission in your admin dashboard and follow up with the client within 24 hours.
          </p>
        </div>

        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>This notification was sent automatically from your Growth Accelerators consultation form.</p>
        </div>
      </div>
    `;

    const emailText = `
New Consultation Request

Client Information:
Name: ${submission.name}
Email: ${submission.email}
Package Interest: ${submission.package || 'No specific package mentioned'}
Submitted: ${new Date(submission.createdAt).toLocaleString('en-GB')}

Message:
${submission.message}

Next Steps: Review this submission in your admin dashboard and follow up with the client within 24 hours.
    `;

    const mailOptions = {
      from: 'georgie@thegrowthaccelerators.co.uk',
      to: 'georgie@thegrowthaccelerators.co.uk',
      subject: `New Consultation Request from ${submission.name}`,
      text: emailText,
      html: emailHtml,
    };

    console.log('📧 Sending email with options:', {
      from: 'georgie@thegrowthaccelerators.co.uk',
      to: 'georgie@thegrowthaccelerators.co.uk',
      subject: mailOptions.subject
    });
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email notification sent for submission from ${submission.name}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
    console.error('Error type:', (error as any).constructor.name);
    console.error('Error message:', (error as any).message);
    if ((error as any).code) console.error('Error code:', (error as any).code);
    return false;
  }
}

// Test email function (for development)
export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified');
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP connection failed:', error);
    return false;
  }
}