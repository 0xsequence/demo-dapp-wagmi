import { ThemeProvider } from '@0xsequence/design-system'

import { sequenceWallet } from '@0xsequence/wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 

import { walletConnect } from 'wagmi/connectors'

import {
  createConfig,
  WagmiProvider,
  http
} from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, polygonMumbai, sepolia, Chain } from '@wagmi/chains'
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

  const chains = [mainnet, polygon, optimism, arbitrum, polygonMumbai, sepolia] as [Chain, ...Chain[]]

  const connectors = [
    sequenceWallet({
      defaultNetwork: 137,
      projectAccessKey: 'iK0DPkHRt0IFo8o4M3fZIIOAAAAAAAAAA',
      connect: {
        app: 'Demo-app',

        // This is optional, and only used to point to a custom
        // environment for the wallet app. By default, it will
        // point to https://sequence.app/
        walletAppURL,
      }
    }),
    walletConnect({
      projectId: 'b87cf8b78e1c5a9881adabe5765d2461',
      showQrModal: true,
    }),
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
