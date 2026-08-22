const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

// Change default state of MNN1
code = code.replace("const [showMnn1, setShowMnn1] = useState(false);", "const [showMnn1, setShowMnn1] = useState(true);");
code = code.replace("const [showMnn2, setShowMnn2] = useState(true);", "const [showMnn2, setShowMnn2] = useState(false);");

// Rearrange Kana grid 
// We want all 4 (Hiragana, Katakana, Hiragana Lanjutan, Katakana Lanjutan) in one grid
const searchGridStr = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">`;

const replaceGridStr = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">`;

if (code.includes(searchGridStr)) {
  code = code.replace(searchGridStr, replaceGridStr);
}

const searchMidStr = `                  </div>
                                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">`;

const replaceMidStr = `                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">`;

if (code.includes(searchMidStr)) {
  code = code.replace(searchMidStr, replaceMidStr);
}

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log("Patched successfully");
