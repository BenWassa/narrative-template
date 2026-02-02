const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(process.cwd(), 'template-photos');

// Unsplash API configuration (no auth needed for basic usage)
const UNSPLASH_BASE = 'https://api.unsplash.com';
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // We'll use public API without key for now

// Fallback: Direct image URLs from Unsplash (public domain)
const STOCK_PHOTOS = {
  // Family trip photos (2024-01-15)
  family: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
  ],

  // General mixed photos (2024-01-16)
  general: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop'
  ],

  // Work/professional photos (2024-01-17)
  work: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'
  ],

  // Archive photos (various dates)
  archive: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
  ],

  // Miscellaneous root photos
  misc: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop'
  ]
};

async function downloadImage(url, filepath) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Narrative-Portfolio-Template/1.0'
      }
    });

    // Resize image for faster loading (max 1200px wide, good quality)
    const imageBuffer = await sharp(response.data)
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    await fs.writeFile(filepath, imageBuffer);
    return true;
  } catch (error) {
    console.warn(`Failed to download ${url}:`, error.message);
    return false;
  }
}

function writeFileWithMtime(filePath, buffer, mtime) {
  // File is already written by downloadImage, just set mtime
  const atime = new Date();
  fs.utimesSync(filePath, atime, mtime);
}

async function generatePhotosForDay(dayDir, date, photoUrls, startHour = 9) {
  await fs.ensureDir(dayDir);

  for (let i = 0; i < photoUrls.length; i++) {
    const hour = startHour + Math.floor((i * 2) / photoUrls.length); // Spread throughout day
    const minute = (i % 2 === 0) ? 0 : 30; // Alternate 00 and 30 minutes
    const dateTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`);
    const filename = `IMG_${date.replace(/-/g, '')}_${(i + 1).toString().padStart(2, '0')}.jpg`;
    const filepath = path.join(dayDir, filename);

    console.log(`Downloading ${filename}...`);
    const success = await downloadImage(photoUrls[i], filepath);

    if (success) {
      writeFileWithMtime(filepath, null, dateTime);
      console.log(`✅ ${filename} downloaded and timestamped`);
    } else {
      console.log(`❌ Failed to download ${filename}`);
    }

    // Small delay to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function generateStockPhotos() {
  console.log('🖼️  Generating stock photos for Narrative Portfolio Template...\n');

  await fs.ensureDir(root);
  const otherDir = path.join(root, 'OTHER');
  await fs.ensureDir(otherDir);

  try {
    // 2024-01-15: Family trip photos (assigned)
    console.log('📸 Creating family trip photos (Day 1 / 2024-01-15)...');
    await generatePhotosForDay(
      path.join(root, 'Day 1'),
      '2024-01-15',
      STOCK_PHOTOS.family,
      8 // Start early morning
    );

    // 2024-01-16: General mixed photos (unassigned)
    console.log('\n📸 Creating general photos (Day 2 / 2024-01-16)...');
    await generatePhotosForDay(
      path.join(root, 'Day 2'),
      '2024-01-16',
      STOCK_PHOTOS.general,
      10
    );

    // 2024-01-17: Work photos (partial assignment)
    console.log('\n📸 Creating work photos (Day 3 / 2024-01-17)...');
    await generatePhotosForDay(
      path.join(root, 'Day 3'),
      '2024-01-17',
      STOCK_PHOTOS.work,
      9
    );

    // Archive folder with older dates
    console.log('\n📸 Creating archive photos (OTHER/archive)...');
    const archiveDir = path.join(otherDir, 'archive');
    await fs.ensureDir(archiveDir);

    const archiveDates = ['2023-12-15', '2023-11-20', '2023-10-05', '2023-09-12', '2023-08-30'];
    for (let i = 0; i < STOCK_PHOTOS.archive.length; i++) {
      const date = archiveDates[i];
      const dateTime = new Date(`${date}T12:00:00Z`);
      const filename = `ARCHIVE_IMG_${date.replace(/-/g, '')}_${(i + 1).toString().padStart(2, '0')}.jpg`;
      const filepath = path.join(archiveDir, filename);

      console.log(`Downloading ${filename}...`);
      const success = await downloadImage(STOCK_PHOTOS.archive[i], filepath);

      if (success) {
        writeFileWithMtime(filepath, null, dateTime);
        console.log(`✅ ${filename} downloaded and timestamped`);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Root level miscellaneous photos
    console.log('\n📸 Creating miscellaneous photos in OTHER/...');
    for (let i = 0; i < STOCK_PHOTOS.misc.length; i++) {
      const date = '2024-01-14'; // Day before main demo
      const hour = 14 + i; // Spread throughout afternoon
      const dateTime = new Date(`${date}T${hour}:00:00Z`);
      const filename = `misc_${(i + 1).toString().padStart(3, '0')}.jpg`;
      const filepath = path.join(otherDir, filename);

      console.log(`Downloading ${filename}...`);
      const success = await downloadImage(STOCK_PHOTOS.misc[i], filepath);

      if (success) {
        writeFileWithMtime(filepath, null, dateTime);
        console.log(`✅ ${filename} downloaded and timestamped`);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 Stock photos generated successfully!');
    console.log(`📁 Location: ${root}`);
    console.log('📊 Summary:');
    console.log('- Day 1 (2024-01-15): 10 family/vacation photos (assigned)');
    console.log('- Day 2 (2024-01-16): 6 general photos (unassigned)');
    console.log('- Day 3 (2024-01-17): 8 work photos (partial assignment)');
    console.log('- OTHER/archive/: 5 older photos (archived)');
    console.log('- OTHER/: 4 miscellaneous photos awaiting assignment');

  } catch (error) {
    console.error('❌ Error generating stock photos:', error);
    process.exit(1);
  }
}

// Run the generator
generateStockPhotos();
