import Cryptr from "cryptr"

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

export const encryptData = (text) => {
    const encrypted = cryptr.encrypt(text);
    console.log("Encrypted Data: ", encrypted)
    return encrypted;
}

export const decryptData = (encryptedData) => {
    const decrypted = cryptr.decrypt(encryptedData);
    console.log("Decrypted Data: ", decrypted);
    return decrypted;
}