function generateUUID () {
  var d = new Date().getTime() + Math.random() * 210
  var uuid = 'xxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, (c) => {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}
function intersection (arr1, arr2) {
  if (arr1 instanceof Array && arr2 instanceof Array) {
    return arr1.filter(elem => arr2.indexOf(elem) > -1)
  } else {
    throw new Error('输入正确的参数')
  }
}
export default {
  generateUUID,
  intersection
}