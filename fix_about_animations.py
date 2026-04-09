import sys
import re

with open('src/app/about/page.js', 'r') as f:
    content = f.read()

# 1. Update Stats stagger
content = content.replace('delay={i * 0.1}', 'delay={i * 0.3}')

# 2. Update Leadership stagger (already delay={i * 0.05} in some places or different)
content = content.replace('delay={i * 0.05}', 'delay={i * 0.2}')

# 3. Individualize Sales Team Reveal
# Find the wrapping Reveal around Sales
sales_block_pattern = r'<Reveal>\s+<div style=\{\{\s+background: T\.metal,.*?{/\* If we have dynamic sales members.*?}\s+</div>\s+</div>\s+</Reveal>'
# This is tricky because the Reveal is outside the container.
# Moving the Reveal inside the map for badges.

# 3a. Remove the big Reveal around the sales container
content = content.replace('<Reveal>\n            <div style={{', '<div style={{')
content = content.replace('</Reveal>\n        </div>\n      </section>', '</div>\n      </section>')

# 3b. Wrap each badge in a Reveal
# Find the badge return
badge_start = r'return \(\s+<div key=\{name\} style=\{\{'
badge_end = r'\}\s+>\s+<div style=\{\{ '
# Re-writing the sales map
content = re.sub(r'\{(useFallback \? FALLBACK_SALES : team\.sales\)\.map\(\(m, i\) => {', 
                r'{(useFallback ? FALLBACK_SALES : team.sales).map((m, i) => {', content) # Ensure i is there

content = re.sub(r'return \(\s+<div key=\{name\} style=\{\{', 
                r'return (\n                    <Reveal key={name} delay={i * 0.1}>\n                    <div style={{', content)

# Close the reveal
content = content.replace('</span>\n                    </div>\n                  );', '</span>\n                    </div>\n                    </Reveal>\n                  );')

# 4. Individualize Advisors
# Remove the big Reveal around advisors
content = content.replace('<Reveal delay={0.2}>\n            <div style={{ background: T.paper, padding: "48px", borderTop: `4px solid ${T.gold}`, height: "100%" }}>', 
                         '<div style={{ background: T.paper, padding: "48px", borderTop: `4px solid ${T.gold}`, height: "100%" }}>')
# Wrap each advisor in a Reveal
content = re.sub(r'\{\(useFallback \? FALLBACK_ADVISORS : team\.advisor\)\.map\(\(a, i\) => \(', 
                r'{(useFallback ? FALLBACK_ADVISORS : team.advisor).map((a, i) => (\n                  <Reveal key={a.name} delay={i * 0.15}>', content)

# I need to ensure the map has 'i' index. 
# Looking at line 363 in About page: `(useFallback ? FALLBACK_ADVISORS : team.advisor).map((a) => (`
content = content.replace('(useFallback ? FALLBACK_ADVISORS : team.advisor).map((a) => (', 
                         '(useFallback ? FALLBACK_ADVISORS : team.advisor).map((a, i) => (')

# Close the advisor reveal
content = content.replace('</div>\n                  </div>\n                \)\)\}', '</div>\n                  </div>\n                  </Reveal>\n                ))}')

with open('src/app/about/page.js', 'w') as f:
    f.write(content)
