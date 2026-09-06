const fs = require('fs');
let code = fs.readFileSync('src/views/CommunityPage.tsx', 'utf8');

code = code.replace(
  "import { notifyRiderRegistration } from '../services/telegramNotifications';",
  "import { notifyCommunityPost } from '../services/telegramNotifications';"
);

const oldNotify = `    // Dispatch Rider Registration / Field Log to Telegram
    notifyRiderRegistration({
      callsign: callsign.toUpperCase(),
      sector: bike.toUpperCase(), // Using sector field for Bike
      gearTagged: mobileNumber, // Using gearTagged field for Mobile Number
      source: 'Field Dispatch Transmission',
      userId: user?.id,
      email: user?.email,
      name: user?.user_metadata?.full_name
    }).catch(() => {});`;

const newNotify = `    // Dispatch Field Log to Telegram
    notifyCommunityPost({
      author: callsign.toUpperCase(),
      location: bike.toUpperCase(),
      quote: reportText,
      mobileNumber: mobileNumber,
    }).catch(() => {});`;

code = code.replace(oldNotify, newNotify);
fs.writeFileSync('src/views/CommunityPage.tsx', code);
