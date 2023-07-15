import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SigningCosmosClient } from "@cosmjs/launchpad";
import { SigningStargateClient } from "@cosmjs/stargate";
import kepllarLogo from "../keplr-logo.png";

  export default function WalletTransactions() {
    const [amount, setAmount] = useState(0);
    const [gas, setGas] = useState(0);
    const [walletAddress, setWalletAddress] = useState("Connect Wallet");
    const [recipient, setReceipent] = useState(
      "kujira1twcrqa8e5vfqxfp8q9hq0ux84mmmnn9apwej57"
    );
    const [transactionHash, setTransactionHas] = useState("");

    // //// query parameters
      
    const [currentQueryParameters, setSearchParams] = useSearchParams();
    const newQueryParameters = new URLSearchParams();


    const { search } = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(search);

    useEffect(() => {
      const cid = query.get("cid");
      const aid = query.get("aid");
      document.cookie = `cid=${cid}`;
      document.cookie = `aid=${aid}`;

    }, [search]);

    const connectWallet = async () => {
      if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
        return false;
      } else {
        if (window.keplr.experimentalSuggestChain) {
          try {
            await window.keplr.experimentalSuggestChain({
              chainId: "kaiyo-1",
              chainName: "Kujira",
              rpc: "https://rpc.kaiyo.kujira.setten.io/",
              rest: "https://lcd.kaiyo.kujira.setten.io/",
              stakeCurrency: {
                coinDenom: "KUJI",
                coinMinimalDenom: "ukuji",
                coinDecimals: 6,
              },
              bip44: {
                coinType: 118,
              },
              currencies: [
                {
                  coinDenom: "KUJI",
                  coinMinimalDenom: "ukuji",
                  coinDecimals: 6,
                },
              ],
              feeCurrencies: [
                {
                  coinDenom: "KUJI",
                  coinMinimalDenom: "ukuji",
                  coinDecimals: 6,
                },
              ],
              gasPriceStep: {
                low: 0.001,
                average: 0.025,
                high: 0.04,
              },
            });
          } catch {
            alert("Failed to suggest the chain");
          }
        } else {
          alert("Please use the recent version of keplr extension");
        }
        const chainId = "kaiyo-1";
        await window.keplr.enable(chainId);

        const offlineSigner = window.getOfflineSigner(chainId);

        const accounts = await offlineSigner.getAccounts();

        const result = new SigningCosmosClient(
          "https://rpc.kaiyo.kujira.setten.io/",
          accounts[0].address,
          offlineSigner
        );
        setGas(result.fees.send.gas);
        setWalletAddress(result.signerAddress);
      }
    };

    const handleSubmit = async (e) => {
      const cid = query.get("cid");
      const aid = query.get("aid");
      e.preventDefault();
      if (Number(amount) > 0) {
        let currentAmount = amount;

        currentAmount = parseFloat(currentAmount);
        if (isNaN(currentAmount)) {
          alert("Invalid amount");
          return false;
        }

        currentAmount *= 10000;
        currentAmount = Math.floor(currentAmount);

        // TODO: need to uncomment this code 
        
        // if (window && window.keplr) {
        //   const chainId = "kaiyo-1";
        //   await window.keplr.enable(chainId);
        //   const offlineSigner = await window.getOfflineSigner(chainId);
        //   const accounts = await offlineSigner.getAccounts();
        //   console.log("offlineSigner", offlineSigner, accounts);
        //   if (
        //     offlineSigner &&
        //     SigningStargateClient &&
        //     SigningStargateClient.connectWithSigner
        //   ) {
        //     // const client = await SigningStargateClient.connectWithSigner(
        //     //   "https://rpc.kaiyo.kujira.setten.io/",
        //     //   offlineSigner,
        //     //   {
        //     //     broadcastPollIntervalMs: 300,
        //     //     broadcastTimeoutMs: 8.000,
        //     //     gasPrice: 0.001,
        //     //   }
        //     // );

        //   } else {
        //     alert("Can't get signer.");
        //   }
        // }
        setTransactionHas("222");

        const collectionData= `amount=${amount}&transactionHash=${123}&gas=${gas}&cid=${cid}&pid=${aid}&walletAddress=${walletAddress}`
        
        // newQueryParameters.set(MY_QUERY_PARAMETER,  collectionData);
        setSearchParams(newQueryParameters);
        navigate(`/tracking?${collectionData}`)
        console.log("gas", gas);
      } else {
        alert("Please enter valid amount");
      }
    };

    
    return (
      <>
        <div class="wrapper">
    <h1>Kujira Crypto Token Swap</h1>
    <span>-------------------------------</span>

    <form>
        <select name="currencyFrom" id="currencyFrom">
            <option value="">-- Select a currency --</option>
            <option value="BTC">BTC</option>
        </select>
        <input type="number" name="amountFrom" id="amountFrom">
        <select name="currencyTo" id="currencyTo">
            <option value="">-- Select a currency --</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
        </select>
    </form>

    <p id="result">Select any token and an amount to swap</p>
</div>

      </>
    );
  }



