const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("import { notifyUserAction } from './services/telegramNotifications';\\n/**", "import { notifyUserAction } from './services/telegramNotifications';\n/**");
fs.writeFileSync('src/App.tsx', code);
