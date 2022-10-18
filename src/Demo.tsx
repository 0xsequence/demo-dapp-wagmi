import React, { useState, useEffect } from 'react'

import logoUrl from './images/logo.svg'

import { ethers } from 'ethers'
import { sequence } from '0xsequence'
import { useSigner, useProvider, useAccount, useConnect, useDisconnect } from 'wagmi'


import { ERC_20_ABI } from './constants/abi'

import { configureLogger } from '@0xsequence/utils'
import { Group } from './components/Group'
import { styled, typography } from './style'
import { Button } from './components/Button'
import { Console } from './components/Console'

configureLogger({ logLevel: 'DEBUG' })

const App = () => {
  const { isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { disconnect } =  useDisconnect()

  const [consoleMsg, setConsoleMsg] = useState<null|string>(null)
  const [consoleLoading, setConsoleLoading] = useState<boolean>(false)

  const appendConsoleLine = (message: string) => {
    return (setConsoleMsg((prevState => {
      return `${prevState}\n\n${message}`
    })))
  }
  
  const resetConsole = () => {
    setConsoleMsg(null)
    setConsoleLoading(true)
  }

  const addNewConsoleLine = (message: string) => {
    setConsoleMsg((() => {
      return (message)
    }))
  }

  const consoleWelcomeMessage = () => {
    setConsoleLoading(false)
    setConsoleMsg('Status: Wallet not connected. Please connect wallet to use Methods')
  }

  const consoleErrorMesssage = () => {
    setConsoleLoading(false)
    setConsoleMsg('An error occurred')
  }

  useEffect(() => {
    if (isConnected) {
      setConsoleMsg('Wallet connected!')
    } else {
      consoleWelcomeMessage()
    }
  }, [isConnected])

  const getChainID = async () => {
    try {
      resetConsole()
      const chainId = await signer.getChainId()
      console.log('signer.getChainId()', chainId)
      addNewConsoleLine(`signer.getChainId(): ${chainId}`)
      setConsoleLoading(false)
    } catch(e) {
      console.error(e)
      consoleErrorMesssage()
    }
  }

  const getBalance = async () => {
    try {
      resetConsole()
      const account = await signer.getAddress()
      const balanceChk1 = await provider!.getBalance(account)
      console.log('balance check 1', balanceChk1.toString())
      addNewConsoleLine(`balance check 1: ${balanceChk1.toString()}`)
  
      const balanceChk2 = await signer.getBalance()
      console.log('balance check 2', balanceChk2.toString())
      appendConsoleLine(`balance check 2: ${balanceChk2.toString()}`)
      setConsoleLoading(false) 
    } catch(e) {
      console.error(e)
      consoleErrorMesssage()
    }
  }


  const getNetworks = async () => {
    try {
      resetConsole()
      const network = await provider!.getNetwork() 
      console.log('networks:', network)
  
      addNewConsoleLine(`networks: ${JSON.stringify(network)}`)
      setConsoleLoading(false) 
    } catch(e) {
      console.error(e)
      consoleErrorMesssage()
    }
  }

  const signMessage = async () => {
    try {
      resetConsole()  
      const message = `Two roads diverged in a yellow wood,
  Robert Frost poet
  
  And sorry I could not travel both
  And be one traveler, long I stood
  And looked down one as far as I could
  To where it bent in the undergrowth;
  
  Then took the other, as just as fair,
  And having perhaps the better claim,
  Because it was grassy and wanted wear;
  Though as for that the passing there
  Had worn them really about the same,
  
  And both that morning equally lay
  In leaves no step had trodden black.
  Oh, I kept the first for another day!
  Yet knowing how way leads on to way,
  I doubted if I should ever come back.
  
  I shall be telling this with a sigh
  Somewhere ages and ages hence:
  Two roads diverged in a wood, and I—
  I took the one less traveled by,
  And that has made all the difference.`
  
  
      // sign
      const sig = await signer.signMessage(message)
      console.log('signature:', sig)
  
      addNewConsoleLine(`signature: ${sig}`)
  
      const isValid = await sequence.utils.isValidMessageSignature(await signer.getAddress(), message, sig, provider as ethers.providers.Web3Provider)
      console.log('isValid?', isValid)
  
      appendConsoleLine(`isValid? ${isValid}`)
      setConsoleLoading(false) 
    } catch(e) {
      console.error(e)
      consoleErrorMesssage()
    }
  }

  const sendETH = async () => {
    try {
      resetConsole()
  
      console.log(`Transfer txn on ${signer.getChainId()}`)
      addNewConsoleLine(`Transfer txn on ${signer.getChainId()}`)
  
      const toAddress = ethers.Wallet.createRandom().address
  
      const tx1 = {
        gasLimit: '0x55555',
        to: toAddress,
        value: ethers.utils.parseEther('1.234'),
        data: '0x'
      }
  
      const balance1 = await provider!.getBalance(toAddress)
      console.log(`balance of ${toAddress}, before:`, balance1)
      appendConsoleLine(`balance of ${toAddress}, before: ${balance1}`)
      const txnResp = await signer.sendTransaction(tx1)
      await txnResp.wait()
  
      const balance2 = await provider!.getBalance(toAddress)
      console.log(`balance of ${toAddress}, after:`, balance2)
      appendConsoleLine(`balance of ${toAddress}, after: ${balance2}`)
      setConsoleLoading(false) 
    } catch(e) {
      console.error(e)
      consoleErrorMesssage()
    }
  }

  const sendDAI = async () => {
    try {
      resetConsole()
      const toAddress = ethers.Wallet.createRandom().address
  
      const amount = ethers.utils.parseUnits('5', 18)
  
      const daiContractAddress = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' // (DAI address on Polygon)
  
      const tx = {
        gasLimit: '0x55555',
        to: daiContractAddress,
        value: 0,
        data: new ethers.utils.Interface(ERC_20_ABI).encodeFunctionData('transfer', [toAddress, amount.toHexString()])
      }
  
      const txnResp = await signer.sendTransaction(tx)
      await txnResp.wait()
  
      console.log('transaction response', txnResp)
      addNewConsoleLine(`TX response ${JSON.stringify(txnResp)}`)
      setConsoleLoading(false) 
    } catch(e) {
      console.error(e)
      consoleErrorMesssage()
    }
  }

  const disableActions = !isConnected

  const getWalletActions = () => {
    if (!isConnected) {
      return null
    }
    return (
      <>
        <Description>Please open your browser dev inspector to view output of functions below</Description>
        <Group label="State" layout="grid">
          <Button disabled={disableActions} onClick={() => getChainID()}>
            ChainID
          </Button>
          <Button disabled={disableActions} onClick={() => getNetworks()}>
            Networks
          </Button>
          <Button disabled={disableActions} onClick={() => getBalance()}>
            Get Balance
          </Button>
        </Group>

        <Group label="Signing" layout="grid">
          <Button disabled={disableActions} onClick={() => signMessage()}>
            Sign Message
          </Button>
        </Group>

        <Group label="Transactions" layout="grid">
          <Button disabled={disableActions} onClick={() => sendETH()}>
            Send ETH
          </Button>
          <Button disabled={disableActions} onClick={() => sendDAI()}>
            Send DAI Tokens
          </Button>
        </Group>
        </>
    )
  }

  const getConnectionButtons = () => {
    if (!isConnected) {
      return (
        <Group>
          {connectors.map((connector) => (
            <Button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
            </Button>
          ))}
        </Group>
      )
    }

    return (
      <Group>
        <Button onClick={() => disconnect()}>
          Disconnect Wallet
        </Button>
      </Group>
    )
  }

  return (
    <Container>
      <SequenceLogo alt="logo" src={logoUrl} />
      <Title>Demo Dapp + Wagmi</Title>
      {getConnectionButtons()}
      {getWalletActions()}
      <Console message={consoleMsg} loading={consoleLoading} />
    </Container>
  )
}

export default React.memo(App)

// @ts-ignore
const Container = styled('div', {
  padding: '80px 25px 80px',
  margin: '0 auto',
  maxWidth: '720px'
})

// @ts-ignore
const SequenceLogo = styled('img', {
  height: '40px'
})

// @ts-ignore
const Title = styled('h1', typography.h1, {
  color: '$textPrimary',
  fontSize: '25px'
})

// @ts-ignore
const Description = styled('p', typography.b1, {
  color: '$textSecondary',
  marginBottom: '15px'
})
