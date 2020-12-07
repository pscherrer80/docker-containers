# Termindienst via Let's Encrypt-Zertifikat absichern

Wenn Sie Ihren Patienten anbieten wollen, selbständig Termine übers Internet zu reservieren, können Sie zum Beispiel den [Termin-Service von Webelexis](http://www.webelexis.ch/dox/selfschedule.html) verwenden, der in Elexis-OOB integriert ist. Dazu müssen Sie allerdings eine verschlüsselte und gesicherte Verbindung vom Internet zu Ihrem Elexis-OOB Server herstellen. Wie das geht, zeige ich in diesem Kapitel.

Im Kapitel über [TLS/SSL](tls.md) haben Sie gesehen, wie man selbstsignierte Zertifikate erstellt, um verschlüsselte Verbindungen aufzubauen. Sie haben auch gesehen, dass man dabei mit diversen Warnmeldungen der Browser fertig werden muss. Das kann man externen Besuchern natürlich nicht zumuten. Wenn wir einen Termindienst freigeben wollen, dann muss dieser mit einem einwandfreien vertrauenswürdigen Zertifikat abgesichert sein.

Solche Zertifikate kann man auf Jahresmietbasis erwerben, wenn Sie sich dafür interessieren, googlen Sie z.B. nach "buy ssl certificate". Oder sehen Sie bei [SwissSign](https://www.swisssign.com/ssl.html) nach.
Die Preise sind sehr unterschiedlich, und ich möchte hier auch nicht weiter darauf eingehen. Wenn Sie mit einem einfachen domänenvalidierten Zertifikat ("SSL Silver") zufrieden sind (und das dürfen Sie getrost, da die Sicherheit der Verschlüsselung wie schon mehrfach beschrieben, nicht vom Zertifikat abhängt), dann können Sie das seit einigen Jahren auch kostenlos haben, mit [Let's Encrypt](https://letsencrypt.org/).

Im Folgenden werde ich zeigen, wie man einen Terminvergabe-Dienst für Elexis erstellt und mit einem Let's Encrypt Zertifikat absichert.

Das ist leider nicht ganz trivial. Im Zweifelsfall sollten Sie externe Beratung beiziehen. Ich zeige hier das Prinzip:



## Schritt für Schritt


### 1: Domain einrichten

Damit Ihre Patienten den Terminservice finden, muss dieser unter einem im Internet bekannten Namen erreichbar sein. Dazu benötigen Sie (1) den Namen selbst (Einen sogenannten Domain-Namen, wie etwa 'meine-praxis.ch'), und (2) eine von aussen erreichbare IP-Adresse, die mit diesem Namen verknüpft wird.

Den Domain-Namen können Sie auf Jahresmietbasis bei einem Domain-Registrar erwerben. Für Domains, die auf .ch oder .li enden, gehen Sie am Besten zu einem der von Switch autorisierten [Registrare](https://www.nic.ch/de/registrars). Für andere Endungen versuchen Sie es z.B. mit `http://nic.<endung>`, also zum Beispiel <http://nic.info> für eine .info Endung. Da es jeden Namen weltweit nur einmal geben kann, ist es gut möglich, dass Ihre Wunschdomain nicht mehr zu haben ist (meine-praxis.ch werden Sie z.B. nicht mehr reservieren können). Probieren Sie dann, den Namen ein wenig zu variieren (dr-eisenbarts-praxis.ch) oder eine andere Endung zu wählen (obertupfiger-arztpraxis.info).

Im Folgenden gehe ich davon aus, dass Sie eine Domain namens **'meine-praxis.ch'** erworben haben, und dass der Termindienst über 'termine.meine-praxis.ch' erreichbar sein soll.


Der nächste Schritt hängt von Ihrer Internet-Anbindung ab, Wenn Sie eine fixe IP haben, können Sie diese IP meist direkt beim Registrar mit Ihrem Dienstnamen (subdomain bzw. CNAME Entry: termine.meine-praxis.ch) vernüpfen. (Prüfen Sie, ob das geht, bevor Sie die Domain bei diesem Registrar kaufen und wählen Sie sonst einen anderen)

Wenn Sie keine fixe IP haben, dann wird sich Ihre Internet-Adresse in mehr oder weniger regelmässigen Abständen ändern. Sie können dann keine feste Verknüpfung zwischen Domain-Namen und IP-Adresse einrichten, sondern benötigen einen "dynamic DNS" Dienst. Wenn Sie nach dyndns googlen, werden Sie fündig. Ein solcher Dienst verknüpft die jeweils gültige IP-Adresse dynamisch mit einem Domain-Namen. Damit er das tun kann, braucht er Informationen, wenn die IP-Adresse sich ändert. Manche Router haben eine Konfigurationsmöglichkeit für dyndns. Bei der Fritz!Box beispielsweise unter Internet/Freigaben/DynDNS. Am besten wählen Sie dann einen DynDNS Anbieter, den Ihr Router von sich aus unterstützt. Manche dynDNS Anbieter erlauben Ihnen auch, direkt einen Domainnamen zu reservieren, dann sparen Sie sich die Kosten des Domain-Registrars, aber meistens bekommen Sie dann nur eine Subdomain des Providers (meinepraxis.providername.com), was nicht unbedingt den besten Eindruck macht,

Falls Ihr Router kein DynDNS unterstützt, benötigen Sie auf Ihrem Server ein kleines Programm (einen dyndns-client), das die aktuelle IP-Adresse jeweils meldet. Ein Beispiel wäre: [ddclient](https://sourceforge.net/projects/ddclient/). 

Richten Sie den DynDNS Dienst so ein, dass er den Namen termine.meine-praxis.ch mit Ihrer IP verknüpft.

### 2. Server erreichbar machen

Wenn das alles korrekt eingerichtet ist (Geben Sie dem Internet etwa zehn Minuten Zeit, um Ihre eben eingetragene Domain auf der ganzen Welt bekannt zu machen), sollte Ihr Router aus dem Internet erreichbar sein.

Versuchen Sie es mit "ping termine.meine-praxis.ch". Es sollte dieselbe IP-Adresse herauskommen, wie wenn Sie zum Beispiel mit <https://www.whatismyip.com/> Ihre öffentliche Adresse nachsehen.

Allerdings "landet" die Anfrage nicht bei Elexis-OOB, sondern vorerst nur beim Router. Damit sie von dort weitergereicht wird, müssen Sie eine "Portweiterleitung" einrichten. Das ist in der Konfiguration des Routers oft unter "NAT" (Network Address Translation) zu finden, bei der Fritz!Box unter "Internet/Freigaben/Portfreigaben". Sorgen Sie dafür, dass zwei Freigaben eingerichtet werden: Eine für den https - Port 443 auf den Elexis-OOB Server und eine für den http-Port 80 auf Ihren Arbeitscomputer, der für die folgende Handlung im selben Netzwerk sein muss, wie der Server.

### 3. Let's Encrypt Zertifikat beziehen

Grundsätzlich gibt es zwei Möglichkeiten:

1. Man kann den in elexis-oob eingebauten reverse-proxy ([traefik](https://traefik.io/)) so konfigurieren, dass er automatisch Zertifikate bezieht und installiert. Er greift hierfür mit dem ACME-Protokoll (Automatic Certificate Management Environment) auf einen Let's Encrypt Server zu, beweist diesem auf eine von mehreren Möglichkeiten, dass er berechtigt ist, im Namen der zu sichernden Domain zu handeln, und erhält im Gegenzug ein Zertifikat, das von allen Browsern als vertrauenswürdig eingestuft wird. Diesen Vorgang wiederholt er alle drei Monate automatisch, da Let's Encrypt Zertifikate immer nur drei Monate lang gültig sind. Der Nachteil dieser Methode ist, dass man dauernd eine Portweiterleitung auf Port 80 offen halten muss (was eine an sich unnötige Angriffsfläche bietet).

2. Man kann manuell ein Let's Encrypt Zertifikat austellen lassen, und dieses in Elexis-OOB installieren. Ich werde mich im Folgenden auf diese Methode beschränken, da man hier kontrollieren kann, wann der HTTP-Port geöffnet wird, und weil man so auch besser versteht, was abläuft.

Um manuell an ein Let's Encrypt Zertifikat zu kommen, kann man z.B. den [let's encrypt certbot](https://certbot.eff.org/) installieren, der ein offizieller ACME Client für die Kommandozeile ist.

* Linux: sudo apt-get install certbot
* macOS: brew install certbot

Oder siehe die Website des Certbot.

#### 3a. Schlüsselpaar erstellen und Zertifikat beziehen

* Schalten Sie die Firewall an Ihrem Arbeitscomputer temporär aus. Stoppen Sie einen allfälligen Webserver, wenn vorhanden (Port 80 muss frei sein).

* Starten Sie: `sudo certbot certonly` une beantworten Sie die Fragen. Die Frage nach der Methode beantworten Sie mit "Spin up temporary webserver", die nach der Domain beantworten Sie in unserem Beispiel mit: termine.meine-praxis.ch. 
Wenn alles klappt, endet certbot mit "Congratulations!" und einem Text in dem erklärt wird, wo die Zertifikate sind.

* Kopieren Sie Zertifikat und Schlüssel an einen zugänglicheren Ort und geben Sie ihnen den richtigen Namen:

```bash
sudo cp /etc/letsencrypt/archive/termine.meine-praxis.ch/fullchain1.pem termine.meine-praxis.ch.crt

sudo cp /etc/letsencrypt/archive/termine.meine-praxis.ch/privkey1.pem termine.meine-praxis.ch.key

sudo chmod +r termine.meine-praxis.ch.key
```

Danach können Sie am Router die Portweiterleitung auf Port 80 Ihres Arbeitscomputers abschalten, und an Ihrem Arbeitscomputer die Firewall wieder aktivieren.

Hinter den Kulissen ist folgendes passiert: Let's Encrypt hat den Certbot aufgefordert, eine bestimmte Zufalls-Datei unter http://termine.meine-praxis.ch zugänglich zu machen, und danach geprüft, ob diese Datei von dort wirklich heruntergeladen werden kann. Wenn ja, hat Certbot den Beweis erbracht, dass er die zu sichernde Domain kontrollieren kann, was ihn zu einem "Silber"-Zertifikat berechtigt. Das funktioniert nur, wenn certbot eine offene Leitung und einen freien Port 80 verwenden kann, daher mussten Sie temporär die Portweiterleitung einrichten und die Firewall ausschalten.

#### 3b. Zertifikat und Schlüssel zu Elexis-OOB hochladen

Gehen Sie zu http://nuno:3000 und wählen Sie rechts unten unter Verwaltung: "Schlüsselpaar installieren". Wählen Sie als Zertifikat termine.meine-praxis.ch.crt und als Privaten Schlüssel termine.meine-praxis.ch.key und klicken sie 'Hochladen'

### 4. Schlüssel beim Proxy bekannt machen und fertigstellen

Nun müssen Sie die Datei traefik.toml im Wurzelverzeichnis von Elexis-OOB manuell editieren: Am Ende finden sie folgende Zeilen:

```toml
# Traefik will automagically create a self-signed certificate here
# or uncomment the following lines for named individual certificates 
# [[entryPoints.https.tls.certificates]]
# certFile="/mnt/termine.meine-praxis.ch.crt"
# keyFile="/mnt/termine.meine-praxis.ch.key"
```
Ändern sie die letzten drei Zeilen:

```toml
# Traefik will automagically create a self-signed certificate here
# or uncomment the following lines for named individual certificates 
    [[entryPoints.https.tls.certificates]]
    certFile="/mnt/termine.meine-praxis.ch.crt"
    keyFile="/mnt/termine.meine-praxis.ch.key"

```
(Natürlich müssen die certFile und keyFile Zeilen den richtigen Dateinamen, den Sie vorhin beim erstellen Des Zertifikats gewählt haben, enthalten. Der Pfadname /mnt/ muss aber genau so bleiben.)

Starten Sie Elexis-OOB neu: 

```
docker-compose stop
docker-compose up -d
```

Jetzt sollten Sie Ihren Termin-Service von überallher auch mit mobilen Geräten über "https://termine.meine-praxis.ch" erreichen können, und der Browser sollte keine Warnung ausgeben.

Wenn Sie sich intern verbinden, z.B. mit `https://webelexis.nuno`, dann wird Traefik ebenfalls das Let's Encrypt Zertifikat vorweisen. Der Browser wird aber dennoch eine Warnung auswerfen, weil dieses Zertifikat nur für termine.meine-praxis.ch gilt und nicht für webelexis.nuno.

Von aussen wird ausser dem Terminservice nichts erreichbar sein. Versuchen Sie: https://webelexis.meine-praxis.ch; das wird nicht gehen. Ebensowenig http(s)://meine-praxis.ch. Wir haben eine Freigabe eingerichtet,die ausschliesslich für den vom restlichen System sauber abgeschotteten Termine-Dienst gilt.

Wie Sie für sich selber und ausgewählte Mitarbeiter/innen der Praxis auch Webelexis oder Elexis von Aussen erreichbar machen können, lesen Sie an [anderer Stelle](mobile.md)
