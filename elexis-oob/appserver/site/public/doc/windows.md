# Elexis-OOB unter Windows

Der Elexis OOB-Server fühlt sich am Wohlsten auf einem Linux-Computer. Die Clients dürfen selbstverständlich gerne auch Windows-Maschinen sein (und sind es ja in der Realität meist auch).

<!-- 
## Beste Option: WSL

Wenn Sie ein einigermassen aktuelles Windows 10 haben (Version 1803 oder neuer), dann sind Sie fein raus: Mit dem [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) können Sie Linux-Programme unter Windows 10 laufen lassen. Das geht mit (fast) allen Editionen von Windows 10, nur die Version S bleibt aussen vor. 

* Windows-Taste drücken, Powershell tippen, mit der rechten Maustaste auf den PowerShell-Eintrag klicken und "Als Administrator ausführen".

* In der Powershell eingeben: `Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
`
* Nach dem Neustart das hier herunterladen: <https://aka.ms/wsl-ubuntu-1804> und es nach dem Laden mit Doppelklick starten. Es wird einige Zeit dauern, und dann zur Eingabe eines Usernames und eines Passworts auffordern.

* Fertig! Sie haben ein Ubuntu 18.04, welches auf von Microsoft(tm) zertifizierte Weise unter Windows 10 läuft. Allerdings noch nicht auf dem aktuellesten Stand.

* Geben Sie im Ubuntu fenster ein: `sudo apt-get update && sudo apt-get upgrade` um das eben installierte Linux auf die neueste Version zu bringen. Auch das wird eine ganze Weile dauern.

*  Geben Sie ein: `sudo apt-get install -y docker docker-compose`

Der Rest geht wie unter Linux:

    git clone https://github.com/rgwch/elexis-oob
    cd elexis-oob
    docker-compose -up -d
   

## Andere Möglichkeiten
-->
Wenn man aber wirklich ein Linux-Verächter ist, kann man den OOB Server auch auf einem Windows-PC zum Laufen bringen. Ich zeige hier kurz das Vorgehen unter Windows-7:

**Systemvoraussetzung: 64-Bit-Version, mindestens 8GB RAM**

* Python 3.6 installieren von <https://www.python.org/ftp/python/3.6.8/python-3.6.8-amd64.exe> Alle Voreinstellungen verwenden und "include python in PATH" ankreuzen.
* Docker Toolbox installieren von <https://docs.docker.com/toolbox/overview/> (*Nicht* den neueren "Docker Desktop for Windows" holen, der benötigt mindestens Windows 10 Professional) Alle Voreinstellungen belassen.
* Computer neu starten.
* Das Docker Quickstart Terminal öffnen (Das wird einige Zeit dauern)
* Dort eingeben: 

```
git clone https://github.com/rgwch/elexis-oob
cd elexis-oob
docker-compose up -d
```

Der Build-Vorgang dauerte bei mir  deutlich länger, als auf den Linux- und Mac-Computern (rund 40 Minuten), was aber auch daran liegen kann, dass der Windows-Computer, den ich für dieses Experiment ausgrub, schon etliche Jahre auf dem Buckel hat.

Wie auch immer: Am Ende lief Elexis-OOB und konnte auch aus dem Netzwerk erreicht werden (Allerdings muss man die Adresse des OOB Hosts mit `docker-machine ip default` herausfinden). Und es läuft alles sehr viel langsamer und hakeliger, als unter Linux oder macOS. Wirklich empfehlen kann ich es nicht.

Auf einem Computer mit Windows 10 Professional oder Enterprise müsste Docker besser laufen, ich kann  das aber nicht prüfen, weil ich kein solches System habe. Für Rückmeldungen wäre ich dankbar.
