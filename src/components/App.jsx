import React from 'react'
import LeftPanel from './LeftPanel'
import Canvas from './Canvas'
import RightPanel from './RightPanel'
import BottomPanel from './BottomPanel'
import CodeExportModal from './CodeExportModal'

function App() {
  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <header className="h-14 bg-slate-900 border-b border-slate-700 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-xl font-bold text-white">MotionCanvas</h1>
          <span className="text-slate-500 text-sm ml-2">Animation Builder</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <LeftPanel />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <Canvas />
          </div>
          <BottomPanel />
        </div>
        <RightPanel />
      </div>

      <CodeExportModal />
    </div>
  )
}

export default App
