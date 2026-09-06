const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const badHookCode = `  // Global Event Tracking for Telegram
  useEffect(() => {
    if (currentView !== 'intro') {
      notifyUserAction('Page View', { view: currentView });
    }
  }, [currentView]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const buttonOrLink = target.closest('button, a') as HTMLElement;
      if (buttonOrLink) {
        const actionName = buttonOrLink.innerText?.trim().slice(0, 50) || buttonOrLink.getAttribute('aria-label') || buttonOrLink.title || 'Unknown Interaction';
        const elementType = buttonOrLink.tagName.toLowerCase();
        
        // Don't spam empty clicks
        if (actionName) {
          notifyUserAction('Interaction', { 
            element: elementType, 
            label: actionName,
            className: buttonOrLink.className.substring(0, 50)
          }).catch(() => {});
        }
      }
    };
    
    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);
`;

// Remove ALL instances of badHookCode
code = code.split(badHookCode).join('');
// Also remove instances where it might be indented differently or missing newlines?
// Actually I'll use regex to remove it if exact match fails.
code = code.replace(/ *\/\/ Global Event Tracking for Telegram[\s\S]*?\}, \[\]\);/g, '');

// Now insert it at the very top of `App` component body, right after `export default function App() {`
const appDef = 'export default function App() {';
const insertPos = code.indexOf(appDef);

if (insertPos !== -1) {
  code = code.slice(0, insertPos + appDef.length) + '\n' + badHookCode + code.slice(insertPos + appDef.length);
}

fs.writeFileSync('src/App.tsx', code);
