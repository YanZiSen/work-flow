import * as d3 from 'd3'
import './index.styl'
{
  let max = 11, data = []
  for (var i = 1; i < max; ++i) data.push(i)

  var linear = d3.scaleLinear().domain([1,10]).range([1,10])
  var linearCapped = d3.scaleLinear().domain([1,10]).range([1,20])

  var pow = d3.scalePow().exponent(2)
  var powCappend = d3.scalePow().domain([1,10]).rangeRound([1,10])

  var log = d3.scaleLog()
  var logCappend = d3.scaleLog().domain([1,10]).rangeRound([1,10])

  function render (data, scale, selector) {
    d3.select(selector).selectAll('div')
      .data(data)
      .enter()
      .append('div')
        .classed('cell', true)
        .style('display', 'inline-block')
        .text(d => scale(d))
        // .text(d => d3.format('.2')(scale(d), 2))
  }
  render(data, linear, '#linear')
  render(data, linearCapped, '#linear-capped')
  render(data, pow, '#pow')
  render(data, powCappend, '#pow-capped')
  render(data, log, '#log')
  render(data, logCappend, '#log-capped')
}

{
  let start = new Date(2016, 0, 1)
  let end = new Date(2016, 11, 31), range = [0, 1200]
  let time = d3.scaleTime().domain([start, end])
    .rangeRound(range)
  let data = []
  for (let i = 0; i < 12; i++) {
    var date = new Date(start.getTime())
    data.push(date.setMonth(date.getMonth() + i))
  }
  d3.select('#time').selectAll('div').data(data)
    .enter()
    .append('div')
    .classed('cell', true)
    .style('width', '200px')
    .text(d => time(d) + '    ' + d3.timeFormat('%x')(d))
}