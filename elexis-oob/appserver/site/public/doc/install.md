# Installation

Hinweis: Es sei an dieser Stelle ausdrücklich darauf hingewiesen, dass eine Arztpraxis-Software mit besonders schützenswerten Daten arbeitet. Die Einfachheit der Installation darf Sie nicht zu leichtfertigem Umgang mit diesen Daten verleiten. Sie dürfen dieses System mit echten Daten nur in einem abgesicherten Netzwerk benutzen. Wenn Sie nicht sicher sind, wie Sie Ihr Netzwerk absichern können, müssen Sie professionelle Unterstützung einkaufen. Im Zweifelsfall ist es sicherer, das Praxisnetzwerk völlig vom Internet zu isolieren. Es ist ausserdem sehr empfehlenswert, die produktive Version auf einer verschlüsselten Partition des Servers zu installieren. Beachten Sie auch die Empfehlungen des [EdöB](https://www.edoeb.admin.ch/edoeb/de/home/datenschutz/gesundheit/erlaeuterungen-zum-datenschutz-in-der-arztpraxis.html).

Falls Sie (erst mal) nur mit Testdaten arbeiten wollen, spricht aber nichts dagegen, ohne grosse Vorsichtsmassnahmen einfach loszulegen und das System nach Herzenslust auszuprobieren! Falls dabei etwas "kaputt" gehen sollte, können Sie erneut mit einem simplen docker-compose Befehl wieder alles auf Anfang setzen.


## Was Sie benötigen

* Einen Computer als Server, auf dem [git](https://git-scm.com), [Docker](http://docker.io) und [Docker-Compose](https://docs.docker.com/compose/) installiert sind. Dies ist idealerweise ein Linux- oder Mac-Computer. Windows (10 Professional, 10 Enterprise oder Server) ist zwar auch möglich, es wird aber eventuell nicht alles funktionieren. Die Verwendung mit Windows<10 und Windows 10 Home ist deutlich schwieriger und wird am Ende auch nicht korrekt funktionieren. Sie können sich für Testzwecke allerdings mit einer Linux-VM z.B. unter [VirtualBox](https://www.virtualbox.org) behelfen. Die darf dann durchaus auch auf einem "schwächeren" Windows installiert sein.

Wenn Sie offen und (noch) nicht festgelegt sind, empfehle ich einen Server mit Linux ohne GUI, z.B. [Ubuntu Server](https://www.ubuntu.com/download/server).

Die Hardware sollte zeitgemäss sein - ein Prozessor mit 4 oder mehr Kernen und mindestens 16GB Arbeitsspeicher sind empfehlenswert.

* Einen oder mehrere Arbeitsplatz-Computer (Clients), auf denen [Java](http://java.sun.com), Version 8 installiert ist. Hier sind Windows, macOS und Linux möglich. 

Wichtig: Elexis ist für Java 8 optimiert und funktioniert derzeit nicht mit den neueren Java-Versionen. 

## Wie Sie anfangen

Auf dem Server:

        git clone https://github.com/rgwch/elexis-oob
        cd elexis-oob
        docker-compose up -d

Dieser Vorgang wird beim ersten Mal sehr lange dauern (ca. 15-25 Minuten auf einem zeitgemässen Computer mit ADSL/LTE Internet). Weitere Starts gehen dann schnell (wenige Sekunden).

Um das ganze System zu stoppen, geben Sie ein: `docker-compose stop`. Um es dann wieder zu starten, genügt `docker-compose start`. Ein solcher Start dauert nur wenige Sekunden. Eine Regeneration der Container erreicht man mit `docker-compose up -d`. Auch das geht noch recht schnell. Normalerweise brauchen Sie sich aber gar nicht um solche Dinge zu kümmern: Wenn Sie den Server herunterfahren, wird Docker zuvor automatisch "sanft" gestoppt, und nach einem Neustart wird das Elexis-OOB-System ebenfalls automatisch neu gestartet. Wenn Sie die Log-Ausgabe sehen wollen, können Sie entweder das -d beim Startbefehl weglassen, oder wenn der Container läuft `docker logs elx_appserver` eingeben. 

Wenn Sie wirklich alles wieder löschen wollen (inklusive der verwendeten Elexis-Datenbank!), etwa um alles komplett neu zu installieren, dann geben Sie ein: `docker-compose down -v --rmi all`. Achtung: Dies wird ohne weitere Rückfrage wirklich sämtliche in Elexis-OOB erstellten und erfassten Daten löschen. Nichts wird sich wiederherstellen lassen. In einer echten Elexis-Umgebung sollte der Zugang zur Server Konsole daher auch nur wenigen Mitarbeitern offen stehen. 

Wenn Sie eine Testumgebung häufig löschen und neu aufsetzen wollen, geben Sie ein: `docker-compose down -v --rmi local`. Dies wird ebenfalls sämtliche zur Laufzeit erstellten Daten, Volumes und Container löschen, bewahrt aber heruntergeladene Images auf. So wird der nächste Aufbau nur wenige Minuten gehen.

Wenn Sie den Parameter -v weglassen, dann bleiben die "Volumes", also die Container mit den Daten, erhalten und nur die Programme werden entfernt bzw. neu erstellt. Selbstverständlich sollten Sie dennoch vor einem solchen Befehl ein Backup anfertigen!

Für die Erstkonfiguration lesen Sie bitte [hier](config.md) weiter.

