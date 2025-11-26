"use client"

import { useState } from 'react'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, isAddress } from 'viem'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, QrCode, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { QRScanner } from './qr-scanner'

interface SendTransactionProps {
  onClose: () => void
}

export function SendTransaction({ onClose }: SendTransactionProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [error, setError] = useState('')

  const { address } = useAccount()
  const { data: hash, sendTransaction, isPending: isSending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleScan = (scannedData: string) => {
    // Handle various QR code formats
    let address = scannedData

    // If it's an ethereum: URI, extract the address
    if (scannedData.startsWith('ethereum:')) {
      address = scannedData.replace('ethereum:', '').split('?')[0]
    }

    setRecipient(address)
    setShowScanner(false)
    setError('')
  }

  const handleSend = async () => {
    setError('')

    // Validation
    if (!recipient) {
      setError('Please enter a recipient address')
      return
    }

    if (!isAddress(recipient)) {
      setError('Invalid recipient address')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      })
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
    }
  }

  const resetForm = () => {
    setRecipient('')
    setAmount('')
    setError('')
  }

  if (isSuccess) {
    return (
      <Card className="p-6 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            resetForm()
            onClose()
          }}
          className="absolute top-4 right-4 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Transaction Sent!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your transaction has been confirmed on the blockchain
            </p>
            {hash && (
              <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                {hash}
              </code>
            )}
          </div>
          <Button onClick={() => {
            resetForm()
            onClose()
          }}>
            Close
          </Button>
        </div>
      </Card>
    )
  }

  if (showScanner) {
    return (
      <QRScanner
        onScan={handleScan}
        onClose={() => setShowScanner(false)}
      />
    )
  }

  return (
    <Card className="p-6 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4 h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Send Transaction</h3>
          <p className="text-sm text-muted-foreground">
            Enter recipient address and amount to send
          </p>
        </div>

        <div className="space-y-4">
          {/* Recipient Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="flex-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowScanner(true)}
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (CELO)</label>
            <input
              type="number"
              placeholder="0.0"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={isSending || isConfirming || !recipient || !amount}
            className="w-full"
            size="lg"
          >
            {isSending || isConfirming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Sending...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Transaction
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
