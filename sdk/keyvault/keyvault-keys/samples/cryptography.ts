import { CryptographyClient } from "../src/cryptographyClient";
import { KeysClient } from "../src";
import { EnvironmentCredential } from "@azure/identity";
import * as crypto from 'crypto';

async function main(): Promise<void> {
  // EnvironmentCredential expects the following three environment variables:
  // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
  // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
  // - AZURE_CLIENT_SECRET: The client secret for the registered application
  const credential = new EnvironmentCredential();

  const vaultName = process.env["KEYVAULT_NAME"] || "<keyvault-name>"
  const url = `https://${vaultName}.vault.azure.net`;

  // Connection to Azure Key Vault
  const client = new KeysClient(url, credential);

  let keyName = "localWorkKey";
  let ecKeyName = "localECWorkKey";

  // Connection to Azure Key Vault Cryptography functionality
  let myWorkKey = await client.createKey(keyName, "RSA");
  let myECKey = await client.createKey(ecKeyName, "EC");

  const remoteCryptoClient = new CryptographyClient(url, myWorkKey.keyMaterial!.kid!, credential);
  const localCryptoClient = new CryptographyClient(url, myWorkKey.keyMaterial!.kid!, credential);

  const remoteECCryptoClient = new CryptographyClient(url, myECKey.keyMaterial!.kid!, credential);
  const localECCryptoClient = new CryptographyClient(url, myECKey.keyMaterial!.kid!, credential);

  // Sign and Verify
  const signatureValue = "MySignature";
  let hash = crypto.createHash("sha256");

  hash.update(signatureValue);
  let digest = hash.digest();
  console.log("digest: ", digest);

  const signature = await remoteECCryptoClient.sign(digest, "ES256");
  console.log("sign result: ", signature);

  const verifyResult1 = await remoteECCryptoClient.verify(digest, signature, "ES256");
  console.log("remote verify result: ", verifyResult1);

  const verifyResult2 = await localECCryptoClient.verifyData(Buffer.from(signatureValue), signature, "ES256");
  console.log("local verify result: ", verifyResult2);

  // const signature = await remoteCryptoClient.sign(digest, "RS256");
  // console.log("sign result: ", signature);

  // const verifyResult1 = await remoteCryptoClient.verify(digest, signature, "RS256");
  // console.log("remote verify result: ", verifyResult1);

  // const verifyResult2 = await localCryptoClient.verifyData(Buffer.from(signatureValue), signature, "RS256");
  // console.log("local verify result: ", verifyResult2);

  // // Encrypt and decrypt
  // const encrypt = await localCryptoClient.encrypt(Buffer.from("My Message"), "RSA1_5");
  // console.log("encrypt result: ", encrypt);

  // const decrypt = await remoteCryptoClient.decrypt(encrypt, "RSA1_5");
  // console.log("decrypt: ", decrypt.toString());

  // const encrypt2 = await localCryptoClient.encrypt(Buffer.from("My Message"), "RSA-OAEP");
  // console.log("encrypt2 result: ", encrypt2);

  // const decrypt2 = await remoteCryptoClient.decrypt(encrypt2, "RSA-OAEP");
  // console.log("decrypt2: ", decrypt2.toString());

  await client.deleteKey(keyName);
  await client.deleteKey(ecKeyName);
}
main().catch((err) => {
  console.log("error code: ", err.code);
  console.log("error message: ", err.message);
  console.log("error stack: ", err.stack);
});
