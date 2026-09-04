const { Jimp } = require('jimp');

async function processLogo() {
  try {
    const image = await Jimp.read('C:\\Users\\yuvak\\.gemini\\antigravity\\brain\\7b1a7f21-89ae-4ee1-9844-5efe9d8aa58f\\media__1785581269797.jpg');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      if (red > 200 && green > 200 && blue > 200) {
        this.bitmap.data[idx + 3] = 0;
      } 
      else if (red < 150 && green < 150 && blue < 150) {
        this.bitmap.data[idx + 0] = 255;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 255;
      }
    });

    await image.write('public/logo.png');
    console.log('Logo processed and saved to public/logo.png');
  } catch (err) {
    console.error('Error processing logo:', err);
  }
}

processLogo();
