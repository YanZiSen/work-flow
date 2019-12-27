import * as d3 from 'd3'
import './index.styl'
import utils from './utils'
import { positionConfig, positionKd} from './config'
import './global'
import generate from './generator'


let leftBar = document.querySelector('.left-bar')
let drawerEl = document.querySelector('.drawer')

function bindEvent () {
  d3.select('.shapes-container').on('click', () => {
    if (d3.event.target.tagName === 'svg') {
      return
    }
    let type = d3.select(d3.event.target).attr('type')
    console.log('target', type)
    let event = new CustomEvent('generate_shape', {
      detail: {
        shape: type
      },
      bubbles: true, // 是否支持冒泡
      cancelable: true, // 是否可以取消默认行为
      composed: true
    })
    drawerEl.dispatchEvent(event)
  })
  drawerEl.addEventListener('generate_shape', (e) => {
    generate.generateShape(e.shape)
  })
}

bindEvent()