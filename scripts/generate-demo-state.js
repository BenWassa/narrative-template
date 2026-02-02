const fs = require('fs');
const path = require('path');

const templateDir = path.resolve(__dirname, '../template-photos');
const outputDir = path.resolve(__dirname, '../src/features/photo-organizer/demo');
const outputPath = path.join(outputDir, 'demoProjectState.ts');

const dayFolders = [
  {
    name: 'Day 1',
    day: 1,
    bucketSequence: [],
  },
  {
    name: 'Day 2',
    day: 2,
    bucketSequence: ['A', 'B', 'C', 'D', 'E', 'M'],
  },
  {
    name: 'Day 3',
    day: 3,
    bucketSequence: ['D', 'D', 'B', 'B', null, null, null, null],
  },
];

const otherRoot = 'OTHER';
const archiveFolder = `${otherRoot}/archive`;
const miscFilePattern = /misc_\d{3}\.jpg/;
const demoProjectId = 'narrative-template-demo';
const demoProjectName = 'Narrative Demo';
const demoRootPath = 'Narrative Demo Photos';
const assetRelativeBase = '../../../../template-photos';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readFiles(folderPath) {
  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

function createPhotoRecords() {
  const records = [];

  dayFolders.forEach((dayFolder) => {
    const folderPath = path.join(templateDir, dayFolder.name);
    if (!fs.existsSync(folderPath)) {
      console.error(`Missing folder: ${folderPath}`);
      process.exit(1);
    }
    const files = readFiles(folderPath);
    files.forEach((fileName, index) => {
      const bucketValue =
        index < dayFolder.bucketSequence.length
          ? dayFolder.bucketSequence[index]
          : null;
      const record = buildRecord({
        folder: dayFolder.name,
        fileName,
        day: dayFolder.day,
        bucket: bucketValue,
        archived: false,
        sequence: index + 1,
      });
      records.push(record);
    });
  });

  const archivePath = path.join(templateDir, archiveFolder);
  if (fs.existsSync(archivePath)) {
    readFiles(archivePath).forEach((fileName, index) => {
      const record = buildRecord({
        folder: archiveFolder,
        fileName,
        day: null,
        bucket: 'X',
        archived: true,
        sequence: index + 1,
      });
      records.push(record);
    });
  }

  const otherRootPath = path.join(templateDir, otherRoot);
  if (fs.existsSync(otherRootPath)) {
    readFiles(otherRootPath)
      .filter((fileName) => miscFilePattern.test(fileName))
      .sort((a, b) => a.localeCompare(b))
      .forEach((fileName, index) => {
        records.push(
          buildRecord({
            folder: otherRoot,
            fileName,
            day: null,
            bucket: null,
            archived: false,
            sequence: index + 1,
          }),
        );
      });
  }

  return records.sort((a, b) => a.timestamp - b.timestamp);
}

function buildRecord({ folder, fileName, day, bucket, archived, sequence }) {
  const folderSegments =
    folder === '.' ? [] : folder.split(/[\\/]/).filter((segment) => segment);
  const normalizedFolder = folderSegments.join('/');
  const filePath = path.posix
    .join(normalizedFolder, fileName)
    .replace('//', '/');
  const fileStats = fs.statSync(
    pathJoin(templateDir, ...folderSegments, fileName),
  );
  const timestamp = Math.round(fileStats.mtimeMs);
  const idPrefix = folderSegments.length ? folderSegments.join('-') : folder;
  const id = `${idPrefix}-${fileName}`;
  const assetPath = path.posix
    .join(assetRelativeBase, normalizedFolder, fileName)
    .replace('//', '/');
  const folderHierarchy = folderSegments;
  const isPreOrganized = Boolean(day && bucket);
  return {
    id,
    originalName: fileName,
    currentName: fileName,
    timestamp,
    day,
    bucket,
    sequence,
    favorite: false,
    rating: 0,
    archived,
    thumbnail: assetPath,
    mimeType: 'image/jpeg',
    filePath,
    sourceFolder:
      folder === '.'
        ? 'root'
        : folderSegments.length
        ? folderSegments.join('/')
        : folder,
    folderHierarchy,
    detectedDay: day,
    detectedBucket: bucket,
    isPreOrganized,
    organizationConfidence: isPreOrganized ? 'high' : 'low',
    subfolderOverride: null,
  };
}

function pathJoin(...segments) {
  return path.join(...segments);
}

function formatValue(value) {
  if (value === null) return 'null';
  if (typeof value === 'string') return `'${value}'`;
  if (Array.isArray(value)) {
    return `[${value.map((item) => formatValue(item)).join(', ')}]`;
  }
  return value;
}

function formatRecord(record) {
  const lines = [
    '{',
    `  id: '${record.id}',`,
    `  originalName: '${record.originalName}',`,
    `  currentName: '${record.currentName}',`,
    `  timestamp: ${record.timestamp},`,
    `  day: ${formatValue(record.day)},`,
    `  bucket: ${formatValue(record.bucket)},`,
    `  sequence: ${formatValue(record.sequence)},`,
    `  favorite: ${record.favorite},`,
    `  rating: ${record.rating},`,
    `  archived: ${record.archived},`,
    `  thumbnail: new URL('${record.thumbnail}', import.meta.url).href,`,
    `  mimeType: '${record.mimeType}',`,
    `  filePath: '${record.filePath}',`,
    `  sourceFolder: '${record.sourceFolder}',`,
    `  folderHierarchy: ${formatValue(record.folderHierarchy)},`,
    `  detectedDay: ${formatValue(record.detectedDay)},`,
    `  detectedBucket: ${formatValue(record.detectedBucket)},`,
    `  isPreOrganized: ${record.isPreOrganized},`,
    `  organizationConfidence: '${record.organizationConfidence}',`,
    '  subfolderOverride: null,',
    '}',
  ];
  return lines.join('\n');
}

const records = createPhotoRecords();
ensureDir(outputDir);
const content = `import type { ProjectPhoto, ProjectState } from '../services/projectService';

export const DEMO_PROJECT_ID = '${demoProjectId}';
export const DEMO_PROJECT_NAME = '${demoProjectName}';
export const DEMO_PROJECT_ROOT_PATH = '${demoRootPath}';

const DEFAULT_SETTINGS = {
  autoDay: true,
  folderStructure: {
    daysFolder: '01_DAYS',
    archiveFolder: '98_ARCHIVE',
    favoritesFolder: 'FAV',
    metaFolder: '_meta',
  },
};

const photoList: ProjectPhoto[] = [
${records.map((record) => formatRecord(record)).join(',\n\n')}
];

export const demoProjectState: ProjectState = {
  projectName: DEMO_PROJECT_NAME,
  rootPath: DEMO_PROJECT_ROOT_PATH,
  settings: DEFAULT_SETTINGS,
  photos: photoList,
  dayLabels: {
    1: 'Day 1',
    2: 'Day 2',
    3: 'Day 3',
  },
  dayContainers: [],
  lastModified: Date.now(),
};
`;
fs.writeFileSync(outputPath, content);
console.log('Generated demo project state at', outputPath);
