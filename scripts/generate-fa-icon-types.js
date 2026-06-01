const fs = require('fs');
const path = require('path');

const metadataPath = path.resolve(
  __dirname,
  '../node_modules/@fortawesome/fontawesome-pro/metadata/icon-families.json',
);
const outputPath = path.resolve(
  __dirname,
  '../projects/my-lib/src/presentation/shared/ab-icon/ab-icon-names.generated.ts',
);

if (!fs.existsSync(metadataPath)) {
  console.warn(
    '[generate-fa-icon-types] Omitido — no hay metadata de @fortawesome/fontawesome-pro.\n' +
      '  Ejecuta npm run install:deps para instalar Pro y regenerar tipos.',
  );
  process.exit(0);
}

const icons = Object.keys(JSON.parse(fs.readFileSync(metadataPath, 'utf8'))).sort();
const union = icons.map((name) => `  | '${name.replace(/'/g, "\\'")}'`).join('\n');

const contents = `/** AUTO-GENERATED — do not edit. Run: npm run generate:fa-icons */
/** Font Awesome Pro icon suffixes from @fortawesome/fontawesome-pro metadata (${icons.length} icons). */

export type FaProIconName =
${union};
`;

fs.writeFileSync(outputPath, contents, 'utf8');
console.log(`[generate-fa-icon-types] Wrote ${icons.length} icon names → ${path.relative(process.cwd(), outputPath)}`);
