import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useAnimationStore } from '../stores/animationStore'

const Shape = ({ shape }) => {
  const { 
    selectedShapeIds, 
    selectShape, 
    updateShape, 
    isRecording, 
    isPreviewPlaying, 
    keyframes, 
    animationSettings,
    saveToHistory,
  } = useAnimationStore()
  
  const shapeRef = useRef(null)
  const shapeDataRef = useRef({ x: shape.x, y: shape.y, width: shape.width, height: shape.height, rotation: shape.rotation })
  
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })
  const [rotateStart, setRotateStart] = useState({ angle: 0, centerX: 0, centerY: 0 })

  const isSelected = selectedShapeIds.includes(shape.id)
  const hasKeyframes = keyframes.length > 1
  const shouldAnimate = isPreviewPlaying && hasKeyframes

  useEffect(() => {
    shapeDataRef.current = { x: shape.x, y: shape.y, width: shape.width, height: shape.height, rotation: shape.rotation }
  }, [shape.x, shape.y, shape.width, shape.height, shape.rotation])

  const keyframesCSS = useMemo(() => {
    if (!shouldAnimate || keyframes.length < 2) return ''
    
    const animName = `preview_anim_${shape.id}`
    let keyframeRules = ''
    
    keyframes.forEach((kf) => {
      const shapeState = kf.shapes.find(s => s.id === shape.id) || shape
      const firstKf = keyframes[0]
      const firstShape = firstKf.shapes.find(s => s.id === shape.id) || shape
      
      const translateX = shapeState.x - firstShape.x
      const translateY = shapeState.y - firstShape.y
      const scale = shapeState.scale / firstShape.scale
      const rotate = shapeState.rotation - firstShape.rotation
      
      keyframeRules += `
        ${kf.timestamp}% {
          transform: translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg);
          background-color: ${shapeState.color};
          opacity: ${shapeState.opacity};
          border-radius: ${shapeState.borderRadius};
        }
      `
    })

    return `@keyframes ${animName} {${keyframeRules}}`
  }, [shouldAnimate, keyframes, shape.id, shape])

  const getAnimationStyle = () => {
    if (!shouldAnimate) return {}
    
    const animName = `preview_anim_${shape.id}`
    const { duration, easing, delay, repeat, direction, fillMode } = animationSettings
    
    return {
      animation: `${animName} ${duration}s ${easing} ${delay}s ${repeat} ${direction} ${fillMode}`,
    }
  }

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return
    e.stopPropagation()
    selectShape(shape.id, e.shiftKey)
    setIsDragging(true)
    setDragStart({ x: e.clientX - shapeDataRef.current.x, y: e.clientY - shapeDataRef.current.y })
  }

  const handleResizeMouseDown = (e) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({ 
      width: shapeDataRef.current.width, 
      height: shapeDataRef.current.height,
      x: e.clientX,
      y: e.clientY 
    })
  }

  const handleRotateMouseDown = (e) => {
    e.stopPropagation()
    setIsRotating(true)
    const current = shapeDataRef.current
    const centerX = current.x + current.width / 2
    const centerY = current.y + current.height / 2
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
    setRotateStart({ angle: startAngle - current.rotation, centerX, centerY })
  }

  useEffect(() => {
    let moved = false

    const handleMouseMove = (e) => {
      if (isDragging) {
        moved = true
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        shapeDataRef.current = { ...shapeDataRef.current, x: newX, y: newY }
        updateShape(shape.id, { x: newX, y: newY })
      }
      if (isResizing) {
        moved = true
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        const newWidth = Math.max(20, resizeStart.width + deltaX)
        const newHeight = Math.max(20, resizeStart.height + deltaY)
        shapeDataRef.current = { ...shapeDataRef.current, width: newWidth, height: newHeight }
        updateShape(shape.id, { width: newWidth, height: newHeight })
      }
      if (isRotating) {
        const currentAngle = Math.atan2(e.clientY - rotateStart.centerY, e.clientX - rotateStart.centerX) * (180 / Math.PI)
        const newRotation = currentAngle - rotateStart.angle
        shapeDataRef.current = { ...shapeDataRef.current, rotation: newRotation }
        updateShape(shape.id, { rotation: newRotation })
      }
    }

    const handleMouseUp = () => {
      if (moved && (isDragging || isResizing)) {
        saveToHistory()
      }
      setIsDragging(false)
      setIsResizing(false)
      setIsRotating(false)
    }

    if (isDragging || isResizing || isRotating) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, isRotating, dragStart, resizeStart, rotateStart, shape.id, updateShape, saveToHistory])

  const baseStyle = {
    position: 'absolute',
    left: shape.x,
    top: shape.y,
    width: shape.width,
    height: shape.height,
    backgroundColor: shape.color,
    borderRadius: shape.borderRadius,
    opacity: shape.opacity,
    transform: `rotate(${shape.rotation}deg)`,
    cursor: isDragging ? 'grabbing' : 'grab',
    ...getAnimationStyle(),
  }

  return (
    <>
      {shouldAnimate && <style>{keyframesCSS}</style>}
      <div
        ref={shapeRef}
        className={`shape ${isSelected ? 'selected' : ''}`}
        style={baseStyle}
        onMouseDown={handleMouseDown}
      >
        {isSelected && !isRecording && !shouldAnimate && (
          <>
            <div
              className="resize-handle absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm cursor-nwse-resize"
              style={{ right: -6, bottom: -6 }}
              onMouseDown={handleResizeMouseDown}
            />
            <div
              className="rotate-handle absolute w-4 h-4 bg-white border-2 border-red-500 rounded-full cursor-grab flex items-center justify-center"
              style={{ left: '50%', top: -20, transform: 'translateX(-50%)' }}
              onMouseDown={handleRotateMouseDown}
            >
              <div className="w-0.5 h-2 bg-red-500" />
            </div>
            {selectedShapeIds.length > 1 && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                {selectedShapeIds.length} selected
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Shape
