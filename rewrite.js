const fs = require('fs');
const file = 'src/app/(owner)/owner/dashboard/page.tsx';
let data = fs.readFileSync(file, 'utf8');

// replace rounded-xl and rounded-2xl with rounded-lg
data = data.replace(/rounded-2xl/g, 'rounded-xl');
data = data.replace(/rounded-xl/g, 'rounded-lg');

// StatCard tweaks
data = data.replace(
  /<div className={\g-white rounded-lg border border-gray-100 border-t-\[3px\] \\\ p-5 flex flex-col gap-1\.5 shadow-sm hover:shadow-md transition-shadow\}>/g,
  \<div className={\\\g-white rounded-lg border border-gray-100 p-4 flex flex-col gap-1.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden\\\}>\\n      <div className={\\\bsolute top-0 left-0 w-full h-[3px] \\\\\\} />\
);

data = data.replace(/w-9 h-9 rounded-lg flex/g, 'w-8 h-8 rounded-md flex');
data = data.replace(/text-3xl font-black/g, 'text-2xl font-bold');

// Header tweaks
data = data.replace(/px-5 py-4/g, 'px-4 py-3');
data = data.replace(/w-12 h-12/g, 'w-10 h-10');
data = data.replace(/sizes="48px"/g, 'sizes="40px"');
data = data.replace(/w-6 h-6/g, 'w-5 h-5');
data = data.replace(/text-xl font-bold/g, 'text-lg font-bold');
data = data.replace(/px-4 py-2 bg-gray-900/g, 'px-3 py-1.5 bg-gray-900 text-sm');

// Overall wrapper adjustments
data = data.replace(/max-w-\[1400px\] mx-auto space-y-5/g, 'max-w-[1400px] mx-auto space-y-4');
data = data.replace(/gap-4/g, 'gap-3 lg:gap-4');
data = data.replace(/p-5/g, 'p-4');
data = data.replace(/px-5 py-3\.5/g, 'px-4 py-3');
data = data.replace(/px-5 py-3/g, 'px-4 py-2.5');
data = data.replace(/px-5 py-2/g, 'px-4 py-2');

// List item tweaks
data = data.replace(/w-8 h-8 rounded-full/g, 'w-7 h-7 rounded-full');
data = data.replace(/w-7 h-7 rounded-lg/g, 'w-6 h-6 rounded-md');
data = data.replace(/sizes="28px"/g, 'sizes="24px"');
data = data.replace(/w-7 h-7 rounded-full/g, 'w-6 h-6 rounded-full text-[10px]');
data = data.replace(/w-8 h-8 rounded-lg/g, 'w-7 h-7 rounded-md');

// Icons stroke width (adding strokeWidth={1.5})
const lucideIcons = ['Store', 'Star', 'MessageSquare', 'UtensilsCrossed', 'Trophy', 'ArrowRight', 'Crown', 'Medal', 'Award', 'CheckCircle2', 'XCircle', 'ChevronRight', 'Flame', 'TrendingUp'];

lucideIcons.forEach(icon => {
  const regex = new RegExp('<' + icon + ' className="([^"]+)" \\/>', 'g');
  data = data.replace(regex, '<' + icon + ' strokeWidth={1.5} className="\" />');
});

fs.writeFileSync(file, data);
console.log('UI Updated');
