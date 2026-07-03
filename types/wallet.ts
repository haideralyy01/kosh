export interface WalletKeyPair {
    publicKey: string;
    secretKey: number[]
}

export interface WalletAccount {
    index: number;
    name: string;
    publicKey: string;
}
export interface EncryptedVault {
    ciphertext: string;
    salt: string;
    iv: string;
    accounts: WalletAccount[];
    activeAccountIndex: number;
    createdAt: number
}

export interface TransactionResult {
    signature: string;
    status: 'confirmed' | 'failed';
}

export interface WalletSession {
    mnemonic: string;
    keypair:WalletKeyPair;
    activeAccount: WalletAccount
}

export type WalletStatus = 'uninitialized' | 'locked' | 'unlocked';

export interface WalletState {
  status: WalletStatus;
  vault: EncryptedVault | null;
  session: WalletSession | null;
}