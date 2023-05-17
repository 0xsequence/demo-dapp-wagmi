import React from 'react'
import { ThemeProvider } from '@0xsequence/design-system'

import { SequenceConnector } from '@0xsequence/wagmi-connector'
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import {
  configureChains,
  createConfig,
  WagmiConfig,
} from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from '@wagmi/chains'
import { publicProvider } from 'wagmi/providers/public';
import { createPublicClient, http } from 'viem'
import Demo from './Demo'

import '@0xsequence/design-system/styles.css'

const App = () => {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
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
        projectId: 'b87cf8b78e1c5a9881adabe5765d2461',
        showQrModal: true,
      },
    }),
  ]
  
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient
  })

  return (
    <ThemeProvider>
      <WagmiConfig config={wagmiConfig}>
        <Demo />
      </WagmiConfig>
    </ThemeProvider>
  )
}

export default App
