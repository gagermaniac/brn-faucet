import * as ethers from 'ethers';
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

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

    return receipt;
});