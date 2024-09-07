import * as ethers from 'ethers';
import "reflect-metadata"
import { claimTx, db } from '../schema';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)


    const ips = event.node.req.headers['x-forwarded-for'] as string
    const userIp = ips.split(",")[0]

    //check if the user has already claimed
    const txHistories = await db.select().from(claimTx).where(sql`${claimTx.ip} = ${userIp} OR ${claimTx.address} = ${body.recipientAddress}`).execute();
    if (txHistories.length > 0) {
        return {
            status: 0,
            error: 'You have already claimed',
        }
    }

    const senderPrivateKey = process.env.PRIVATE_KEY ?? '';
    const provider = new ethers.JsonRpcProvider('https://brn.rpc.caldera.xyz/http', 6636130);

    const signer = new ethers.Wallet(senderPrivateKey, provider);

    // Define the transaction
    const tx = {
        to: body.recipientAddress,
        value: ethers.parseEther('0.1') // Convert the amount to Wei
    };

    // Send the transaction
    const transactionResponse = await signer.sendTransaction(tx);

    // Wait for the transaction to be mined
    const receipt = await transactionResponse.wait();

    // Insert the transaction into the database
    await db.insert(claimTx).values({
        ip: userIp,
        address: body.recipientAddress,
        hash: receipt?.hash ?? '',
    }).returning({
        uid: claimTx.uid,
    }).execute();

    return receipt;
});