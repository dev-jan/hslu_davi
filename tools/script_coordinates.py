# Folder garmin_speed
# Columns:
# Latitude | Longtitude | Name | ID | + Speed from Filename

# Folder garmin_type !!! Unused
# Columns :
# Latitude | Longtitude | Name | ID | + Type

# Final file: garmin_blitzer
# Columns:
# Latitude | Longtitude | Name | ID | Speed | Type

import pandas as pd
import glob

file_name_complete = 'garmin_coordinates.csv'
path = r'./garmin_speed' # use your path
all_files = glob.glob(path + "/*.csv")

print(all_files)

li = []

for filename in all_files:
    print("!!!Reading File : " + filename)
    df = pd.read_csv(filename, index_col=None, header=0, encoding = "ISO-8859-1", names=["Longitude", "Latitude", "Name", "ID"])
    print('Length : ' + str(len(filename.split('_'))))
    if len(filename.split('_')) == 3:
        speed = 0
        typ = filename.split('_')[2].split('.')[0]
    else:
        typ = filename.split('_')[2]
        speed = filename.split('_')[3].split('.')[0]

    print('Typ : ' + typ)
    print('Speed : ' + str(speed))
    df["Type"] = typ
    #df[len(df.columns)] = typ
    df["Speed"] = speed
    #df[len(df.columns)] = speed
    print(df)
    li.append(df[["Longitude", "Latitude"]])

#print(li)
frame = pd.concat(li, ignore_index=True)
print(frame)
frame.to_csv(file_name_complete, sep=',', index=False)

""" path = r'./garmin_type'
all_files = glob.glob(path + "/*.csv")

print (all_files)

li = []

for filename in all_files:
    print("!!!Reading file : " + filename)
    df = pd.read_csv(filename, index_col=None, header=0, encoding = "ISO-8859-1")
    li.append(df)

frame = pd.concat(li, axis=0, ignore_index=True)
frame.to_csv(file_name_complete, sep=',') """


