const fs = require('fs');
let code = fs.readFileSync('src/pages/Quiz.tsx', 'utf-8');

// Add import
if (!code.includes('import { motion, AnimatePresence } from \'motion/react\';')) {
  code = code.replace(
    "import { getVocabulariesByCategory, allVocabularies, formatCategoryName } from '../data';",
    "import { getVocabulariesByCategory, allVocabularies, formatCategoryName } from '../data';\nimport { motion, AnimatePresence } from 'motion/react';"
  );
}

// Wrap question area in AnimatePresence and motion.div
if (code.includes('<div className="text-center mb-12 flex-1 flex flex-col justify-center mt-12">')) {
  // First, find the return statement of the Quiz component's main view
  code = code.replace(
    /<div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex-1 flex flex-col items-center justify-center relative">\s*<div className="text-center mb-12 flex-1 flex flex-col justify-center mt-12">\s*<p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-4">\s*\{promptText\}\s*<\/p>\s*<h2 className="text-5xl md:text-6xl font-black mb-4 text-slate-800 leading-tight">\s*<span className="underline decoration-4 underline-offset-8 decoration-indigo-200">\{questionText\}<\/span>\s*<\/h2>\s*<\/div>\s*<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-auto">/g,
    `<div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentVocab.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex-1 flex flex-col items-center justify-center"
          >
            <div className="text-center mb-12 flex-1 flex flex-col justify-center mt-12">
              <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-4">
                {promptText}
              </p>
              <h2 className="text-5xl md:text-6xl font-black mb-4 text-slate-800 leading-tight">
                <span className="underline decoration-4 underline-offset-8 decoration-indigo-200">{questionText}</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-auto">`
  );
  
  // Close the tags
  code = code.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/,
    `            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}`
  );
}

fs.writeFileSync('src/pages/Quiz.tsx', code);
console.log("Updated Quiz.tsx");
