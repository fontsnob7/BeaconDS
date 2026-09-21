// scripts/generate-angular.js
const fs = require('fs');
const path = require('path');
const tokens = JSON.parse(fs.readFileSync('./tokens/tokens.json', 'utf8'));

// Generate TypeScript constants
let typescript = `// AUTO-GENERATED: Do not edit manually
// Generated from tokens/tokens.json

export const DESIGN_TOKENS = {
`;

// Primitives
typescript += `\n  primitives: {`;
for (const [category, items] of Object.entries(tokens.primitives)) {
  typescript += `\n    ${category}: {`;
  for (const [name, values] of Object.entries(items)) {
    typescript += `\n      ${name}: {`;
    for (const [key, data] of Object.entries(values)) {
      typescript += `\n        ${key}: '${data.value}',`;
    }
    typescript += `\n      },`;
  }
  typescript += `\n    },`;
}
typescript += `\n  },`;

// Semantic
typescript += `\n\n  semantic: {`;
for (const [category, items] of Object.entries(tokens.semantic)) {
  typescript += `\n    ${category}: {`;
  for (const [name, values] of Object.entries(items)) {
    typescript += `\n      ${name}: {`;
    for (const [variant, data] of Object.entries(values)) {
      typescript += `\n        ${variant}: '${data.value}',`;
    }
    typescript += `\n      },`;
  }
  typescript += `\n    },`;
}

typescript += `\n  },\n};\n`;

// Write TypeScript file
fs.writeFileSync('./packages/angular/tokens.ts', typescript);
console.log('✅ TypeScript generated: packages/angular/tokens.ts');
