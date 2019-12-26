import * as d3 from 'd3'
import './index.styl'
import utils from './utils'
import { positionConfig, positionKd} from './config'

{
  let leftBar = document.querySelector('.left-bar')
  let drawerEl = document.querySelector('.drawer')
  let drawer = d3.select('.drawer').append('svg')
    .attr('class', 'drawer-svg')
    .attr('height', '100%')
    .attr('width', '100%')
  let globalData = {}, startPos = null, startSize = null, rectData = null, linkData

  function findDataByid (id) {
    let data = null
    if (rectData.uuid === id) {
      data = rectData
    } else {
      Object.keys(globalData).forEach(key => {
        let find = globalData[key].find(item => item.uuid === id)
        if (find) {
          data = find
        }
      })
    }
    return data
  }
  function generatePoint(start, end) {
    return [start, end]
  }
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
  function generateLinkStart (data, type) {
    let reduceData = null
    switch (type) {
      case 'left':
        reduceData = {
          x: data.translateX,
          y: data.translateY + data.height / 2
        }
        break;
      case 'right':
        reduceData = {
          x: data.translateX + data.width,
          y: data.translateY + data.height / 2
        }
        break;
      case 'top':
        reduceData = {
          x: data.translateX + data.width / 2,
          y: data.translateY,
        }
        break;
      case 'bottom':
        reduceData = {
          x: data.translateX + data.width / 2,
          y: data.translateY + data.height,
        }
        break;
    }
    return reduceData
  }
  function catchPoint (data) {
    let point = null
    if (Object.keys(globalData).length) {
      Object.keys(globalData).forEach(key => {
        if (key === 'line') return;
        globalData[key].forEach(dataObj => {
          let connectDots = dataObj.connectDots
          for (key in connectDots) {
            if (Math.sqrt(
                Math.pow(connectDots[key].x - data.x, 2) +
                Math.pow(connectDots[key].y - data.y, 2)
            ) < 120){
              point = {
                owner: dataObj,
                targetType: key,
                end: connectDots[key]
              }
            }
          }
        })
      })
    }
    return point
  }
  let line = d3.line().x(d => d.x).y(d => d.y)

  let move = function (d) {
    // 更新shape
    let uuid = d3.select(this).attr('uuid')
    console.log('uuid', uuid)
    let data = findDataByid(uuid)
    data.translateX += d3.event.dx
    data.translateY += d3.event.dy
    d3.select(this).attr("transform", d => `translate(${data.translateX},${data.translateY})`)

    if (globalData.line) {
      // 更新link
      let linkData = globalData.line.filter(line => line.source === uuid).map(line => {
        line.start = generateLinkStart(data, line.type)
        line.points = generatePoint(line.start, line.end)
        return line
      })
      // console.log('lines', d3.selectAll(`path[parentId = "${uuid}"]`))
      // console.log('linkData', linkData)
      d3.selectAll(`path[parentId = "${uuid}"]`).data(linkData)
      .attr('d', d => line(d.points))

      let lindDataT = globalData.line.filter(line => line.target === uuid).map(line => {
        line.end = generateLinkStart(data, line.targetType)
        console.log('line.end', line.end)
        line.points = generatePoint(line.start, line.end)
        return line
      })
      console.log('lineDataT', lindDataT)
      d3.selectAll(`path[targetId = "${uuid}"]`).data(lindDataT)
      .attr('d', d => line(d.points))
    }
  }
  let drag = d3.drag().on('drag', move)

  let resize = function () {
    // 获取resize点的信息, 获取递增系数
    let uuid = d3.select(this).attr('parentId')
    let data = findDataByid(uuid)
    let [horizontal, vertical] = d3.select(this).attr('type').split(',')
    // 更新数据
    data.width = data.width + positionKd[horizontal] * d3.event.dx
    data.height = data.height + positionKd[vertical] * d3.event.dy
    // 更新形状
    let parent = d3.select(`[uuid = "${uuid}"]`)
    parent.select(`.shape`).data([data])
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('rx', d => d.rx)
    parent.selectAll(`.resizer`).data(generateResizer(data))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    parent.selectAll('.link-circle').data(generateLinkcircle(data))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)

    if (globalData.line) {
      // 更新link
      let linkData = globalData.line.filter(line => line.source === uuid).map(line => {
        line.start = generateLinkStart(data, line.type)
        line.points = generatePoint(line.start, line.end)
        return line
      })
      // console.log('lines', d3.selectAll(`path[parentId = "${uuid}"]`))
      // console.log('linkData', linkData)
      d3.selectAll(`path[parentId = "${uuid}"]`).data(linkData)
      .attr('d', d => line(d.points))

      let lindDataT = globalData.line.filter(line => line.target === uuid).map(line => {
        line.end = data.connectDots[line.targetType]
        line.points = generatePoint(line.start, line.end)
        return line
      })
      console.log('lineDataT', lindDataT)
      d3.selectAll(`path[targetId = "${uuid}"]`).data(lindDataT)
      .attr('d', d => line(d.points))
    }
  }
  let resizer = d3.drag().on('drag', resize)

  let lineDrawerStart = function () {
    let uuid = d3.select(this).attr('parentId')
    let type = d3.select(this).attr('type')
    linkData = {
      target: null,
      source: uuid,
      type: type,
      start: null,
      end: null,
      id: utils.generateUUID(),
      points: []
    }
    let data = findDataByid(uuid)
    linkData.start = generateLinkStart(data, type)
    console.log('start', linkData.start, d3.mouse(d3.select('.drawer-svg').node()))
  }

  let lineDrawer = function () {
    let curPoint = {
      x: d3.mouse(drawer.node())[0],
      y: d3.mouse(drawer.node())[1]
    }
    let hasEnd = catchPoint(curPoint)
    if (hasEnd) {
      console.log('hasEnd',hasEnd)
      linkData.end = hasEnd.end
      linkData.target = hasEnd.owner.uuid
      linkData.targetType = hasEnd.targetType
    } else {
      linkData.end = curPoint
      linkData.target = ''
      linkData.targetType = ''
    }
    console.log('linkData', linkData)
    console.log('points', generatePoint(linkData.start, linkData.end))
    linkData.points = generatePoint(linkData.start, linkData.end)
    let lines = drawer.selectAll(`path[id = "${linkData.id}"]`).data([linkData.points])
     lines.enter()
        .append('path')
        .attr('parentId', linkData.source)
        .attr('id', linkData.id)
        .attr('d', d => line(d))
        .merge(lines)
        .attr('targetId', linkData.target)
        .attr('d', d => line(d))
  }
  let lineDrawerEnd = function () {
    if (!globalData.line) {
      globalData.line = []
    }
    globalData.line.push(utils.deepCopy(linkData))
  }
  let lineDrawerHandler = d3.drag().on('start', lineDrawerStart)
                                                      .on('drag', lineDrawer)
                                                      .on('end', lineDrawerEnd)

  function initContainerTrans () {
    drawerEl.addEventListener('generate_shape', (e) => {
      console.log('selector', `[uuid = "${rectData.uuid}"]`)
      let rect = drawer.selectAll(`[uuid = "${rectData.uuid}"]`).data([rectData])
        .enter()
        .append('g')
        .attr('uuid', d => d.uuid)
        .attr('transform', d => `translate(${d.translateX},${d.translateY})`)
        .call(drag)
        .selectAll('.shape')
        .data([rectData])
        .enter()
        .append('rect')
        .attr('class', 'shape')
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .attr('rx', d => d.rx)

      let resizerEl = drawer.select(`[uuid = '${rectData.uuid}']`).selectAll('.resizer')
        .data(generateResizer(rectData))
        .enter()
        .append('circle')
        .attr('class', 'resizer')
        .attr('parentId', rectData.uuid)
        .style('fill', '#198cff')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('type', d => d.type)
        .attr('r', 5)
        .call(resizer)
      let drawerCircle = drawer.select(`[uuid = '${rectData.uuid}']`).selectAll('circle.link-circle')
        .data(generateLinkcircle(rectData))
        .enter()
        .append('circle')
        .attr('class', 'link-circle')
        .attr('parentId', rectData.uuid)
        .style('fill', '#198cff')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('type', d => d.type)
        .attr('r', 5)
        .call(lineDrawerHandler)
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
        if (rectData) {
          rectData.connectDots = {
            left: {
              x: rectData.translateX,
              y: rectData.translateY + rectData.height / 2
            },
            right: {
              x: rectData.translateX + rectData.width,
              y: rectData.translateY + rectData.height / 2
            },
            top: {
              x: rectData.translateX + rectData.width / 2,
              y: rectData.translateY,
            },
            bottom:{
              x: rectData.translateX + rectData.width / 2,
              y: rectData.translateY + rectData.height,
            }
          }
          globalData[rectData.type] = globalData[rectData.type] ? globalData[rectData.type] : []
          globalData[rectData.type].push(utils.deepCopy(rectData))
        }
        rectData = {
          'x': 0, 'y': 0,
          'width': 200,
          'height': 120,
          'rx': 5,
          uuid: utils.generateUUID(),
          translateX: 100,
          translateY: 100,
          type: 'rect'
        }
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