import action from './action'
import * as d3 from 'd3'
import global from './global'

let curGroup

let line = d3.line().x(d => d.x).y(d => d.y)

/**
 * 根据起点和终点生成插值线段
 * @param start link起点坐标
 * @param end link结束点坐标
 * @returns {*[]} 插值数组
 */
function interpolationDots (start, end) {
  return [start, end]
}

/**
 * 根据shape数据生成reszier坐标
 * @param data shape数据
 * @returns {*[]}
 */
function generateResizePos (data) {
  return [
    {x: 0, y: 0, type: 'left,top' },
    {x: 0, y: 0 + data.height, type: 'left,bottom'},
    {x: 0 + data.width, y: 0, type: 'right,top'},
    {x: 0 + data.width, y: 0 + data.height, type: 'right,bottom'},
  ]
}

/**
 * 根据点坐标生成连接操作点
 * @param data
 * @returns {*[]}
 */
function generateLinkPosition (data) {
  return [
    {x: 0, y: data.height / 2, type: 'left' },
    {x: data.width, y: data.height / 2, type: 'right'},
    {x: data.width / 2, y: 0, type: 'top'},
    {x: data.width / 2, y: data.height, type: 'bottom'},
  ]
}

/**
 * 根据连接点位置和形状数据生成连接点位置
 * @param data
 * @param type
 * @returns {x, y}
 */
function generateLinkPointByType (data, type) {
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

function generateHandler ({data, shape} = {}) {
  console.log(data, shape)
  if (curGroup) {
    removeHandler()
  }
  curGroup = d3.select(`g[uuid = '${data.uuid}']`)
  curGroup
    .selectAll('circle.link-circle')
    .data(generateLinkPosition(data))
    .enter()
    .append('circle')
    .attr('class', 'link-circle')
    .attr('parentId', data.uuid)
    .style('fill', '#198cff')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('type', d => d.type)
    .attr('r', 5)
    .call(action.lineDrawerHandler)

  curGroup.selectAll('.resizer')
    .data(generateResizePos(data))
    .enter()
    .append('circle')
    .attr('class', 'resizer')
    .attr('parentId', data.uuid)
    .style('fill', '#198cff')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('type', d => d.type)
    .attr('r', 5)
    .call(action.resizer)
}

function generateLineHandler ({data, shape}) {
  console.log('data', data, 'shape', shape)
<<<<<<< HEAD
  d3.select(`g[uuid = "${data.uuid}"]`).selectAll('circle')
    .data(data.points)
    .enter()
    .append('circle')
    .attr('class', 'link-modify')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 4)
    .attr('relation-type', (d, i) => {
      return i === 0 ? 'source': i === (data.points.length - 1) ? 'target' : 'other'
    })
    .style('fill', 'yellow')
    .call(action.lineModifyHandler)
=======
>>>>>>> 2cd597f1186e6e89a3f70245f9405e7fc997f21d
}

function removeHandler () {
  if (curGroup) {
    curGroup.selectAll('circle.link-circle').remove()
    curGroup.selectAll('.resizer').remove()
    curGroup = null
  }
}

function generateShape (type) {
  let tempData = global.appendShape()
  global.getDrawer().selectAll(`[uuid = "${tempData.uuid}"]`).data([tempData])
    .enter()
    .append('g')
      .attr('uuid', d => d.uuid)
      .attr('transform', d => `translate(${d.translateX},${d.translateY})`)
      .call(action.drag)
      .selectAll('.shape')
      .data([tempData])
      .enter()
      .append('rect')
        .attr('uuid', d => d.uuid)
        .attr('class', 'shape')
        .attr('shape', 'rect')
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .attr('rx', d => d.rx)
}

export default {
  generateShape,
  generateHandler,
  generateResizePos,
  interpolationDots,
  generateLinkPosition,
  generateLinkPointByType,
  removeHandler,
  generateLineHandler,
  line,
}