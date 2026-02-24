import React from 'react'
import { useAnimationStore } from '../stores/animationStore'

const Timeline = () => {
  const { keyframes, isRecording, isPreviewPlaying, removeKeyframe, togglePreview, stopPreview, shapes } = useAnimationStore()

  const handleKeyframeClick = (kf) => {
    if (isPreviewPlaying) {
      stopPreview()
    }
  }

  return (
    <div className="h-20 bg-slate-900 border-t border-slate-700 px-4 flex flex-col">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300">Timeline</span>
          <span className="text-xs text-slate-500">({keyframes.length} keyframes)</span>
        </div>
        
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-400">Recording - Press Ctrl+K to add keyframe</span>
          </div>
        )}
        
        {isPreviewPlaying && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">Playing animation...</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center gap-1 overflow-x-auto pb-2">
        {keyframes.length === 0 ? (
          <div className="text-xs text-slate-500 italic">
            Start recording to capture keyframes
          </div>
        ) : (
          <>
            {keyframes.map((kf, idx) => (
              <div
                key={kf.id}
                className="flex-shrink-0 relative group"
                onClick={() => handleKeyframeClick(kf)}
              >
                <div
                  className={`h-10 px-3 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    kf.timestamp === 0
                      ? 'bg-green-600 text-white'
                      : kf.timestamp === 100
                        ? 'bg-blue-600 text-white'
                        : 'bg-yellow-600 text-white hover:bg-yellow-500'
                  }`}
                >
                  <span className="text-xs font-bold">{kf.timestamp}%</span>
                </div>
                
                {kf.timestamp !== 0 && kf.timestamp !== 100 && !isRecording && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeKeyframe(kf.id)
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
                
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] text-slate-500 whitespace-nowrap">
                  Frame {idx + 1}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {keyframes.length > 1 && (
        <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={isPreviewPlaying ? stopPreview : togglePreview}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${
              isPreviewPlaying
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPreviewPlaying ? (
              <>
                <span className="text-sm">■</span> Stop
              </>
            ) : (
              <>
                <span className="text-sm">▶</span> Play
              </>
            )}
          </button>
          <span className="text-xs text-slate-500">
            {shapes.length} shape{shapes.length !== 1 ? 's' : ''} × {keyframes.length} keyframes
          </span>
        </div>
      )}
    </div>
  )
}

export default Timeline
