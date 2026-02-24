# MotionCanvas - CSS Animation Builder for React

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Zustand-5.0.0-764ABC?style=for-the-badge" alt="Zustand">
  <img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite" alt="Vite">
</p>

<p align="center">
  A modern, visual CSS animation builder that generates production-ready React components with pure CSS keyframes - no external animation libraries required.
</p>

---

## ✨ Features

### Core Features
- **Visual Animation Editor** - Create animations by moving, resizing, and rotating shapes on a canvas
- **Multi-Shape Support** - Animate multiple shapes simultaneously
- **Multi-Step Keyframes** - Add intermediate keyframes for complex animations
- **Recording System** - Record start and end states with automatic keyframe generation

### Export Options
- **Pure CSS Export** - Generate standalone React components with inline CSS keyframes
- **Tailwind CSS Export** - Generate components with Tailwind animation utilities
- **Multi-Shape Export** - Export entire scenes with multiple animated shapes

### Quality of Life
- **Undo/Redo** - Full history support with unlimited undo (up to 50 steps)
- **Keyboard Shortcuts** - Speed up your workflow with keyboard shortcuts
- **Timeline Panel** - Visual representation of all keyframes
- **Multi-Select** - Select multiple shapes with Shift+Click
- **Shape Duplication** - Duplicate shapes with Ctrl+D
- **Particle Effects** - Beautiful particle trails during animation preview

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/motion-canvas.git

# Navigate to project directory
cd motion-canvas

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

---

## 📖 Usage Guide

### Creating Your First Animation

1. **Add Shapes** - Click on Circle, Square, or Rectangle in the left panel
2. **Position Shapes** - Drag shapes to position them on the canvas
3. **Customize** - Use the right panel to change colors, size, rotation, etc.
4. **Start Recording** - Click the red "Record" button in the bottom panel
5. **Animate** - Move, resize, or rotate your shapes to create the animation path
6. **Add Keyframes** - Press Ctrl+K or click "+ Keyframe" to add intermediate steps
7. **Stop Recording** - Click "Stop" to finish recording
8. **Preview** - Click "Preview" to see your animation
9. **Export** - Click "Export CSS" or "Export Tailwind" to get your code

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause animation preview |
| `Delete` | Delete selected shapes |
| `Ctrl + D` | Duplicate selected shapes |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + A` | Select all shapes |
| `Ctrl + K` | Add keyframe (during recording) |
| `Ctrl + R` | Start recording |
| `Shift + Click` | Multi-select shapes |
| `Escape` | Clear selection / Stop recording |

### Animation Settings

- **Duration** - How long the animation takes (in seconds)
- **Delay** - Time to wait before starting the animation
- **Easing** - How the animation accelerates/decelerates
  - `linear` - Constant speed
  - `ease` - Starts slow, speeds up, then slows down
  - `ease-in` - Starts slow, speeds up
  - `ease-out` - Starts fast, slows down
  - `ease-in-out` - Starts slow, speeds up, then slows down
  - `elastic` - Bouncy overshoot effect
  - `backOut` - Slight overshoot at the end
- **Repeat** - How many times to repeat the animation
- **Direction** - normal, reverse, alternate, alternate-reverse
- **Fill Mode** - What happens before/after animation

---

## 🏗️ Architecture

### Tech Stack

- **React 19** - UI Framework
- **TailwindCSS 4** - Styling
- **Zustand 5** - State Management
- **Vite 7** - Build Tool

### Project Structure

```
motion-canvas/
├── src/
│   ├── components/
│   │   ├── App.jsx              # Main application component
│   │   ├── Canvas.jsx           # Main editing canvas
│   │   ├── Shape.jsx            # Individual shape component
│   │   ├── LeftPanel.jsx        # Shape creation & list
│   │   ├── RightPanel.jsx       # Animation settings
│   │   ├── BottomPanel.jsx      # Recording controls
│   │   ├── Timeline.jsx        # Visual keyframe timeline
│   │   ├── Particles.jsx        # Particle effects
│   │   └── CodeExportModal.jsx  # Code export dialog
│   ├── stores/
│   │   └── animationStore.js    # Zustand state management
│   ├── utils/
│   │   ├── keyframeGenerator.js # CSS keyframe generation
│   │   └── codeExporter.js     # React component generation
│   ├── hooks/
│   │   └── useKeyboardShortcuts.js # Keyboard shortcuts
│   ├── index.css               # Global styles
│   └── main.jsx                # Application entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### State Management

The application uses Zustand for state management. The store handles:

- Shape management (add, update, delete, select)
- Recording system (start, stop, add keyframes)
- Animation playback
- Undo/Redo history
- Export functionality

### Recording System

The recording system captures the entire state of all shapes at specific timestamps:

```javascript
keyframes = [
  { id: 1, timestamp: 0, shapes: [...] },   // Start state
  { id: 2, timestamp: 50, shapes: [...] },  // Intermediate state
  { id: 3, timestamp: 100, shapes: [...] }, // End state
]
```

### Code Generation

The exported components include:

1. Inline `<style>` tag with `@keyframes`
2. Animated `<div>` with all properties
3. Customizable props (size, color, duration, delay, etc.)
4. No external dependencies

---

## 🎨 Generated Code Example

### Input (Visual Recording)

- Start: Circle at position (100, 100)
- End: Circle at position (300, 100)

### Output (Exported React Component)

```jsx
import React from "react";

export default function AnimatedShape({
  size = 80,
  color = "#3b82f6",
  duration = 1,
  delay = 0,
  repeat = "infinite",
  direction = "normal",
  fillMode = "forwards",
  easing = "ease-in-out",
  className = "",
}) {
  return (
    <>
      <style>
        {`
          @keyframes anim_1234567890 {
            0% {
              transform: translate(0px, 0px) scale(1) rotate(0deg);
              background-color: #3b82f6;
              opacity: 1;
              border-radius: 50%;
            }
            100% {
              transform: translate(200px, 0px) scale(1) rotate(0deg);
              background-color: #3b82f6;
              opacity: 1;
              border-radius: 50%;
            }
          }
        `}
      </style>

      <div
        className={className}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: "50%",
          animation: `${anim_1234567890} ${duration}s ${easing} ${delay}s ${repeat} ${direction} ${fillMode}`,
        }}
      />
    </>
  );
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - The UI library
- [TailwindCSS](https://tailwindcss.com/) - The styling framework
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Vite](https://vitejs.dev/) - The build tool

---

## 🔗 Links

- [Live Demo](#) (if deployed)
- [Report Bug](#)
- [Request Feature](#)

---

<p align="center">Made with ❤️ for the React community</p>
