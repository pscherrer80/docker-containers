const forge = require('node-forge')


const createSelfSignedKeyCert = attrs => {
    var pki = forge.pki;

    // generate a keypair and create an X.509v3 certificate
    var keys = pki.rsa.generateKeyPair(2048);
    var cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    var attrs = [{
        name: 'commonName',
        value: (attrs.cn || "example.com")
    }, {
        name: 'countryName',
        value: (attrs.c || "CH")
    }, {
        shortName: 'ST',
        value: (attrs.st || "Zürich")
    }, {
        name: 'localityName',
        value: (attrs.l || "Elexikon")
    }, {
        name: 'organizationName',
        value: (attrs.o || "Elexis")
    }, {
        shortName: 'OU',
        value: (attrs.ou || "OOB")
    }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([{
        name: 'basicConstraints',
        cA: true
    }, {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
    }, {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true
    }, {
        name: 'nsCertType',
        client: true,
        server: true,
        email: true,
        objsign: true,
        sslCA: true,
        emailCA: true,
        objCA: true
    }, {
        name: 'subjectAltName',
        altNames: [{
            type: 6, // URI
            value: (attrs.cn || "example.org") 
        }, {
            type: 7, // IP
            ip: (attrs.ip || '127.0.0.1')
        }]
    }, {
        name: 'subjectKeyIdentifier'
    }]);
    // self-sign certificate
    cert.sign(keys.privateKey);

    // convert a Forge certificate to PEM
    var pem = pki.certificateToPem(cert);
    const pk=pki.privateKeyToPem(keys.privateKey)

    return {privateKey: pk, certificate: pem}
}

module.exports=createSelfSignedKeyCert
