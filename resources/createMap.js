function createMap() {
  w = 3000;
  h = 1250;
  var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 450 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

  
  var projection = d3
    .geoEquirectangular()
    .center([0, 15]) // set centre to further North
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
   .on("zoom", zoomed)

  // append the svg object to the body of the page
  var svg = d3.select("#mapbox")
    .append("svg")
    // set to the same size as the "map-holder" div
    .attr("width", "100%")
    .attr("height", height)
    // add zoom functionality
    .call(zoom);
  
  d3.json("data/world.geo.json", function(json) {
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
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", function(d, i) {
          return "country" + d.properties.iso_a3;
      })
      .attr("class", "country")
      // add an onclick action to zoom into clicked country
      .on("click", function(d, i) {
          d3.selectAll(".country").classed("country-on", false);
          d3.select(this).classed("country-on", true);
          boxZoom(path.bounds(d), path.centroid(d), 20);
      })
    ;
  });
}

createMap()