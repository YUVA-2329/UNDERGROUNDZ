import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

export default async function ugzBotHandler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase configuration missing on server' });
  }

  try {
    // Authenticate user using the provided JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Create profile if missing
    let activeProfile = profile;
    if (!profile) {
      const newProfile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        callsign: user.user_metadata?.callsign || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: insertedProfile } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();
        
      activeProfile = insertedProfile || newProfile;
    }

    // Construct the authenticated user context for the UGZ Bot
    const botContext = {
      user_id: user.id,
      email: user.email,
      display_name: activeProfile.full_name || activeProfile.callsign || 'Undergroundz Member',
      authenticated: true,
      last_login_at: user.last_sign_in_at || new Date().toISOString()
    };

    // Example Bot logic placeholder
    const { message } = req.body;

    const botResponse = `Acknowledged, ${botContext.display_name}. Undergroundz Identity confirmed.`;

    return res.status(200).json({
      success: true,
      context: botContext,
      reply: botResponse
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
