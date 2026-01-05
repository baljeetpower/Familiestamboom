const svg = d3.select("#canvas");
const g = svg.append("g");

// Zoom & pan
const zoom = d3.zoom()
  .scaleExtent([0.3, 5])
  .on("zoom", (event) => {
    g.attr("transform", event.transform);
  });

svg.call(zoom);

// Test-element
g.append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 40)
  .attr("fill", "white");
