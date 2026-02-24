import { create } from 'zustand'

let shapeIdCounter = 0

const createShape = (type, x = 100, y = 100) => {
  shapeIdCounter++
  const defaults = {
    circle: { width: 80, height: 80, borderRadius: '50%' },
    square: { width: 80, height: 80, borderRadius: '0%' },
    rectangle: { width: 120, height: 60, borderRadius: '0%' },
  }
  
  const base = {
    id: shapeIdCounter,
    type,
    x,
    y,
    width: defaults[type]?.width || 80,
    height: defaults[type]?.height || 80,
    rotation: 0,
    scale: 1,
    color: '#3b82f6',
    opacity: 1,
    borderRadius: defaults[type]?.borderRadius || '0%',
  }
  
  return base
}

const cloneShapes = (shapes) => {
  return shapes.map(shape => ({ ...shape }))
}

const MAX_HISTORY = 50

export const useAnimationStore = create((set, get) => ({
  shapes: [],
  selectedShapeIds: [],
  isRecording: false,
  isPreviewPlaying: false,
  keyframes: [],
  animationSettings: {
    duration: 1,
    delay: 0,
    easing: 'ease-in-out',
    repeat: 'infinite',
    direction: 'normal',
    fillMode: 'forwards',
  },
  generatedCode: null,
  showCodeModal: false,
  
  history: [],
  historyIndex: -1,

  saveToHistory: () => {
    const state = get()
    const snapshot = {
      shapes: cloneShapes(state.shapes),
      selectedShapeIds: [...state.selectedShapeIds],
    }
    
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(snapshot)
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift()
      }
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    })
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const prevSnapshot = state.history[state.historyIndex - 1]
        return {
          shapes: cloneShapes(prevSnapshot.shapes),
          selectedShapeIds: [...prevSnapshot.selectedShapeIds],
          historyIndex: state.historyIndex - 1,
        }
      }
      return {}
    })
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const nextSnapshot = state.history[state.historyIndex + 1]
        return {
          shapes: cloneShapes(nextSnapshot.shapes),
          selectedShapeIds: [...nextSnapshot.selectedShapeIds],
          historyIndex: state.historyIndex + 1,
        }
      }
      return {}
    })
  },

  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },

  addShape: (type) => {
    const state = get()
    const offset = state.shapes.length * 20 + 50
    const newShape = createShape(type, 50 + offset, 50 + offset)
    
    set((state) => ({
      shapes: [...state.shapes, newShape],
      selectedShapeIds: [newShape.id],
    }))
    
    get().saveToHistory()
  },

  selectShape: (id, addToSelection = false) => {
    set((state) => {
      if (addToSelection) {
        const isSelected = state.selectedShapeIds.includes(id)
        return {
          selectedShapeIds: isSelected
            ? state.selectedShapeIds.filter(sid => sid !== id)
            : [...state.selectedShapeIds, id]
        }
      }
      return { selectedShapeIds: [id] }
    })
  },

  selectAll: () => {
    set((state) => ({
      selectedShapeIds: state.shapes.map(s => s.id)
    }))
  },

  clearSelection: () => {
    set({ selectedShapeIds: [] })
  },

  updateShape: (id, updates) => {
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        shape.id === id ? { ...shape, ...updates } : shape
      ),
    }))
  },

  updateSelectedShapes: (updates) => {
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        state.selectedShapeIds.includes(shape.id) ? { ...shape, ...updates } : shape
      ),
    }))
  },

  deleteSelectedShapes: () => {
    set((state) => ({
      shapes: state.shapes.filter((shape) => !state.selectedShapeIds.includes(shape.id)),
      selectedShapeIds: [],
    }))
    get().saveToHistory()
  },

  deleteShape: (id) => {
    set((state) => ({
      shapes: state.shapes.filter((shape) => shape.id !== id),
      selectedShapeIds: state.selectedShapeIds.filter(sid => sid !== id),
    }))
    get().saveToHistory()
  },

  duplicateSelectedShapes: () => {
    const state = get()
    if (state.selectedShapeIds.length === 0) return

    const newShapes = []
    const newSelectedIds = []
    
    state.shapes.forEach(shape => {
      if (state.selectedShapeIds.includes(shape.id)) {
        const newShape = {
          ...shape,
          id: ++shapeIdCounter,
          x: shape.x + 30,
          y: shape.y + 30,
        }
        newShapes.push(newShape)
        newSelectedIds.push(newShape.id)
      }
    })

    set((state) => ({
      shapes: [...state.shapes, ...newShapes],
      selectedShapeIds: newSelectedIds,
    }))
    
    get().saveToHistory()
  },

  clearCanvas: () => {
    set({
      shapes: [],
      selectedShapeIds: [],
      keyframes: [],
      isRecording: false,
      isPreviewPlaying: false,
      history: [],
      historyIndex: -1,
    })
  },

  startRecording: () => {
    const state = get()
    if (state.shapes.length === 0) return
    
    const startKeyframe = {
      id: Date.now(),
      timestamp: 0,
      shapes: cloneShapes(state.shapes),
    }
    set({
      isRecording: true,
      keyframes: [startKeyframe],
    })
  },

  addKeyframe: () => {
    const state = get()
    if (!state.isRecording || state.shapes.length === 0) return

    const keyframeCount = state.keyframes.length
    const timestamp = keyframeCount === 0 ? 0 : Math.min(100, Math.round((keyframeCount) * (100 / (keyframeCount + 1))))
    
    const newKeyframe = {
      id: Date.now(),
      timestamp,
      shapes: cloneShapes(state.shapes),
    }

    set((state) => ({
      keyframes: [...state.keyframes, newKeyframe].sort((a, b) => a.timestamp - b.timestamp),
    }))
  },

  removeKeyframe: (keyframeId) => {
    set((state) => ({
      keyframes: state.keyframes.filter(k => k.id !== keyframeId),
    }))
  },

  stopRecording: () => {
    const state = get()
    if (state.shapes.length === 0) {
      set({ isRecording: false })
      return
    }

    const finalKeyframe = {
      id: Date.now(),
      timestamp: 100,
      shapes: cloneShapes(state.shapes),
    }

    set((state) => {
      const existingKeyframes = state.keyframes.filter(k => k.timestamp < 100 && k.timestamp > 0)
      return {
        isRecording: false,
        keyframes: [...existingKeyframes, finalKeyframe].sort((a, b) => a.timestamp - b.timestamp),
      }
    })
  },

  togglePreview: () => {
    set((state) => ({ isPreviewPlaying: !state.isPreviewPlaying }))
  },

  stopPreview: () => {
    set({ isPreviewPlaying: false })
  },

  setAnimationSettings: (settings) => {
    set((state) => ({
      animationSettings: { ...state.animationSettings, ...settings },
    }))
  },

  setGeneratedCode: (code) => {
    set({ generatedCode: code })
  },

  toggleCodeModal: () => {
    set((state) => ({ showCodeModal: !state.showCodeModal }))
  },

  getSelectedShapes: () => {
    const state = get()
    return state.shapes.filter(s => state.selectedShapeIds.includes(s.id))
  },

  clearKeyframes: () => {
    set({ keyframes: [], isPreviewPlaying: false })
  },

  setShapes: (shapes) => {
    set({ shapes })
  },
}))
