const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf-8');

const injection1 = `try {
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
}`;

const injection2 = `try {
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
}`;

content = content.replace(injection1, '');
content = content.replace(injection2, '');

fs.writeFileSync('src/main.tsx', content);
console.log('Success');
