<script setup lang="ts">
import { data } from "autoprefixer";
import * as ethers from "ethers";

const balance = ref("0");

const address = ref("");
const result = ref<any>({});

const getBalance = async () => {
  const response = await useFetch("/api/balance");
  const data = await response.data.value;
  balance.value = data?.balance ?? "0";
};

const claim = async () => {
  const response = await useFetch("/api/claim", {
    method: "POST",
    body: JSON.stringify({ recipientAddress: address.value }),
  });
  result.value = response.data.value;
};

const invalidAddress = computed(() => {
  return !ethers.isAddress(address.value);
});

onMounted(() => {
  getBalance();
});
</script>
<template>
  <div>
    <NuxtRouteAnnouncer />

    <div
      class="bg-slate-900 w-[100vw] h-[100vh] flex flex-col items-center justify-center"
    >
      <h2 class="text-white font-bold text-3xl">BRN Faucet</h2>
      <p class="text-white">Faucet balance : {{ balance }}</p>
      <div class="container p-6 flex flex-col gap-6 align-center items-center">
        <div
          class="mt-3 max-w-[500px] text-white flex flex-col bg-slate-800 border rounded-md min-w-[50vw] border-slate-600 p-6"
        >
          <div class="mb-3">
            <h4 class="text-xl font-bold mb-1">Get Test Tokens</h4>
            <small>Get 0.1 BRN tokens</small>
          </div>
          <form v-on:submit.prevent="claim" class="flex flex-col">
            <input
              v-model="address"
              required
              placeholder="Enter you wallet address"
              class="p-2 mb-2 border-collapse rounded-md bg-slate-700 border border-slate-600"
            />
            <span class="text-red-500" v-if="invalidAddress && address != ''"
              >Invalid address</span
            >
            <button
              type="submit"
              class="bg-orange-500 p-2 mt-3 rounded-md font-light"
            >
              Send 0.1 BRN tokens
            </button>
          </form>
        </div>
        <div
          v-if="result.status === 1"
          class="bg-green-600 text-white border border-green-700 rounded p-2"
        >
          <h2>Success</h2>
          <p>Your transaction has been successfully sent</p>
          <p>
            Transaction hash :
            <a :href="'https://brn.explorer.caldera.xyz/tx/' + result.hash">{{
              result.hash
            }}</a>
          </p>
        </div>
        <div
          v-if="result.status && result.status !== 1"
          class="bg-slate-600 text-white border border-red-700 rounded p-2"
        >
          <h2 class="font-black text-red-500">Error</h2>
          <p>Something went wrong</p>
          <p>Error : {{ result.error }}</p>
          <p>Please try again</p>
        </div>
      </div>
    </div>
  </div>
</template>
