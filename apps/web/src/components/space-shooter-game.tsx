"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

interface GameObject {
	x: number
	y: number
	width: number
	height: number
	speed: number
}

interface Enemy extends GameObject {
	health: number
}

interface Bullet extends GameObject {
	active: boolean
}

interface Particle {
	x: number
	y: number
	vx: number
	vy: number
	life: number
	size: number
	color: string
}

interface LifePickup extends GameObject {
	active: boolean
}

export function SpaceShooterGame() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameOver">("menu")
	const [score, setScore] = useState(0)
	const [highScore, setHighScore] = useState(0)
	const [level, setLevel] = useState(1)
	const [lives, setLives] = useState(3)
	const [currentTip, setCurrentTip] = useState(0)
	const { theme } = useTheme()

	const gameLoop = useRef<number>()
	const keysPressed = useRef<Set<string>>(new Set())
	const waveOffset = useRef<number>(0)
	const invincibleRef = useRef<boolean>(false)
	const invincibleTimerRef = useRef<number>(0)
	const playerPosRef = useRef<{ x: number; y: number } | null>(null)
	const livesRef = useRef<number>(lives)

	const gameTips = [
		"💡 Use WASD or Arrow Keys to move. Press SPACE to shoot enemies!",
		"🎯 Life pickups (hearts) drop more frequently at higher levels - watch for them!",
		"📊 Level progression follows the Fibonacci sequence: 100, 200, 300, 500, 800, 1300...",
		"⚡ After taking damage, you're invincible for 2 seconds - use this time to reposition!",
		"🎮 Enemy spawn rate increases with each level - stay alert!",
		"💪 Some enemies require multiple hits - look for the health bar above them!",
		"🌊 Dark mode changes the background to ocean waves - try it out!",
		"❤️ Collect hearts to gain extra lives, up to a maximum of 5 lives!",
		"🏆 Your high score is saved locally - challenge yourself to beat it!",
		"🚀 Enemies move faster at higher levels - master your dodging skills!",
		"🎨 Player flashing? That means you're temporarily invincible!",
		"💥 Bullets cost nothing - don't be shy, keep shooting!",
	]

	useEffect(() => {
		const savedHighScore = localStorage.getItem("octoHighScore")
		if (savedHighScore) {
			setHighScore(parseInt(savedHighScore))
		}
	}, [])

	// Rotate tips every 60 seconds
	useEffect(() => {
		const tipInterval = setInterval(() => {
			setCurrentTip((prev) => (prev + 1) % gameTips.length)
		}, 60000) // 60 seconds

		return () => clearInterval(tipInterval)
	}, [gameTips.length])

	useEffect(() => {
		if (gameState !== "playing") return

		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext("2d")
		if (!ctx) return

		// Game constants
		const CANVAS_WIDTH = canvas.width
		const CANVAS_HEIGHT = canvas.height
		const PLAYER_WIDTH = 40
		const PLAYER_HEIGHT = 40
		const BULLET_WIDTH = 4
		const BULLET_HEIGHT = 12
		const ENEMY_WIDTH = 40
		const ENEMY_HEIGHT = 40

		// Game state
		let animationId: number
		let localScore = score
		let currentLevel = level

		// Initialize or restore player position
		if (!playerPosRef.current) {
			playerPosRef.current = {
				x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
				y: CANVAS_HEIGHT - 100
			}
		}

		const player: GameObject = {
			x: playerPosRef.current.x,
			y: playerPosRef.current.y,
			width: PLAYER_WIDTH,
			height: PLAYER_HEIGHT,
			speed: 5,
		}

		const bullets: Bullet[] = []
		const enemies: Enemy[] = []
		const particles: Particle[] = []
		const lifePickups: LifePickup[] = []
		let lastShotTime = 0
		const SHOT_COOLDOWN = 250
		let enemySpawnTimer = 0
		const ENEMY_SPAWN_RATE = Math.max(1000 - (currentLevel * 100), 300)
		const MAX_LIVES = 5
		const LIFE_PICKUP_WIDTH = 30
		const LIFE_PICKUP_HEIGHT = 30
		const INVINCIBLE_DURATION = 2000 // 2 seconds

		// Create particle explosion
		const createExplosion = (x: number, y: number, color: string = "#ff6b6b") => {
			for (let i = 0; i < 15; i++) {
				const angle = (Math.PI * 2 * i) / 15
				const speed = Math.random() * 3 + 2
				particles.push({
					x,
					y,
					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed,
					life: 1,
					size: Math.random() * 3 + 2,
					color,
				})
			}
		}

		// Spawn enemy
		const spawnEnemy = () => {
			const x = Math.random() * (CANVAS_WIDTH - ENEMY_WIDTH)
			enemies.push({
				x,
				y: -ENEMY_HEIGHT,
				width: ENEMY_WIDTH,
				height: ENEMY_HEIGHT,
				speed: 2 + currentLevel * 0.3,
				health: 1 + Math.floor(currentLevel / 3),
			})

			// Chance to spawn life pickup (only if lives < MAX_LIVES)
			if (livesRef.current < MAX_LIVES) {
				let dropChance = 0.02 // 2% base
				if (currentLevel >= 4 && currentLevel <= 6) dropChance = 0.05 // 5% mid levels
				if (currentLevel >= 7) dropChance = 0.08 // 8% hard levels

				if (Math.random() < dropChance) {
					const pickupX = Math.random() * (CANVAS_WIDTH - LIFE_PICKUP_WIDTH)
					lifePickups.push({
						x: pickupX,
						y: -LIFE_PICKUP_HEIGHT,
						width: LIFE_PICKUP_WIDTH,
						height: LIFE_PICKUP_HEIGHT,
						speed: 1.5, // Slower than enemies
						active: true,
					})
				}
			}
		}

		// Collision detection
		const checkCollision = (a: GameObject, b: GameObject): boolean => {
			return (
				a.x < b.x + b.width &&
				a.x + a.width > b.x &&
				a.y < b.y + b.height &&
				a.y + a.height > b.y
			)
		}

		// Draw functions
		const drawPlayer = () => {
			// Flashing effect when invincible
			if (invincibleRef.current && Math.floor(Date.now() / 100) % 2 === 0) {
				ctx.globalAlpha = 0.5
			}

			// Draw spaceship
			ctx.fillStyle = "#4ecdc4"
			ctx.beginPath()
			ctx.moveTo(player.x + player.width / 2, player.y)
			ctx.lineTo(player.x, player.y + player.height)
			ctx.lineTo(player.x + player.width / 2, player.y + player.height - 10)
			ctx.lineTo(player.x + player.width, player.y + player.height)
			ctx.closePath()
			ctx.fill()

			// Draw cockpit
			ctx.fillStyle = "#45b7af"
			ctx.beginPath()
			ctx.arc(player.x + player.width / 2, player.y + 15, 6, 0, Math.PI * 2)
			ctx.fill()

			// Draw wings
			ctx.fillStyle = "#ff6b6b"
			ctx.fillRect(player.x - 8, player.y + 20, 8, 15)
			ctx.fillRect(player.x + player.width, player.y + 20, 8, 15)

			// Reset alpha
			ctx.globalAlpha = 1
		}

		const drawBullets = () => {
			ctx.fillStyle = "#ffe66d"
			bullets.forEach((bullet) => {
				if (bullet.active) {
					ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
					// Add glow effect
					ctx.shadowBlur = 10
					ctx.shadowColor = "#ffe66d"
					ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
					ctx.shadowBlur = 0
				}
			})
		}

		const drawEnemies = () => {
			enemies.forEach((enemy) => {
				// Enemy body
				ctx.fillStyle = enemy.health > 1 ? "#e76f51" : "#f4a261"
				ctx.beginPath()
				ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height)
				ctx.lineTo(enemy.x, enemy.y)
				ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + 10)
				ctx.lineTo(enemy.x + enemy.width, enemy.y)
				ctx.closePath()
				ctx.fill()

				// Enemy eyes
				ctx.fillStyle = "#000"
				ctx.fillRect(enemy.x + 10, enemy.y + 8, 6, 6)
				ctx.fillRect(enemy.x + enemy.width - 16, enemy.y + 8, 6, 6)

				// Health bar for stronger enemies
				if (enemy.health > 1) {
					const maxHealth = 1 + Math.floor(currentLevel / 3)
					const healthBarWidth = enemy.width
					const healthWidth = (enemy.health / maxHealth) * healthBarWidth
					ctx.fillStyle = "#ff0000"
					ctx.fillRect(enemy.x, enemy.y - 8, healthBarWidth, 3)
					ctx.fillStyle = "#00ff00"
					ctx.fillRect(enemy.x, enemy.y - 8, healthWidth, 3)
				}
			})
		}

		const drawParticles = () => {
			particles.forEach((particle) => {
				ctx.fillStyle = particle.color
				ctx.globalAlpha = particle.life
				ctx.beginPath()
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
				ctx.fill()
				ctx.globalAlpha = 1
			})
		}

		const drawLifePickups = () => {
			lifePickups.forEach((pickup) => {
				if (pickup.active) {
					// Draw heart shape
					ctx.fillStyle = "#ff6b9d"
					ctx.save()
					ctx.translate(pickup.x + pickup.width / 2, pickup.y + pickup.height / 2)

					// Heart shape using bezier curves
					ctx.beginPath()
					ctx.moveTo(0, 5)
					ctx.bezierCurveTo(-8, -3, -15, -8, -10, -15)
					ctx.bezierCurveTo(-5, -18, 0, -15, 0, -8)
					ctx.bezierCurveTo(0, -15, 5, -18, 10, -15)
					ctx.bezierCurveTo(15, -8, 8, -3, 0, 5)
					ctx.closePath()
					ctx.fill()

					// Add glow effect
					ctx.shadowBlur = 15
					ctx.shadowColor = "#ff6b9d"
					ctx.fill()
					ctx.shadowBlur = 0

					ctx.restore()
				}
			})
		}

		const drawBackground = () => {
			const isDark = document.documentElement.classList.contains('dark')

			if (isDark) {
				// Ocean background
				const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
				gradient.addColorStop(0, '#0a1628')
				gradient.addColorStop(0.5, '#1e3a5f')
				gradient.addColorStop(1, '#2c5282')
				ctx.fillStyle = gradient
				ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

				// Draw waves
				waveOffset.current += 0.02
				ctx.strokeStyle = 'rgba(56, 178, 172, 0.3)'
				ctx.lineWidth = 2

				for (let w = 0; w < 3; w++) {
					ctx.beginPath()
					const yBase = CANVAS_HEIGHT * (0.3 + w * 0.2)
					for (let x = 0; x < CANVAS_WIDTH; x += 5) {
						const y = yBase + Math.sin(x * 0.02 + waveOffset.current + w * 2) * 15
						if (x === 0) ctx.moveTo(x, y)
						else ctx.lineTo(x, y)
					}
					ctx.stroke()
				}

				// Underwater bubbles
				ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
				for (let i = 0; i < 20; i++) {
					const x = (i * 217 + waveOffset.current * 50) % CANVAS_WIDTH
					const y = (i * 137) % CANVAS_HEIGHT
					const size = (i % 4) + 2
					ctx.beginPath()
					ctx.arc(x, y, size, 0, Math.PI * 2)
					ctx.fill()
				}
			} else {
				// Space background with stars
				ctx.fillStyle = "#0a0e27"
				ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

				ctx.fillStyle = "#ffffff"
				for (let i = 0; i < 100; i++) {
					const x = (i * 137) % CANVAS_WIDTH
					const y = (i * 239) % CANVAS_HEIGHT
					const size = (i % 3) + 1
					ctx.fillRect(x, y, size, size)
				}
			}
		}

		const drawHUD = () => {
			const HUD_HEIGHT = 35

			// Draw text content with shadow for visibility
			ctx.shadowBlur = 3
			ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
			ctx.fillStyle = "#ffffff"
			ctx.font = "bold 16px Arial"

			// Score (left)
			ctx.fillText(`Score: ${localScore}`, 15, 22)

			// Level (left-center)
			ctx.fillText(`Level: ${currentLevel}`, 150, 22)

			// Lives with hearts (center)
			ctx.fillText(`Lives:`, 280, 22)
			for (let i = 0; i < livesRef.current; i++) {
				ctx.fillStyle = "#ff6b9d"
				ctx.save()
				ctx.translate(340 + i * 22, 17)
				ctx.scale(0.4, 0.4)
				ctx.beginPath()
				ctx.moveTo(0, 5)
				ctx.bezierCurveTo(-8, -3, -15, -8, -10, -15)
				ctx.bezierCurveTo(-5, -18, 0, -15, 0, -8)
				ctx.bezierCurveTo(0, -15, 5, -18, 10, -15)
				ctx.bezierCurveTo(15, -8, 8, -3, 0, 5)
				ctx.closePath()
				ctx.fill()
				ctx.restore()
			}

			// High Score (right)
			ctx.fillStyle = "#ffffff"
			ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH - 150, 22)

			// Reset shadow
			ctx.shadowBlur = 0
		}

		// Update game logic
		const update = (timestamp: number) => {
			// Update invincibility timer
			if (invincibleRef.current) {
				invincibleTimerRef.current += 16
				if (invincibleTimerRef.current >= INVINCIBLE_DURATION) {
					invincibleRef.current = false
					invincibleTimerRef.current = 0
				}
			}

			// Handle player movement
			const HUD_HEIGHT = 35
			if (keysPressed.current.has("ArrowRight") || keysPressed.current.has("d") || keysPressed.current.has("D")) {
				player.x = Math.min(CANVAS_WIDTH - player.width, player.x + player.speed)
			}
			if (keysPressed.current.has("ArrowLeft") || keysPressed.current.has("a") || keysPressed.current.has("A")) {
				player.x = Math.max(0, player.x - player.speed)
			}
			if (keysPressed.current.has("ArrowUp") || keysPressed.current.has("w") || keysPressed.current.has("W")) {
				player.y = Math.max(HUD_HEIGHT, player.y - player.speed)
			}
			if (keysPressed.current.has("ArrowDown") || keysPressed.current.has("s") || keysPressed.current.has("S")) {
				player.y = Math.min(CANVAS_HEIGHT - player.height, player.y + player.speed)
			}

			// Save player position to ref
			playerPosRef.current = { x: player.x, y: player.y }

			// Handle shooting
			if (keysPressed.current.has(" ") && timestamp - lastShotTime > SHOT_COOLDOWN) {
				bullets.push({
					x: player.x + player.width / 2 - BULLET_WIDTH / 2,
					y: player.y,
					width: BULLET_WIDTH,
					height: BULLET_HEIGHT,
					speed: 8,
					active: true,
				})
				lastShotTime = timestamp
			}

			// Update bullets
			bullets.forEach((bullet) => {
				bullet.y -= bullet.speed
				if (bullet.y < -bullet.height) {
					bullet.active = false
				}
			})

			// Update life pickups
			lifePickups.forEach((pickup, pickupIndex) => {
				if (pickup.active) {
					pickup.y += pickup.speed

					// Check collision with player
					if (checkCollision(player, pickup)) {
						pickup.active = false
						if (livesRef.current < MAX_LIVES) {
							livesRef.current += 1
							setLives(livesRef.current)
							createExplosion(pickup.x + pickup.width / 2, pickup.y + pickup.height / 2, "#ff6b9d")
						}
						lifePickups.splice(pickupIndex, 1)
					}

					// Remove if off screen
					if (pickup.y > CANVAS_HEIGHT) {
						pickup.active = false
						lifePickups.splice(pickupIndex, 1)
					}
				}
			})

			// Spawn enemies
			enemySpawnTimer += 16
			if (enemySpawnTimer > ENEMY_SPAWN_RATE) {
				spawnEnemy()
				enemySpawnTimer = 0
			}

			// Update enemies
			enemies.forEach((enemy, enemyIndex) => {
				enemy.y += enemy.speed

				// Check collision with player (only if not invincible)
				if (!invincibleRef.current && checkCollision(player, enemy)) {
					createExplosion(player.x + player.width / 2, player.y + player.height / 2, "#4ecdc4")
					enemies.splice(enemyIndex, 1)
					livesRef.current -= 1
					setLives(livesRef.current)

					// Activate invincibility
					invincibleRef.current = true
					invincibleTimerRef.current = 0

					if (livesRef.current <= 0) {
						setGameState("gameOver")
						if (localScore > highScore) {
							setHighScore(localScore)
							localStorage.setItem("octoHighScore", localScore.toString())
						}
					}
				}

				// Check collision with bullets
				bullets.forEach((bullet, bulletIndex) => {
					if (bullet.active && checkCollision(bullet, enemy)) {
						bullet.active = false
						enemy.health -= 1

						if (enemy.health <= 0) {
							createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2)
							enemies.splice(enemyIndex, 1)
							localScore += 10 * currentLevel
							setScore(localScore)

							// Fibonacci-style level progression
							const levelThresholds = [0, 100, 200, 300, 500, 800, 1300, 2100, 3400, 5500, 8900]
							for (let i = levelThresholds.length - 1; i >= 0; i--) {
								if (localScore >= levelThresholds[i]) {
									const newLevel = i + 1
									if (newLevel > currentLevel) {
										currentLevel = newLevel
										setLevel(currentLevel)
									}
									break
								}
							}
						}
					}
				})

				// Remove enemies that are off screen
				if (enemy.y > CANVAS_HEIGHT) {
					enemies.splice(enemyIndex, 1)
				}
			})

			// Update particles
			particles.forEach((particle, index) => {
				particle.x += particle.vx
				particle.y += particle.vy
				particle.life -= 0.02
				if (particle.life <= 0) {
					particles.splice(index, 1)
				}
			})

			// Remove inactive bullets
			for (let i = bullets.length - 1; i >= 0; i--) {
				if (!bullets[i].active) {
					bullets.splice(i, 1)
				}
			}
		}

		// Main game loop
		const gameLoopFunc = (timestamp: number) => {
			drawBackground()
			update(timestamp)
			drawParticles()
			drawLifePickups()
			drawEnemies()
			drawBullets()
			drawPlayer()
			drawHUD()

			animationId = requestAnimationFrame(gameLoopFunc)
		}

		// Handle keyboard input
		const handleKeyDown = (e: KeyboardEvent) => {
			const gameKeys = ["w", "a", "s", "d", "W", "A", "S", "D", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "]
			if (gameKeys.includes(e.key)) {
				e.preventDefault()
				keysPressed.current.add(e.key)
			}
		}

		const handleKeyUp = (e: KeyboardEvent) => {
			const gameKeys = ["w", "a", "s", "d", "W", "A", "S", "D", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "]
			if (gameKeys.includes(e.key)) {
				keysPressed.current.delete(e.key)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		window.addEventListener("keyup", handleKeyUp)

		animationId = requestAnimationFrame(gameLoopFunc)

		return () => {
			cancelAnimationFrame(animationId)
			window.removeEventListener("keydown", handleKeyDown)
			window.removeEventListener("keyup", handleKeyUp)
		}
	}, [gameState, highScore])

	const startGame = () => {
		setGameState("playing")
		setScore(0)
		setLevel(1)
		setLives(3)
		livesRef.current = 3
		invincibleRef.current = false
		invincibleTimerRef.current = 0
		playerPosRef.current = null // Reset to starting position
	}

	const pauseGame = () => {
		setGameState("paused")
	}

	const resumeGame = () => {
		setGameState("playing")
	}

	const restartGame = () => {
		startGame()
	}

	return (
		<div className="flex flex-col items-center justify-center gap-6 p-4">
			<div className="relative">
				<canvas
					ref={canvasRef}
					width={600}
					height={450}
					className="border-4 border-primary rounded-lg bg-[#0a0e27]"
				/>

				{/* Menu Overlay */}
				{gameState === "menu" && (
					<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
						<p className="text-white/70 mb-8 text-center max-w-md">
							Use WASD or Arrow Keys to move<br />
							Press SPACE to shoot
						</p>
						<Button onClick={startGame} size="lg" className="text-xl px-8 py-6">
							START GAME
						</Button>
						{highScore > 0 && (
							<p className="text-white/50 mt-4">High Score: {highScore}</p>
						)}
					</div>
				)}				{/* Paused Overlay */}
				{gameState === "paused" && (
					<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
						<h2 className="text-4xl font-bold text-white mb-8">PAUSED</h2>
						<div className="flex gap-4">
							<Button onClick={resumeGame} size="lg">
								Resume
							</Button>
							<Button onClick={restartGame} variant="outline" size="lg">
								Restart
							</Button>
						</div>
					</div>
				)}

				{/* Game Over Overlay */}
				{gameState === "gameOver" && (
					<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg">
						<h2 className="text-4xl font-bold text-white mb-4">GAME OVER</h2>
						<p className="text-2xl text-white/70 mb-2">Final Score: {score}</p>
						<p className="text-xl text-white/50 mb-8">Level Reached: {level}</p>
						{score > highScore && (
							<p className="text-2xl text-yellow-400 mb-4">🎉 NEW HIGH SCORE! 🎉</p>
						)}
						<Button onClick={restartGame} size="lg" className="text-xl px-8 py-6">
							PLAY AGAIN
						</Button>
					</div>
				)}
			</div>

			{/* Game Controls */}
			{gameState === "playing" && (
				<div className="flex gap-4">
					<Button onClick={pauseGame} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
						⏸ Pause
					</Button>
				</div>
			)}

			{/* Dynamic Tips */}
			<div className="text-center text-sm text-muted-foreground max-w-2xl">
				<p className="mb-2 transition-opacity duration-500">
					{gameTips[currentTip]}
				</p>
			</div>
		</div>
	)
}
