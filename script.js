const svg = d3.select("#canvas");
const g = svg.append("g");

// Zet SVG expliciet fullscreen
function resize() {
  svg.attr("width", window.innerWidth);
  svg.attr("height", window.innerHeight);
}

resize();
window.addEventListener("resize", resize);

// Zoom & pan
const zoom = d3.zoom()
  .scaleExtent([0.3, 5])
  .on("zoom", (event) => {
    g.attr("transform", event.transform);
  });

svg.call(zoom);

// Data laden
d3.json("data.json").then(function (data) {

  // ID → persoon map
  const peopleMap = {};
  data.people.forEach(function (p) {
    peopleMap[p.id] = p;
  });

  // Lijnen
  g.selectAll(".link")
    .data(data.links || [])
    .enter()
    .append("line")
    .attr("x1", function (d) { return peopleMap[d.source].x; })
    .attr("y1", function (d) { return peopleMap[d.source].y; })
    .attr("x2", function (d) { return peopleMap[d.target].x; })
    .attr("y2", function (d) { return peopleMap[d.target].y; })
    .attr("stroke", "#444")
    .attr("stroke-width", 1);

  // Personen
  const person = g.selectAll(".person")
    .data(data.people)
    .enter()
    .append("g")
    .attr("class", "person")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  person.append("image")
  .attr("xlink:href", d => d.photo)
  .attr("width", 120)
  .attr("height", 120)
  .attr("x", -60)
  .attr("y", -60);

  person.append("text")
    .attr("y", 90)
    .attr("text-anchor", "middle")
    .attr("fill", "#e0e0e0")
    .attr("font-size", "14px")
    .text(function (d) { return d.name; });

  // Start gecentreerd
  requestAnimationFrame(function () {
    const bbox = svg.node().getBoundingClientRect();

    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .scale(1)
        .translate(bbox.width / 2, bbox.height / 2)
    );
  });

});
