import React from 'react'
import { useAnimationStore } from '../stores/animationStore'
import { generateReactComponent, generateTailwindComponent, generateMultiShapeComponent } from '../utils/codeExporter'

const BottomPanel = () => {
  const {
    shapes,
    isRecording,
    isPreviewPlaying,
    keyframes,
    startRecording,
    stopRecording,
    addKeyframe,
    togglePreview,
    stopPreview,
    setGeneratedCode,
    toggleCodeModal,
    clearKeyframes,
    animationSettings,
  } = useAnimationStore()

  const canRecord = shapes.length > 0
  const canExport = keyframes.length >= 2

  const handleStartRecording = () => {
    if (canRecord) {
      clearKeyframes()
      startRecording()
    }
  }

  const handleStopRecording = () => {
    stopRecording()
  }

  const handleAddKeyframe = () => {
    addKeyframe()
  }

  const handleExport = (type) => {
    if (keyframes.length >= 2) {
      const settings = useAnimationStore.getState().animationSettings
      let code
      if (shapes.length > 1) {
        code = generateMultiShapeComponent(keyframes, settings, shapes)
      } else {
        code = type === 'tailwind'
          ? generateTailwindComponent(keyframes, settings)
          : generateReactComponent(keyframes, settings)
      }
      setGeneratedCode(code)
      toggleCodeModal()
    }
  }

  const handlePreview = () => {
    if (isPreviewPlaying) {
      stopPreview()
    } else {
      togglePreview()
    }
  }

  return (
    <div className="h-16 bg-slate-900 border-t border-slate-700 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            disabled={!canRecord}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-colors ${
              canRecord
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span className="w-3 h-3 bg-white rounded-full" />
            Record
          </button>
        ) : (
          <>
            <button
              onClick={handleAddKeyframe}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
              title="Ctrl+K"
            >
              + Keyframe
            </button>
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-2 px-5 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
            >
              <span className="w-3 h-3 bg-red-500 rounded-sm" />
              Stop
            </button>
          </>
        )}

        <button
          onClick={handlePreview}
          disabled={!canExport}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            canExport
              ? isPreviewPlaying
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isPreviewPlaying ? '⏹ Stop' : '▶ Preview'}
        </button>

        {keyframes.length > 0 && (
          <div className="text-sm text-slate-400 ml-2">
            {keyframes.length} kf
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {canExport && (
          <div className="text-sm text-green-400 mr-2">
            ✓ Ready
          </div>
        )}

        <select
          value={animationSettings.easing}
          onChange={(e) => useAnimationStore.getState().setAnimationSettings({ easing: e.target.value })}
          className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded text-slate-200 text-sm"
        >
          <option value="linear">linear</option>
          <option value="ease">ease</option>
          <option value="ease-in">ease-in</option>
          <option value="ease-out">ease-out</option>
          <option value="ease-in-out">ease-in-out</option>
        </select>

        <button
          onClick={() => handleExport('pure')}
          disabled={!canExport}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            canExport
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          Export CSS
        </button>

        <button
          onClick={() => handleExport('tailwind')}
          disabled={!canExport}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            canExport
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          Export Tailwind
        </button>
      </div>
    </div>
  )
}

export default BottomPanel
