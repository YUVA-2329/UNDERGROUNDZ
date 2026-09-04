const { Jimp } = require('jimp');
const path = require('path');

const inputs = [
  { file: 'C:\\Users\\yuvak\\.gemini\\antigravity\\brain\\7b1a7f21-89ae-4ee1-9844-5efe9d8aa58f\\unbranded_hoodie_1785581593645.png', out: 'public/hoodie.png' },
  { file: 'C:\\Users\\yuvak\\.gemini\\antigravity\\brain\\7b1a7f21-89ae-4ee1-9844-5efe9d8aa58f\\unbranded_tshirt_1785581606846.png', out: 'public/tshirt.png' },
  { file: 'C:\\Users\\yuvak\\.gemini\\antigravity\\brain\\7b1a7f21-89ae-4ee1-9844-5efe9d8aa58f\\unbranded_shirt_1785581617055.png', out: 'public/shirt.png' },
  { file: 'C:\\Users\\yuvak\\.gemini\\antigravity\\brain\\7b1a7f21-89ae-4ee1-9844-5efe9d8aa58f\\unbranded_sweater_1785581628005.png', out: 'public/sweater.png' }
];

async function run() {
  try {
    const logo = await Jimp.read('public/logo.png');
    logo.resize({ w: 400 });

    for (const item of inputs) {
      console.log(`Processing ${item.out}...`);
      const img = await Jimp.read(item.file);
      
      const x = (img.bitmap.width - logo.bitmap.width) / 2;
      const y = img.bitmap.height * 0.30;
      
      img.composite(logo, x, y);
      
      await img.write(item.out);
      console.log(`Saved ${item.out}`);
    }
  } catch (err) {
    console.error('Error compositing images:', err);
  }
}

run();
