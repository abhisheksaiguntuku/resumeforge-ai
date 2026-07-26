import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const regex = /export const dynamic = 'force-dynamic';?\n?/g;
    const matches = content.match(regex);
    if (matches && matches.length > 1) {
        content = content.replace(regex, '');
        content = "export const dynamic = 'force-dynamic';\n" + content;
        fs.writeFileSync(filePath, content);
        console.log('Fixed', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('route.ts')) {
            fixFile(fullPath);
        }
    }
}

walkDir('./src/app/api');
console.log('Done fixing duplicates');
