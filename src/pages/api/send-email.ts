import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { EMAIL_ERROR_CODES } from '@/lib/email/constants';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { to, subject, html } = await request.json();

    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.VITE_SMTP_USERNAME,
        pass: process.env.VITE_SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: {
        name: process.env.VITE_SMTP_SENDER_NAME || 'Gestly',
        address: process.env.VITE_SMTP_SENDER_EMAIL || 'link-magico@br.sendbot.co'
      },
      to,
      subject,
      html,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: info.messageId
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    let errorCode = EMAIL_ERROR_CODES.SEND_ERROR;
    let status = 500;

    if (error.code === 'EAUTH') {
      errorCode = EMAIL_ERROR_CODES.CONFIG_ERROR;
    } else if (error.code === 'ECONNECTION') {
      errorCode = EMAIL_ERROR_CODES.SMTP_ERROR;
    } else if (error.responseCode === 421 || error.responseCode === 450) {
      errorCode = EMAIL_ERROR_CODES.RATE_LIMIT;
      status = 429;
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorCode,
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};