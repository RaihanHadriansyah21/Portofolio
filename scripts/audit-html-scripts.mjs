import fs from 'fs';
import path from 'path';

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(findHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const allHtml = findHtmlFiles('.next/server/app');
console.log('Total prerendered HTML files found:', allHtml.length);

const targetPages = ['en.html', 'id.html', 'about', 'credentials', 'scovis'];

for (const htmlPath of allHtml) {
  const isTarget = targetPages.some(t => htmlPath.includes(t));
  if (!isTarget) continue;

  const html = fs.readFileSync(htmlPath, 'utf8');
  const scripts = [...html.matchAll(/src="\/_next\/static\/chunks\/([^"]+)"/g)].map(m => m[1]);
  const css = [...html.matchAll(/href="\/_next\/static\/chunks\/([^"]+\.css)"/g)].map(m => m[1]);
  
  console.log(`\n=== Page: ${htmlPath.replace('.next/server/app', '')} ===`);
  console.log('CSS:', css);
  console.log('Scripts count:', scripts.length);
  console.log('Scripts:', scripts);
  
  // Check if Rapier/Three.js chunks are referenced
  const hasThree = scripts.some(s => s.includes('055eyqii2mj2b') || s.includes('1e1_o5os5'));
  console.log('Includes Three/Rapier chunks?', hasThree);
}
