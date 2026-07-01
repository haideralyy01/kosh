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