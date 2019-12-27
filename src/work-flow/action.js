import * as d3 from "d3";
import utils from "./utils";
import global from './global'
import {positionKd} from './config'
import generate from './generator'

// 相互引用提成公共方法

/**
 * 判断是否可以捕捉,并将捕捉点信息返回
 * @param data
 * @returns {
 *      owner 所属点形状信息, targetType 结束点位置, end 结束点坐标
 * }
 */
function catchPoint (data) {
  let point = null
  let globalData = global.getGlobalData()
  if (Object.keys(globalData).length) {
    Object.keys(globalData).forEach(key => {
      if (key === 'line') return;
      globalData[key].forEach(dataObj => {
        let connectDots = dataObj.connectDots
        for (key in connectDots) {
          if (Math.sqrt(
              Math.pow(connectDots[key].x - data.x, 2) +
              Math.pow(connectDots[key].y - data.y, 2)
          ) < 20){
            point = {
              owner: dataObj,
              targetType: key,
              end: utils.deepCopy(connectDots[key])
            }
          }
        }
      })
    })
  }
  return point
}

let move = function () {
  // 更新shape
  let uuid = d3.select(this).attr('uuid')
  let data = global.findDataByid(uuid)
  let globalData = global.getGlobalData()
  data.translateX += d3.event.dx
  data.translateY += d3.event.dy
  data.connectDots =  global.calcConnectDots(data)
  d3.select(this).attr("transform", d => `translate(${data.translateX},${data.translateY})`)

  if (globalData.line) {
    // 更新link
    let linkData = globalData.line.filter(line => line.source === uuid).map(line => {
      line.start = generate.generateLinkPointByType(data, line.type)
      line.points = generate.interpolationDots(line.start, line.end)
      return line
    })
    // console.log('lines', d3.selectAll(`path[parentId = "${uuid}"]`))
    // console.log('linkData', linkData)
    let linkGroup = d3.selectAll(`g[parentId = "${uuid}"]`).data(linkData)
    linkGroup.selectAll('path').data(d => Array(2).fill(d))
      .attr('d', d => generate.line(d.points))

    let lindDataT = globalData.line.filter(line => line.target === uuid).map(line => {
      line.end = data.connectDots[line.targetType]
      line.points = generate.interpolationDots(line.start, line.end)
      return line
    })

    let linkGroupT = d3.selectAll(`g[targetId = "${uuid}"]`).data(lindDataT)
    linkGroupT.selectAll('path').data(d => Array(2).fill(d))
    .attr('d', d => generate.line(d.points))
  }
}
let drag = d3.drag().on('drag', move)

let resize = function () {
  // 获取resize点的信息, 获取递增系数
  let uuid = d3.select(this).attr('parentId')
  let data = global.findDataByid(uuid)
  let globalData = global.getGlobalData()
  let [horizontal, vertical] = d3.select(this).attr('type').split(',')
  // 更新数据
  data.width = data.width + positionKd[horizontal] * d3.event.dx
  data.height = data.height + positionKd[vertical] * d3.event.dy
  data.connectDots =  global.calcConnectDots(data)
  // 更新形状
  let parent = d3.select(`g[uuid = "${uuid}"]`)
  parent.select(`.shape`).data([data])
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('rx', d => d.rx)
  parent.selectAll(`.resizer`).data(generate.generateResizePos(data))
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
  parent.selectAll('.link-circle').data(generate.generateLinkPosition(data))
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)

  if (globalData.line) {
    // 更新link
    let linkData = globalData.line.filter(line => line.source === uuid).map(line => {
      line.start = generate.generateLinkPointByType(data, line.type)
      line.points = generate.interpolationDots(line.start, line.end)
      return line
    })
    // console.log('lines', d3.selectAll(`path[parentId = "${uuid}"]`))
    // console.log('linkData', linkData)
    let linkGroup = d3.selectAll(`g[parentId = "${uuid}"]`).data(linkData)
    linkGroup.selectAll('path').data(d => Array(2).fill(d))
    .attr('d', d => generate.line(d.points))

    let lindDataT = globalData.line.filter(line => line.target === uuid).map(line => {
      line.end = data.connectDots[line.targetType]
      line.points = generate.interpolationDots(line.start, line.end)
      return line
    })

    let linkGroupT = d3.selectAll(`g[targetId = "${uuid}"]`).data(lindDataT)
    linkGroupT.selectAll('path').data(d => Array(2).fill(d))
    .attr('d', d => generate.line(d.points))
  }
}
let resizer = d3.drag().on('drag', resize)

let lineDrawerStart = function () {
  let uuid = d3.select(this).attr('parentId')
  let type = d3.select(this).attr('type')
  let linkData = global.initLinkData(uuid, type)
  let data = global.findDataByid(uuid)
  linkData.start = generate.generateLinkPointByType(data, type)
}

let lineDrawer = function () {
  let rootNode = global.getDrawer().node()
  let linkData = global.getLinkData()
  let curPoint = {
    x: d3.mouse(rootNode)[0],
    y: d3.mouse(rootNode)[1]
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

  linkData.points = generate.interpolationDots(linkData.start, linkData.end)

  let lineGroup = global.getDrawer().select(`g[uuid = "${linkData.uuid}"]`).attr('targetId', linkData.target)
  if (!lineGroup.node()) {
    lineGroup = global.getDrawer().append('g')
      .attr('uuid', linkData.uuid)
      .attr('parentId', linkData.source)
      .attr('targetId', linkData.target)
  }

  let lines = lineGroup.selectAll('path').data(Array(2).fill(linkData.points));
  lines
    .enter()
    .append('path')
    .attr('shape', 'line')
    .attr('marker-end', (d, i) => {
      return i ? 'url(#arrow)' : ''
    })
    .merge(lines)
    .attr('class', 'link')
    .style('stroke', (d, i) => {
      return i ? '#666' : 'transparent'
    })
    .attr('d', d => generate.line(d))
    .attr('stroke-width', (d, i) => {
      return i ? 1 : 9
    })
}
let lineDrawerEnd = function () {
  global.addLink()
}
let lineDrawerHandler = d3.drag().on('start', lineDrawerStart)
  .on('drag', lineDrawer)
  .on('end', lineDrawerEnd)
let lineModifyStart = function () {
  let linkGroupId = this.parentNode.getAttribute('uuid')
  // find data
  let data = global.findDataByid(linkGroupId)
  data.originStart = Object.assign({x: 0, y: 0}, data.start)
  data.originEnd = Object.assign({x: 0, y: 0}, data.end)
}
let lineModify = function () {
  let relationType = this.getAttribute('relation-type')
  let linkGroupId = this.parentNode.getAttribute('uuid')
  // find data
  let data = global.findDataByid(linkGroupId)
  // change data (source , target)
  if (relationType === 'source') {
    let start = Object.assign({x:0, y:0}, data.originStart)
    let moveX = d3.event.x - d3.event.subject.x
    let moveY = d3.event.y - d3.event.subject.y
    start.x = start.x + moveX
    start.y = start.y + moveY
    console.log('moveX', 'moveY', moveX, moveY, start.x, start.y)
    let catchPointPos = catchPoint(start)
    if (!catchPointPos) {
      console.log('yes')
      data.source = ''
      data.start = {x: data.originStart.x + moveX, y: data.originStart.y + moveY}
      data.points = generate.interpolationDots(data.start, data.end)
      let linkGroup = d3.select(`g[uuid = "${linkGroupId}"]`)
      linkGroup.selectAll('path').data(Array(2).fill(data))
        .attr('d', d => generate.line(d.points))
      linkGroup.selectAll('circle').data(data.points)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    } else {
      console.log('catch-it')
      data.source = catchPointPos.owner.uuid
      data.start = catchPointPos.end
      data.type = catchPointPos.targetType
      data.points = generate.interpolationDots(data.start, data.end)
      let linkGroup = d3.select(`g[uuid = "${linkGroupId}"]`)
      linkGroup.selectAll('path').data(Array(2).fill(data))
      .attr('d', d => generate.line(d.points))
      linkGroup.selectAll('circle').data(data.points)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    }
  } else if (relationType === 'target') {
    let end = Object.assign({x:0, y:0}, data.originEnd)
    let moveX = d3.event.x - d3.event.subject.x
    let moveY = d3.event.y - d3.event.subject.y
    end.x = end.x + moveX
    end.y = end.y + moveY
    console.log('moveX', 'moveY', moveX, moveY, end.x, end.y)
    let catchPointPos = catchPoint(end)
    if (!catchPointPos) {
      console.log('yes')
      data.target = ''
      data.end = {x: data.originEnd.x + moveX, y: data.originEnd.y + moveY}
      data.points = generate.interpolationDots(data.start, data.end)
      let linkGroup = d3.select(`g[uuid = "${linkGroupId}"]`)
      linkGroup.selectAll('path').data(Array(2).fill(data))
      .attr('d', d => generate.line(d.points))
      linkGroup.selectAll('circle').data(data.points)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    } else {
      console.log('catch-it')
      data.target = catchPointPos.owner.uuid
      data.end = catchPointPos.end
      data.targetType = catchPointPos.targetType
      data.points = generate.interpolationDots(data.start, data.end)
      let linkGroup = d3.select(`g[uuid = "${linkGroupId}"]`)
      linkGroup.selectAll('path').data(Array(2).fill(data))
      .attr('d', d => generate.line(d.points))
      linkGroup.selectAll('circle').data(data.points)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    }
  }
  // update Element
  console.log('relationType', 'linkGroup')
}
let lineModifyHandler = d3.drag().on('start', lineModifyStart).on('drag', lineModify)

export default {
  drag, resizer, lineDrawerHandler, lineModifyHandler
}