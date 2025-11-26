"use client"

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Camera, AlertCircle } from 'lucide-react'

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string>('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerIdRef = useRef('qr-scanner-' + Math.random().toString(36).substring(7))

  const startScanning = async () => {
    try {
      setError('')
      const scannerId = scannerIdRef.current

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerId)
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText)
          stopScanning()
        },
        (errorMessage) => {
          // Silent error handling for scanning process
        }
      )
      setScanning(true)
    } catch (err: any) {
      setError(err.message || 'Failed to start camera')
      console.error('Scanner error:', err)
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop()
        setScanning(false)
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [scanning])

  return (
    <Card className="p-6 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          stopScanning()
          onClose()
        }}
        className="absolute top-4 right-4 h-8 w-8 p-0 z-10"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
          <p className="text-sm text-muted-foreground">
            Scan a wallet address QR code to autofill the recipient address
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div
            id={scannerIdRef.current}
            className="w-full max-w-md rounded-lg overflow-hidden"
            style={{ minHeight: scanning ? '300px' : '0' }}
          />

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md w-full">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!scanning && (
            <Button onClick={startScanning} size="lg" className="w-full">
              <Camera className="h-5 w-5 mr-2" />
              Start Camera
            </Button>
          )}

          {scanning && (
            <Button onClick={stopScanning} variant="outline" size="lg" className="w-full">
              Stop Scanning
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
