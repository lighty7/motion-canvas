import React from 'react'
import { useAnimationStore } from '../stores/animationStore'

const shapeTypes = [
  { type: 'circle', label: 'Circle', icon: '●' },
  { type: 'square', label: 'Square', icon: '■' },
  { type: 'rectangle', label: 'Rectangle', icon: '▬' },
]

const LeftPanel = () => {
  const { 
    addShape, 
    shapes, 
    selectedShapeIds, 
    deleteShape, 
    clearCanvas, 
    isRecording, 
    keyframes,
    duplicateSelectedShapes,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useAnimationStore()

  const handleAddShape = (type) => {
    addShape(type)
  }

  return (
    <div className="w-56 bg-slate-900 border-r border-slate-700 p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Add Shape</h2>
        <div className="space-y-2">
          {shapeTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => handleAddShape(type)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <span className="text-2xl text-blue-400">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
            canUndo()
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
          }`}
          title="Ctrl+Z"
        >
          ↩ Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
            canRedo()
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
          }`}
          title="Ctrl+Y"
        >
          ↪ Redo
        </button>
      </div>

      {shapes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Shapes</h2>
            <span className="text-xs text-slate-500">{shapes.length}</span>
          </div>
          
          <div className="flex gap-2 mb-3">
            <button
              onClick={duplicateSelectedShapes}
              disabled={selectedShapeIds.length === 0}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedShapeIds.length > 0
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
              }`}
              title="Ctrl+D"
            >
              ⧉ Duplicate
            </button>
            <button
              onClick={() => useAnimationStore.getState().deleteSelectedShapes()}
              disabled={selectedShapeIds.length === 0}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedShapeIds.length > 0
                  ? 'bg-red-900/50 hover:bg-red-900 text-red-400'
                  : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
              }`}
              title="Delete"
            >
              🗑 Delete
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {shapes.map((shape) => (
              <div
                key={shape.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  selectedShapeIds.includes(shape.id) ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                onClick={(e) => useAnimationStore.getState().selectShape(shape.id, e.shiftKey)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: shape.color }}
                  />
                  <span className="text-slate-200 capitalize text-sm">{shape.type}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteShape(shape.id)
                  }}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {keyframes.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-sm text-slate-400">
            <span className="text-yellow-400 font-medium">{keyframes.length}</span> keyframe{keyframes.length !== 1 ? 's' : ''} recorded
          </div>
          {isRecording && (
            <div className="text-xs text-red-400 mt-1">Recording in progress...</div>
          )}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-slate-700">
        <button
          onClick={clearCanvas}
          className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-400 rounded-lg transition-colors"
        >
          Clear Canvas
        </button>
      </div>

      <div className="text-xs text-slate-600 space-y-1">
        <div className="text-slate-500 font-medium mb-1">Shortcuts:</div>
        <div>Space - Play/Pause</div>
        <div>Del - Delete</div>
        <div>Ctrl+D - Duplicate</div>
        <div>Ctrl+Z - Undo</div>
        <div>Ctrl+Shift+Z - Redo</div>
        <div>Ctrl+K - Add keyframe</div>
        <div>Shift+Click - Multi-select</div>
      </div>
    </div>
  )
}

export default LeftPanel
