import React from 'react'
import { useAnimationStore } from '../stores/animationStore'

const RightPanel = () => {
  const { shapes, animationSettings, setAnimationSettings, keyframes } = useAnimationStore()

  if (shapes.length === 0) {
    return (
      <div className="w-64 bg-slate-900 border-l border-slate-700 p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Properties</h2>
        <p className="text-slate-500 text-sm">Add shapes from the left panel to get started</p>
      </div>
    )
  }

  return (
    <div className="w-64 bg-slate-900 border-l border-slate-700 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Animation Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Duration (s)</label>
          <input
            type="number"
            min="0.1"
            max="60"
            step="0.1"
            value={animationSettings.duration}
            onChange={(e) => setAnimationSettings({ duration: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Delay (s)</label>
          <input
            type="number"
            min="0"
            max="60"
            step="0.1"
            value={animationSettings.delay}
            onChange={(e) => setAnimationSettings({ delay: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Easing</label>
          <select
            value={animationSettings.easing}
            onChange={(e) => setAnimationSettings({ easing: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          >
            <option value="linear">linear</option>
            <option value="ease">ease</option>
            <option value="ease-in">ease-in</option>
            <option value="ease-out">ease-out</option>
            <option value="ease-in-out">ease-in-out</option>
            <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">elastic</option>
            <option value="cubic-bezier(0.175, 0.885, 0.32, 1.275)">backOut</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Repeat</label>
          <select
            value={animationSettings.repeat}
            onChange={(e) => setAnimationSettings({ repeat: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          >
            <option value="infinite">infinite</option>
            <option value="1">1 time</option>
            <option value="2">2 times</option>
            <option value="3">3 times</option>
            <option value="5">5 times</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Direction</label>
          <select
            value={animationSettings.direction}
            onChange={(e) => setAnimationSettings({ direction: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          >
            <option value="normal">normal</option>
            <option value="reverse">reverse</option>
            <option value="alternate">alternate</option>
            <option value="alternate-reverse">alternate-reverse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Fill Mode</label>
          <select
            value={animationSettings.fillMode}
            onChange={(e) => setAnimationSettings({ fillMode: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          >
            <option value="none">none</option>
            <option value="forwards">forwards</option>
            <option value="backwards">backwards</option>
            <option value="both">both</option>
          </select>
        </div>
      </div>

      {keyframes.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-3">Recorded Keyframes</h3>
          <div className="space-y-2">
            {keyframes.map((kf, idx) => (
              <div key={kf.id} className="flex items-center justify-between text-sm bg-slate-800 px-3 py-2 rounded">
                <span className="text-slate-400">Frame {idx + 1}</span>
                <span className="text-yellow-400 font-medium">{kf.timestamp}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Shapes</span>
            <span className="text-white">{shapes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Keyframes</span>
            <span className="text-white">{keyframes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Duration</span>
            <span className="text-white">{animationSettings.duration}s</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightPanel
