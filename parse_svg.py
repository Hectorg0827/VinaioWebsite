import xml.etree.ElementTree as ET
import json

tree = ET.parse('map.svg')
root = tree.getroot()
paths = []

namespaces = {'svg': 'http://www.w3.org/2000/svg'}

# Many paths are inside a <g class="state">
# Some might be stand alone
for path in root.findall('.//{http://www.w3.org/2000/svg}path'):
    cls = path.attrib.get('class', '')
    d = path.attrib.get('d', '')
    title_el = path.find('{http://www.w3.org/2000/svg}title')
    title = title_el.text if title_el is not None else cls.upper()
    id_code = path.attrib.get('id', cls)

    # Clean classes, skip separators
    if 'separator1' in cls: continue
    
    if len(id_code) == 2:
        paths.append({
            'id': id_code.upper(),
            'name': title,
            'd': d
        })

with open('src/data/us-paths.json', 'w') as f:
    json.dump(paths, f, indent=2)

print("Parsed", len(paths), "paths")
