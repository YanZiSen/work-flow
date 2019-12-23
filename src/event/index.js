import * as d3 from 'd3'
import './index.styl'

// {
//     let r = 400;
//     var svg = d3.select('body').append('svg')
//     let positionLabel = svg.append('text')
//                             .attr('x', 10)
//                             .attr('y', 30)
//     let printPosition = () => {
//         let position = d3.mouse(svg.node())
//         positionLabel.text(position)
//     }
//     svg.on('mousemove', printPosition)
//     svg.on('click', () => {
//         for (let i = 0; i < 5; i++) {
//             var position = d3.mouse(svg.node())
//             var circle = svg.append('circle')
//                             .attr('cx', position[0])
//                             .attr('cy', position[1])
//                             .attr("r", 0)
//                             .attr('stroke', '#666')
//                             .attr('fill', 'none')
//                             .style("stroke-width", 5 / (i))
//                             .transition()
//                                 .delay(Math.pow(i, 2.5) * 50)
//                                 .duration(2000)
//                                 .ease(d3.easeQuadIn)
//                             .attr('r', r)
//                             .style('stroke-opacity', 0)
//                             .on('end', function () {
//                                 d3.select(this).remove()
//                             })
//         }
//     })
// }

{
    let width = 600, height = 350, r = 50
    let data = [
        [width / 2 - r, height / 2 - r],
        [width / 2 + r, height / 2 - r],
        [width / 2 - r, height / 2 + r],
        [width / 2 + r, height / 2 + r]
    ]
    let zoomHandler = () => {
        var transform = d3.event.transform
        console.log('transform', transform)
        svg.attr("transform", `scale(${transform.k})`)
    }
    var svg = d3.select('body').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('transform-origin', 'center center')
                    .call(
                        d3.zoom().scaleExtent([1, 10])
                        .on('zoom', zoomHandler)
                    )
    let move = function (d) {
        var x = d3.event.x
        var y = d3.event.y
        console.log('x', x, 'y', y)
        console.log('translate', `translate(${x},${y})`)
        console.log('el', d3.select(this))
        d3.select(this).attr("transform", d => `translate(${x},${y})`)
    }
    let drag = d3.drag().on('drag', move)
   
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        // .attr('cx', d => d[0])
        // .attr('cy', d => d[1])
        .attr('r', r)
        .attr('transform', (d) => {
            return `translate(${d})`
        })
        .call(drag)
}