import type { EncryptedVault, WalletAccount } from '@/types/wallet';

const PBKDF2_ITERATIONS = 210_000;

const str2ab = (str: string) => new TextEncoder().encode(str).buffer;

const hex2ab = (hex: string) =>
  new Uint8Array(hex.match(/../g)!.map((b) => parseInt(b, 16)));

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer =>
  new Uint8Array(bytes).buffer;

const ab2hex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');


const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    str2ab(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};


export const encryptMnemonic = async (
  mnemonic: string,
  password: string,
  accounts: WalletAccount[]
): Promise<EncryptedVault> => {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    str2ab(mnemonic)
  );

  return {
    ciphertext: ab2hex(ciphertext),
    salt: ab2hex(salt.buffer),
    iv: ab2hex(iv.buffer),
    accounts,
    activeAccountIndex: 0,
    createdAt: Date.now(),
  };
};


export const decryptMnemonic = async (
  vault: EncryptedVault,
  password: string
): Promise<string> => {
  const salt = hex2ab(vault.salt);
  const iv = hex2ab(vault.iv);
  const ciphertext = hex2ab(vault.ciphertext);

  const key = await deriveKey(password, salt);

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: toArrayBuffer(iv) },
      key,
      toArrayBuffer(ciphertext)
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error('Incorrect password');
  }
};