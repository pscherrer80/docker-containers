# Elexis - Out Of The Box

Dieses docker-compose Projekt erstellt eine vollständige Elexis-Arbeitsumgebung aus:

* Appserver: Eine Website, die folgende Dienste anbietet:
  
  * Download von Elexis Installationen für alle unterstützten Betriebssysteme via http oder über 
  Samba-Share.

  * Update Site zur Nachinstallation von Plugins.

  * Backup Service zur regelmässigen Datensicherung.

  * Zugriff via Samba auf die Dokumentenverzeichnisse von Lucinda.

* Elexisdb: Elexis Datenbank, einfache Basiskonfiguration

* Webelexis: Webapp-Zugriff auf die Elexis-Datenbank.

* Lucinda: Dokumentenmanager mit ausgefeilter Suchfunktion.

* PACS (Picture Archiving and Communication System): Ein Verwaltungssystem für z.B. DICOM-Dateien (Röntgenbilder etc.)

## Voraussetzungen

Als Vorbedingung benötigen Sie nur Git, Docker und Docker-Compose auf dem Server, sowie Java JRE 8 auf den Clients. 

## Installation und start

Auf dem Server:

      git clone https://github.com/rgwch/elexis-oob
      cd elexis-oob
      sudo docker-compose up -d

Der Vorgang wird beim ersten Mal 20 Minuten oder länger dauern und viel Netz-Bandbreite brauchen (Da ein Maven-Build involviert ist, muss das halbe Internet heruntergeladen werden). Wenn Docker-Compose fertig ist, richten Sie von einem im selben Netzwerk befindlichen Client-Computer aus einen Browser auf <http://IhrServer:3000>. Dort finden Sie dann auch eine detaillierte Anleitung (<http://IhrServer:3000/doc>, wobei Sie für IhrServer entweder die IP Adresse oder den symbolischen Netzwerknamen einsetzen.

(Eine Online-Kopie der Dokumentation ist [hier](https://elexis.ch/oob/doc/#!index.md))
