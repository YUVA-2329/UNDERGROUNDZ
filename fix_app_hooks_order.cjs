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
code = code.replace(/ *\/\/ Global Event Tracking for Telegram[\s\S]*?\}, \[\]\);/g, '');

// Now insert it AFTER `const [currentView, setCurrentView] = useState<ViewType>(...);`
// I will search for the end of that useState hook which ends around line ~60 (has a closing `  });`)
// Actually let's search for `const [selectedCategory, setSelectedCategory] = useState<string>('ALL');`
const anchor = "const [selectedCategory, setSelectedCategory] = useState<string>('ALL');";
const insertPos = code.indexOf(anchor);

if (insertPos !== -1) {
  code = code.slice(0, insertPos) + badHookCode + '\n  ' + code.slice(insertPos);
}

fs.writeFileSync('src/App.tsx', code);
