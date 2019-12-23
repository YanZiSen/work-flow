import * as d3 from 'd3'
import './index.styl'
import Mock from 'mockjs'

/**
 * 数据绑定。经数组绑定为数据
 {
    // enter update merge exit
    // d3.select('#drawer').text('测试-text')
    let data = [10,15,30,50,80,65,55,30,20,10,8]
    function render (data) {
      var bars = d3.selectAll('div.h-bar').data(data) // 绑定元素与数据的关系, 返回update部分
      // bars
      //   // .append('div') // 对选集进行遍历操作
      //   .attr('class', 'h-bar')
      //   .style('width', d => d * 3 + 'px')
      //   .text(d => d)
      bars.enter()  // enter 补齐选集
        .append('div') // 对选集进行遍历操作
        .attr('class', 'h-bar')
        .merge(bars) // ? update在哪用 返回update(), enter() 合并的结果
        .style('width', d => d * 3 + 'px')
        .text(d => d)
      bars.exit().remove()
    }
    setInterval(()=> {
      data.shift()
      data.push(Math.round(Math.random()*100))
      render(data)
    },1000)
  }
*/

// {
//   // 经对象绑定为数据
//   var data = Mock.mock({
//     "list|10": [{
//       "width|10-100": 10,
//       "color|10-100": 20
//     }]
//   }).list
//   var colorScale = d3.scaleLinear()
//     .domain([0,100])
//     .range('#add8e6', 'blue')
//   function render (data) {
//     var bars = d3.selectAll('.h-bar').data(data)
//     bars.enter()
//       .append('div')
//       .attr('class', 'h-bar')
//       .merge(bars)
//       .style('width', d => d.width * 5 + 'px')
//       .style('backgroundColor', d => colorScale(d.color))
//       .text(d => d.width)
//     bars.exit().remove()
//   }
//   setInterval(() => {
//     data.shift()
//     data.push({
//       width: Mock.Random.integer(10, 100),
//       color: Mock.Random.integer(10, 100)  
//     })
//     render(data)
//   }, 1000)
//   render(data)
// }

// {
//   let data = []
//   let datum = function (x) {
//     return 15 + x * x
//   }
//   let newData = function () {
//     data.push(datum)
//     return data
//   }
//   function render () {
//     var divs = d3.select('#container').selectAll('div').data(newData) // 绑定的是函数，会直接调用此函数
//     divs.enter().append('div').append('span');
//     divs.attr("class", 'v-bar')
//         .style('height', function (d, i) {
//           return d(i) + 'px'
//         })
//         .select('span')
//         .text((d, i) => {
//           return d(i)
//         })
//     divs.exit().remove()
//   }
//   render()
//   setInterval(render, 1000)
// }

{
  // 数据排序
  var data = [
    {expense: 10, category: "Retail"},
    {expense: 15, category: "Gas"},
    {expense: 30, category: "Retail"},
    {expense: 50, category: "Dining"},
    {expense: 80, category: "Gas"},
    {expense: 65, category: "Retail"},
    {expense: 55, category: "Gas"},
    {expense: 30, category: "Dining"},
    {expense: 20, category: "Retail"},
    {expense: 10, category: "Dining"},
    {expense: 8, category: "Gas"},
  ]
  function render (data, comparator) {
    var basr = d3.selectAll('.h-bar').data(data)
    basr.enter().append('div').attr('class', 'h-bar').append('span')
    d3.selectAll('.h-bar')
      .style('width', d => d.expense * 5 + 'px')
      .select('span')
      .text(d => d.category)
    if (comparator) {
      basr.sort(comparator)
    }
  }
  var compareByExpense = (a, b) => {
    return a.expense - b.expense ? -1 : 1
  }
  var compareByCategory = (a, b) => {
    return a.category < b.category ? -1 : 1
  }
  render(data)
  function sort(comparator) {
    render(data, comparator)
  }
  function appendBtn () {
    let btnGroup = document.createElement('div')
    btnGroup.setAttribute('class', 'btn-group')
    document.body.appendChild(btnGroup)
    let documentFlag = document.createDocumentFragment()
    let btn = document.createElement('button')
    btn.innerText = 'Sort by Expense'
    btn.onclick = sort.bind(btn,compareByExpense)
    let btn1 = document.createElement('button')
    btn1.onclick = sort.bind(btn1, compareByCategory)
    btn1.innerText = 'Sort by Category'
    let btn2 = document.createElement('button')
    btn2.onclick = sort.bind(btn2, null)
    btn2.innerText = 'Reset'
    documentFlag.appendChild(btn)
    documentFlag.appendChild(btn1)
    documentFlag.appendChild(btn2)
    btnGroup.appendChild(documentFlag)
  }
  appendBtn()
}