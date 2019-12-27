import utils from "./utils";
import * as d3 from 'd3'
import generate from './generator'
import action from './action'

let globalData = {}, tempShape, tempLink, drawer

/**
 * 根据形状id 获取形状信息
 * @param id 形状id
 * @returns {shapeData}
 */
function findDataByid (id) {
  let data = null
  if (tempShape.uuid === id) {
    data = tempShape
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

/**
 * 添加形状到缓存
 */
function appendShape () {
  if (tempShape) {
    tempShape.connectDots = calcConnectDots(tempShape)
    globalData[tempShape.type] = globalData[tempShape.type] ? globalData[tempShape.type] : []
    globalData[tempShape.type].push(utils.deepCopy(tempShape))
  }
  return resetShape()
}

/**
 * 删除形状
 */

/**
 * 修改特定形状
 */
function modifyShape (uuid) {

}

/**
 * 重置形状信息
 */
function resetShape () {
  tempShape = {
    'x': 0, 'y': 0,
    'width': 200,
    'height': 120,
    'rx': 5,
    uuid: utils.generateUUID(),
    translateX: 100,
    translateY: 100,
    type: 'rect',
    connectDots: {

    }
  }
  return tempShape
}

function getShapeTmp () {
  if (tempShape) {
    return tempShape
  } else {
    return resetShape()
  }
}

function getDrawer () {
  if (drawer) {
    return drawer
  } else {
    drawer = d3.select('.drawer').append('svg')
      .attr('class', 'drawer-svg')
      .attr('height', '100%')
      .attr('width', '100%')
      .on('click', () => {
        let target = d3.select(d3.event.target)
        if (target.attr('shape') === 'rect') {
          generate.generateHandler({
            data: findDataByid(target.attr('uuid')),
            shape: target.attr('shape')
          })
        } else if (target.attr('shape') === 'line') {
          let targetUuid = target.node().parentNode.getAttribute('uuid')
          generate.generateLineHandler({
            data: findDataByid(targetUuid),
            shape: target.attr('shape')
          })
        } else {
          generate.removeHandler()
        }
      })
    drawer.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('orient', 'auto')
      .attr('viewBox', '0 0 12 12')
      .attr('refX', 6)
      .attr('refY', 6)
      .append('path')
      .attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2')
      .style('fill', '#666')
    return d3.select('.drawer-svg')
  }
}

function initLinkData (sourceId, type) {
  tempLink = {
    target: null,
    source: sourceId,
    type: type,
    start: null,
    end: null,
    uuid: utils.generateUUID(),
    points: []
  }
  return tempLink
}

function getGlobalData () {
  return globalData
}
window.getGlobalData = getGlobalData
function getLinkData () {
  return tempLink
}

function addLink () {
  if (!globalData.line) {
    globalData.line = []
  }
  globalData.line.push(utils.deepCopy(tempLink))
  tempLink = null
}

function calcConnectDots (data) {
  return {
    left: {
      x: data.translateX,
          y: data.translateY + data.height / 2
    },
    right: {
      x: data.translateX + data.width,
          y: data.translateY + data.height / 2
    },
    top: {
      x: data.translateX + data.width / 2,
          y: data.translateY,
    },
    bottom:{
      x: data.translateX + data.width / 2,
          y: data.translateY + data.height,
    }
  }
}

export default {
  getGlobalData,
  getLinkData,
  findDataByid,
  appendShape,
  getShapeTmp,
  calcConnectDots,
  getDrawer,
  initLinkData,
  addLink
}