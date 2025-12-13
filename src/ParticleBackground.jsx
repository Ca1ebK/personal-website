import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'

// Constants
const TAU = Math.PI * 2
const circleCount = 150
const circlePropCount = 8
const circlePropsLength = circleCount * circlePropCount
// HALVED SPEED: original was 0.1 and 1
const baseSpeed = 0.05
const rangeSpeed = 0.5
const baseTTL = 150
const rangeTTL = 200
const baseRadius = 100
const rangeRadius = 200
const rangeHue = 60
const xOff = 0.0015
const yOff = 0.0015
const zOff = 0.0015
const backgroundColor = 'hsla(0,0%,5%,1)'

// Helper functions
function rand(max) {
  return Math.random() * max
}

function cos(angle) {
  return Math.cos(angle)
}

function sin(angle) {
  return Math.sin(angle)
}

function fadeInOut(t, m) {
  const hm = 0.5 * m
  return Math.abs((t + hm) % m - hm) / hm
}

export default function ParticleBackground() {
  const containerRef = useRef(null)
  const canvasRef = useRef({ a: null, b: null })
  const ctxRef = useRef({ a: null, b: null })
  const circlePropsRef = useRef(null)
  const simplexRef = useRef(null)
  const baseHueRef = useRef(220)
  const animationFrameRef = useRef(null)
  const lastFrameTimeRef = useRef(0)

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

    // Initialize circles
    const circleProps = new Float32Array(circlePropsLength)
    circlePropsRef.current = circleProps

    function initCircle(i) {
      const x = rand(canvas.a.width)
      const y = rand(canvas.a.height)
      const n = simplex(x * xOff, y * yOff, baseHueRef.current * zOff)
      const t = rand(TAU)
      const speed = baseSpeed + rand(rangeSpeed)
      const vx = speed * cos(t)
      const vy = speed * sin(t)
      const life = 0
      const ttl = baseTTL + rand(rangeTTL)
      const radius = baseRadius + rand(rangeRadius)
      const hue = baseHueRef.current + n * rangeHue

      circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i)
    }

    function initCircles() {
      for (let i = 0; i < circlePropsLength; i += circlePropCount) {
        initCircle(i)
      }
    }

    function updateCircle(i) {
      const i2 = 1 + i
      const i3 = 2 + i
      const i4 = 3 + i
      const i5 = 4 + i
      const i6 = 5 + i
      const i7 = 6 + i
      const i8 = 7 + i

      let x = circleProps[i]
      let y = circleProps[i2]
      const vx = circleProps[i3]
      const vy = circleProps[i4]
      let life = circleProps[i5]
      const ttl = circleProps[i6]
      const radius = circleProps[i7]
      const hue = circleProps[i8]

      drawCircle(x, y, life, ttl, radius, hue)

      life++

      circleProps[i] = x + vx
      circleProps[i2] = y + vy
      circleProps[i5] = life

      if (checkBounds(x, y, radius) || life > ttl) {
        initCircle(i)
      }
    }

    function drawCircle(x, y, life, ttl, radius, hue) {
      ctx.a.save()
      // DULLER: reduced saturation from 60% to 35%, reduced lightness from 30% to 22%
      // Also reduced alpha by multiplying fadeInOut by 0.6
      const fade = fadeInOut(life, ttl) * 0.6
      ctx.a.fillStyle = `hsla(${hue},35%,22%,${fade})`
      ctx.a.beginPath()
      ctx.a.arc(x, y, radius, 0, TAU)
      ctx.a.fill()
      ctx.a.closePath()
      ctx.a.restore()
    }

    function checkBounds(x, y, radius) {
      return (
        x < -radius ||
        x > canvas.a.width + radius ||
        y < -radius ||
        y > canvas.a.height + radius
      )
    }

    function updateCircles() {
      // HALVED: hue shift slowed from 1 to 0.5 per frame
      baseHueRef.current += 0.5
      for (let i = 0; i < circlePropsLength; i += circlePropCount) {
        updateCircle(i)
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
    }

    function render() {
      ctx.b.save()
      ctx.b.filter = 'blur(50px)'
      ctx.b.drawImage(canvas.a, 0, 0)
      ctx.b.restore()
    }

    function draw(currentTime) {
      // Frame rate limiter for smoother, slower animation (~30fps)
      if (currentTime - lastFrameTimeRef.current < 33) {
        animationFrameRef.current = window.requestAnimationFrame(draw)
        return
      }
      lastFrameTimeRef.current = currentTime

      ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height)
      ctx.b.fillStyle = backgroundColor
      ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height)
      updateCircles()
      render()
      animationFrameRef.current = window.requestAnimationFrame(draw)
    }

    // Setup
    resize()
    initCircles()
    draw(0)

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

