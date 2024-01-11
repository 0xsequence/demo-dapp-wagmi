import { ThemeProvider } from '@0xsequence/design-system'

import { SequenceConnector } from '@0xsequence/wagmi-connector'
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import {
  configureChains,
  createConfig,
  WagmiConfig,
} from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, polygonMumbai, sepolia } from '@wagmi/chains'
import { sequence } from '0xsequence'
import Demo from './Demo'

import '@0xsequence/design-system/styles.css'

const App = () => {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, polygonMumbai, sepolia],
    [
      (chain) => {
        const network = sequence.network.findNetworkConfig(sequence.network.allNetworks, chain.id)
        if (!network) {
          throw new Error(`Could not find network config for chain ${chain.id}`)
        }

        return { chain, rpcUrls: { http: [network.rpcUrl] } }
      }
    ]
  )

  const urlParams = new URLSearchParams(window.location.search)
  let walletAppURL = 'https://sequence.app'

  if (urlParams.get('walletAppURL') && urlParams.get('walletAppURL').length > 0) {
    walletAppURL = urlParams.get('walletAppURL')
  }

  const connectors = [
    new SequenceConnector({
      chains,
      options: {
        defaultNetwork: 137,

        connect: {
          app: 'Demo-app',

          // This is optional, and only used to point to a custom
          // environment for the wallet app. By default, it will
          // point to https://sequence.app/
          walletAppURL
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
