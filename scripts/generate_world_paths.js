const fs = require('fs');
const topojson = require('topojson-client');
const d3 = require('d3-geo');

const world = JSON.parse(fs.readFileSync('src/data/world-atlas.json', 'utf8'));
const countries = topojson.feature(world, world.objects.countries).features;

// Natural Earth projection or Mercator?
// Wine maps often look better with Natural Earth (Robinson-like)
const projection = d3.geoNaturalEarth1()
  .scale(150)
  .translate([450, 300]); // Center in a 900x600 coordinate space

const pathGenerator = d3.geoPath().projection(projection);

const optimizedPaths = countries.map(country => {
  const d = pathGenerator(country);
  if (!d) return null;

  return {
    id: country.id,
    name: country.properties.name,
    d: d
  };
}).filter(Boolean);

fs.writeFileSync('src/data/world-svg-paths.json', JSON.stringify(optimizedPaths));
console.log(`Generated ${optimizedPaths.length} country paths.`);
