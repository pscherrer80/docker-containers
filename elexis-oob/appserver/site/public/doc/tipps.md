# Einige Tipps

## Dcoker-Compose Kommandos

### Neustart

    docker-compose restart

### Programme löschen, Daten behalten, z.B. Update 

    docker-compose down --rmi local
    git pull
    docker-compose up --build -d

### Programme und alle Container löschen, Daten behalten

    docker-compose down --rmi all

### Programme und Daten komplett löschen       

    docker-compose down -v --rmi all
    
**Achtung:** Dies löscht WIRKLICH und ohne jede Rückfrage alle Daten! Nach einem erneuten `docker-compose up -d` ist Ihre Elexis-Datenbank wieder wie neu. **Machen Sie vor solchen Aktionen IMMER ein Backup**.

## Login in den dockerisierten MariaDB-Server

    docker exec -it elx_elexisdb /bin/sh
    mysql --protocol tcp -u username -ppassword 
    use elexisoob

## Existierende Elexis-Datenbank in OOB einlesen

```bash
# existierende Datenbank in dumpfile sichern
mysqldump -h localhost -u elexisuser -pelexispwd elexis>elexis-dump.sql
# Neue Datenbank einrichten und starten
docker-compose up -d
# Zunächst mit localhost:3000 die Datenbank initialisieren, dann hier weiter:
docker-compose restart
docker cp elexis-dump.sql elx_elexisdb:/opt/
docker exec -it elx_elexisdb /bin/bash
mysql -u root -pelexisadmin
use elexisoob;
source /opt/elexis-dump.sql
exit
rm /opt/elexis-dump.sql
exit
```   

Wenn Sie danach mit http://nuno:3000 auf die Verwaltungsoberfläche zugreifen, müssen Sie einen Elexis-User mit Administratorrechten der existierenden Datenbank zum Einloggen verwenden. Selbstverständlich sollten Sie jetzt nicht mehr die Datenbank initialisieren oder Basis-Datenbestände einlesen. Richten Sie möglichst bald ein funktionierendes Backup-Konzept ein, resp. passen Sie Ihr existierendes BAckup-Konzept an die neue Datenbank an!

## Vorgaben ändern; erweiterte Konfiguration

Ports und Namen sind in .env definiert und werden von dort im docker-compose.yaml eingelesen. Die .env Datei ist unter Linux und Mac unsichtbar, wird also nur angezeigt, wenn Sie explizit versteckte Dateien anzeigen lassen. z.B. mit `ls -la` oder durch die entsprechende Einstellung im Dateimanager.

## Individuelle docker-compose

Manchmal möchten Sie die docker-compose.yaml anpassen. Im Allgemeinen ist es besser, sich zuerst zu überlegen, wie man mit den Vorgaben zurecht kommen kann, aber manchmal muss es eben sein... Sobald man Änderungen an docker-compose.yaml macht, steht man aber vor einem Problem: Jedesmal, wenn man ein Update von elexis-oob einspielt, werden die Änderungen überschrieben. Ich würde daher etwas anderes tun. Kopieren Sie die docker-compose.yaml nach z.b. meine-praxis.yaml. Dann können Sie die Software mit `docker-compose up -d -f meine-praxis.yaml` starten, und bei einem Update mit `git pull` bleibt Ihre Konfiguration erhalten.

## Lucinda auf eigenes Dokument- und Basisverzeichnis richten

Standardmässig richtet elexis-oob das Dokumentenmanagement-System so ein, dass sowohl Dokumente, als auch Index in speziellen "Volumes" namens lucindadata und lucindabase abgelegt wereden. Daran ist an sich nichts falsch, aber manchmal möchte man zumindest die Dokumente lieber in einem Verzeichnis, auf das man auch mit anderen Programmen zugreifen kann, zum Beispiel um Dokumente vom Scanner direkt dort hin zu schicken. Das geht so:

* erstellen Sie ein Unterverzeichnis in Ihrem elexis-oob Verzeichnis, zum Beispiel namens "local". 
* Kopieren Sie die Datei .env in dieses Verzeichnis
* Ändern Sie den Eintrag `LUCINDA_DOCS=lucindadata` so, dass er auf das gewünschte Verzeichnis zeigt. Hier muss der volle absolute Pfad angegeben werden, also etwa `LUCINDA_DOCS=/srv/praxis/berichte`.
* Starten Sie elexis-oob von diesem Verzeichznis aus: `docker-compose up -d`. Docker wird dann die docker-compose.yaml im übergeordneten Verzeichnis finden, aber die .env Datei des aktuellen Verzeichnisses verwenden.

## SSH Schlüsselpaar erstellen

Das geht über die Appserver-Oberfläche mit dem Menüpunkt Verwaltung->Selbstsigniertes Zertifikat erstellen. Dies wird ein selbstsigniertes Zertifikat unter dem Namen 'name-der-website.crt' und einen privaten Schlüssel mit dem Namen 'name-der-website.key' im Wurzelverzeichnis des Volume 'webelexisdata' erstellen.

Wenn Sie mehr Kontrolle über den Prozess benötigen, können Sie das openssl-Programm verwenden:
`openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes` erstellt einen Schlüssel und ein selbstsigniertes Zertifikat dazu.

## Minio auf Raspberry Pi

Wenn man sich für ein Storage-Konzept wie Amazon S3 interessiert, aber nicht Amazon Kunde werden will, ist [Minio](https://minio.io) eine Option. Man kann sich seine eigenen Amazon S3 Cloud bauen, indem man beispielsweise einen Raspberry Pi mit einer grossen USB-Festplatte versieht und dort Minio installiert. Hier die dazu nötigen Schritte:

* [Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/) herunterladen und auf eine Mikro-SD-Karte brennen, zum Beispiel mit [Etcher](https://www.balena.io/etcher/). Eine 16GB MicroSD genügt völlig.

* Noch auf dem Arbeitskomputer ins Verzeichnis /boot der SD-Karte gehen und dort 'touch ssh' eingeben

* Die MikroSD-Karte in den Raspberry Pi einlegen, starten, und sich dann mit `ssh raspberry` oder `ssh raspberrypi.local` und dem Passwort 'raspberry' einloggen.

* mit `sudo raspi-config` ins Konfiguationsprogramm gehen. Dort ein anderes Passwort, einen anderen Hostnamen (ich wähle 'miniopi') wählen, den SSH Server aktivieren, die Locale-Einstellungen auf de_CH UTF8 und die Zeitzone korrekt einstellen. Falls das WLAN-Modul gebraucht wird, auch die WLAN-Landeinstellungen und Zugangsdaten korrekt eingeben.

* Neu starten und sich dann mit `ssh pi@miniopi` oder `ssh pi@miniopi.local`und dem vorhin vergebenen Passwort anmelden.

* `sudo apt-get install git`

* Go herunterladen von: <https://dl.google.com/go/go1.12.1.linux-armv6l.tar.gz> und mit `tar -xzf go1.12.1.linux-armv6l.tar.gz` entpacken. Das so entstandene Verzeichnis go nach /usr/local verschieben und den PATH mit /usr/local/go/bin ergänzen. Bitte nicht versuchen, go mit `apt-get golang`zu installieren, dann bekommt man eine hoffnungslos veraltete Version. Für Minio ist mindestens 1.11 nötig.

* `go get -u github.com/minio/minio`. Dies wird eine ganze Weile dauern. Danach befindet sich das Minio Binary in go/bin/minio

* Externe Festplatte an einen USB-Port des Pi anschliessen (Nur begrenzte Leistungsaufnahme möglich; ggf. an Stromversorgung angeschlossenen USB-Hub dazwischen hängen, oder eine Platte mit eigener Stromversorgung verwenden). Die Platte mit fdisk partitionieren und mit `sudo mkfs -t ext4 /dev/sda1`  formatieren, dann mit `sudo mount /dev/sda1 /mnt`einhängen und mit `sudo chown -R pi.pi /mnt` für Minio beschreibbar machebn.

* `export MINIO_ACCESS_KEY=irgendwas && export MINIO_SECRET_KEY=geheimerschluessel && go/bin/minio server /mnt` startet den Server. Man kann die Verwaltungsoberfläche mit dem Browser auf <http://miniopi:9000> erreichen und auf derselben Adresse auch Amazon S3 Datenspeicherungs-APIs verwenden.

Die Leistung eines Raspberry 3B reicht gut für einen Minio-Server, sofern nicht mehr als zwei oder drei Clients gleichzeitig darauf zugreifen. Er ist im LAN immer noch schneller, als ein "echter" Amazon S3, weil der Datentransport natürlich wesentlich schneller ist.

## Datensicherung mit Restic

[Restic](https://restic.net) ist ein Datensicherungs-Tool, das verschlüsselte versionierte und verifizierbare Backups erstellen kann, und zwar auf eine Vielzahl von Zielen, unter Anderem auch Amazon S3 und somit auch Minio.

Man muss Restic auf dem Computer installieren, von dem aus man das Backup starten bzw. zurückspielen will. Bevor man sichern kann, muss man ein Repository initialiseren:

```bash
export AWS_ACCESS_KEY=irgendwas
export AWS_SECRET_KEY=geheimerschluessel
restic init -r s3:http://miniopi:9000/repositoryname
```

Danach startet man ein Backup mit `restic backup -r s3:http://miniopi:9000/repositoryname /zu/sicherndes/verzeichnis`

Das erste Backup wird lang dauern, bei späteren Backups werden dann nur noch die Differenzen gesichert.

Integritätscheck erfolgt mit `restic check -r s3:http://miniopi:9000/repositoryname`, eine Liste aller snapshots bekommt man mit `restic snapshots -r s3:http://miniopi:9000/repositoryname` und zurückspielen kann man mit `restic restore latest -r s3:http://miniopi:9000/repositoryname --target /hierhin/kopieren`

Mit `restic mount /irgend/ein/mountpoint -r s3:http://miniopi:9000/repositoryname` kann man ein Backup Repository als Verzeichnis irgendwo einbinden und darin suchen, Dateien herauskopieren usw (aber nichts verändern).

Weiteres auf der ausführlichen Website von Restic.
