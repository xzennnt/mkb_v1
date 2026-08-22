const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf-8');

const injection = `
try {
  const gDesc = Object.getOwnPropertyDescriptor(globalThis, 'fetch');
  if (gDesc && gDesc.get && !gDesc.set && gDesc.configurable) {
    Object.defineProperty(globalThis, 'fetch', {
      get: gDesc.get,
      set: function(v) { console.warn("Ignored globalThis.fetch assignment", v); },
      configurable: true,
      enumerable: gDesc.enumerable
    });
  }
} catch (e) {
  console.error("Failed to patch globalThis.fetch", e);
}
`;

if (!content.includes('Ignored globalThis.fetch assignment')) {
  content = content.replace("import App from './App.tsx';", injection + "\nimport App from './App.tsx';");
  fs.writeFileSync('src/main.tsx', content);
}
console.log('Success 2');
