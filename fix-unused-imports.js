const fs = require('fs');
const path = require('path');

// Percorsi da controllare
const directoriesToCheck = ['src/app', 'src/components', 'src/lib'];

// Funzione per correggere le importazioni non utilizzate
function fixUnusedImports(content, filePath) {
  const lines = content.split('\n');
  let modified = false;
  
  // Cerca le righe di importazione
  const newLines = lines.map(line => {
    // Cerca importazioni specifiche tra parentesi graffe
    if (line.includes('import {') && line.includes('} from')) {
      const match = line.match(/import\s+\{([^}]+)\}\s+from/);
      if (match) {
        const imports = match[1].split(',').map(i => i.trim());
        
        // Verifica quali importazioni sono menzionate nel resto del file
        const unusedImports = imports.filter(imp => {
          // Estrai il nome dell'importazione (senza alias)
          const importName = imp.split(' as ')[0].trim();
          
          // Conta quante volte appare nel resto del file
          // Escludiamo la riga di importazione stessa
          const restOfFile = content.replace(line, '');
          
          // Utilizziamo una regex che cerca il nome dell'importazione come parola completa
          const regex = new RegExp(`\\b${importName}\\b`, 'g');
          return (restOfFile.match(regex) || []).length === 0;
        });
        
        // Se ci sono importazioni non utilizzate, rimuovile
        if (unusedImports.length > 0) {
          const usedImports = imports.filter(imp => !unusedImports.includes(imp));
          
          if (usedImports.length === 0) {
            // Se tutte le importazioni sono inutilizzate, rimuovi l'intera riga
            console.log(`Removed all imports: ${line} in ${filePath}`);
            modified = true;
            return '';
          } else {
            // Altrimenti, mantieni solo le importazioni utilizzate
            const newLine = line.replace(
              match[0], 
              `import { ${usedImports.join(', ')} } from`
            );
            console.log(`Modified imports in ${filePath}:`);
            console.log(`  From: ${line}`);
            console.log(`  To:   ${newLine}`);
            modified = true;
            return newLine;
          }
        }
      }
    }
    return line;
  });
  
  return modified ? newLines.join('\n') : content;
}

// Funzione per correggere un file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corregge le importazioni non utilizzate
    const updatedContent = fixUnusedImports(content, filePath);
    
    // Se il contenuto è cambiato, scrivi il file
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Funzione per attraversare ricorsivamente le directory
function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (stats.isFile() && 
               (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx'))) {
      fixFile(fullPath);
    }
  });
}

// Esegui lo script su tutte le directory specificate
directoriesToCheck.forEach(dir => {
  const fullDir = path.join(process.cwd(), dir);
  if (fs.existsSync(fullDir)) {
    traverseDirectory(fullDir);
  }
});

console.log('Completed fixing unused imports');