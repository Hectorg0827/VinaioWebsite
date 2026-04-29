const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const UPDATES = [
  {
    slug: 'bermudez-bermudez-rum-aniversario-gran-reserva',
    description: "A complex, well-rounded premium Dominican aged rum. It pours a deep mahogany-brown. The nose is highly expressive with prominent notes of vanilla, caramel, toffee, and toasted oak, complemented by dried apricots, raisins, and a hint of leather. On the palate, it offers a smooth, velvety entry striking a perfect balance between sweetness and dryness. Flavors of butterscotch, praline, and dark chocolate are balanced by wood spice, cinnamon, and nutmeg. The finish is pleasantly dry with lingering notes of warm oak and tobacco. An exceptional digestif, best enjoyed neat or on the rocks."
  },
  {
    slug: 'bat-gara-urtaran-bat-gara-urtaran-2021',
    description: "A serious, gastronomic expression of Txakoli from the Basque Country, aged on its lees in neutral chestnut and acacia casks. It presents an elegant nose of hay, ripe stone fruits (pear and peach), and subtle gorse flower. The palate is full, balanced, and structured, maintaining the characteristic crisp acidity of Txakoli but with added richness and volume. Flavors of peach, pineapple, and honey are supported by a distinct mineral, saline backbone and creamy, nutty undertones from its aging process. It concludes with a long, dry, and fresh finish. An exceptional pairing for shellfish, white fish, and complex seafood dishes."
  }
];

async function updateDescriptions() {
  console.log("Updating sommelier descriptions...");
  for (const update of UPDATES) {
    const { data, error } = await supabase
      .from('products')
      .update({ description_en: update.description })
      .eq('slug', update.slug);
      
    if (error) {
      console.error(`Error updating ${update.slug}:`, error);
    } else {
      console.log(`Updated: ${update.slug}`);
    }
  }
}

updateDescriptions();
