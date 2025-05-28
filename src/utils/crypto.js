// utils/crypto.js
import forge from "node-forge";

// Encripta el mensaje usando la clave pública del destinatario
export function encryptMessage(message, publicKey) {
  const key = forge.pki.publicKeyFromPem(publicKey);
  const encryptedMessage = key.encrypt(message, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: forge.mgf1.create(forge.md.sha256.create())
  });
  return forge.util.encode64(encryptedMessage);
}
