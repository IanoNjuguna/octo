"use client"

import { QRCodeSVG } from 'qrcode.react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Copy, Download } from 'lucide-react'
import { useState } from 'react'

interface ReceiveQRCodeProps {
  address: string
  onClose: () => void
}

export function ReceiveQRCode({ address, onClose }: ReceiveQRCodeProps) {
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const canvas = document.getElementById('receive-qr-code') as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `wallet-${address.slice(0, 8)}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
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
          <h3 className="text-lg font-semibold mb-2">Receive Funds</h3>
          <p className="text-sm text-muted-foreground">
            Scan this QR code or share your address to receive payments
          </p>
        </div>

        <div className="flex justify-center py-6">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG
              id="receive-qr-code"
              value={address}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Your Address</p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <code className="text-xs font-mono flex-1 break-all">
                {address}
              </code>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={copyAddress}
              className="flex-1"
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Address'}
            </Button>
            <Button
              onClick={downloadQR}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
