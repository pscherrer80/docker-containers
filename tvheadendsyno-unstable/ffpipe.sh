#!/bin/bash

name=$1
url=`echo $2 | cut -d '|' -f1`
forward=`echo $2 | cut -d '|' -f2`
forward=${forward/=/:}

/usr/bin/ffmpeg -loglevel fatal -headers $forward$'\r\n' -i $url -vcodec copy -acodec copy -metadata service_provider=IPTV -metadata service_name=$name -f mpegts pipe:1
