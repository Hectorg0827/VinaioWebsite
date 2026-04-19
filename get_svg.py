import json
import urllib.request

url = "https://raw.githubusercontent.com/joshuaellinger/react-usa-map/master/src/data/usa-states-dimensions.json"
try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read())
        print(f"Downloaded {len(data)} US states")
        # Save to a local json file just for the component to import
        with open("src/data/us-states.json", "w") as f:
            json.dump(data, f)
except Exception as e:
    print("Error:", e)

