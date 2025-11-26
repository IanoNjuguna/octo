"use client"

import { useState, useEffect } from 'react'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { formatEther } from 'viem'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, QrCode, Send, LogOut, Wallet } from 'lucide-react'
import { ReceiveQRCode } from './receive-qr-code'
import { SendTransaction } from './send-transaction'

export function WalletDashboard() {
  const [mounted, setMounted] = useState(false)
  const [showReceive, setShowReceive] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [copied, setCopied] = useState(false)

  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })
  const { disconnect } = useDisconnect()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isConnected || !address) {
    return (
      <Card className="p-8 text-center">
        <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Wallet Connected</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to use the wallet features
        </p>
      </Card>
    )
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {formatAddress(address)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-8 w-8 p-0"
                >
                  <Copy className={`h-4 w-4 ${copied ? 'text-green-500' : ''}`} />
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnect()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-1">Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'}
              </span>
              <span className="text-lg text-muted-foreground">
                {balance?.symbol || 'CELO'}
              </span>
            </div>
            {chain && (
              <p className="text-sm text-muted-foreground mt-1">
                on {chain.name}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          size="lg"
          onClick={() => {
            setShowReceive(true)
            setShowSend(false)
          }}
          className="h-auto py-6 flex flex-col gap-2"
        >
          <QrCode className="h-6 w-6" />
          <span>Receive</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            setShowSend(true)
            setShowReceive(false)
          }}
          className="h-auto py-6 flex flex-col gap-2"
        >
          <Send className="h-6 w-6" />
          <span>Send</span>
        </Button>
      </div>

      {/* Receive QR Code */}
      {showReceive && (
        <ReceiveQRCode
          address={address}
          onClose={() => setShowReceive(false)}
        />
      )}

      {/* Send Transaction */}
      {showSend && (
        <SendTransaction
          onClose={() => setShowSend(false)}
        />
      )}
    </div>
  )
}
