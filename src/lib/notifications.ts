import { supabase } from './supabase';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export const emailConfig: EmailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: import.meta.env.SMTP_SECURE === 'true',
  auth: {
    user: 'link-magico@br.sendbot.co',
    pass: 'eknrmrmjytdrbnsj'
  }
};

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    // Log email attempt
    console.log('Sending email to:', to);

    // Use Edge Function to send email via SMTP
    const { error } = await supabase.functions.invoke('send-smtp-email', {
      body: { to, subject, html, config: emailConfig }
    }); 

    if (error) throw error;
    
    // Log success
    console.log('Email sent successfully');
    
    return true;
  } catch (error) {
    // Log detailed error
    console.error('Failed to send email:', {
      to,
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}