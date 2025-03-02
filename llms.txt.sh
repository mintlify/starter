#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read the configuration from llms.txt.json
const config = JSON.parse(fs.readFileSync('llms.txt.json', 'utf8'));
const includePaths = config.includePaths;
const excludePaths = config.excludePaths || [];

// Output file
const outputFile = 'llms.txt';

// Clear the output file if it exists
fs.writeFileSync(outputFile, "# LangWatch\n\n");

// Function to process imports in an MDX file
function processImports(content, filePath) {
  // Find all import statements
  const importRegex = /import\s+(\w+)\s+from\s+["']([^"']+)["'];?/g;
  let modifiedContent = content;
  const imports = {};

  // Extract all imports
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importName = match[1];
    const importPath = match[2];

    // Handle only imports from /snippets
    if (importPath.startsWith('/snippets/')) {
      const absoluteImportPath = path.join(process.cwd(), importPath.substring(1));

      try {
        if (fs.existsSync(absoluteImportPath)) {
          // Read the imported file
          const importedContent = fs.readFileSync(absoluteImportPath, 'utf8');
          imports[importName] = importedContent;
          if (importName == "LLMsTxtProtip") {
            imports[importName] = ""
          }
        } else {
          console.warn(`Warning: Import file not found: ${absoluteImportPath}`);
        }
      } catch (err) {
        console.error(`Error reading import file ${absoluteImportPath}: ${err.message}`);
      }
    }
  }

  // Replace component references with their content
  Object.keys(imports).forEach(componentName => {
    // Simple replacement for <ComponentName /> pattern
    const componentRegex = new RegExp(`<${componentName}\\s*\\/>`, 'g');
    modifiedContent = modifiedContent.replace(componentRegex, imports[componentName]);
  });

  // Remove import statements
  modifiedContent = modifiedContent.replace(importRegex, '');

  // Replace <Tab title="X"> with ### X
  modifiedContent = modifiedContent.replace(/<Tab\s+title="([^"]+)">/g, '### $1\n');

  // Remove </Tab> tags
  modifiedContent = modifiedContent.replace(/<\/Tab>/g, '');

  // Remove <Tabs> and </Tabs> tags
  modifiedContent = modifiedContent.replace(/<Tabs>|<\/Tabs>/g, '');

  // Remove too many sequential newlines
  modifiedContent = modifiedContent.replace(/\n\n\n\n+/g, '\n\n');

  return modifiedContent;
}

// Process each include path
includePaths.forEach(includePath => {
  try {
    // Create a find command to locate the files
    let findCmd = `find . -type f -path "./${includePath}" 2>/dev/null || echo ""`;

    // Add exclude patterns if any
    if (excludePaths.length > 0) {
      excludePaths.forEach(excludePath => {
        findCmd += ` | grep -v "${excludePath}"`;
      });
    }

    // Execute the find command
    const files = execSync(findCmd)
      .toString()
      .trim()
      .split('\n')
      .filter(file => file); // Remove empty lines

    // Process each matching file
    files.forEach(file => {
      console.log(`Processing: ${file}`);
      try {
        let content = fs.readFileSync(file, 'utf8');

        // Process imports for MDX files
        if (file.endsWith('.mdx')) {
          content = processImports(content, file);
        }

        // Remove trailing whitespaces
        content = content.replace(/[ \t]+$/gm, '');

        // Append to output file
        fs.appendFileSync(outputFile, `# FILE: ${file}\n\n`);
        fs.appendFileSync(outputFile, content);
        fs.appendFileSync(outputFile, '\n---\n\n');
      } catch (err) {
        console.error(`Error reading ${file}: ${err.message}`);
      }
    });
  } catch (error) {
    // If there's an error with the command, log and continue
    console.log(`Error with pattern: ${includePath}: ${error.message}`);
  }
});

// Remove extra blank line at EOF
let finalContent = fs.readFileSync(outputFile, 'utf8');
if (finalContent.endsWith('\n\n')) {
  finalContent = finalContent.substring(0, finalContent.length - 1);
  fs.writeFileSync(outputFile, finalContent);
}

console.log(`Done! All matching files have been merged into ${outputFile}`);
