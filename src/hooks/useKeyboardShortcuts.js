import { useEffect } from 'react'
import { useAnimationStore } from '../stores/animationStore'

export const useKeyboardShortcuts = () => {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    deleteSelectedShapes,
    duplicateSelectedShapes,
    selectAll,
    clearSelection,
    togglePreview,
    isRecording,
    startRecording,
    stopRecording,
    addKeyframe,
    isPreviewPlaying,
  } = useAnimationStore()

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      if (isInput) return

      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) undo()
      }
      
      if ((e.key === 'y' && (e.ctrlKey || e.metaKey)) || (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
        e.preventDefault()
        if (canRedo()) redo()
      }

      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        selectAll()
      }

      if (e.key === 'Escape') {
        clearSelection()
        if (isRecording) stopRecording()
        if (isPreviewPlaying) useAnimationStore.getState().stopPreview()
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (useAnimationStore.getState().selectedShapeIds.length > 0) {
          e.preventDefault()
          deleteSelectedShapes()
        }
      }

      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        duplicateSelectedShapes()
      }

      if (e.key === ' ' && !isRecording) {
        e.preventDefault()
        togglePreview()
      }

      if (isRecording && e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        addKeyframe()
      }

      if (e.key === 'r' && (e.ctrlKey || e.metaKey) && !isRecording) {
        e.preventDefault()
        startRecording()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo, deleteSelectedShapes, duplicateSelectedShapes, selectAll, clearSelection, togglePreview, isRecording, startRecording, stopRecording, addKeyframe, isPreviewPlaying])
}

export const keyboardShortcuts = [
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Y'], description: 'Redo' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
  { keys: ['Ctrl', 'D'], description: 'Duplicate selected shapes' },
  { keys: ['Ctrl', 'A'], description: 'Select all shapes' },
  { keys: ['Delete'], description: 'Delete selected shapes' },
  { keys: ['Space'], description: 'Play/Pause preview' },
  { keys: ['Ctrl', 'K'], description: 'Add keyframe (during recording)' },
  { keys: ['Ctrl', 'R'], description: 'Start recording' },
  { keys: ['Escape'], description: 'Clear selection / Stop recording' },
]
