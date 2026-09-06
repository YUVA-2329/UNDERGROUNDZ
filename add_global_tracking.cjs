const fs = require('fs');
const path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const hookCode = `
  // Global Event Tracking for Telegram
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

if (!code.includes("handleGlobalClick")) {
  // Find where to insert, right before `return (` inside App
  const insertPos = code.lastIndexOf('  return (');
  if (insertPos !== -1) {
    code = code.slice(0, insertPos) + hookCode + '\\n' + code.slice(insertPos);
  }
}

fs.writeFileSync(path, code);
