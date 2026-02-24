import React from 'react'
import Shape from './Shape'
import Particles from './Particles'
import Timeline from './Timeline'
import { useAnimationStore } from '../stores/animationStore'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

const Canvas = () => {
  const { shapes, selectShape, isRecording, keyframes, isPreviewPlaying } = useAnimationStore()

  useKeyboardShortcuts()

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      selectShape(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="relative flex-1 bg-slate-800 border-2 border-slate-600 rounded-lg overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
        onClick={handleCanvasClick}
      >
        {shapes.map((shape) => (
          <Shape key={shape.id} shape={shape} />
        ))}
        
        <Particles />
        
        {shapes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <p className="text-lg mb-2">Add shapes from the left panel</p>
              <p className="text-sm">Click and drag to move, resize, or rotate</p>
              <p className="text-xs mt-4 text-slate-600">Press Space to preview, Del to delete</p>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
            <span className="font-medium">Recording... (Ctrl+K to add keyframe)</span>
          </div>
        )}

        {isPreviewPlaying && keyframes.length > 1 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <span>▶ Playing Animation ({keyframes.length} keyframes)</span>
          </div>
        )}
      </div>

      <Timeline />
    </div>
  )
}

export default Canvas
