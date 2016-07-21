TVHeadend for Synology latest stable version<br>
<br>
Additional files:<br>
ffmpeg and ffpipe.sh to get IPTV-Channels with X-Forward working<br>
XMLTV-package to grab additional epgdata<br>
.configuration within dockerfile is needed<br>
<br>
Configuration tv_grab_eu_epgdata:<br>
docker exec -it <container_name> bash<br>
<br><br>
change to user hts:<br>
chsh -s /bin/bash hts<br>
su hts <br>

tv_grab_eu_epgdata --configure<br>
.follow instructions<br>
