import csv
import sqlite3

# this was downloaded from https://simplemaps.com/data/world-cities it has around 48k entries which is suitable for this project
source_file = "worldcities.csv"
target_file = "../app/src/assets/cities.db"

conn = sqlite3.connect(target_file)
cursor = conn.cursor()

# Delete the table if it exists to avoid conflicts during creation
cursor.execute('DROP TABLE IF EXISTS cities')

cursor.execute('''
CREATE TABLE cities (
    id INTEGER PRIMARY KEY,
    city_name TEXT NOT NULL,
    country TEXT NOT NULL,
    country_code TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    population INTEGER NOT NULL,
    is_capital INTEGER NOT NULL DEFAULT 0
)
''')

insert_query = '''
INSERT INTO cities (city_name, country, country_code, latitude, longitude, population, is_capital)
VALUES (?, ?, ?, ?, ?, ?, ?)
'''

data_to_insert = []

with open(source_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        id = row['id']
        city_name = row['city']
        country = row['country']
        country_code = row['iso2']
        latitude = float(row['lat'])
        longitude = float(row['lng'])
        # some entries have decimal values for some reason so can't directly convert to int
        population = int(float(row['population'])) if row['population'] else 0
        is_capital = 1 if row['capital'].lower() == 'primary' else 0
        data_to_insert.append((city_name, country, country_code, latitude, longitude, population, is_capital))

cursor.executemany(insert_query, data_to_insert)

conn.commit()
conn.close()

print(f"Inserted {len(data_to_insert)} cities into the database.")
