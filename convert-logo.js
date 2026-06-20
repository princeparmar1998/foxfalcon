const { Jimp } = require('jimp');
const path = require('path');

async function cropTransparentSpace() {
  const inputPath = path.join(__dirname, 'public', 'logo-icon.png');

  console.log('Reading image...');
  const image = await Jimp.read(inputPath);

  const { width, height, data } = image.bitmap;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  // Find bounding box of non-transparent pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3];
      if (alpha > 10) { // non-transparent pixel
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Bounding box: (${minX}, ${minY}) → (${maxX}, ${maxY})`);
  console.log(`Cropping from ${width}x${height} to ${maxX - minX}x${maxY - minY}`);

  // Add small padding
  const pad = 10;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, maxX - minX + pad * 2);
  const cropH = Math.min(height - cropY, maxY - minY + pad * 2);

  image.crop({ x: cropX, y: cropY, w: cropW, h: cropH });

  await image.write(inputPath);
  console.log(`✅ Cropped PNG saved: ${cropW}x${cropH}px`);
}

cropTransparentSpace().catch(console.error);
