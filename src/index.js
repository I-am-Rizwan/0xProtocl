async function sign() {
  console.log("jeee");
  const utils = require("@0x/protocol-utils");
  const contractAddresses = require("@0x/contract-addresses");
  const { MetamaskSubprovider } = require("@0x/subproviders");
  console.log("HANDLE");
  const CHAIN_ID = 1; // Eth mainnet chain ID
  const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
  const addresses = contractAddresses.getContractAddressesForChainOrThrow(
    CHAIN_ID
  );

  const getFutureExpiryInSeconds = () =>
    Math.floor(Date.now() / 1000 + 300).toString(); // 5 min expiry

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  const maker = accounts[0];

  // Sign order
  const order = new utils.LimitOrder({
    makerToken: addresses.etherToken,
    takerToken: addresses.zrxToken,
    makerAmount: "1", // NOTE: This is 1 WEI, 1 ETH would be 1000000000000000000
    takerAmount: "1000000000000000", // NOTE this is 0.001 ZRX. 1 ZRX would be 1000000000000000000
    maker: maker,
    sender: NULL_ADDRESS,
    expiry: getFutureExpiryInSeconds(),
    salt: Date.now().toString(),
    chainId: CHAIN_ID,
    verifyingContract: addresses.exchangeProxy
  });

  const supportedProvider = new MetamaskSubprovider(
    window.web3.currentProvider
  );
  const signature = await order.getSignatureWithProviderAsync(
    supportedProvider,
    utils.SignatureType.EIP712 // Optional
  );
  console.log(`Signature: ${JSON.stringify(signature, undefined, 2)}`);

  const signedOrder = { ...order, signature };
  const resp = await fetch("https://api.0x.org/sra/v4/order", {
    method: "POST",
    body: JSON.stringify(signedOrder),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const getOrder = async () => {
    return await fetch(
      "https://api.0x.org/orderbook/v1?quoteToken=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&baseToken=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    );
  };
  console.log(await (await getOrder()).json());

  if (resp.status === 200) {
    alert("Successfully posted order to SRA");
  } else {
    const body = await resp.json();
    alert(
      `ERROR(status code ${resp.status}): ${JSON.stringify(body, undefined, 2)}`
    );
  }
}

const placeOrder = async () => {
  console.log("jeee");
  const utils = require("@0x/protocol-utils");
  const contractAddresses = require("@0x/contract-addresses");
  const { MetamaskSubprovider } = require("@0x/subproviders");
  console.log("HANDLE");
  const CHAIN_ID = 1; // Eth mainnet chain ID
  const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
  const addresses = contractAddresses.getContractAddressesForChainOrThrow(
    CHAIN_ID
  );

  const getFutureExpiryInSeconds = () =>
    Math.floor(Date.now() / 1000 + 300).toString(); // 5 min expiry

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  const maker = accounts[0];

  // Sign order
  const order = new utils.LimitOrder({
    makerToken: addresses.etherToken,
    takerToken: addresses.zrxToken,
    makerAmount: "100000000000000",
    takerAmount: "2000000000000000000000",
    maker: maker,
    taker: "0x0000000000000000000000000000000000000000",
    pool: "0x0000000000000000000000000000000000000000000000000000000000000000",
    expiry: getFutureExpiryInSeconds(),
    salt:
      "2752094376750492926844965905320507011598275560670346196138937898764349624882",
    chainId: 1,
    verifyingContract: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    takerTokenFeeAmount: "0",
    sender: "0x0000000000000000000000000000000000000000",
    feeRecipient: "0x0000000000000000000000000000000000000000",
    signature: {
      v: 27,
      r: "0x983a8a8dad663124a52609fe9aa82737f7f02d12ed951785f36b50906041794d",
      s: "0x5f18ae837be4732bcb3dd019104cf775f92b8740b275be510462a7aa62cdf252",
      signatureType: 3
    }
  });

  const supportedProvider = new MetamaskSubprovider(
    window.web3.currentProvider
  );
  const signature = await order.getSignatureWithProviderAsync(
    supportedProvider,
    utils.SignatureType.EIP712 // Optional
  );
  console.log(`Signature: ${JSON.stringify(signature, undefined, 2)}`);

  const signedOrder = { ...order, signature };
  const resp = await fetch("https://api.0x.org/orderbook/v1/order", {
    method: "POST",
    body: JSON.stringify(signedOrder),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const getOrder = async () => {
    return await fetch(
      "https://api.0x.org/orderbook/v1?quoteToken=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&baseToken=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    );
  };
  console.log(await (await getOrder()).json());

  if (resp.status === 200) {
    alert(resp.status);
  } else {
    const body = await resp.json();
    alert(
      `ERROR(status code ${resp.status}): ${JSON.stringify(body, undefined, 2)}`
    );
  }
};

const btn = document.createElement("button");
btn.innerText = "Click to sign and submit";
btn.onclick = () => {
  sign().catch((err) => console.error(err));
};

const btnn = document.createElement("button");
btnn.innerText = "Click to post order ";
btnn.onclick = () => {
  placeOrder().catch((err) => console.error(err));
};
document.body.appendChild(btnn);
document.body.appendChild(btn);
