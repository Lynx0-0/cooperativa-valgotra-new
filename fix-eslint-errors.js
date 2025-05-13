const fs = require('fs');
const path = require('path');

// Percorsi da controllare
const directoriesToCheck = ['src/app', 'src/components', 'src/lib'];

// Funzione per correggere le virgolette
function fixQuotes(content) {
  // Corregge &quot; nelle classi JSX
  return content.replace(/className=&quot;([^"]*)&quot;/g, 'className="$1"')
                .replace(/lang=&quot;([^"]*)&quot;/g, 'lang="$1"')
                .replace(/([a-zA-Z0-9-]+)=&quot;([^"]*)&quot;/g, '$1="$2"');
}

// Funzione per correggere un file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corregge le virgolette
    const updatedContent = fixQuotes(content);
    
    // Se il contenuto è cambiato, scrivi il file
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Fixed quotes in: ${filePath}`);
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

console.log('Completed fixing quotes');