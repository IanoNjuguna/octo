"use client"

import { useAccount } from "wagmi"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, Gamepad2, Wallet } from "lucide-react"
import Link from "next/link"
import { CheckCeloBalance } from "@/components/check-celo-balance"
import { ReceiveDropdown } from "@/components/receive-dropdown"

// Lazy load heavy game component only when needed
const SpaceShooterGame = dynamic(
  () => import("@/components/space-shooter-game").then(mod => ({ default: mod.SpaceShooterGame })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] border-4 border-primary rounded-lg bg-[#0a0e27]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
)

export default function Home() {
  const { isConnected } = useAccount()

  // Hero section for non-connected users
  if (!isConnected) {
    return (
      <main className="flex-1">
        <section className="relative py-6 lg:py-8">
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8 text-muted-foreground max-w-3xl mx-auto">
                Play Octo, our Web3 space shooter.
              </h3>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle>🎮 How to Play</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Hold at least 0.2 CELO to unlock the game.
                      Keep your balance above the threshold to maintain access.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>💎 Balance-Gated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your CELO balance is checked in real-time. No minting, no fees.
                      Just hold the minimum balance.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🚀 Built on Celo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Fast, cheap transactions on Celo blockchain. Integrated wallet
                      for seamless Web3 experience.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild>
                  <Link href="/wallet">
                    <Wallet className="mr-2 h-5 w-5" />
                    Get CELO
                  </Link>
                </Button>
                <ReceiveDropdown />
              </div>

              <div className="relative max-w-4xl mx-auto">
                <canvas
                  width={800}
                  height={600}
                  className="border-4 border-primary rounded-lg bg-[#0a0e27] opacity-50 blur-sm w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-8 border-2 border-primary shadow-2xl">
                    <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h2 className="text-2xl font-bold text-center mb-2">Connect to Play</h2>
                    <p className="text-center text-muted-foreground">
                      Connect your wallet to get started
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // User is connected - check balance and show game
  return (
    <main className="flex-1">
      <section className="relative pt-2 pb-4">
        <div className="container px-4 mx-auto max-w-6xl">
          <CheckCeloBalance>
            <SpaceShooterGame />
          </CheckCeloBalance>
        </div>
      </section>
    </main>
  )
}