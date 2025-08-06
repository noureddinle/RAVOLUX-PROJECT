import { Response } from 'express';

// Helper function for error handling
export const handleError = (res: Response, error: any, message = 'Internal server error') => {
    console.error(error);
    res.status(500).json({ error: message });
};
  
export default handleError;