import { htmlMoneyFormatter } from './util.js'

const appendSparkline = (elemId, data) => {

  const width = 200;
  const height = 60;
  const x = d3.scale.linear().range([0.02 * width, 0.98 * width]);
  const y = d3.scale.linear().range([0.98 * height, 0.02 * height]);
  const line = d3.svg
    .line()
    .interpolate("bundle")
    .x((d) => {
      return x(d.time);
    })
    .y((d) => {
      return y(d.close);
    });

  const drawSparkline = (elemId, data) => {
    data.forEach((d) => {
      d.time = +d.time;
      return d.close = +d.close;
    });
    x.domain(d3.extent(data, (d) => {
      return d.time;
    }));
    y.domain(d3.extent(data, (d) => {
      return d.close;
    }));

    const svg = d3.select(elemId)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(0, 2)');
    svg.append('path')
      .datum(data)
      .attr('class', 'sparkline')
      .attr('d', line);
    svg.append('circle')
      .attr('class', 'sparkcircleEnd')
      .attr('cx', x(data[data.length - 1].time))
      .attr('cy', y(data[data.length - 1].close))
      .attr('r', 3);
    svg.append('circle')
      .attr('class', 'sparkcircleStart')
      .attr('cx', x(data[0].time))
      .attr('cy', y(data[0].close))
      .attr('r', 3);
    svg.append('text')
      .attr('class', 'graphValueLabel')
      .attr('x', x(data[data.length - 1].time))
      .attr('y', height / 2)
      .attr('text-anchor', 'end')
      .text(htmlMoneyFormatter(data[data.length - 1].close, '\u20AC'));
    svg.append('text')
      .attr('class', 'graphValueLabel')
      .attr('x', x(data[0].time))
      .attr('y', height / 2)
      .attr('text-anchor', 'start')
      .text(htmlMoneyFormatter(data[0].close, '\u20AC'));
  }; // drawSparkline

  return drawSparkline(elemId, data);
}; // appendSparkline

export { appendSparkline };