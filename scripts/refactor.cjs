const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const coreDir = path.join(srcDir, 'core');
const modulesDir = path.join(srcDir, 'modules');

// Helper to create dirs
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Directories to create
ensureDir(path.join(coreDir, 'components'));
ensureDir(path.join(coreDir, 'types'));
['evaluacion_docente', 'titulacion', 'vinculacion', 'indicadores'].forEach(mod => {
    ensureDir(path.join(modulesDir, mod, 'components'));
    ensureDir(path.join(modulesDir, mod, 'services'));
    ensureDir(path.join(modulesDir, mod, 'hooks'));
});

// File moves mapping
const moves = [
    { src: 'App.tsx', dest: 'src/core/App.tsx' },
    { src: 'main.tsx', dest: 'src/core/main.tsx' },
    { src: 'index.css', dest: 'src/core/index.css' },
    { src: 'types.ts', dest: 'src/core/types.ts' }, // Keep global types here for now
    { src: 'types_titulacion.ts', dest: 'src/modules/titulacion/types.ts' },
    { src: 'types_vinculacion.ts', dest: 'src/modules/vinculacion/types.ts' },
    { src: 'types_indicadores.ts', dest: 'src/modules/indicadores/types.ts' },
    
    // Core components
    { src: 'components/Header.tsx', dest: 'src/core/components/Header.tsx' },
    { src: 'components/Sidebar.tsx', dest: 'src/core/components/Sidebar.tsx' },
    { src: 'components/Loader.tsx', dest: 'src/core/components/Loader.tsx' },
    { src: 'components/ErrorDisplay.tsx', dest: 'src/core/components/ErrorDisplay.tsx' },
    
    // Titulacion
    { src: 'components/TitulacionModule.tsx', dest: 'src/modules/titulacion/components/TitulacionModule.tsx' },
    { src: 'components/titulacion', dest: 'src/modules/titulacion/components/titulacion', isDir: true },
    { src: 'services/titulacion', dest: 'src/modules/titulacion/services/titulacion', isDir: true },

    // Vinculacion
    { src: 'components/VinculacionModule.tsx', dest: 'src/modules/vinculacion/components/VinculacionModule.tsx' },
    { src: 'components/vinculacion', dest: 'src/modules/vinculacion/components/vinculacion', isDir: true },
    { src: 'services/vinculacion', dest: 'src/modules/vinculacion/services/vinculacion', isDir: true },

    // Indicadores
    { src: 'components/IndicadoresModule.tsx', dest: 'src/modules/indicadores/components/IndicadoresModule.tsx' },
    { src: 'components/indicadores', dest: 'src/modules/indicadores/components/indicadores', isDir: true },
    { src: 'services/indicadores', dest: 'src/modules/indicadores/services/indicadores', isDir: true },
    { src: 'hooks/indicadores', dest: 'src/modules/indicadores/hooks/indicadores', isDir: true },

    // Evaluacion Docente (The rest)
    { src: 'components/EvaluacionDocenteModule.tsx', dest: 'src/modules/evaluacion_docente/components/EvaluacionDocenteModule.tsx' },
];

console.log('Moving files limit mapping...');
moves.forEach(move => {
    const srcPath = path.join(rootDir, move.src);
    const destPath = path.join(rootDir, move.dest);
    ensureDir(path.dirname(destPath));
    if (fs.existsSync(srcPath)) {
        fs.renameSync(srcPath, destPath);
        console.log(`Moved ${move.src} -> ${move.dest}`);
    }
});

// Now we move all remaining files in components/ and services/ to evaluacion_docente
const componentsDir = path.join(rootDir, 'components');
if (fs.existsSync(componentsDir)) {
    const remainingComponents = fs.readdirSync(componentsDir);
    remainingComponents.forEach(file => {
        const srcPath = path.join(componentsDir, file);
        const destPath = path.join(modulesDir, 'evaluacion_docente', 'components', file);
        if (fs.existsSync(srcPath)) {
          fs.renameSync(srcPath, destPath);
          console.log(`Moved Evaluacion Docente Component: ${file}`);
        }
    });
    fs.rmdirSync(componentsDir); // should be empty now
}

const servicesDir = path.join(rootDir, 'services');
if (fs.existsSync(servicesDir)) {
    const remainingServices = fs.readdirSync(servicesDir);
    remainingServices.forEach(file => {
        const srcPath = path.join(servicesDir, file);
        const destPath = path.join(modulesDir, 'evaluacion_docente', 'services', file);
        if (fs.existsSync(srcPath)) {
          fs.renameSync(srcPath, destPath);
          console.log(`Moved Evaluacion Docente Service: ${file}`);
        }
    });
    fs.rmdirSync(servicesDir); // should be empty now
}

const hooksDir = path.join(rootDir, 'hooks');
if (fs.existsSync(hooksDir)) {
    try { fs.rmdirSync(hooksDir); } catch(e) { console.log('hooks dir not empty?'); } // remove empty hooks dir
}

// Update imports
const processDirectory = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace common absolute/relative assumptions with Aliases
            // We'll replace all relative imports with alias imports to save us from hell
            // For App.tsx, we replace components -> @core/components or @evaluacion_docente...
            const replacements = [
                { regex: /from\s+['"]@\/components\/(.*?)['"]/g, replace: 'from \'@core/components/$1\'' },
                { regex: /from\s+['"]@\/hooks\/(.*?)['"]/g, replace: 'from \'@evaluacion_docente/hooks/$1\'' },
                
                // Specific Module Replacements
                { regex: /from\s+['"].*?components\/EvaluacionDocenteModule['"]/g, replace: 'from \'@evaluacion_docente/components/EvaluacionDocenteModule\'' },
                { regex: /from\s+['"].*?components\/TitulacionModule['"]/g, replace: 'from \'@titulacion/components/TitulacionModule\'' },
                { regex: /from\s+['"].*?components\/VinculacionModule['"]/g, replace: 'from \'@vinculacion/components/VinculacionModule\'' },
                { regex: /from\s+['"].*?components\/IndicadoresModule['"]/g, replace: 'from \'@indicadores/components/IndicadoresModule\'' },
                
                // Fixing core component imports within the shell
                { regex: /from\s+['"][^'"]*components\/Header['"]/g, replace: 'from \'@core/components/Header\'' },
                { regex: /from\s+['"][^'"]*components\/Sidebar['"]/g, replace: 'from \'@core/components/Sidebar\'' },
                { regex: /from\s+['"][^'"]*components\/Loader['"]/g, replace: 'from \'@core/components/Loader\'' },
                { regex: /from\s+['"][^'"]*components\/ErrorDisplay['"]/g, replace: 'from \'@core/components/ErrorDisplay\'' },

                // Fix types.ts
                { regex: /from\s+['"][^'"]*types_titulacion['"]/g, replace: 'from \'@titulacion/types\'' },
                { regex: /from\s+['"][^'"]*types_vinculacion['"]/g, replace: 'from \'@vinculacion/types\'' },
                { regex: /from\s+['"][^'"]*types_indicadores['"]/g, replace: 'from \'@indicadores/types\'' },
                { regex: /from\s+['"][^'"]*types['"]/g, replace: 'from \'@core/types\'' },
                
                // Specific folder replacements for cross-module or internal relative
                { regex: /from\s+['"][^'"]*components\/titulacion\/(.*?)['"]/g, replace: 'from \'@titulacion/components/titulacion/$1\'' },
                { regex: /from\s+['"][^'"]*services\/titulacion\/(.*?)['"]/g, replace: 'from \'@titulacion/services/titulacion/$1\'' },
                { regex: /from\s+['"][^'"]*components\/vinculacion\/(.*?)['"]/g, replace: 'from \'@vinculacion/components/vinculacion/$1\'' },
                { regex: /from\s+['"][^'"]*services\/vinculacion\/(.*?)['"]/g, replace: 'from \'@vinculacion/services/vinculacion/$1\'' },
                { regex: /from\s+['"][^'"]*components\/indicadores\/(.*?)['"]/g, replace: 'from \'@indicadores/components/indicadores/$1\'' },
                { regex: /from\s+['"][^'"]*services\/indicadores\/(.*?)['"]/g, replace: 'from \'@indicadores/services/indicadores/$1\'' },
                { regex: /from\s+['"][^'"]*hooks\/indicadores\/(.*?)['"]/g, replace: 'from \'@indicadores/hooks/indicadores/$1\'' },
            ];

            // Only appy replacements if the file is NOT index.html
            if (!fullPath.endsWith('.html')) {
                let initialContent = content;
                replacements.forEach(rep => {
                    content = content.replace(rep.regex, rep.replace);
                });
                if (initialContent !== content) {
                    fs.writeFileSync(fullPath, content);
                    console.log(`Updated imports in ${fullPath}`);
                }
            } else {
                // Specific for index.html
                if (content.includes('src="/main.tsx"')) {
                    content = content.replace('src="/main.tsx"', 'src="/src/core/main.tsx"');
                    fs.writeFileSync(fullPath, content);
                    console.log(`Updated index.html main.tsx path`);
                }
            }
        }
    });
};

processDirectory(rootDir);
console.log('Refactor script completed.');
