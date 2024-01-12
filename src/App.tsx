import { ThemeProvider } from '@0xsequence/design-system'

import { SequenceConnector } from '@0xsequence/wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 

import { metaMask, walletConnect } from 'wagmi/connectors'

import {
  createConfig,
  WagmiProvider
} from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, polygonMumbai, sepolia } from '@wagmi/chains'
import { sequence } from '0xsequence'
import Demo from './Demo'

import '@0xsequence/design-system/styles.css'

const queryClient = new QueryClient() 

const App = () => {
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
    metaMask(),
    walletConnect({
      projectId: 'b87cf8b78e1c5a9881adabe5765d2461',
      showQrModal: true,
    }),
  ]
  

  const getTransportByChain = (chain) => {
    const network = sequence.network.findNetworkConfig(sequence.network.allNetworks, chain.id)
    if (!network) {
      throw new Error(`Could not find network config for chain ${chain.id}`)
    }

    return { chain, rpcUrls: { http: [network.rpcUrl] } }
  }

  const chains = [mainnet, polygon, optimism, arbitrum, polygonMumbai, sepolia]
  const transports = {}
  chains.forEach(chain => {
    transports[chain.id] = getTransportByChain(chain)
  })
  const wagmiConfig = createConfig({
    chains,
    transports,
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
