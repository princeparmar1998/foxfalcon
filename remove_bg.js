const { Jimp } = require('jimp');
const path = require('path');

async function removeBackgroundBFS(fileName) {
  const filePath = path.join(__dirname, 'public', fileName);
  console.log(`Processing with Flood-Fill BFS: ${filePath}`);
  
  const image = await Jimp.read(filePath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  const data = image.bitmap.data;
  
  const visited = new Uint8Array(width * height);
  const queue = [];
  
  function getPixelIndex(x, y) {
    return (y * width + x) * 4;
  }
  
  function isDark(x, y) {
    const idx = getPixelIndex(x, y);
    const r = data[idx + 0];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Threshold: anything close to black (r, g, b < 25)
    return r < 25 && g < 25 && b < 25;
  }
  
  // Add seed pixels (the 4 corners and the border edges to capture any gaps)
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
    visited[0 * width + x] = 1;
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
    visited[y * width + 0] = 1;
    visited[y * width + (width - 1)] = 1;
  }
  
  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++];
    
    if (isDark(cx, cy)) {
      // Make it transparent!
      const idx = getPixelIndex(cx, cy);
      data[idx + 3] = 0; // Alpha = 0
      
      // Check neighbors
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];
      
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const visIdx = ny * width + nx;
          if (!visited[visIdx]) {
            visited[visIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }
  
  // Apply a subtle anti-aliasing feathering step around the transparency border 
  // to avoid jagged edges!
  // Any dark pixel that has at least one transparent neighbor gets a slight alpha feathering
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = getPixelIndex(x, y);
      if (data[idx + 3] !== 0) { // If it is not transparent
        const r = data[idx + 0];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // If it is fairly dark (edge transition)
        if (r < 55 && g < 55 && b < 55) {
          // Check if any neighbor is fully transparent
          const hasTransparentNeighbor = 
            data[getPixelIndex(x + 1, y) + 3] === 0 ||
            data[getPixelIndex(x - 1, y) + 3] === 0 ||
            data[getPixelIndex(x, y + 1) + 3] === 0 ||
            data[getPixelIndex(x, y - 1) + 3] === 0;
            
          if (hasTransparentNeighbor) {
            // Smoothly feather it!
            data[idx + 3] = Math.round((r + g + b) / 3 * 2.5); // Dynamic alpha based on brightness
          }
        }
      }
    }
  }
  
  await image.write(filePath);
  console.log(`Successfully removed background for ${fileName}`);
}

async function main() {
  try {
    await removeBackgroundBFS('logo.png');
    await removeBackgroundBFS('logo-short.png');
    await removeBackgroundBFS('logo-icon.png');
  } catch (error) {
    console.error('Error during image processing:', error);
  }
}

main();
