import * as d3 from 'd3'
import './index.styl'
import utils from './utils'
import { positionConfig } from './config'

{
  let leftBar = document.querySelector('.left-bar')
  let drawerEl = document.querySelector('.drawer')
  let drawer = d3.select('.drawer').append('svg')
    .attr('height', '100%')
    .attr('width', '100%')
  let globalData = {}, startPos = null, startSize = null

  function generateResizer (data) {
    // x: 100, y: 100, width: 200, height: 120,
    return [
      {x: 0, y: 0, type: 'left,top' },
      {x: 0, y: 0 + data.height, type: 'left,bottom'},
      {x: 0 + data.width, y: 0, type: 'right,top'},
      {x: 0 + data.width, y: 0 + data.height, type: 'right,bottom'},
    ]
  }
  function generateLinkcircle (data) {
    return [
      {x: 0, y: data.height / 2, type: 'left' },
      {x: data.width, y: data.height / 2, type: 'right'},
      {x: data.width / 2, y: 0, type: 'top'},
      {x: data.width / 2, y: data.height, type: 'bottom'},
    ]
  }
  let moveStart = function () {
    startPos = d3.mouse(this)
    console.log(startPos)
  }
  let move = function (d) {
    let transform = d3.select(this).attr('transform')
    console.log('transform', transform)
    let [placeholder, x, y] = transform.match(/translate\((-?\d+(?:\.\d*)?),(-?\d+(?:\.\d*)?)\)/)
    x = parseInt(x)
    y = parseInt(y)
    d3.select(this).attr("transform", d => `translate(${x + d3.event.dx},${y + d3.event.dy})`)
  }
  let drag = d3.drag().on('start', moveStart).on('drag', move)

  let resize = function () {
    // find shape
    // 更新矩形
    let resizeShape = d3.select(this.parentNode).select('.shape')
    let group = d3.select(this.parentNode)
    let resize = d3.select(this)
    let typeList = resize.attr('type').split(',')
    typeList.forEach(type => {
      let position = positionConfig[type]
      console.log('position', position)
      resizeShape
        .attr(position.shape.attr, parseInt(resizeShape.attr(position.shape.attr))
          + position.shape.dir * d3.event[position.shape.eventAttr])
      if (position.transform) {
        let transform =  group.attr('transform')
        let [placeholder, x, y] = transform.match(/translate\((-?\d+(?:\.\d*)?),(-?\d+(?:\.\d*)?)\)/)
        x = Number(x)
        y = Number(y)
        console.log('x', x, 'y', y)
        console.log(`translate(${x + position.transform.x * d3.event.dx}, ${ y + position.transform.y * d3.event.dy})`)
        group.attr('transform', `translate(${x + position.transform.x * d3.event.dx},${ y + position.transform.y * d3.event.dy})`)
      }
    })

    // find resizer
    // 更新resizer位置
    d3.select(this.parentNode).selectAll('circle').each(function (item, i) {
      let matchTypeList = utils.intersection(item.type.split(','), typeList)
      // if (this === resize.node()) {return}
      // console.log('this', this) this 就是resize.node() 无法判断,如果用箭头函数的话
      // console.log('noed', resize.node())
      matchTypeList.forEach(type => {
        let curNode = d3.select(this)
        let direction = positionConfig[type]
        console.log('direction', direction)
        curNode
        .attr(direction.attr,
            parseInt(curNode.attr(direction.attr))
              + direction.moveDir * d3.event[direction.eventAttr])
      })
    })
    // find type (transform change ? size, change)
    // resize shape
  }
  let resizer = d3.drag().on('drag', resize)
  function initContainerTrans () {
    drawerEl.addEventListener('generate_shape', (e) => {
      let uuid = utils.generateUUID()
      let rect = drawer.append('g')
        .attr('uuid', uuid)
        .attr('transform', `translate(${100},${100})`)
        .call(drag)
        .append('rect')
        .attr('class', 'shape')
        .attr('width', 200)
        .attr('height', 120)
        .attr('rx', 4)
      let data = {
        x: 100,
        y: 100,
        width: 200,
        height: 120,
        uuid: 1
      }
      globalData.rect = []
      globalData.rect.push(data)
      let resizerEl = drawer.select(`[uuid = '${uuid}']`).selectAll('circle')
        .data(generateResizer(data))
        .enter()
        .append('circle')
        .attr('class', 'resizer')
        .style('fill', '#198cff')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('type', d => d.type)
        .attr('r', 5)
        .call(resizer)
      let drawerCircle = drawer.select(`[uuid = '${uuid}']`).selectAll('circle.link-circle')
        .data(generateLinkcircle(data))
        .enter()
        .append('circle')
        .attr('class', 'link-circle')
        .style('fill', '#198cff')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('type', d => d.type)
        .attr('r', 5)
    })
  }
  function drawShapes () {
    let svg = d3.select('.left-bar').append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      // .on('click', () => {alert(1)})
    svg.append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 100)
      .attr('height', 40)
      .attr('rx', 5)
      .style('fill', '#fff')
      .on('click', (e) => {
        console.log(d3.event)
        let event = new CustomEvent('generate_shape', {
          detail: {
            shape: 'rect'
          },
          bubbles: true, // 是否支持冒泡
          cancelable: true, // 是否可以取消默认行为
          composed: true
        })
        drawerEl.dispatchEvent(event)
      })
  }
  let init = () => {
    drawShapes()
    initContainerTrans()
  }
  init()
}