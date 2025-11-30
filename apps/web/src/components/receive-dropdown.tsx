"use client"

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Copy, QrCode } from 'lucide-react'

export function ReceiveDropdown() {
	const { address } = useAccount()
	const [copied, setCopied] = useState(false)

	const copyAddress = async () => {
		if (address) {
			await navigator.clipboard.writeText(address)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}

	if (!address) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="lg" variant="outline">
					<QrCode className="mr-2 h-5 w-5" />
					Receive CELO
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-80 p-4" align="end">
				<div className="space-y-4">
					<div>
						<h4 className="font-semibold mb-1">Receive CELO</h4>
						<p className="text-xs text-muted-foreground">
							Scan this QR code or share your address
						</p>
					</div>

					<div className="flex justify-center py-4">
						<div className="bg-white p-3 rounded-lg">
							<QRCodeSVG
								value={address}
								size={200}
								level="H"
								includeMargin={true}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Your Address</p>
						<div className="flex items-center gap-2 p-2 bg-muted rounded-md">
							<code className="text-xs font-mono flex-1 break-all">
								{address}
							</code>
						</div>

						<Button
							onClick={copyAddress}
							className="w-full"
							variant="secondary"
							size="sm"
						>
							<Copy className="h-3 w-3 mr-2" />
							{copied ? 'Copied!' : 'Copy Address'}
						</Button>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
