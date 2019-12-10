import pandas as pd
import json

filenameData = '../data/roadKilometerPerCountry.csv'
filenameMapping = './countrymapping.json'

def get_country_isocode(countryname):
    for country in countryCodeMapping:
        if country['Name'].startswith(countryname):
            return country['Code']
    return 'XX'

# read the data file
df = pd.read_csv(filenameData, index_col=None, header=1, encoding="ISO-8859-1")

# load the country code mapping file
countryCodeMapping = None
with open(filenameMapping, 'r') as f:
    countryCodeMapping = json.load(f)

numberOfNotMappedCountries = 0
for row in df.iterrows():
    name = str(row[1][1])
    value = row[1][2]
    countryIsoCode = get_country_isocode(name)
    if countryIsoCode == 'XX':
        numberOfNotMappedCountries += 1
        countryIsoCode = name
    print(countryIsoCode + "," + str(value))

print("Not mapped countries: " + str(numberOfNotMappedCountries))