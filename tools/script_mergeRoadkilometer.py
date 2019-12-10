import requests
import pandas as pd
from itertools import islice
import json
LIMIT = 10

blitzerPerCountryList = None
with open('../data/blitzerPerCountry.json', 'r') as f:
    blitzerPerCountryList = json.load(f)

roadkilometer = pd.read_csv('./roadKilometerPerCountry.csv', 
                            index_col=None, header=0, encoding="ISO-8859-1")

def getRoadkilometerForCountry(isocodeCountry):
    for row in roadkilometer.iterrows():
        if row[1][0] == isocodeCountry:
            return row[1][1]
    return 99999999999

for country in blitzerPerCountryList:
    if country["key"] == "LA":
        country["name"] = "Laos"
    country["roadkilometer"] = getRoadkilometerForCountry(country["key"])

print(blitzerPerCountryList)
