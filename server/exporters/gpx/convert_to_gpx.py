import json
import sys
import datetime
data = json.load(sys.stdin)


print('<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.0">\n	<name>Example gpx</name>\n	<trk><name>Example gpx</name><number>1</number><trkseg>\n')
for timeline_object in data['timelineObjects']:
    location = timeline_object['placeVisit']['location']
    latitudeE7 = int(location['latitudeE7'])
    longitudeE7 = int(location['longitudeE7'])
    if latitudeE7 > 900000000:
        latitudeE7 = latitudeE7 - 4294967296 //DAN where does this 4294967296 come from, and looks like longitude number should be different
    if longitudeE7 > 1800000000:
        longitudeE7 = longitudeE7 - 4294967296
    latitude = latitudeE7 / 1E7
    longitude = longitudeE7 / 1E7
    name = location['name'].replace('\n','')
    start_time = datetime.datetime.fromtimestamp(int(timeline_object['placeVisit']['duration']['startTimestampMs'])/1000)
    end_time = datetime.datetime.fromtimestamp(int(timeline_object['placeVisit']['duration']['endTimestampMs'])/1000)
    print('  <trkpt lat="%f" lon="%f"><time>%s</time><name>%s</name></trkpt>' % (latitude, longitude, start_time.isoformat(), name))
    print('  <trkpt lat="%f" lon="%f"><time>%s</time><name>%s</name></trkpt>' % (latitude, longitude, end_time.isoformat(), name))
print('	</trkseg></trk>\n</gpx>')
