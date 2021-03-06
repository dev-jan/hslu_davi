function createMap() {
  w = 3000;
  h = 1250;
  var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 450 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

  var theBlitzerData;
  var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  var projection = d3
    .geoEquirectangular()
    .center([120, 0]) // set centre to further North
    .scale([w/(2*Math.PI)]) // scale to fit group width
    .translate([w/2,h/2]) // ensure centred in group

  // Define map path
  var path = d3
    .geoPath()
    .projection(projection)

  // apply zoom to countriesGroup
  function zoomed() {
    t = d3
      .event
      .transform
    ;
    countriesGroup.attr(
      "transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")"
    );
  }
  var zoom = d3
   .zoom()
   .scaleExtent([0.5, 10])
   .on("zoom", zoomed)

  // append the svg object to the body of the page
  var svg = d3.select("#mapbox")
    .append("svg")
    // set to the same size as the "map-holder" div
    .attr("width", "100%")
    .attr("height", height)
    // add zoom functionality
    .call(zoom);

  queue()
    .defer(d3.json, "data/blitzerPerCountry.json")
    .defer(d3.json, "data/world.geo.json")
    .await(loaded);

  function loaded(err, theBlitzerData, worldData) {
    field = "value";
    theBlitzerData = theBlitzerData.map(function(d) {
      d[field] = (d[field] === undefined || isNaN(+d[field])) ? null : +d[field];
      return d;
    }).filter(function(d) {
      return d[field] !== null;
    });

    var datadomain = d3.extent(theBlitzerData.map(function(x) { return x[field]; }));
    var colors = d3.scaleQuantize()
                    .domain(datadomain)
                    .range(colorbrewer["Oranges"][9]);

    var x = d3.scaleLinear()
                .domain(datadomain)
                .range([0, 240]);


    worldData.features = worldData.features.map(function(c) {
      val = 0
      valPerKilometer = 0
      theBlitzerData.filter(function(blitzerData){
        if (blitzerData.key == c.properties.iso_a2) {
          return true;
        }
        return false;
      }).forEach(function(blitzerData) {
        val += blitzerData.value
        valPerKilometer += blitzerData.value / (blitzerData.roadkilometer / 1000)
      })
      c["_data"] = val
      c["_dataKilometer"] = Math.round(valPerKilometer * 100) / 100
      return c
    })

    countriesGroup = svg
      .append("g")
      .attr("id", "map")
    ;
    // add a background rectangle
    countriesGroup
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
    ;
    countries = countriesGroup
      .selectAll("path")
      .data(worldData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", function(d, i) {
          return "country" + d.properties.iso_a2;
      })
      .attr("class", "country")
      .style("fill", function(d, i) {
        return (d["_data"] && d._data !== null) ? colors(d._data) : '#FFF';
      })
      // add an onclick action to zoom into clicked country
      .on("click", function(d, i) {
        d3.selectAll(".country").classed("country-on", false);
        d3.select(this).classed("country-on", true);

        tooltip.transition()
              .duration(200)
              .style("opacity", 1);
        var str = "<b>" + d.properties.name + "</b><br />";
        str += "Blitzer: " + d["_data"] + "<br />";
        str += "Blitzer pro 1000 Kilometer: " + d["_dataKilometer"]
        tooltip.html(str)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 30) + "px");
    })

    // x scale bar on the map
    var tf = ".0f",
      tsign = "",
      drange = datadomain[1] - datadomain[0];
    if (datadomain[0] < 0) {
      tsign = "+";
    }
    if (drange <= 2.0) {
      tf = ".2f";
    } else if (drange < 10.0) {
      tf = ".1f";
    }

    var xAxis = d3.axisBottom(x)
      .tickFormat(d3.format(tsign + tf));

    var xbar = svg.append("g")
                .attr("transform", "translate(" + (width / 2 - 120) + "," + (height - 30) + ")")
                .attr("class", "map-xbar-scale");

    xbar.selectAll("rect")
        .data(d3.pairs(x.ticks(10)))
      .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .style("fill", function(d) { return colors(d[0]); });
  }

}

createMap()
