import forge from 'node-forge';
import fs from 'fs';

const credentialsFile = __dirname + "/../credentials/data.json";

export default function getCertificateCredentials() {
    if (fs.existsSync(credentialsFile)) {
        return JSON.parse(fs.readFileSync(credentialsFile).toString());
    } else {
        console.log("Missing credentials at: " + credentialsFile + " generating new self signed certificate");
        const data = generateCertificateCredentials();
        fs.writeFileSync(credentialsFile, JSON.stringify(data, null, 4));
        return data;
    }
}

function generateCertificateCredentials() {
    const altNames = [
        { type: 2, value: 'localhost' },
        { type: 7, ip: '127.0.0.1' }
    ]
    const issuer = [
        { name: 'commonName', value: 'example.com' }, // Not used
        { name: 'organizationName', value: 'Philip Nicholls Test Cert' },
        { name: 'organizationalUnitName', value: 'MS Amlin Code Task' }
    ]
    const certificateExtensions = [
        { name: 'basicConstraints', cA: true },
        { name: 'keyUsage', keyCertSign: true, digitalSignature: true, nonRepudiation: true, keyEncipherment: true, dataEncipherment: true },
        { name: 'extKeyUsage', serverAuth: true, clientAuth: true, codeSigning: true, emailProtection: true, timeStamping: true },
        { name: 'nsCertType', client: true, server: true, email: true, objsign: true, sslCA: true, emailCA: true, objCA: true },
        { name: 'subjectAltName', altNames },
        { name: 'subjectKeyIdentifier' }
    ]
    const keys = forge.pki.rsa.generateKeyPair(2048)
    const cert = forge.pki.createCertificate()
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)
    cert.publicKey = keys.publicKey
    cert.setSubject(issuer)
    cert.setIssuer(issuer)
    cert.setExtensions(certificateExtensions)
    cert.sign(keys.privateKey)
    return {
        key: forge.pki.privateKeyToPem(keys.privateKey),
        cert: forge.pki.certificateToPem(cert)
    }
}