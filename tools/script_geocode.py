import requests
import pandas as pd
from itertools import islice
LIMIT = 10

filename = 'garmin_blitzer.csv'
filename_complete = 'garmin_geo.csv'
offset = 29001

dff = pd.DataFrame([], columns = ['Longitude', 'Latitude', 'Name', 'ID', 'Type', 'Speed', 'Country', 'State', 'City']) 

df = pd.read_csv(filename, skiprows=offset)
for row in df.iterrows():
    print(row[0])
    lon = row[1][0]
    lat = row[1][1]
    name = row[1][2]
    idnum = row[1][3]
    typ = row[1][4]
    speed = row[1][5]
    #addr = "https://geocode.xyz/" + str(lat) + "," + str(lon) + "?json=1&auth457029223302844513150x4024" throttled requests
    addr = "http://www.mapquestapi.com/geocoding/v1/reverse?key=CHDXpCgUYtcAz0LzAIvuMAZOoFyjGPqn&location=" + str(lat) + "," + str(lon) + "&includeRoadMetadata=false&includeNearestIntersection=false"
    print(addr)
    resp = requests.get(addr)
    json = resp.json()
    #print(json)
    result = json['results'][0]
    location = result['locations'][0]
    if 'adminArea1' in location: #country
        country = location['adminArea1']
    else:
        country = 'Unknow'
    if 'adminArea3' in location: #state
        state = location['adminArea3']
    else:
        state = 'Unknow'
    if 'adminArea5' in location: #city
        city = location['adminArea5']
    else:
        city = 'Unknow'
    s = pd.Series([lon, lat, name, idnum, typ, speed, country, state, city], index=['Longitude', 'Latitude', 'Name', 'ID', 'Type', 'Speed', 'Country', 'State', 'City'])
    print(s)
    dff = dff.append(s, ignore_index=True)
    if ((row[0] % 500) == 0):
        dff.to_csv(filename_complete + str(row[0] + offset), sep=',', index=False)


dff.to_csv(filename_complete, sep=',', index=False)

""" resp = requests.get("https://geocode.xyz/51.4647,0.0079?json=1&auth457029223302844513150x4024 ")
json = resp.json()
print(json['state'])
print(json['city']) """