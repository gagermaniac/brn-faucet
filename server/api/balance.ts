import * as ethers from 'ethers';
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

    return {
        address: address,
        balance: etherBalance,
    };
})