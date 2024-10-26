import { Router } from 'express';
import { identifyAndLinkContact } from '../services/ContactService';

const identifyRoutes = Router();

identifyRoutes.post('/identify', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      res.status(400).json({ message: 'Either email or phoneNumber is required' });
      return;
    }

    const response = await identifyAndLinkContact({ email, phoneNumber: phoneNumber?.toString() });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default identifyRoutes;