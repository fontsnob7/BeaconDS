// scripts/generate-figma.js
const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('./tokens/tokens.json', 'utf8'));

// Generate Figma variable creation script
const figmaScript = generateFigmaVariables(tokens);

console.log('Figma variables script generated!');
console.log('Copy this into Figma Console:');
console.log(figmaScript);

function generateFigmaVariables(tokens) {
  let script = `
(async () => {
  try {
    console.log("Creating Figma variables...");
    
    const allCollections = await figma.variables.getLocalVariableCollectionsAsync();
    const collections = {};
    
    // Find collections (must exist first)
    for (const collection of allCollections) {
      collections[collection.name.toLowerCase()] = collection;
    }
    
    // Create primitive colors
`;
  
  // Loop through primitives
  for (const [colorFamily, shades] of Object.entries(tokens.primitives.color)) {
    for (const [shade, data] of Object.entries(shades)) {
      if (data.value && data.value.startsWith('#')) {
        script += `
    const var_${colorFamily}_${shade} = await figma.variables.createVariableAsync(
      "${colorFamily}/${shade}",
      collections.primitives.id,
      "COLOR"
    );
    var_${colorFamily}_${shade}.setValueForMode(
      collections.primitives.modes[0].modeId,
      { type: "SOLID", color: hexToRgb("${data.value}") }
    );
    var_${colorFamily}_${shade}.setScopes(["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR"]);
    var_${colorFamily}_${shade}.setCodeSyntax("WEB", "var(--color-${colorFamily}-${shade})");
`;
      }
    }
  }
  
  script += `
    console.log("✅ All Figma variables created!");
  } catch(e) { console.error(e); }
})();

function hexToRgb(hex) {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}
`;
  
  return script;
}
