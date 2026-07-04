import { decryptMnemonic, encryptMnemonic } from '@/lib/crypto';
import { clearVault, loadVault, saveVault, vaultExists } from '@/lib/storage';
import { EncryptedVault, WalletAccount, WalletState } from '@/types/wallet';
import { getKeypairFromMnemonic } from '@/utils/wallet';
import { create } from 'zustand';

interface WalletActions {
    initialize: () => void;
    createWallet: (mnemonic: string, password: string) => Promise<void>;
    importWallet: (mnemonic: string, password: string) => Promise<void>;
    unlock: (password: string) => Promise<void>;
    lock: () => void;
    resetWallet: () => void;
    addAccount: () => Promise<void>;
    switchAccount: (index: number) => Promise<void>;
};

const initialState: WalletState = {
  status: 'uninitialized',
  vault: null,
  session: null,
};

export const useWalletStore = create<WalletState &  WalletActions>((set, get) => ({
    ...initialState,
    initialize: () => {
        const { status } = get();
        if (status === 'unlocked') return;
        if (vaultExists()) {
            const vault = loadVault();
            set({ status: 'locked', vault});
        } else {
            set({ status: 'uninitialized'});
        }
    },
    createWallet: async (mnemonic, password) => {
        const keypair = await getKeypairFromMnemonic(mnemonic, 0);;

        const firstAccount: WalletAccount = {
            index: 0,
            name: 'Account 1',
            publicKey: keypair.publicKey
        };

        const vault = await encryptMnemonic(mnemonic, password, [firstAccount]);
        saveVault(vault);

        set({
            status: 'unlocked',
            vault,
            session: {
                mnemonic,
                keypair,
                activeAccount: firstAccount
            },
        });
    },

    importWallet: async (mnemonic, password) => {
        const keypair = await getKeypairFromMnemonic(mnemonic, 0);

        const firstAccount: WalletAccount = {
            index: 0,
            name: 'Account 1',
            publicKey: keypair.publicKey,
        };

        const vault = await encryptMnemonic(mnemonic, password, [firstAccount]);
        saveVault(vault);

        set({
            status: 'unlocked',
            vault,
            session: {
                mnemonic,
                keypair,
                activeAccount: firstAccount,
            },
        });
    },

    unlock: async (password) => {
        const { vault } = get();
        if (!vault) throw new Error('No vault found');

        const mnemonic = await decryptMnemonic(vault, password);
        const activeAccount = vault.accounts[vault.activeAccountIndex];
        const keypair = await getKeypairFromMnemonic(mnemonic, activeAccount.index);

        set({
            status: 'unlocked',
            session: {
                mnemonic, 
                keypair,
                activeAccount,
            },
        });
    },

    lock: () => {
        set({ status: 'locked', session: null });
    },

    resetWallet: () => {
        clearVault();
        set(initialState);
    },

    addAccount: async () => {
        const { vault, session } = get();
        if (!vault || !session) throw new Error('Wallet not unlocked');

        const newIndex = vault.accounts.length;
        const newKeypair = await getKeypairFromMnemonic(session.mnemonic, newIndex);

        const newAccount: WalletAccount = {
            index: newIndex,
            name: `Account ${newIndex + 1}`,
            publicKey: newKeypair.publicKey,
        };

        const updateVault: EncryptedVault = {
            ...vault,
            accounts: [...vault.accounts, newAccount],
        };

        saveVault(updateVault);
        set({ vault: updateVault });
    },

    switchAccount: async (index) => {
        const { vault, session } = get();
        if (!vault || !session) throw new Error('Wallet not unlocked');

        const account = vault.accounts[index];
        if (!account) throw new Error('Account not found');

        const keypair = await getKeypairFromMnemonic(session.mnemonic, index);

        const updateVault: EncryptedVault = {
            ...vault,
            activeAccountIndex: index,
        };

        saveVault(updateVault);

        set({
            vault:updateVault,
            session: {
                ...session,
                keypair,
                activeAccount: account
            },
        });
    },
}));