const fs = require('fs');
let content = fs.readFileSync('src/components/BrandIntroCinematic.tsx', 'utf8');

// The string to replace globally
const badStr = `              <div className="mt-2 md:mt-4 font-body text-[#8e8e98] text-xs sm:text-sm md:text-base tracking-[0.3em] sm:tracking-[0.5em] font-bold uppercase text-center">\n                WHEN ENGINE SPEAKS\n              </div>\n            </div>`;

content = content.split(badStr).join('');

fs.writeFileSync('src/components/BrandIntroCinematic.tsx', content);
