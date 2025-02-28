import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { EMAIL_ERROR_CODES } from '../../src/lib/email/constants';

export const handler: Handler = async (event) => {
  try {
    // Validate request
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false,
          error: 'Missing request body'
        })
      };
    }

    const { to, subject, html, from } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!to || !subject || !html) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields'
        })
      };
    }

    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.VITE_SMTP_USERNAME,
        pass: process.env.VITE_SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5
      }
    });

    // Verify connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: {
        name: from.name || 'Gestly',
        address: from.email || 'link-magico@br.sendbot.co'
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId
      })
    };

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
    
    return {
      statusCode: status,
      body: JSON.stringify({
        success: false, 
        error: errorCode,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  }
};