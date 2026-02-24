import { generateKeyframes, generateAnimationString } from './keyframeGenerator'

const getShapeState = (keyframes, shapeIndex = 0) => {
  if (!keyframes || keyframes.length < 2 || !keyframes[0].shapes[shapeIndex]) {
    return null
  }
  return keyframes[0].shapes[shapeIndex]
}

export const generateReactComponent = (keyframes, animationSettings) => {
  const animationName = `anim_${Date.now()}`
  const firstShape = getShapeState(keyframes, 0)
  
  if (!firstShape) {
    return '// No keyframes recorded'
  }

  const keyframesCSS = generateKeyframes(keyframes, animationName)
  const { duration, delay, easing, repeat, direction, fillMode } = animationSettings

  const componentCode = `import React from "react";

export default function AnimatedShape({
  size = ${Math.max(firstShape.width, firstShape.height)},
  color = "${firstShape.color}",
  duration = ${duration},
  delay = ${delay},
  repeat = "${repeat}",
  direction = "${direction}",
  fillMode = "${fillMode}",
  easing = "${easing}",
  className = "",
}) {
  return (
    <>
      <style>
        {\`
          ${keyframesCSS}
        \`}
      </style>

      <div
        className={className}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: "${firstShape.borderRadius}",
          animation: \\\`\${animationName} \${duration}s \${easing} \${delay}s \${repeat} \${direction} \${fillMode}\\\`,
        }}
      />
    </>
  );
}`

  return componentCode
}

export const generateTailwindComponent = (keyframes, animationSettings) => {
  const animationName = `anim_${Date.now()}`
  const firstShape = getShapeState(keyframes, 0)
  
  if (!firstShape) {
    return '// No keyframes recorded'
  }

  const keyframesCSS = generateKeyframes(keyframes, animationName)
  const { duration, delay, easing, repeat, direction, fillMode } = animationSettings

  const componentCode = `import React from "react";

export default function AnimatedShape({
  size = ${Math.max(firstShape.width, firstShape.height)},
  color = "${firstShape.color}",
  duration = ${duration},
  delay = ${delay},
  repeat = "${repeat}",
  direction = "${direction}",
  fillMode = "${fillMode}",
  easing = "${easing}",
  className = "",
}) {
  return (
    <>
      <style>
        {\`
          ${keyframesCSS}
        \`}
      </style>

      <div
        className={\`\${className}\`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: "${firstShape.borderRadius}",
          animation: \\\`\${animationName} \${duration}s \${easing} \${delay}s \${repeat} \${direction} \${fillMode}\\\`,
        }}
      />
    </>
  );
}`

  return componentCode
}

export const generateMultiShapeComponent = (keyframes, animationSettings, shapes) => {
  const baseAnimationName = `anim_${Date.now()}`
  const { duration, delay, easing, repeat, direction, fillMode } = animationSettings

  let allKeyframes = ''
  let shapesJSX = ''

  shapes.forEach((shape, idx) => {
    const animationName = `${baseAnimationName}_${idx}`
    
    let keyframeRules = ''
    keyframes.forEach((kf) => {
      const shapeState = kf.shapes.find(s => s.id === shape.id)
      const firstKf = keyframes[0]
      const firstShape = firstKf.shapes.find(s => s.id === shape.id)
      
      if (!shapeState || !firstShape) return
      
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

    allKeyframes += `
      @keyframes ${animationName} {${keyframeRules}
      }
    `

    shapesJSX += `
      <div
        style={{
          position: 'absolute',
          left: ${shape.x}px,
          top: ${shape.y}px,
          width: ${shape.width}px,
          height: ${shape.height}px,
          backgroundColor: "${shape.color}",
          borderRadius: "${shape.borderRadius}",
          animation: \\\`\${animationName} \${duration}s \${easing} \${delay}s \${repeat} \${direction} \${fillMode}\\\`,
        }}
      />`
  })

  const componentCode = `import React from "react";

export default function AnimatedScene({
  duration = ${duration},
  delay = ${delay},
  repeat = "${repeat}",
  direction = "${direction}",
  fillMode = "${fillMode}",
  easing = "${easing}",
  className = "",
}) {
  return (
    <>
      <style>
        {\`
          ${allKeyframes}
        \`}
      </style>

      <div className={\`relative \${className}\`}>
        ${shapesJSX}
      </div>
    </>
  );
}`

  return componentCode
}
