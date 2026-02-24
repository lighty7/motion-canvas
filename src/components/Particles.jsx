import React, { useEffect, useRef } from 'react'
import { useAnimationStore } from '../stores/animationStore'

const Particles = () => {
  const { isPreviewPlaying, keyframes, shapes } = useAnimationStore()
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const particleIdRef = useRef(0)
  const lastPositionsRef = useRef({})
  const startTimeRef = useRef(null)

  const createParticle = (x, y, color) => {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 3 + 1
    const size = Math.random() * 4 + 2
    
    return {
      id: particleIdRef.current++,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      color,
      life: 1,
      decay: Math.random() * 0.02 + 0.01,
    }
  }

  useEffect(() => {
    if (!isPreviewPlaying || keyframes.length < 2 || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      particlesRef.current = []
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    lastPositionsRef.current = {}
    particlesRef.current = []
    startTimeRef.current = null
    
    shapes.forEach(shape => {
      const firstKf = keyframes[0]
      const firstShape = firstKf.shapes.find(s => s.id === shape.id)
      if (firstShape) {
        lastPositionsRef.current[shape.id] = { 
          x: firstShape.x + firstShape.width / 2, 
          y: firstShape.y + firstShape.height / 2 
        }
      }
    })

    const duration = (useAnimationStore.getState().animationSettings.duration || 1) * 1000

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const currentKeyframeIndex = Math.min(
        Math.floor(progress * (keyframes.length - 1)),
        keyframes.length - 2
      )
      const nextKeyframeIndex = Math.min(currentKeyframeIndex + 1, keyframes.length - 1)
      const keyframeProgress = (progress * (keyframes.length - 1)) - currentKeyframeIndex

      const currentKf = keyframes[currentKeyframeIndex]
      const nextKf = keyframes[nextKeyframeIndex]

      const interpolatedShapes = shapes.map(shape => {
        const currentShape = currentKf.shapes.find(s => s.id === shape.id)
        const nextShape = nextKf.shapes.find(s => s.id === shape.id)
        
        if (!currentShape || !nextShape) return shape
        
        return {
          ...shape,
          x: currentShape.x + (nextShape.x - currentShape.x) * keyframeProgress,
          y: currentShape.y + (nextShape.y - currentShape.y) * keyframeProgress,
          width: currentShape.width + (nextShape.width - currentShape.width) * keyframeProgress,
          height: currentShape.height + (nextShape.height - currentShape.height) * keyframeProgress,
          color: nextShape.color,
          rotation: currentShape.rotation + (nextShape.rotation - currentShape.rotation) * keyframeProgress,
        }
      })

      particlesRef.current = particlesRef.current
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1,
          life: p.life - p.decay,
        }))
        .filter(p => p.life > 0)

      interpolatedShapes.forEach(shape => {
        const centerX = shape.x + shape.width / 2
        const centerY = shape.y + shape.height / 2
        const lastPos = lastPositionsRef.current[shape.id]
        
        if (lastPos) {
          const dx = centerX - lastPos.x
          const dy = centerY - lastPos.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist > 8) {
            for (let i = 0; i < 2; i++) {
              particlesRef.current.push(createParticle(centerX, centerY, shape.color))
            }
            lastPositionsRef.current[shape.id] = { x: centerX, y: centerY }
          }
        } else {
          lastPositionsRef.current[shape.id] = { x: centerX, y: centerY }
        }
      })

      particlesRef.current.forEach(particle => {
        ctx.globalAlpha = particle.life
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        particlesRef.current = []
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPreviewPlaying, keyframes])

  if (!isPreviewPlaying || keyframes.length < 2) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1000 }}
    />
  )
}

export default Particles
