import * as ethers from 'ethers';
import { ClaimTx } from '~/db/claim-tx';
import { AppDataSource } from '~/db/datasource';
import { claimTx, db } from '../schema';
import { desc } from 'drizzle-orm';


export default defineEventHandler(async (event) => {
    const senderPrivateKey = process.env.PRIVATE_KEY ?? '';
    const provider = new ethers.JsonRpcProvider('https://brn.rpc.caldera.xyz/http', 6636130);

    // Get the balance of the address

    const signer = new ethers.Wallet(senderPrivateKey, provider);
    const address = signer.address;
    const balance = await provider.getBalance(address);

    // Convert the balance from Wei to Ether
    const etherBalance = ethers.formatEther(balance);

    const txHistories = await db.select().from(claimTx).limit(100).orderBy(desc(claimTx.created_at)).execute();

    return {
        address: address,
        balance: etherBalance,
        txHistories,
    };
})