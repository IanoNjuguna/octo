"use client"

import dynamic from "next/dynamic"
import { Wallet, Loader2 } from "lucide-react"

// Lazy load wallet dashboard for better initial page load
const WalletDashboard = dynamic(
	() => import("@/components/wallet-dashboard").then(mod => ({ default: mod.WalletDashboard })),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}
)

export default function WalletPage() {
	return (
		<main className="flex-1">
			<section className="relative pt-2 pb-4">
				<div className="container px-4 mx-auto max-w-4xl">
					{/* Header */}
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
							<Wallet className="h-4 w-4" />
							Powered by MiniPay
						</div>

						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Send, receive, and manage your CELO tokens with QR code support
						</p>
					</div>

					{/* Wallet Dashboard */}
					<WalletDashboard />
				</div>
			</section>
		</main>
	);
}
