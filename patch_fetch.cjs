const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf-8');

const injection = `
try {
  const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (desc && desc.get && !desc.set && desc.configurable) {
    Object.defineProperty(window, 'fetch', {
      get: desc.get,
      set: function(v) { console.warn("Ignored window.fetch assignment", v); },
      configurable: true,
      enumerable: desc.enumerable
    });
  }
} catch (e) {
  console.error("Failed to patch window.fetch", e);
}
`;

if (!content.includes('Ignored window.fetch assignment')) {
  content = content.replace("import App from './App.tsx';", injection + "\nimport App from './App.tsx';");
  fs.writeFileSync('src/main.tsx', content);
}
console.log('Success');
