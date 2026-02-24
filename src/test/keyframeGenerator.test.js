import { describe, it, expect } from 'vitest'
import { generateKeyframes, generateAnimationString } from '../utils/keyframeGenerator'

describe('keyframeGenerator', () => {
  describe('generateKeyframes', () => {
    it('should generate keyframes for single shape', () => {
      const keyframes = [
        {
          timestamp: 0,
          shapes: [{
            id: 1,
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

      const result = generateKeyframes(keyframes, 'testAnimation')
      
      expect(result).toContain('@keyframes testAnimation')
      expect(result).toContain('0%')
      expect(result).toContain('100%')
      expect(result).toContain('translate(0px, 0px)')
      expect(result).toContain('translate(200px, 0px)')
    })

    it('should generate keyframes with rotation', () => {
      const keyframes = [
        {
          timestamp: 0,
          shapes: [{
            id: 1,
            x: 100,
            y: 100,
            width: 80,
            height: 80,
            rotation: 0,
            scale: 1,
            color: '#3b82f6',
            opacity: 1,
            borderRadius: '0%'
          }]
        },
        {
          timestamp: 100,
          shapes: [{
            id: 1,
            x: 100,
            y: 100,
            width: 80,
            height: 80,
            rotation: 180,
            scale: 1,
            color: '#3b82f6',
            opacity: 1,
            borderRadius: '0%'
          }]
        }
      ]

      const result = generateKeyframes(keyframes, 'rotateAnimation')
      
      expect(result).toContain('rotate(0deg)')
      expect(result).toContain('rotate(180deg)')
    })

    it('should handle color transitions', () => {
      const keyframes = [
        {
          timestamp: 0,
          shapes: [{
            id: 1,
            x: 100,
            y: 100,
            width: 80,
            height: 80,
            rotation: 0,
            scale: 1,
            color: '#ff0000',
            opacity: 1,
            borderRadius: '0%'
          }]
        },
        {
          timestamp: 100,
          shapes: [{
            id: 1,
            x: 100,
            y: 100,
            width: 80,
            height: 80,
            rotation: 0,
            scale: 1,
            color: '#00ff00',
            opacity: 1,
            borderRadius: '0%'
          }]
        }
      ]

      const result = generateKeyframes(keyframes, 'colorAnimation')
      
      expect(result).toContain('#ff0000')
      expect(result).toContain('#00ff00')
    })

    it('should handle multi-step keyframes', () => {
      const keyframes = [
        {
          timestamp: 0,
          shapes: [{ id: 1, x: 0, y: 0, rotation: 0, scale: 1, color: '#000', opacity: 1, borderRadius: '0%' }]
        },
        {
          timestamp: 50,
          shapes: [{ id: 1, x: 50, y: 50, rotation: 90, scale: 1.5, color: '#888', opacity: 0.8, borderRadius: '25%' }]
        },
        {
          timestamp: 100,
          shapes: [{ id: 1, x: 100, y: 100, rotation: 180, scale: 2,             color: '#fff', opacity: 0.5, borderRadius: '50%' }]
        }
      ]

      const result = generateKeyframes(keyframes, 'multiStepAnimation')
      
      expect(result).toContain('0%')
      expect(result).toContain('50%')
      expect(result).toContain('100%')
    })
  })

  describe('generateAnimationString', () => {
    it('should generate animation string with all params', () => {
      const result = generateAnimationString('testAnim', 1, 0, 'ease-in-out', 'infinite')
      
      expect(result).toBe('testAnim 1s ease-in-out 0s infinite')
    })

    it('should generate animation string with delay', () => {
      const result = generateAnimationString('testAnim', 2, 1, 'linear', '2')
      
      expect(result).toBe('testAnim 2s linear 1s 2')
    })
  })
})
