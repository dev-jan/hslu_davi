function createCompare() {
  w = 3000;
  h = 1250;
  var margin = {top: 30, right: 40, bottom: 30, left: 100},
  width = document.getElementById('comparebox').offsetWidth - margin.left - margin.right,
  height = 2000 - margin.top - margin.bottom;

  d3.json("data/blitzerPerCountry.json", function(data) {
    // sort the data
    data = data.sort(function (a, b) {
      return d3.ascending(a.value, b.value);
    })

    var x = d3.scaleLinear()
              .range([0, width]);

    
    var y = d3.scaleBand()
              .range([height, 0])
              .padding(0.1);

    // Scale the range of the data in the domains
    x.domain([0, d3.max(data, function(d){ return d.value; })])
    y.domain(data.map(function(d) { return d.name; }));

    var yAxis = d3.axisLeft()
        .scale(y)
        //no tick marks
        .tickSize(0);

    var svgCompare = d3.select("#comparebox").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")

    var gy = svgCompare.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    // append the rectangles for the bar chart
    var bars = svgCompare.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .on('mouseover', function (d, i) {
          d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
        })
        .on('mouseout', function (d, i) {
          d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1')
        });

    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.name);
        })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.value);
        });

    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.name) + y.bandwidth() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.value) + 3;
        })
        .text(function (d) {
            return d.value;
        });

  })
  
}

createCompare()
