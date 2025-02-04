"use client"

import { useTonConnectUI } from "@tonconnect/ui-react";
import "./globals.css";
import { useCallback, useEffect, useState } from "react";
import { Address} from "@ton/core";

export default function Home() {
  const [tonConnectUI] = useTonConnectUI()
  const [tonWalletAddress,setTonWalletAddress]=useState<string | null>(null)
  const [isLoading,setIsLoading]=useState(true)

  const handleWalletConnection=useCallback((address:string)=>{
    setTonWalletAddress(address)
    console.log("Wallet connected Successfully")
    setIsLoading(false)
  },[])

  const handleWalletDisconnection=useCallback(()=>{
    setTonWalletAddress(null)
    console.log("Wallet Disconnected Successfully")
    setIsLoading(false)
  },[])

  useEffect(()=>{
    const checkWalletConnection=async()=>{
      if(tonConnectUI.account?.address){
        handleWalletConnection(tonConnectUI.account?.address)
      }else{
        handleWalletDisconnection()
      }
    }

    checkWalletConnection()

    const unsubscribe=tonConnectUI.onStatusChange((wallet)=>{
      if(wallet){
        handleWalletConnection(wallet.account.address)
      }else{
        handleWalletDisconnection()
      }
    })

    return()=>{
      unsubscribe();
    };

  },[tonConnectUI,handleWalletConnection,handleWalletDisconnection])

  const handleWalletAction=async()=>{
    if(tonConnectUI.connected){
      setIsLoading(true)
      await tonConnectUI.disconnect()
    }else{
      await tonConnectUI.openModal()
    }
  };

  const formatAddress=(address:string)=>{
    const tempAddress=Address.parse(address).toString()
    return `${tempAddress.slice(0,4)}...${tempAddress.slice(-4)}`
  }

  if(isLoading){
    return(
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
          Loading...
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">TON-Connect</h1>

      {tonWalletAddress? (
        <div className="flex felx-col items-center">
          <p className="mb-8">Connected: {formatAddress(tonWalletAddress)}</p>
          <button
            onClick={handleWalletAction}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Dissconnect Wallet
          </button>
        </div>
      ):(
        <button
          onClick={handleWalletAction}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect TON Wallet
        </button>
      )}
    </main>
  );
}
