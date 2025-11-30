"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { CheckCeloBalance } from "@/components/check-celo-balance"

// Lazy load game component for better performance
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

export default function GamePage() {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <CheckCeloBalance>
        <SpaceShooterGame />
      </CheckCeloBalance>
    </div>
  )
}
