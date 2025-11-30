"use client"

import { useAccount, useBalance } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Wallet, ArrowRight, Copy, Check } from "lucide-react"
import { formatEther } from "viem"
import Link from "next/link"
import { QRCodeSVG } from 'qrcode.react'
import { useState } from "react"

const REQUIRED_BALANCE = "0.2" // 0.2 CELO required

interface CheckCeloBalanceProps {
	children: React.ReactNode
}

export function CheckCeloBalance({ children }: CheckCeloBalanceProps) {
	const { address, isConnected } = useAccount()
	const [copied, setCopied] = useState(false)

	const { data: balance, isLoading } = useBalance({
		address,
	})

	const copyAddress = async () => {
		if (address) {
			await navigator.clipboard.writeText(address)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}

	if (!isConnected) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Wallet className="w-6 h-6" />
							Connect Wallet
						</CardTitle>
						<CardDescription>
							Connect your wallet to play the game
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-center text-muted-foreground">
							Please connect your wallet using the button in the top right corner.
						</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<div className="flex flex-col items-center gap-3">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p className="text-sm text-muted-foreground">Checking balance...</p>
				</div>
			</div>
		)
	}

	const balanceInCelo = balance ? formatEther(balance.value) : "0"
	const hasEnoughBalance = parseFloat(balanceInCelo) >= parseFloat(REQUIRED_BALANCE)

	if (!hasEnoughBalance) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<div className="w-full max-w-lg">
					<Card className="border border-white/30 bg-background/40 backdrop-blur-xl shadow-2xl">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<AlertCircle className="w-6 h-6" />
								Can't Play Yet - Need More CELO
							</CardTitle>
							<CardDescription>
								You need <span className="font-bold">at least {REQUIRED_BALANCE} CELO to unlock the game</span>
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5">
							<div className="p-4 bg-muted rounded-lg">
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">Your Balance:</span>
									<span className="text-lg font-bold">{parseFloat(balanceInCelo).toFixed(4)} CELO</span>
								</div>
							</div>

							<div className="space-y-3">
								<div className="text-center">
									<p className="text-sm text-muted-foreground mb-4">
										Scan this QR code or send CELO to your wallet address below
									</p>
								</div>

								<div className="flex justify-center py-4">
									<div className="bg-white p-4 rounded-lg shadow-sm">
										<QRCodeSVG
											value={address || ''}
											size={200}
											level="H"
											includeMargin={true}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<p className="text-xs text-muted-foreground text-center">Your Wallet Address</p>
									<div className="flex items-center gap-2 p-3 bg-muted rounded-md group">
										<code className="text-xs font-mono flex-1 break-all">
											{address}
										</code>
										<Button
											onClick={copyAddress}
											variant="ghost"
											size="icon"
											className="h-8 w-8 shrink-0"
										>
											{copied ? (
												<Check className="h-4 w-4 text-green-600 dark:text-green-400" />
											) : (
												<Copy className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	return <>{children}</>
}
