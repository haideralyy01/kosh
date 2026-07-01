import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import type { WalletKeyPair } from '@/types/wallet'

export const generateMnemonic = (wordCount: 12 | 24 = 12): string => {
  const strength = wordCount === 24 ? 256 : 128;
  return bip39.generateMnemonic(strength);
};

export const validateMnemonic = (mnemonic: string): boolean => {
  return bip39.validateMnemonic(mnemonic);
};

export const getKeypairFromMnemonic = async (
  mnemonic: string,
  accountIndex = 0,
  passphrase = ''
): Promise<WalletKeyPair> => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = await bip39.mnemonicToSeed(mnemonic, passphrase);
  const path = `m/44'/501'/${accountIndex}'/0'`;
  const derivedSeed = derivePath(path, seed.toString('hex')).key;

  const keypair = Keypair.fromSeed(derivedSeed);

  return {
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Array.from(keypair.secretKey),
  };
};