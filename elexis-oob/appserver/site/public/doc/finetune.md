# Feinabstimmung


In diesem Kapitel geht es darum, verschiedene Zugriffsmöglichkeiten auf Ihre Dienste vom LAN und auch von ausserhalb zu diskutieren. Notgedrungen wird dieses Kapitel ein wenig technisch werden. Wenn das nicht so Ihr Ding ist, ist das auch nicht so schlimm, und Sie brauchen dieses Kapitel gar nicht zu lesen: Elexis-OBB funktioniert ja auch ohne dies, und den Feinschliff können Sie wenn gewünscht auch später noch von externen Fachleuten besorgen lassen.

Standardmässig laufen in Elexis-OOB alle Dienste auf dem selben Server. Dieser kann aus dem LAN/WLAN entweder über seine IP-Adresse (z.B. 192.168.0.17) oder seinen Netzwerk-Namen erreicht werden. Den Namen haben Sie in der Regel beim Einrichten des Computers vergeben. Sie können ihn auch nachträglich noch ändern, aber das geht bei jedem System anders und würde hier zu weit führen. Dieser Servername braucht nicht geheim gehalten zu werden; er ist kein Sicherheitsfeature, ebensowenig wie seine interne IP-Adresse. (Die externe Adresse werden wir später etwas differenzierter betrachten).

Viele Leute nennen ihre Server nach epischen Figuren ("Gandalf") oder ganz pragmatisch ("server1"), oder auch nach einer hervorstechenden Eigenschaft ("droehner"). Für die folgenden Überlegungen nehmen wir mal an, dass Ihr Server den Netzwerknamen "nuno" habe (was eine Verkürzung von "Numero Uno" ist, und gehaltvoller klingt als "none", die Verkürzung von "Number One". Aber das tut hier eh nichts zur Sache, Sie können Ihre Computer ja nennen, wie Sie wollen, sollten dafür aber keine Sonderzeichen und keine Umlaute verwenden). Wir wollen ausserdem annehmen, dass Ihr Terminvergabedienst aus dem Internet unter der URL `https://termine.meine-praxis.ch` erreichbar sein soll.


## Service Namen

Wenn Sie der Einrichtungsanleitung für Elexis-OOB gefolgt sind, dann können Sie die Elexis-Dienste jetzt über Adressen wie `http://nuno:3000` für den appserver oder `http://nuno:2019` für Webelexis erreichen. Das ist ein wenig unhandlich und schwer zu merken. Man kann sich natürlich behelfen, indem man Lesezeichen für jeden Dienst mit passendem Namen anlegt. Oder man nützt den in Elexis-OOB eingebauten Reverse-Proxy:

Dazu müssen Sie allerdings (ein wenig) in die Konfiguration von Elexis-OOB und Ihres Netzwerks eingreifen: In der Datei '.env' im Basisverzeichnis von Elexis-OOB (Diese Datei sehen Sie in macOS und Linux möglicherweise erst, wenn Sie die Anzeige verborgener Dateien zulassen), stehen ziemlich am Anfang folgende Zeilen:

```yaml
LOCAL_NAME=localhost
EXTERNAL_NAME=localhost
```

Ändern Sie diese Zeilen so:

````yaml
LOCAL_NAME=nuno
EXTERNAL_NAME=meine-praxis.ch
````

Speichern Sie die Datei und erstellen Sie Elexis-OOB neu:

```bash
docker-compose stop 
docker-compose up -d
```


Jetzt sind Ihre Dienste prinzipiell auch als `http://appserver.nuno`, `http://lucinda.nuno`, `http://webelexis.nuno`, `http://pacs.nuno` erreichbar. Allerdings geht das nicht, wenn nuno 'localhost' ist, und es geht erstmal auch nicht, wenn der Server ein anderer Computer ist. Der Reverse-Proxy kann die Kontrolle nämlich logischerweise erst übernehmen, wenn die Anfrage bereits bis zu ihm gekommen ist. Aber wie kommt diese Anfrage von Ihrem Client zum Server? Über irgendeine Form der Namensauflösung. Das kann DNS sein (universell) oder SMB (windows-kompatibel) oder Zeroconf/Bonjour (Apple und Linux-kompatibel).

Diese Namensauflösung weiss, wenn Ihr Netzwerk richtig konfiguriert ist, wie Ihr Server heisst. Geben Sie in einer Shell `ping nuno` ein, dann sollte eine Antwort vom Server zurückkommen. Allerdings wird `ping appserver.nuno` nicht funktionieren. Für die Namensauflösung sind `appserver.nuno`, `webelexis.nuno` und `nuno` drei verschiedene Server mit potentiell drei verschiedenen Adressen.

Wie man es anstellt, solche subdomain-Namen im Netzwerk bekannt zu machen, ist sehr system- und routerspezifisch und würde den Rahmen dieses Artikels sprengen.

Eine einfachere Möglichkeit ist die Anpassung der '/etc/hosts' Datei in Linux und macOS bzw. der der 'C:\Windows\System32\drivers\etc\hosts' Datei in Windows, und zwar auf jedem Client, der mit dem Elexis-OOB Server kommunizieren soll.

Angenommen, die IP-Adresse von nuno sei 192.168.0.14. Fügen Sie dann in /etc/hosts folgende Zeile ein:

192.168.0.14 nuno lucinda.nuno appserver.nuno termine.nuno webelexis.nuno pacs.nuno

(Alles in einer Zeile)

Jetzt können Sie von diesem Client aus `http://webelexis.nuno` usw. eingeben. Der Reverse-Proxy von Elexis-OOB sorgt dafür, dass dieser Aufruf intern in `http://nuno:2019` umgewandelt wird (und diese ursprüngliche Art des Zugriffs funktioniert auch weiterhin).

## Verschlüsselte Verbindungen

Standardmässig ist die Verbindung zwischen den einzelnen Services und die Verbindung zwischen den Elexis Clients und der Datenbank unverschlüsselt. An sich ist das nicht unbedingt ein Problem, wenn die Kommunikation ausschliesslich in einem privaten und abgesicherten Netzwerk stattfindet: LAN Kabel sind bauartbedingt kaum abzuhören und richtig konfiguriertes WLAN ist per se bereits sicher verschlüsselt. 

Falls Sie das aus grundsätzlichen Erwägungen stört, oder wenn das LAN nicht vollständig unter Ihrer Kontrolle ist (z.B. weil es der Vermieter betreibt), oder falls Sie ein WLAN mit Gast-Zugang betreiben (wovon ich in einer Arztpraxis dringend abraten würde), dann sollten sie die ganze Kommunikation verschlüsseln.

Dafür hat sich im Internet bereits 1995 ein Protokoll namens SSL (Secure Socker Layer) etabliert, das ab 1999 allmählich von TLS (Transport Layer Security) abgelöst wurde. Trotzdem sprechen viele noch von SSL, was auch nicht weiter schlimm ist, denn das Konzept der Protokolle ist dasselbe, nur die technische Implementation ist ein wenig unterschiedlich.

Die gute Nachricht ist: Das geht ganz einfach, sofern Sie Ihre Dienste wie oben gezeigt unter den Servicenamen erreichbar gemacht haben. Geben sie einfach  `https://webelexis.nuno` etc. ein (anstatt `http://...`), und schon ist die Verbindung verschlüsselt.

Die schlechte Nachchricht ist, dass Ihr Browser Sie vermutlich mit beängstigenden Warnungen vor dem Besuch dieser möglicherweise betrügerischen Seite abhalten will, und Ihnen erst nach mehrfachem Bestätigen, dass Sie wissen, was Sie tun, Zugriff gewähren wird.

Um zu verstehen, was das bedeutet, und was Sie damit anfangen können, empfehle ich Ihnen, die Seite über [ssl/tls](tls.md) zu lesen.

