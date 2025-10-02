import './style.css'
import { setupNiivue } from './setup-niivue.js'
document.querySelector('#app')!.innerHTML = `
  <div style="width: 100vw; height: 100vh">
   <canvas id="nvCanvas" ></canvas>
  </div>
`
setupNiivue(document.querySelector('#nvCanvas')!)
