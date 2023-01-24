import React from 'react'

import { SequenceConnector } from '@0xsequence/wagmi-connector'
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import {
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from '@wagmi/chains'
import { publicProvider } from 'wagmi/providers/public';
import Demo from './Demo'

const App = () => {
  const { chains, provider } = configureChains(
    [mainnet, polygon, optimism, arbitrum],
    [
      publicProvider()
    ]
  );

  const connectors = [
    new SequenceConnector({
      chains,
      options: {
        connect: {
          app: 'Demo-app',
          networkId: 137
        }
      }
    }),
    new MetaMaskConnector({
      chains,
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ]
  
  const wagmiClient = createClient({
    autoConnect: false,
    connectors,
    provider
  })


  return (
    <WagmiConfig client={wagmiClient}>
      <Demo />
    </WagmiConfig>
  )
}

export default App