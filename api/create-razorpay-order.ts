import type { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { PRODUCTS } from '../src/data';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customer, currency = 'INR' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    // SERVER-SIDE PRICE VALIDATION: Never trust client-sent prices
    let serverTotal = 0;
    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.product?.id);
      if (!product) {
        return res.status(400).json({ error: `Invalid product: ${item.product?.id}` });
      }
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      serverTotal += product.price * quantity;
    }

    // Convert to smallest currency unit (paise for INR, cents for USD)
    // 1 USD = approx 85 INR if converting, or 1:1 if currency is USD
    const targetCurrency = currency.toUpperCase();
    const multiplier = targetCurrency === 'INR' ? 85 : 1; // standard conversion factor if catalog is in $
    const totalInMinorUnits = Math.round(serverTotal * multiplier * 100);

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if real Razorpay credentials exist
    if (keyId && keySecret && !keyId.includes('placeholder')) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const rzpOrder = await razorpay.orders.create({
          amount: totalInMinorUnits,
          currency: targetCurrency,
          receipt: `rcpt_${Date.now().toString().slice(-8)}`,
          notes: {
            customer_name: customer?.fullName || 'Guest',
            customer_email: customer?.email || 'unspecified',
          },
        });

        return res.status(200).json({
          success: true,
          requiresConfig: false,
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: keyId,
        });
      } catch (rzpErr: any) {
        console.error('[Razorpay API Error]:', rzpErr);
        return res.status(500).json({
          error: 'Failed to create Razorpay order',
          details: rzpErr?.error?.description || rzpErr?.message,
        });
      }
    }

    // Credentials not yet configured in environment variables:
    // Return structured test-mode descriptor so development & evaluation can proceed safely
    return res.status(200).json({
      success: true,
      requiresConfig: true,
      testMode: true,
      message: 'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required for production payments.',
      orderId: `order_test_${Date.now()}`,
      amount: totalInMinorUnits,
      currency: targetCurrency,
      keyId: null,
      serverTotalOriginal: serverTotal,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}
