const fs = require('fs');
const path = 'src/services/telegramNotifications.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes("'USER_ACTION'")) {
  code = code.replace("export type TelegramEventType =", "export type TelegramEventType =\n  | 'USER_ACTION'");
}

fs.writeFileSync(path, code);
