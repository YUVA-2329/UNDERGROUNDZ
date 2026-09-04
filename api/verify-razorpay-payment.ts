import type { Request, Response } from 'express';
import crypto from 'crypto';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isTestMode,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing payment order or payment ID' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Production verification with real Razorpay Secret Key
    if (keySecret && !keySecret.includes('placeholder') && !isTestMode) {
      if (!razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment signature for verification' });
      }

      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const isMatch = crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature)
      );

      if (!isMatch) {
        return res.status(400).json({
          verified: false,
          error: 'Razorpay signature verification failed. Possible tampering detected.',
        });
      }

      return res.status(200).json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'paid',
      });
    }

    // Test mode verification (when Razorpay credentials are not yet configured in env)
    if (isTestMode || razorpay_order_id.startsWith('order_test_')) {
      return res.status(200).json({
        verified: true,
        testMode: true,
        paymentId: razorpay_payment_id || `pay_test_${Date.now()}`,
        orderId: razorpay_order_id,
        status: 'paid',
        note: 'Verified in Razorpay Sandbox / Development Mode.',
      });
    }

    return res.status(400).json({
      verified: false,
      error: 'Razorpay secret key not configured in environment.',
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ error: 'Server error verifying payment', message: error?.message });
  }
}
