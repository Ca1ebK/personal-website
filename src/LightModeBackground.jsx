import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'

// Constants
const TAU = Math.PI * 2
const particleCount = 700
const particlePropCount = 9
const particlePropsLength = particleCount * particlePropCount
const rangeY = 100
const baseTTL = 50
const rangeTTL = 150
const baseSpeed = 0.1
const rangeSpeed = 2
const baseRadius = 1
const rangeRadius = 4
const baseHue = 20 // Illini orange base
const rangeHue = 220 // Wide range to include blue
const noiseSteps = 8
const xOff = 0.00125
const yOff = 0.00125
const zOff = 0.0005
const backgroundColor = 'hsla(30,20%,97%,1)' // Warm off-white with subtle orange tint

// Helper functions
function rand(max) {
  return Math.random() * max
}

function randRange(range) {
  return (Math.random() - 0.5) * range
}

function cos(angle) {
  return Math.cos(angle)
}

function sin(angle) {
  return Math.sin(angle)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function fadeInOut(t, m) {
  const hm = 0.5 * m
  return Math.abs((t + hm) % m - hm) / hm
}

export default function LightModeBackground() {
  const containerRef = useRef(null)
  const canvasRef = useRef({ a: null, b: null })
  const ctxRef = useRef({ a: null, b: null })
  const centerRef = useRef([0, 0])
  const tickRef = useRef(0)
  const simplexRef = useRef(null)
  const particlePropsRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create canvases
    const canvas = {
      a: document.createElement('canvas'),
      b: document.createElement('canvas')
    }
    canvas.b.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    `
    container.appendChild(canvas.b)
    
    const ctx = {
      a: canvas.a.getContext('2d'),
      b: canvas.b.getContext('2d')
    }

    canvasRef.current = canvas
    ctxRef.current = ctx

    // Initialize SimplexNoise
    const simplex = createNoise3D()
    simplexRef.current = simplex

    // Initialize particles
    const particleProps = new Float32Array(particlePropsLength)
    particlePropsRef.current = particleProps

    function initParticle(i) {
      const x = rand(canvas.a.width)
      const y = centerRef.current[1] + randRange(rangeY)
      const vx = 0
      const vy = 0
      const life = 0
      const ttl = baseTTL + rand(rangeTTL)
      const speed = baseSpeed + rand(rangeSpeed)
      const radius = baseRadius + rand(rangeRadius)
      const hue = baseHue + rand(rangeHue)

      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i)
    }

    function initParticles() {
      tickRef.current = 0
      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        initParticle(i)
      }
    }

    function updateParticle(i) {
      const i2 = 1 + i
      const i3 = 2 + i
      const i4 = 3 + i
      const i5 = 4 + i
      const i6 = 5 + i
      const i7 = 6 + i
      const i8 = 7 + i
      const i9 = 8 + i

      let x = particleProps[i]
      let y = particleProps[i2]
      const n = simplex(x * xOff, y * yOff, tickRef.current * zOff) * noiseSteps * TAU
      let vx = lerp(particleProps[i3], cos(n), 0.5)
      let vy = lerp(particleProps[i4], sin(n), 0.5)
      let life = particleProps[i5]
      const ttl = particleProps[i6]
      const speed = particleProps[i7]
      const x2 = x + vx * speed
      const y2 = y + vy * speed
      const radius = particleProps[i8]
      const hue = particleProps[i9]

      drawParticle(x, y, x2, y2, life, ttl, radius, hue)

      life++

      particleProps[i] = x2
      particleProps[i2] = y2
      particleProps[i3] = vx
      particleProps[i4] = vy
      particleProps[i5] = life

      if (checkBounds(x, y) || life > ttl) {
        initParticle(i)
      }
    }

    function drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
      ctx.a.save()
      ctx.a.lineCap = 'round'
      ctx.a.lineWidth = radius
      // Illini themed: map to orange or blue
      const normalizedHue = ((hue % 360) + 360) % 360
      const isOrange = normalizedHue < 120 || normalizedHue > 300
      const finalHue = isOrange ? 20 : 220
      const saturation = isOrange ? 90 : 70
      const lightness = isOrange ? 55 : 40
      ctx.a.strokeStyle = `hsla(${finalHue},${saturation}%,${lightness}%,${fadeInOut(life, ttl)})`
      ctx.a.beginPath()
      ctx.a.moveTo(x, y)
      ctx.a.lineTo(x2, y2)
      ctx.a.stroke()
      ctx.a.closePath()
      ctx.a.restore()
    }

    function checkBounds(x, y) {
      return (
        x > canvas.a.width ||
        x < 0 ||
        y > canvas.a.height ||
        y < 0
      )
    }

    function drawParticles() {
      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        updateParticle(i)
      }
    }

    function resize() {
      const { innerWidth, innerHeight } = window
      
      canvas.a.width = innerWidth
      canvas.a.height = innerHeight

      ctx.a.drawImage(canvas.b, 0, 0)

      canvas.b.width = innerWidth
      canvas.b.height = innerHeight
      
      ctx.b.drawImage(canvas.a, 0, 0)

      centerRef.current[0] = 0.5 * canvas.a.width
      centerRef.current[1] = 0.5 * canvas.a.height
    }

    function renderGlow() {
      ctx.b.save()
      ctx.b.filter = 'blur(8px)'
      ctx.b.globalCompositeOperation = 'multiply'
      ctx.b.drawImage(canvas.a, 0, 0)
      ctx.b.restore()

      ctx.b.save()
      ctx.b.filter = 'blur(4px)'
      ctx.b.globalCompositeOperation = 'multiply'
      ctx.b.drawImage(canvas.a, 0, 0)
      ctx.b.restore()
    }

    function renderToScreen() {
      ctx.b.save()
      ctx.b.globalCompositeOperation = 'source-over'
      ctx.b.drawImage(canvas.a, 0, 0)
      ctx.b.restore()
    }

    function draw() {
      tickRef.current++

      ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height)

      ctx.b.fillStyle = backgroundColor
      ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height)

      drawParticles()
      renderGlow()
      renderToScreen()

      animationFrameRef.current = window.requestAnimationFrame(draw)
    }

    // Setup
    resize()
    initParticles()
    draw()

    // Handle resize
    window.addEventListener('resize', resize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
      if (container.contains(canvas.b)) {
        container.removeChild(canvas.b)
      }
    }
  }, [])

  return <div ref={containerRef} className="content--canvas" />
}

