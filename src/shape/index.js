import * as d3 from 'd3'

{
    let width = 600
    let height = 600
    let svg = d3.select('body').append('svg')
    svg.attr('width', width)
        .attr('height', height)
    // svg.append('line')
    //     .attr('x1', 30)
    //     .attr('y1', 30)
    //     .attr('x2', 200)
    //     .attr('y2', 200)
    //     .attr('stroke', '#666')
    // svg.append('circle')
    //     .attr('cx', 250)
    //     .attr('cy', 250)
    //     .attr('r', 50)
    //     .attr('stroke', '#666')
    //     .attr('fill', 'none')
    // svg.append('rect')
    //     .attr('x', 200)
    //     .attr('y', 200)
    //     .attr('width', 150)
    //     .attr('height', 200)
    //     .attr('stroke', '#666')
    //     .attr('fill', 'none')
    // svg.append('polygon')
    //     .attr('points', "450,200 500,100 550,200")
    //     .attr('stroke', '#666')
    //     .attr('fill', 'none')

    // 线段生成器
    let data = [
        [
            {x: 0, y: 150},
            {x: 100, y: 230},
            {x: 140, y: 180},
            {x: 240, y: 300},
            {x: 280, y: 120},
            {x: 340, y: 260},
            {x: 420, y: 340}
        ]
    ]
    let line = d3.line()
                .x(d => {
                    console.log('d', d)
                    return d.x
                })
                .y(d => d.y)
                .curve(d3.curveCardinal)
    svg.selectAll('path.line').data(data)
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('d', i => {
            console.log('line', i, line(i))
            return line(i)
        })
        .attr('stroke', '#888')
        .attr('fill', 'none')
    data.forEach(list => {
        svg.append('g').selectAll('circle').data(list)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 4.5)
        .attr('stroke', '#666')
        .attr('fill', '#fff')
    })    
}