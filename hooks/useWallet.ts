import { useWalletStore } from '@/store/walletStore';

export const useWallet = () => {
    const status = useWalletStore((state) => state.status);
    const vault = useWalletStore((state) => state.vault);
    const session = useWalletStore((state) => state.session);

    const initialize = useWalletStore((state) => state.initialize);
    const createWallet = useWalletStore((state) => state.createWallet); 
    const importWallet = useWalletStore((state) => state.importWallet);
    const unlock = useWalletStore((state) => state.unlock);
    const lock = useWalletStore((state) => state.lock);
    const addAccount = useWalletStore((state) => state.addAccount);
    const switchAccount = useWalletStore((state) => state.switchAccount);
    const resetWallet = useWalletStore((state) => state.resetWallet);

    return {
        status,
        vault,
        session,

        publicKey: session?.keypair?.publicKey ?? null,
        secretKey: session?.keypair?.secretKey ?? null,
        mnemonic: session?.mnemonic ?? null,
        activeAccount: session?.activeAccount ?? null,
        accounts: vault?.accounts ?? [],
        isUnlocked: status === 'unlocked',
        isLocked: status === 'locked',
        isUninitialized: status === 'uninitialized',

        initialize,
        createWallet,
        importWallet,
        unlock,
        lock,
        addAccount,
        switchAccount,
        resetWallet,
    }
}

