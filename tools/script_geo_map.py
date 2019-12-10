import requests
import pandas as pd
from itertools import islice
import json
LIMIT = 10

filename_complete = 'geo_map.json'
filename = 'garmin_geo_merged.csv'
#filename = 'geo_map.csv'

geo_map = {}

df = pd.read_csv(filename)
for row in df.iterrows():
    #print(row[0])
    lon = row[1][0]
    lat = row[1][1]
    name = row[1][2]
    idnum = row[1][3]
    typ = row[1][4]
    speed = row[1][5]
    country = row[1][6]
    state = row[1][7]
    city = row[1][8]
    
    if country != country:
        country = 'XX'

    if country in geo_map:
        geo_map[country] += 1
    else:
        geo_map[country] = 1
    #print(geo_map)

j = None
with open('countrymapping.json', 'r') as f:
    j = json.load(f)

top_json = []
def get_country_name(key_country):
    for country in j:
        if country['Code'].startswith(key_country):
            return country['Name']
    return 'Unknown'

for key, value in geo_map.items():
    country_json = {}
    country_json["key"] = key
    country_json["name"] = get_country_name(key)
    country_json["value"] = value
    #print(json.dumps(country_json))
    top_json.append(country_json)

print(top_json)

with open(filename_complete, 'w') as f:
        f.write(json.dumps(top_json))