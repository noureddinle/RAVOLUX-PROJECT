import { NextRequest, NextResponse } from 'next/server';
import { EmailService, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { type, to, data } = await request.json();

    let template;
    
    switch (type) {
      case 'order-confirmation':
        template = emailTemplates.orderConfirmation(data);
        break;
      case 'order-status-update':
        template = emailTemplates.orderStatusUpdate(data, data.newStatus);
        break;
      case 'welcome':
        template = emailTemplates.welcomeEmail(data);
        break;
      case 'contact-response':
        template = emailTemplates.contactFormResponse(data);
        break;
      case 'password-reset':
        template = emailTemplates.passwordReset(data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    await EmailService.send(to, template);

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}