function createCompare() {
  var margin = {top: 20, right: 20, bottom: 70, left: 40},
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
  
  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  
  var y = d3.scaleLinear().range([height, 0]);
  
  var svgCompare = d3.select("#comparebox").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")")
  
    //Read the data
    d3.json("data/blitzerPerCountry.json", function(data) {
      // format the data
      data.forEach(function(d) {
        d.value = +d.value;
      });

      // Scale the range of the data in the domains
      x.domain(data.map(function(d) { return d.name; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);

      // append the rectangles for the bar chart
      svgCompare.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.name); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .on('mouseover', function (d, i) {
            d3.select(this).transition()
                  .duration('50')
                  .attr('opacity', '.85');
          })
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
                  .duration('50')
                  .attr('opacity', '1')
          })

      // add the x Axis
      svgCompare.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // add the y Axis
      svgCompare.append("g")
         .call(d3.axisLeft(y));
    })
  
}

createCompare()