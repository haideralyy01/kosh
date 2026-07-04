import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction
} from '@solana/web3.js'
import type { TransactionResult } from '@/types/wallet';
import { promise } from 'zod';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const getConnection = (): Connection => {
    return new Connection(RPC_URL);
}

export const getBalance = async (publicKey: string): Promise<Number> => {
    try {
        const connection = getConnection();
        const pubKey = new PublicKey(publicKey);
        const lamports = await connection.getBalance(pubKey);
        return lamports / LAMPORTS_PER_SOL;
    } catch{
        throw new Error('Failed to get balance');
    }
};

export const sendSOL = async (
    secretKey: number[],
    toAddress: string,
    ammount: number
): Promise<TransactionResult> => {
    try {
        const connection = getConnection();
        const fromKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
        const toPublicKey = new PublicKey(toAddress);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toPublicKey,
                lamports: ammount * LAMPORTS_PER_SOL
            })
        );

        const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
        return {signature, status: 'confirmed'};
    } catch {
        throw new Error('transection failed');
    }
};

export const getTransactionHistory = async (publicKey: string) => {
    try {
        const connection = getConnection();
        const pubkey = new PublicKey(publicKey);

        const signature = await connection.getSignaturesForAddress(pubkey, { limit: 10, });

        const transaction = await Promise.all(
            signature.map(async (sig) => {
                const tx = await connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0, });
                return { sig, tx };
            })
        );
        return transaction
    } catch {
        throw new Error('Failed to fetch transactions');
    }
};

export const isValidPublicKey = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};