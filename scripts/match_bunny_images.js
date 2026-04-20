const fs = require('fs');

const BOTTLE_CDN = "https://vinaio-bottles.b-cdn.net";

// Load data
const bunnyFiles = JSON.parse(fs.readFileSync('/tmp/bunny-files.json', 'utf8'));
const products = JSON.parse(fs.readFileSync('/tmp/supabase-products.json', 'utf8'));

function normalize(str) {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, "");    // Remove special chars
}

const matches = [];
const unmatched = [];

products.forEach(p => {
  const normName = normalize(p.name);
  const normBrand = normalize(p.brand);
  const combined = normBrand + normName;
  
  let bestMatch = null;
  let highestScore = 0;

  bunnyFiles.forEach(file => {
    const filename = file.ObjectName;
    const normFile = normalize(filename);
    
    let score = 0;
    
    // 1. Exact combined match (Brand+Name)
    if (normFile.includes(combined)) score += 10;
    
    // 2. Contains both brand and name separately
    if (normBrand && normFile.includes(normBrand)) score += 5;
    if (normName && normFile.includes(normName)) score += 5;
    
    // 3. Numeric prefix match (if product_code matches)
    if (p.product_code && filename.startsWith(p.product_code)) score += 20;

    // 4. Boost for common extensions
    if (filename.toLowerCase().endsWith('.png') || filename.toLowerCase().endsWith('.webp')) score += 1;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = filename;
    }
  });

  if (bestMatch && highestScore >= 5) {
    matches.push({
      id: p.id,
      name: p.name,
      brand: p.brand,
      old_url: p.image_url,
      new_url: `${BOTTLE_CDN}/${encodeURIComponent(bestMatch)}`,
      filename: bestMatch,
      score: highestScore
    });
  } else {
    unmatched.push({ id: p.id, name: p.name, brand: p.brand });
  }
});

const report = {
  summary: {
    total_products: products.length,
    total_bunny_files: bunnyFiles.length,
    matched: matches.length,
    unmatched: unmatched.length,
    match_rate: ((matches.length / products.length) * 100).toFixed(2) + "%"
  },
  top_matches: matches.slice(0, 10),
  unmatched_samples: unmatched.slice(0, 10)
};

fs.writeFileSync('/tmp/match-report.json', JSON.stringify(report, null, 2));
fs.writeFileSync('/tmp/matching-data.json', JSON.stringify(matches, null, 2));

console.log(`Matching Complete!`);
console.log(`Matched: ${matches.length}/${products.length}`);
console.log(`Report written to /tmp/match-report.json`);
