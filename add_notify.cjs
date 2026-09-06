const fs = require('fs');
let code = fs.readFileSync('src/services/telegramNotifications.ts', 'utf8');

if (!code.includes("'NEW_COMMUNITY_POST'")) {
  code = code.replace("  | 'USER_ACTION'", "  | 'USER_ACTION'\n  | 'NEW_COMMUNITY_POST'");
}

const newFunc = `
// =========================================================================
// 9. Community Post / Field Dispatch
// =========================================================================
export async function notifyCommunityPost(post: {
  author: string;
  location: string;
  quote: string;
  mobileNumber?: string;
}): Promise<void> {
  await dispatchTelegramNotification({
    event: 'NEW_COMMUNITY_POST',
    title: \`New Community Dispatch: \${post.author}\`,
    customFields: {
      author: post.author,
      bike_or_location: post.location,
      mobile: post.mobileNumber || 'Not provided',
      message: post.quote,
    },
  });
}
`;

if (!code.includes("notifyCommunityPost")) {
  code += newFunc;
}

fs.writeFileSync('src/services/telegramNotifications.ts', code);
