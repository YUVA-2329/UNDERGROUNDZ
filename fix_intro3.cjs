const fs = require('fs');
const path = 'src/components/BrandIntroCinematic.tsx';
let code = fs.readFileSync(path, 'utf8');

// I need to look at what's there
console.log(code.substring(code.indexOf('<canvas') - 50, code.indexOf('<canvas') + 500));
