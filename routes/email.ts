import { Router, Request, Response } from 'express';
import { EmailService, emailTemplates } from '../lib/email';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { type, to, data } = req.body;

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
        return res.status(400).json({ error: 'Invalid email type' });
    }

    await EmailService.send(to, template);

    res.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Email API error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;