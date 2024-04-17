import { ThemeProvider } from '@0xsequence/design-system'

import { sequenceWallet } from '@0xsequence/wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { walletConnect } from 'wagmi/connectors'

import { createConfig, WagmiProvider, http } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, sepolia, Chain } from 'viem/chains'
import { sequence } from '0xsequence'
import Demo from './Demo'

import './index.css'
import '@0xsequence/design-system/styles.css'

const queryClient = new QueryClient()

const arbitrumSepolia: Chain = {
  id: 421614,
  name: 'Arbitrum Sepolia',
  testnet: true,
  nativeCurrency: {
    name: 'Arbitrum Sepolia Ether',
    symbol: 'ASETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://nodes.sequence.app/arbitrum-sepolia']
    },
    public: {
      http: ['https://nodes.sequence.app/arbitrum-sepolia']
    }
  }
}

const polygonAmoy: Chain = {
  id: 80002,
  name: 'Polygon Amoy',
  testnet: true,
  nativeCurrency: {
    name: 'Matic Amoy',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://nodes.sequence.app/amoy']
    },
    public: {
      http: ['https://nodes.sequence.app/amoy']
    }
  }
}

const App = () => {
  const urlParams = new URLSearchParams(window.location.search)
  let walletAppURL = 'https://sequence.app'

  if (urlParams.get('walletAppURL') && urlParams.get('walletAppURL').length > 0) {
    walletAppURL = urlParams.get('walletAppURL')
  }

  const chains = [mainnet, polygon, optimism, arbitrum, sepolia, polygonAmoy, arbitrumSepolia] as [Chain, ...Chain[]]

  const connectors = [
    sequenceWallet({
      connectOptions: {
        app: 'Demo-app',
        projectAccessKey: 'iK0DPkHRt0IFo8o4M3fZIIOAAAAAAAAAA'
      },
      defaultNetwork: 137,

      // This is optional, and only used to point to a custom
      // environment for the wallet app. By default, it will
      // point to https://sequence.app/
      walletAppURL
    }),
    walletConnect({
      projectId: 'b87cf8b78e1c5a9881adabe5765d2461',
      showQrModal: true
    })
  ]

  const transports = {}

  chains.forEach(chain => {
    const network = sequence.network.findNetworkConfig(sequence.network.allNetworks, chain.id)
    if (!network) return
    transports[chain.id] = http(network.rpcUrl)
  })

  const wagmiConfig = createConfig({
    chains,
    connectors,
    transports
  })

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Demo />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}

export default App
