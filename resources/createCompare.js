cw = 3000;
ch = 1250;
var cmargin = {top: 30, right: 60, bottom: 30, left: 100},
cwidth = document.getElementById('comparebox').offsetWidth - cmargin.left - cmargin.right,
cheight = 2000 - cmargin.top - cmargin.bottom;
compareData = null;

var x = d3.scaleLinear()
          .range([0, cwidth]);

var y = d3.scaleBand()
          .range([cheight, 0])
          .padding(0.1);

var yAxis = d3.axisLeft()
              .scale(y)
              //no tick marks
              .tickSize(0);

var svgCompare = d3.select("#comparebox").append("svg")
    .attr("width", cwidth + cmargin.left + cmargin.right)
    .attr("height", cheight + cmargin.top + cmargin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + cmargin.left + "," + cmargin.top + ")")

var gy = svgCompare.append("g")
    .attr("class", "yAxis")
    .call(yAxis)

function updateCompare(showRaw) {
    compareData.forEach(function(d, i) {
        if (showRaw) {
            d.value = d.oValue;
        }
        else {
            if (d.roadkilometer == null || d.roadkilometer == 0) {
                d.roadkilometer = 1
            }
            d.value = d.value / (d.roadkilometer / 1000);
        }
        d.value = Math.round(d.value * 100) / 100
    });
    compareData.sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    })
    x.domain([0, d3.max(compareData, function(d){ return d.value; })])
    y.domain(compareData.map(function(d) { return d.name; }));
    
    svgCompare.select(".yAxis")
              .call(yAxis)

    var barWrappers = svgCompare.selectAll(".barWrapper").data(compareData);
    var childRects = barWrappers.selectAll(".bar");
    childRects
        .transition()
        .attr("y", function (d) {
            return y(d.name);
        })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function (d) {
            console.log(d)
            return x(d.value);
        })
        .duration(1000);

    var childTexts = barWrappers.selectAll(".label");
    childTexts
        .transition()
        .attr("y", function (d) {
            return y(d.name) + y.bandwidth() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.value) + 3;
        })
        .text(function (d) {
            return d.value;
        })
        .duration(1000);
}

function createCompare(showRaw) {
  d3.json("data/blitzerPerCountry.json", function(data) {
    compareData = data
    data = data.map(function(d) {
        d.oValue = d.value;
        if (!showRaw) {
            if (d.roadkilometer == null || d.roadkilometer == 0) {
                d.roadkilometer = 1
            }
            d.value = d.value / (d.roadkilometer / 1000);
        }
        d.value = Math.round(d.value * 100) / 100
        return d;
    }).sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    })

    // Scale the range of the data in the domains
    x.domain([0, d3.max(data, function(d){ return d.value; })])
    y.domain(data.map(function(d) { return d.name; }));

    svgCompare.select(".yAxis")
              .call(yAxis)

    // append the rectangles for the bar chart
    var barWrappers = svgCompare.selectAll(".barWrapper")
        .data(compareData);

    barWrappers.exit()
               .transition().duration(1000)
               .attr("r", 0)
               .remove();

    barWrappersEnter = barWrappers.enter()
        .append("g")
        .attr("class", "barWrapper")
        .attr("id", function(d, i) {
            return "wrapper" + d.name;
        })
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

    barWrappersEnter.append("rect")
        .attr("class", "bar")
        .attr("id", function(d, i) {
            return "bar" + d.name;
        })
        .attr("y", function (d) {
            return y(d.name);
        })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.value);
        });

    //add a value label to the right of each bar
    barWrappersEnter.append("text")
        .attr("class", "label")
        .attr("id", function(d, i) {
            return "text" + d.name;
        })
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

function loadDataPerKilometer() {
    console.log("Load per Kilometer data...")
    document.getElementById("rawBtn").className = "pure-button"
    document.getElementById("kiloBtn").className = "pure-button pure-button-primary"
    updateCompare(false)
}

function loadDataRaw() {
    console.log("Load raw data...")
    document.getElementById("kiloBtn").className = "pure-button"
    document.getElementById("rawBtn").className = "pure-button pure-button-primary"
    updateCompare(true)
}

createCompare(true)
