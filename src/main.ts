import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

console.log('Welcome to codexapp. GitHub: https://github.com/friuns2/codexui')

createApp(App).use(router).mount('#app')

function installOverflowDebugger(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const compact = (params.get('compact') ?? '').trim().toLowerCase()
  const debug = (params.get('debugOverflow') ?? '').trim().toLowerCase()
  if (!(compact === '1' || compact === 'true' || debug === '1' || debug === 'true')) return

  const markerId = 'codex-overflow-debug'

  const run = () => {
    const viewportWidth = window.innerWidth
    const existing = document.getElementById(markerId)
    if (existing) existing.remove()

    document.querySelectorAll<HTMLElement>('[data-overflow-debug]').forEach((element) => {
      element.removeAttribute('data-overflow-debug')
      element.style.outline = ''
    })

    const offenders: Array<{ element: HTMLElement; right: number }> = []
    const elements = Array.from(document.body.querySelectorAll<HTMLElement>('*'))

    for (const element of elements) {
      const rect = element.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) continue
      if (rect.right - viewportWidth > 1) {
        offenders.push({ element, right: rect.right })
      }
    }

    if (offenders.length === 0) return

    offenders
      .sort((a, b) => b.right - a.right)
      .slice(0, 5)
      .forEach(({ element }) => {
        element.setAttribute('data-overflow-debug', '1')
        element.style.outline = '2px solid #ef4444'
      })

    const top = offenders[0]?.element
    if (!top) return

    const label = document.createElement('div')
    label.id = markerId
    label.textContent = [
      top.tagName.toLowerCase(),
      top.className ? `.${String(top.className).trim().replace(/\s+/g, '.')}` : '',
      `→ ${Math.round(top.getBoundingClientRect().right - viewportWidth)}px`,
    ].join('')
    label.style.position = 'fixed'
    label.style.left = '8px'
    label.style.right = '8px'
    label.style.bottom = '8px'
    label.style.zIndex = '999999'
    label.style.padding = '8px 10px'
    label.style.borderRadius = '12px'
    label.style.background = 'rgba(0,0,0,0.88)'
    label.style.color = '#fff'
    label.style.font = '12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace'
    label.style.wordBreak = 'break-word'
    label.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)'
    document.body.appendChild(label)
  }

  let frame = 0
  const schedule = () => {
    if (frame) cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      frame = 0
      run()
    })
  }

  window.addEventListener('load', schedule)
  window.addEventListener('resize', schedule)
  window.addEventListener('orientationchange', schedule)
  document.addEventListener('scroll', schedule, true)
  setTimeout(schedule, 300)
  setTimeout(schedule, 1200)
}

installOverflowDebugger()
