# Backup

##  Grundlagen

Datensicherung ist nie überflüssig. Jede Computer-Festplatte wird irgendwann defekt sein. Leider weiss man nicht wann. Die Ausfallrate ist am Anfang relativ hoch (wegen Produktionsfehlern), sinkt dann auf sehr geringe Werte ab und steigt ab etwa dem dritten Jahr wieder an. Die Datenspeicherungs-Firma Backblaze gibt regelmässig Lebensdauerwerte ihrer derzeit rund 100000 Festplatten an: <https://www.backblaze.com/blog/2018-hard-drive-failure-rates/>. Die durchschnittliche jährliche Ausfallrate wird mit rund 1.7% errechnet, wobei die Firma ihre Platten jeweils nach etwa 4 Jahren austauscht. 

Bei SSDs gibt es naturgemäss noch weniger Daten, als bei magnetischen Festplatten, aber es ist bekannt, dass jede SSD-Speicherzelle nur eine limitierte Zahl von Schreibvorgängen aushält (die allerdings immerhin wesentlich grösser ist, als früher angenommen).

Wie auch immer: Das Prinzip Hoffnung ist verkehrt, wenn es um wichtige Daten geht. Und es nützt auch nicht viel, ein RAID statt einer einzelnen Platte zu verwenden. Einige Überlegungen dazu habe ich [hier](http://rgwch.github.io/2015/09/datensicherheit) zusammengefasst.

Bevor wir uns für ein Datensicherungskonzept entscheiden, brauchen wir einen Anforderungskatalog:

Das Backup-System muss folgende Eingenschaften haben:

* Vom Hauptsystem unabhängig - Wir müssen ja auf die Daten auch dann zugreifen können, wenn nicht nur die Platte, sondern der ganze Server ausfällt.

* Versioniert - Wir brauchen nicht nur den momentanen Stand, sondern auch einige ältere Versionen. Stellen Sie sich vor, ein Erpressungs-Trojaner oder ein Hardware-Defekt oder eine Fehlbedienung zerstört einen Teil Ihrer Daten, und Sie merken das erst nach dem Backup - Ein einzelnes Backup wäre dann auch gleich zerstört. Dann muss es die Möglichkeit geben, eine ältere Version einzuspielen.

* Verschlüsselt - In der Datensicherung sind exakt dieselben Daten, wie im Hauptsystem, und diese müssen genauso sicher gegen unerlaubten Zugriff gesichert sein.

* Automatisierbar - Wenn Sie dran denken müssen, ein Backup anzufertigen, dann werden Sie es manchmal vergessen. Und [Murphy's law](https://de.wikipedia.org/wiki/Murphy’s_Law) garantiert, dass der Server genau dann kaputt geht, wenn das letzte  Backup länger als zwei Wochen her ist.

* Wiederherstellbar - Das ist natürlich eine Binsenweisheit. Was nützt ein Backup, das nicht wiederhersgestellt werden kann? Leider ist es durchaus nicht selbstverständlich. Backups laufen ja, wie oben betont, idealerweise automatisch ab, zum Beispiel mit einem nächtlichen Hintergrund-Job. Je nachdem passiert dabei ein Fehler und niemand sieht die Fehlermeldung... Und wenn Sie an den Punkt Verschlüsselung denken: Sie müssen sicher sein, dass die Verschlüsselung auch wieder entschlüsselt werden kann. Dazu gehört, dass Sie ein Programm benötigen, das den angewendeten Algorithmus beherrscht, und Sie müssen sich auch nach 10 Jahren noch an das verwendete Passwort erinnern. Und last but not least müssen auch die verwendeten Speichermedien  mit dem Computer, den Sie in 10 Jahren benutzen werden, noch lesbar sein. Auch das ist nicht so selbstverständlich, wie man meinen könnte: Wenn Sie vor 20 Jahren Ihre Daten auf den damals weit verbreiteten Floppy Disks gespeichert haben, dann werden Sie heute echte Probleme haben, an diese Daten wieder heranzukommen. Und zwar sogar dann, wenn Sie auch ein Laufwerk für solche Floppy Disks aufbewahrt haben: Sie werden es an Ihren heutigen PC nicht anschliessen können. Und wenn Sie Ihre Datensicherung auf CDs oder DVDs speichern, dann ist die Gefahr nicht vernachlässigbar, dass diese wegen Alterung des Trägermaterials nach 10 Jahren nicht mehr vollständig lesbar sind. Dasselbe gilt für magnetische Platten, wo das entsprechender Altzerungsproblem "Bitfäule" genannt wird. Einzelne kaputte Bits sind bei normnalen Dateien nicht schlimm - Ein Text ist immer noch lesbar, wenn das eine oder andere X zu einem U wurde. Bei verschlüsselten Dateien aber ist alles verloren, wenn auch nur ein einziges Bit kippt. Denn dann "passt" der Schlüssel nicht mehr.

## Backup-Konzepte

### Plattenrotation

Eine tragbare Festplatte nimmt jeweils ein Backup auf und wird dann gegen eine andere identische Pkatte ausgetauscht. Wenn man beispielsweise fünf solcher Platten verwendet, kann man an jedem Arbeitstag eine andere einsetzen, und auf jeder vielleicht 10 Datensicherungs-Generationen speichern, die dann jeweils eine Woche auseinander liegen. Damit wird der Verlust jeder einzelnen Platte oder sogar mehrere Platten verschmerzbar. Idealerweise lagern Sie die Platten auch an verschiedenen Orten, so dass auch bei einem Einbruch oder Brand nicht alles verloren ist.

* Vorteil: Dadurch, dass Sie jede Platte immer wieder verwenden, ist sichergestellt, dass sie funktionieren. Trotzdem möchten Sie sie vielleicht nach etwa 5 Jahren auswechseln, wenn das Risiko eines Ausfalls grösser wird.

* Nachteil: Man muss doch wieder an etwas denken... Wenn man vergisst, die Platten auszutauschen, baut man ein "Klumpenrisiko" mit der gerade angeschlossenen Platte auf, und gemäss Murphy werden Sie erst merken, dass diese Platte kaputt ist, wenn auch Ihre Server-Festplatte aussteigt, und Sie ein möglichst aktuelles Backup benötigen.

### Fernbackup

Sie können Ihre Daten mit einem geeigneten Programm auf einen oder mehrere andere Computer sichern. Dies kann man genauso leicht automatisieren, wie die Sicherung auf eine externe Festplatte.

* Vorteil: Keine zusätzliche Hardware am Praxis-System, man muss nicht an Plattentausch etc. denken.

* Nachteil: Das Backup wird viel länger dauern, da das Netzwerk langsamer ist, als eine angeschlossene Fewstplatte. Weiterer Nachteil: Murphy wird dafür sorgen, dass der Internetzugang just dann schnarchlangsam oder ganz ausgefallen ist, wenn Sie Ihr Backup dringend zurückspielen wollen.

### Cloud-Backup

Statt auf einen eigenen Server können Sie die Daten auch in einer Cloud speichern. Das ist seitens des Backup-Systems kein Unterschied.

* Vorteil: Sie müssen sich nicht um Aufbau und Unterhalt des Backup-Servers kümmern. Die Cloud Anbieter garantieren eine sehr hohe Verfügbarkeit und Datensicherheit.

* Nachteile: Die Daten sind für den Cloud-Anbieter sichtbar. Sie müssen sie also unbediungt vor der Übertragung verschlüsseln. Ok, das müssen Sie eigentlich sowieso tun. Weiterer Nachteil: Sie sind darauf angewiesen, dass es den Cloud-Anbieter in 10 Jahren noch gibt, und dass Sie noch Zugang darauf haben. Und last but not least: Die Datensicherung wird hier etwas kosten. Allerdings meist wesentlich weniger, als ein eigener Server oder auch nur eine Backup-Festplatte kosten würde.

Selbstverständlich können Sie anstelle der Cloud eines professionellen Anbieters auch eine eigene Cloud aufbauen, damit wird die Cloud-Speicherung zu einer Variante des weiter oben erwähnten Fernbackup.

## Backup-Anwendungen

Für welches der oben genannten Backup-Konzepte Sie sich entscheiden, hängt zu sehr von Ihrem individuellen System ab, als dass man allgemeingültige Empfehlungen abgeben könnte.

Ich selbst bevorzuge ein dreistufiges Konzept:

* Stufe 1: Plattenrotation und Fernbackup. Ich wechsle zwischen Wechselplatten und der Speicherung auf externe Computer ab. Als Backup-Programm verwende ich [rsync](https://rsync.samba.org) und [restic](https://restic.net). Die Steuerung wird von einem Cron-Job erledigt, der nachts aktiv wird.

* Stufe 2: Cloud Backup. Aus praktischen Gründen verwende ich hier [Amazon S3](https://aws.amazon.com/de/s3/). Das ist ziemlich günstig (etwa 30 US-cent pro GB und Jahr) und kann von meinem ohnehin benutzen Backup-Tool restic direkt genutzt werden. Aber natürlih kann man ebenso gut andere Anbieter bevorzugen, etwa Google Cloud Storage, Microsoft Azure Storage oder andere.

* Stufe 3: "Cold Backup". Daten, die ich voraussichtlich länger nicht oder nie mehr brauche, kommen in den [Amazon Glacier](https://aws.amazon.com/de/glacier/?nc=sn&loc=0). Das ist noch billiger als S3 (weniger als 5 US-cent pro GB und Jahr), hat aber den Nachteil, dass das Zurückholen der Daten erstens einige Zeit dauern kann (Stunden bis Tage), und dass es etwas kostet, die Daten wieder zu holen (Derzeit je nach gewünschter Geschwindigkeit etwa 0.5-3 cent pro GB). Wenn man die Daten ausnahmsweise doch mal sehr schnell benötigt, muss man zusätzlich 100 Dollar für die Express-Bereitstellung bezahlen.

## Zusammenfassung

Der Aufbau eines Backup-Konzeptes liegt ausserhalb der Ziele von Elexis-OOB. Die Verwaltungsfunktion bietet Ihnen nur den Ausgangspunkt fürs Backup: sie stellt die Daten in einer Form bereit, in der Sie sie mit einer der hier erwähnten Techniken sichern können. Oder auch auf eine ganz andere Weise, dies sei Ihnen überlassen. Als Ausgangs- oder Anhaltspunkt zeige ich Ihnen hier einige Backup-Skripte für einen Linux-Server:

### Stufe 1 Backup

#### Datenbank sichern
````
#!/bin/bash

fdate=`date '+%Y-%m-%d-%H%M'`
filename='elexis_'$fdate'.sql'
log=/root/backup.log
dest=/media/extended/databackup

echo $filename > $log

mysqldump -h 192.168.0.1 --protocol=tcp -P 3312 -u backupuser -p$BACKUPPWD elexis --ignore-table=elexis.ch_elexis_omnivore_data>$filename

rc=$?; if [[ $rc != 0 ]]; then
	echo dump failed with error code $rc >>$log
	exit $rc
fi
echo mysqldump ended normally >>$log

mv $filename ${dest}/elexisDB/$filename
rc=$?; if [[ $rc != 0 ]]; then 
	echo copy $filename failed with code $rc >>$log
	exit $rc
fi
echo copy ended normally >>$log

chmod o-r,g-r ${dest}/elexisDB/$filename

echo mysql finished >>$log
echo `date` >>$log
/root/srvbackup >>$log
echo srvbackup finished >>$log
echo `date`>> $log

echo end $filename >>$log

echo backup berichte >>$log
restic backup -r /mnt/seagate4t/berichte/ -p ./resticpwd /srv/public/Berichte
rc=$?; if [[ $rc != 0 ]]; then
	echo restic failed with error code $rc >>$log
	exit $rc
fi
echo restic ended normally >>$log

echo backup pacs >>$log
/root/savepacs.sh >>$log
echo pacs resticed >>$log


```` 
#### Zahl der aufzubewahrenden Datenbank-Backups limitieren

````
#! /bin/bash

# Zahl der Backups zum aufbewahren
keepnum=10

# Backup-Verzeichnis
backupdir=dest=/media/extended/databackup/elexisDB

origdir=`pwd`
cd $backupdir

numsnaps=$(ls -r1 -d elexis_*|wc -l)
echo backups: $numsnaps >>$logfile
if [ $numsnaps -gt $keepnum ] ; then
        echo deleting >>$logfile
        ls -r1 -d elexis_*|tail -n1|xargs -d '\n' rm
else
        echo nothing to delete >>$logfile
fi


cd $origdir

````

#### Nicht-Datenbank Dateien sichern
````
#! /bin/bash

dest=/media/extended/databackup

rsync -a /root ${dest}/system
rsync -aH --exclude={".Private",".ecryptfs"} /home ${dest}/system
rsync -aH /boot ${dest}/system
rsync -aH /etc  ${dest}/system
rsync -a /srv/data ${dest}/pxserv/srv
rsync -a /srv/dockerfiles ${dest}/pxserv/srv
rsync -a /srv/repositories ${dest}/pxserv/srv
rsync -a /srv/public ${dest}/pxserv/srv
rsync -a /srv/lucinda ${dest}/pxserv/srv

mount -t cifs //192.168.17.121/backup -o credentials=/root/bcred,vers=1.0 /mnt/backup
rsync -a --exclude={"system/*","snapshots/*"} ${dest}/ /mnt/backup/usb4tback/
umount /mnt/backup
````

#### PACS sichern

````
#! /bin/bash

cd /srv/dockerfiles
docker-compose stop -t 60 pacs
restic backup -r /mnt/seagate4t/pacs-restic -p /root/resticpwd /srv/pacs
docker-compose start
````

### Stufe 2 Backup

````
export AWS_ACCESS_KEY_ID=$AMAZONKEYID
export AWS_SECRET_ACCESS_KEY=$AMAZONKEY
restic backup -r s3:s3.amazonaws.com/praxis /media/extended/databackup
````
