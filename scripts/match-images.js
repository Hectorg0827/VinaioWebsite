const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('/tmp/input_catalog.json', 'utf8'));
const bottleFiles = JSON.parse(fs.readFileSync('/tmp/bunny-files.json', 'utf8'));
const logoFiles = JSON.parse(fs.readFileSync('/tmp/bunny-logos.json', 'utf8'));

const CDN_BOTTLES = "https://vinaio-bottles.b-cdn.net";
const CDN_VINIAO_BODEGA_LOGOS = "https://vinaioimports.b-cdn.net";
const CDN_VINAIO_COMPANY_LOGOS = "https://vinaioimports.b-cdn.net";

function normalizeString(str) {
  if (!str) return "";
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

// 1. Process Logo Mapping
function findLogo(brand, producer) {
  const targets = [brand, producer].filter(Boolean).map(normalizeString);
  for (const t of targets) {
    for (const lf of logoFiles) {
      if (normalizeString(lf.path).includes(t)) {
        return (lf.zone === 'viniao-bodega-logos' ? CDN_VINIAO_BODEGA_LOGOS : CDN_VINAIO_COMPANY_LOGOS) + "/" + lf.path;
      }
    }
  }
  return "";
}

// 2. Process Bottle Mapping
const mapped = catalog.map(p => {
  const normBrand = normalizeString(p.brand);
  const normProducer = normalizeString(p.producer);
  
  // Find subfolder
  const brandFolderFiles = bottleFiles.filter(bf => {
    const parts = bf.split('/');
    if (parts.length < 2) return false;
    const folder = normalizeString(parts[1]);
    return folder.includes(normBrand) || folder.includes(normProducer) || normBrand.includes(folder) || (normProducer && normProducer.includes(folder));
  });

  let imageUrl = "";

  if (brandFolderFiles.length > 0) {
    if (brandFolderFiles.length === 1) {
      // Only one image in this brand's folder
      imageUrl = CDN_BOTTLES + "/" + encodeURI(brandFolderFiles[0]);
    } else {
      // Multiple images, try to match by name or type
      const searchTerms = [normalizeString(p.name), normalizeString(p.type)];
      let bestMatch = null;
      let highestScore = 0;

      for (const file of brandFolderFiles) {
        const normFile = normalizeString(file);
        let score = 0;
        
        // Very basic scoring: if name is in filename, +2. if type is in filename, +1.
        if (searchTerms[0] && normFile.includes(searchTerms[0])) score += 2;
        if (searchTerms[1] && normFile.includes(searchTerms[1])) score += 1;
        
        // Exact keyword matches for common types
        if (normFile.includes('rosado') && normalizeString(p.type).includes('rose')) score += 3;
        if (normFile.includes('blanco') && normalizeString(p.type).includes('white')) score += 3;
        if (normFile.includes('tinto') && normalizeString(p.type).includes('red')) score += 3;
        
        if (score > highestScore) {
          highestScore = score;
          bestMatch = file;
        }
      }

      if (bestMatch && highestScore > 0) {
        imageUrl = CDN_BOTTLES + "/" + encodeURI(bestMatch);
      } else {
        // Fallback: just pick the first one if we can't decide, or pick one that doesn't have specific types
        imageUrl = CDN_BOTTLES + "/" + encodeURI(brandFolderFiles[0]);
      }
    }
  } else {
    // If we couldn't find a folder, try all files by name/brand
    for (const file of bottleFiles) {
       const normFile = normalizeString(file);
       if (normFile.includes(normalizeString(p.name)) && normFile.includes(normalizeString(p.brand))) {
         imageUrl = CDN_BOTTLES + "/" + encodeURI(file);
         break;
       }
    }
  }

  return {
    ...p,
    logo_url: findLogo(p.brand, p.producer),
    image_url: imageUrl
  };
});

fs.writeFileSync('/tmp/final_catalog.json', JSON.stringify(mapped, null, 2));
console.log("Written to /tmp/final_catalog.json");
