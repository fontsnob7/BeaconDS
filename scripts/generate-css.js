// scripts/generate-css.js
const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('./tokens/tokens.json', 'utf8'));

// Generate CSS variables for light theme
let cssLight = `:root {
  /* Primitive Colors - Light Theme */
`;

for (const [colorFamily, shades] of Object.entries(tokens.primitives.color)) {
  for (const [shade, data] of Object.entries(shades)) {
    if (data.value) {
      cssLight += `\n  --color-${colorFamily}-${shade}: ${data.value};`;
    }
  }
}

// Semantic colors - light theme
cssLight += `\n\n  /* Semantic Colors - Light Theme */`;
for (const [category, variants] of Object.entries(tokens.semantic.color)) {
  for (const [name, values] of Object.entries(variants)) {
    if (values.light) {
      cssLight += `\n  --color-${category}-${name}: var(${resolveValue(values.light.value)});`;
    }
  }
}

// Add spacing, radius, typography...
cssLight += `\n\n  /* Spacing */`;
for (const [name, data] of Object.entries(tokens.primitives.spacing)) {
  cssLight += `\n  --spacing-${name}: ${data.value}px;`;
}

cssLight += `\n\n  /* Border Radius */`;
for (const [name, data] of Object.entries(tokens.primitives.radius)) {
  cssLight += `\n  --radius-${name}: ${data.value}px;`;
}

cssLight += `\n}`;

// Write CSS file
fs.writeFileSync('./packages/angular/styles/tokens.light.css', cssLight);
console.log('✅ CSS generated: packages/angular/styles/tokens.light.css');

function resolveValue(value) {
  // Convert {primitives.color.blue.500} to var(--color-blue-500)
  return value.replace(/{primitives\.([^}]+)}/g, (match, path) => {
    return 'var(--' + path.replace(/\./g, '-') + ')';
  });
}
