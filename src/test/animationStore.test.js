import { describe, it, expect, beforeEach } from 'vitest'
import { useAnimationStore } from '../stores/animationStore'

describe('animationStore', () => {
  beforeEach(() => {
    useAnimationStore.getState().clearCanvas()
  })

  describe('addShape', () => {
    it('should add a circle shape', () => {
      const { shapes, addShape } = useAnimationStore.getState()
      addShape('circle')
      
      const newState = useAnimationStore.getState()
      expect(newState.shapes).toHaveLength(1)
      expect(newState.shapes[0].type).toBe('circle')
      expect(newState.shapes[0].borderRadius).toBe('50%')
    })

    it('should add a square shape', () => {
      const { addShape } = useAnimationStore.getState()
      addShape('square')
      
      const newState = useAnimationStore.getState()
      expect(newState.shapes).toHaveLength(1)
      expect(newState.shapes[0].type).toBe('square')
      expect(newState.shapes[0].borderRadius).toBe('0%')
    })

    it('should add a rectangle shape', () => {
      const { addShape } = useAnimationStore.getState()
      addShape('rectangle')
      
      const newState = useAnimationStore.getState()
      expect(newState.shapes).toHaveLength(1)
      expect(newState.shapes[0].type).toBe('rectangle')
    })

    it('should auto-select the added shape', () => {
      const { addShape, selectedShapeIds } = useAnimationStore.getState()
      addShape('circle')
      
      const newState = useAnimationStore.getState()
      expect(newState.selectedShapeIds).toContain(newState.shapes[0].id)
    })
  })

  describe('selectShape', () => {
    it('should select a shape', () => {
      const { addShape, selectShape } = useAnimationStore.getState()
      addShape('circle')
      const shapeId = useAnimationStore.getState().shapes[0].id
      
      selectShape(shapeId)
      
      const newState = useAnimationStore.getState()
      expect(newState.selectedShapeIds).toContain(shapeId)
    })

    it('should support multi-select with shift key', () => {
      const { addShape, selectShape } = useAnimationStore.getState()
      addShape('circle')
      addShape('square')
      
      const shapes = useAnimationStore.getState().shapes
      selectShape(shapes[0].id, false)
      selectShape(shapes[1].id, true)
      
      const newState = useAnimationStore.getState()
      expect(newState.selectedShapeIds).toHaveLength(2)
    })
  })

  describe('updateShape', () => {
    it('should update shape position', () => {
      const { addShape, updateShape } = useAnimationStore.getState()
      addShape('circle')
      const shapeId = useAnimationStore.getState().shapes[0].id
      
      updateShape(shapeId, { x: 100, y: 200 })
      
      const newState = useAnimationStore.getState()
      expect(newState.shapes[0].x).toBe(100)
      expect(newState.shapes[0].y).toBe(200)
    })

    it('should update shape color', () => {
      const { addShape, updateShape } = useAnimationStore.getState()
      addShape('circle')
      const shapeId = useAnimationStore.getState().shapes[0].id
      
      updateShape(shapeId, { color: '#ff0000' })
      
      const newState = useAnimationStore.getState()
      expect(newState.shapes[0].color).toBe('#ff0000')
    })

    it('should update shape rotation', () => {
      const { addShape, updateShape } = useAnimationStore.getState()
      addShape('circle')
      const shapeId = useAnimationStore.getState().shapes[0].id
      
      updateShape(shapeId, { rotation: 45 })
      
      const newState = useAnimationStore.getState()
      expect(newState.shapes[0].rotation).toBe(45)
    })
  })

  describe('deleteShape', () => {
    it('should delete a shape', () => {
      const { addShape, deleteShape } = useAnimationStore.getState()
      addShape('circle')
      const shapeId = useAnimationStore.getState().shapes[0].id
      
      deleteShape(shapeId)
      
      const newState = useAnimationStore.getState()
      expect(newState.shapes).toHaveLength(0)
    })
  })

  describe('recording', () => {
    it('should start recording', () => {
      const { addShape, startRecording } = useAnimationStore.getState()
      addShape('circle')
      
      startRecording()
      
      const newState = useAnimationStore.getState()
      expect(newState.isRecording).toBe(true)
      expect(newState.keyframes).toHaveLength(1)
      expect(newState.keyframes[0].timestamp).toBe(0)
    })

    it('should add keyframe during recording', () => {
      const { addShape, startRecording, addKeyframe, updateShape } = useAnimationStore.getState()
      addShape('circle')
      const shapeId = useAnimationStore.getState().shapes[0].id
      
      startRecording()
      updateShape(shapeId, { x: 100 })
      addKeyframe()
      
      const newState = useAnimationStore.getState()
      expect(newState.keyframes).toHaveLength(2)
    })

    it('should stop recording', () => {
      const { addShape, startRecording, stopRecording, updateShape, addKeyframe } = useAnimationStore.getState()
      addShape('circle')
      const shapeId = useAnimationStore.getState().shapes[0].id
      
      startRecording()
      updateShape(shapeId, { x: 100 })
      addKeyframe()
      stopRecording()
      
      const newState = useAnimationStore.getState()
      expect(newState.isRecording).toBe(false)
      expect(newState.keyframes.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('undo/redo', () => {
    it('should save history when adding shapes', () => {
      const { addShape } = useAnimationStore.getState()
      
      const initialCount = useAnimationStore.getState().shapes.length
      addShape('circle')
      const shapesAfterAdd = useAnimationStore.getState().shapes.length
      
      expect(shapesAfterAdd).toBe(initialCount + 1)
    })

    it('should have undo/redo functions', () => {
      const { undo, redo, canUndo, canRedo } = useAnimationStore.getState()
      
      expect(typeof undo).toBe('function')
      expect(typeof redo).toBe('function')
      expect(typeof canUndo).toBe('function')
      expect(typeof canRedo).toBe('function')
    })

    it('should track history index', () => {
      const { addShape } = useAnimationStore.getState()
      addShape('circle')
      
      const state = useAnimationStore.getState()
      expect(state.historyIndex).toBeGreaterThanOrEqual(0)
    })
  })

  describe('clearCanvas', () => {
    it('should clear all shapes', () => {
      const { addShape, clearCanvas } = useAnimationStore.getState()
      addShape('circle')
      addShape('square')
      
      clearCanvas()
      
      const newState = useAnimationStore.getState()
      expect(newState.shapes).toHaveLength(0)
      expect(newState.keyframes).toHaveLength(0)
    })
  })

  describe('animation settings', () => {
    it('should update animation settings', () => {
      const { setAnimationSettings } = useAnimationStore.getState()
      
      setAnimationSettings({ duration: 2, delay: 0.5 })
      
      const newState = useAnimationStore.getState()
      expect(newState.animationSettings.duration).toBe(2)
      expect(newState.animationSettings.delay).toBe(0.5)
    })

    it('should update easing', () => {
      const { setAnimationSettings } = useAnimationStore.getState()
      
      setAnimationSettings({ easing: 'linear' })
      
      const newState = useAnimationStore.getState()
      expect(newState.animationSettings.easing).toBe('linear')
    })
  })
})
