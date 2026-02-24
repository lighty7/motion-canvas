import { describe, it, expect } from 'vitest'
import { generateReactComponent, generateTailwindComponent, generateMultiShapeComponent } from '../utils/codeExporter'

describe('codeExporter', () => {
  const mockKeyframes = [
    {
      timestamp: 0,
      shapes: [{
        id: 1,
        type: 'circle',
        x: 100,
        y: 100,
        width: 80,
        height: 80,
        rotation: 0,
        scale: 1,
        color: '#3b82f6',
        opacity: 1,
        borderRadius: '50%'
      }]
    },
    {
      timestamp: 100,
      shapes: [{
        id: 1,
        type: 'circle',
        x: 300,
        y: 100,
        width: 80,
        height: 80,
        rotation: 0,
        scale: 1,
        color: '#3b82f6',
        opacity: 1,
        borderRadius: '50%'
      }]
    }
  ]

  const mockSettings = {
    duration: 1,
    delay: 0,
    easing: 'ease-in-out',
    repeat: 'infinite',
    direction: 'normal',
    fillMode: 'forwards'
  }

  describe('generateReactComponent', () => {
    it('should generate valid React component', () => {
      const result = generateReactComponent(mockKeyframes, mockSettings)
      
      expect(result).toContain('import React from "react"')
      expect(result).toContain('export default function AnimatedShape')
    })

    it('should include keyframes', () => {
      const result = generateReactComponent(mockKeyframes, mockSettings)
      
      expect(result).toContain('@keyframes')
      expect(result).toContain('0%')
      expect(result).toContain('100%')
    })

    it('should include animation style', () => {
      const result = generateReactComponent(mockKeyframes, mockSettings)
      
      expect(result).toContain('animation:')
      expect(result).toContain('translate(200px, 0px)')
    })

    it('should handle empty keyframes', () => {
      const result = generateReactComponent([], mockSettings)
      
      expect(result).toContain('// No keyframes recorded')
    })
  })

  describe('generateTailwindComponent', () => {
    it('should generate valid Tailwind component', () => {
      const result = generateTailwindComponent(mockKeyframes, mockSettings)
      
      expect(result).toContain('import React from "react"')
      expect(result).toContain('export default function AnimatedShape')
    })

    it('should include Tailwind class placeholder', () => {
      const result = generateTailwindComponent(mockKeyframes, mockSettings)
      
      expect(result).toContain('className={`${className}`}')
    })
  })

  describe('generateMultiShapeComponent', () => {
    const multiShapeKeyframes = [
      {
        timestamp: 0,
        shapes: [
          { id: 1, type: 'circle', x: 100, y: 100, width: 80, height: 80, rotation: 0, scale: 1, color: '#3b82f6', opacity: 1, borderRadius: '50%' },
          { id: 2, type: 'square', x: 200, y: 200, width: 60, height: 60, rotation: 0, scale: 1, color: '#ef4444', opacity: 1, borderRadius: '0%' }
        ]
      },
      {
        timestamp: 100,
        shapes: [
          { id: 1, type: 'circle', x: 300, y: 100, width: 80, height: 80, rotation: 0, scale: 1, color: '#3b82f6', opacity: 1, borderRadius: '50%' },
          { id: 2, type: 'square', x: 400, y: 200, width: 60, height: 60, rotation: 0, scale: 1, color: '#ef4444', opacity: 1, borderRadius: '0%' }
        ]
      }
    ]

    const mockShapes = [
      { id: 1, type: 'circle', x: 100, y: 100, width: 80, height: 80, color: '#3b82f6', borderRadius: '50%' },
      { id: 2, type: 'square', x: 200, y: 200, width: 60, height: 60, color: '#ef4444', borderRadius: '0%' }
    ]

    it('should generate component with multiple shapes', () => {
      const result = generateMultiShapeComponent(multiShapeKeyframes, mockSettings, mockShapes)
      
      expect(result).toContain('export default function AnimatedScene')
      expect(result).toContain('position: \'absolute\'')
    })

    it('should generate separate keyframes for each shape', () => {
      const result = generateMultiShapeComponent(multiShapeKeyframes, mockSettings, mockShapes)
      
      expect(result).toContain('@keyframes anim_')
    })

    it('should include all shapes in output', () => {
      const result = generateMultiShapeComponent(multiShapeKeyframes, mockSettings, mockShapes)
      
      expect(result).toContain('#3b82f6')
      expect(result).toContain('#ef4444')
    })
  })
})
