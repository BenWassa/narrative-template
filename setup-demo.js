#!/usr/bin/env node

/**
 * Narrative Portfolio Template Setup Script
 *
 * This script helps set up the portfolio template by:
 * 1. Installing dependencies
 * 2. Generating fresh dummy photos (optional)
 * 3. Starting the development server
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Narrative Portfolio Template...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json') || !fs.existsSync('template-photos')) {
  console.error('❌ Error: Please run this script from the narrative-template directory');
  process.exit(1);
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Check if template photos exist
const templatePhotosDir = path.join(__dirname, 'template-photos');
const hasPhotos = fs.existsSync(templatePhotosDir) &&
  fs.readdirSync(templatePhotosDir).some(file => file.endsWith('.jpg'));

if (!hasPhotos) {
  console.log('🖼️  Generating template photos...');
  try {
    execSync('node generate_stock_photos.js', { stdio: 'inherit' });
    console.log('✅ Template photos generated\n');
  } catch (error) {
    console.error('❌ Failed to generate template photos');
    process.exit(1);
  }
} else {
  console.log('✅ Template photos already exist\n');
}

// Start the development server
console.log('🌐 Starting development server...');
console.log('📖 Once started, open http://localhost:5173 in your browser');
console.log('🎯 To create a demo project:');
console.log('   1. Click "New Project"');
console.log('   2. Name it "Narrative Demo"');
console.log('   3. Choose the "template-photos" folder');
console.log('   4. Click "Create Project"\n');

try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start development server');
  process.exit(1);
}