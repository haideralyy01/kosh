import type { EncryptedVault } from '@/types/wallet';

const VAULT_KEY = 'sol_vault';

export const saveVault = (vault: EncryptedVault): void => {
    try {
        localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
    } catch {
        throw new Error('Faild to save vault to localStorage');
    }
};

export const loadVault = (): EncryptedVault | null => {
    try {
        const raw = localStorage.getItem(VAULT_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as EncryptedVault
    } catch {
        throw new Error('Faild to load vault from localStorage')
    }
};

export const clearVault = (): void => {
    try {
        localStorage.removeItem(VAULT_KEY);
    } catch {
        throw new Error('Faild to clear vault from localStorage')
    }
};

export const vaultExists = (): boolean => {
    return localStorage.getItem(VAULT_KEY) !== null;
}

