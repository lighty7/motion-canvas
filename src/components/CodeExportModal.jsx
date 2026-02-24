import React, { useState } from 'react'
import { useAnimationStore } from '../stores/animationStore'

const CodeExportModal = () => {
  const { showCodeModal, toggleCodeModal, generatedCode } = useAnimationStore()
  const [copied, setCopied] = useState(false)
  const [exportType, setExportType] = useState('react')

  if (!showCodeModal) return null

  const handleCopy = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `AnimatedComponent.jsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleClose = () => {
    toggleCodeModal()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={handleClose}>
      <div
        className="bg-slate-900 rounded-xl w-[800px] max-h-[85vh] flex flex-col border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Export Animation</h2>
            <p className="text-sm text-slate-400 mt-1">Copy or download your production-ready React component</p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 border-b border-slate-700 flex items-center gap-4">
          <span className="text-sm text-slate-400">Format:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setExportType('react')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                exportType === 'react'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              React + CSS
            </button>
            <button
              onClick={() => setExportType('tailwind')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                exportType === 'tailwind'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Tailwind CSS
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <pre className="bg-slate-950 p-4 rounded-lg text-sm text-slate-300 overflow-x-auto font-mono leading-relaxed">
            {generatedCode}
          </pre>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Production ready</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download .jsx
            </button>
            <button
              onClick={handleCopy}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeExportModal
