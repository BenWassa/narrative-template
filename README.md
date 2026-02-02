# Narrative - Portfolio Template

A pre-configured demonstration of the Narrative photo organization app with sample photos showcasing all core features.

## Features Demonstrated

- ✅ Photo organization by date
- ✅ Project/narrative assignment
- ✅ Archive functionality
- ✅ Mixed assignment states
- ✅ Unassigned photo handling
- ✅ Folder structure detection
- ✅ Photo viewing and management

## What's Included

- **33 high-quality stock photos** from Unsplash (copyright-free)
- **Thematically organized** by content type for realistic demonstration
- **Pre-configured project assignments** showing different organizational states
- **Multiple organizational states**: assigned, unassigned, archived
- **Ready-to-use template** for portfolio showcase

## Quick Start

**Option 1: Automated Setup**

```bash
node setup-demo.js
```

**Option 2: Manual Setup**

1. **Install dependencies**: `npm install`
2. **Start the app**: `npm run dev`
3. **Create a demo project**:
   - Click "New Project"
   - Enter project name: "Narrative Demo"
   - Click "Choose Folder" and select the `template-photos` folder in this directory
   - Click "Create Project"

## Demo Project Structure

The template comes with a pre-configured demo project showing:

### `template-photos/2024-01-15/` - Fully Assigned Day (10 photos)

- **Family vacation photos**: Travel destinations, outdoor activities, family moments
- All photos assigned to "Family Trip 2024" project
- Shows the end result of photo organization
- Demonstrates successful project assignment workflow

### `template-photos/2024-01-16/` - Unassigned Day (6 photos)

- **General mixed photos**: Landscapes, city scenes, nature shots
- Photos with no project assignments
- Demonstrates the core problem the app solves
- Ready for assignment to projects

### `template-photos/2024-01-17/` - Partially Assigned Day (8 photos)

- **Professional work photos**: Office environments, meetings, workspaces
- Mix of assigned and unassigned photos
- Shows realistic organizational workflow
- Demonstrates mid-process organization state

### `template-photos/archive/` - Archived Photos (5 photos)

- **Older photos from various dates**: Mix of different content types
- Photos from 2023 marked as archived
- Demonstrates archive functionality
- Shows how old content is managed

### `template-photos/` (Root Level) - Miscellaneous Photos (4 photos)

- **Unorganized photos**: Various content types at root level
- Shows initial state before organization
- Demonstrates photos waiting to be processed

### `template-photos/` (Root Level) - Miscellaneous Photos

- 3-5 unorganized photos at root level
- Shows photos waiting to be organized
- Demonstrates initial state before organization

## Pre-configured Projects

The template includes these sample projects:

- **Family Trip 2024** - Photos from a family vacation
- **Work Conference** - Professional event photos
- **Personal Archive** - Miscellaneous personal photos

## How It Works

This is the same Narrative app you know and love, but:

1. **Pre-loaded with dummy photos** instead of requiring you to load personal photos
2. **Comes with sample project assignments** to demonstrate functionality
3. **Shows various organizational states** (assigned, unassigned, archived)
4. **Ready to run immediately** for portfolio demonstrations

## Customization

If you want to modify the demo:

- Replace photos in `template-photos/` with your own dummy images
- Edit project assignments through the app interface
- Add/remove projects as needed
- The app works exactly like the full version

## Technical Details

- Built with React, TypeScript, and Vite
- Uses IndexedDB for local storage
- Supports HEIC, JPG, PNG, and other image formats
- **Demo photos**: High-quality stock images from Unsplash (free for commercial use)

## Photo Credits & Copyright

All demo photos are sourced from [Unsplash](https://unsplash.com), a platform providing free high-quality stock photography. The images are copyright-free and can be used for portfolio demonstrations, presentations, and commercial purposes.

**Photo categories used:**

- Travel & vacation photos (family trip demonstration)
- Nature & landscape photography (general content)
- Professional workspace photos (work demonstration)
- Mixed content for archive and miscellaneous examples

## About Narrative

Narrative is a photo organization app that helps you organize photos by assigning them to meaningful projects and narratives, rather than just folders and dates. This template demonstrates the core workflow and features.

---

_This is a portfolio demonstration template. For the full Narrative app with personal photo organization, visit the main repository._
