import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import createRazorpayOrderHandler from './api/create-razorpay-order';
import verifyRazorpayPaymentHandler from './api/verify-razorpay-payment';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Undergroundz API',
      timestamp: new Date().toISOString(),
      hasRazorpayKey: Boolean(process.env.RAZORPAY_KEY_ID),
      hasRazorpaySecret: Boolean(process.env.RAZORPAY_KEY_SECRET),
      hasSupabaseUrl: Boolean(process.env.VITE_SUPABASE_URL),
    });
  });

  app.post('/api/create-razorpay-order', (req, res) => {
    createRazorpayOrderHandler(req, res);
  });

  app.post('/api/verify-razorpay-payment', (req, res) => {
    verifyRazorpayPaymentHandler(req, res);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Undergroundz] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
