const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');
const script = `
    <script>
      try {
        const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
        if (desc && desc.get && !desc.set && desc.configurable) {
          Object.defineProperty(window, 'fetch', {
            get: desc.get,
            set: function(v) { console.warn("Ignored window.fetch assignment"); },
            configurable: true,
            enumerable: desc.enumerable
          });
        }
      } catch(e) {}
    </script>
    <script type="module" src="/src/main.tsx"></script>`;
html = html.replace('<script type="module" src="/src/main.tsx"></script>', script);
fs.writeFileSync('index.html', html);
console.log('Fixed index.html');
