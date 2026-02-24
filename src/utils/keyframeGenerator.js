export const generateKeyframes = (keyframes, animationName) => {
  if (!keyframes || keyframes.length < 2) return ''
  
  const firstShape = keyframes[0].shapes[0]
  if (!firstShape) return ''

  let keyframeRules = ''
  
  keyframes.forEach((kf) => {
    const shape = kf.shapes[0]
    if (!shape) return
    
    const translateX = shape.x - firstShape.x
    const translateY = shape.y - firstShape.y
    const scale = shape.scale / firstShape.scale
    const rotate = shape.rotation - firstShape.rotation
    
    keyframeRules += `
      ${kf.timestamp}% {
        transform: translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg);
        background-color: ${shape.color};
        opacity: ${shape.opacity};
        border-radius: ${shape.borderRadius};
      }
    `
  })

  return `@keyframes ${animationName} {${keyframeRules}
}`
}

export const generateAnimationString = (animationName, duration, delay, easing, repeat) => {
  return `${animationName} ${duration}s ${easing} ${delay}s ${repeat}`
}
