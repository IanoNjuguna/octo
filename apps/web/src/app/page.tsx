"use client"

import { Wallet } from "lucide-react";
import { WalletDashboard } from "@/components/wallet-dashboard";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative py-12 lg:py-20">
        <div className="container px-4 mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              <Wallet className="h-4 w-4" />
              Powered by MiniPay
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Seti <span className="text-primary">Wallet</span>
            </h1>

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
