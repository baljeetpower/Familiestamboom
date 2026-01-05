const svg = d3.select("#canvas");
const g = svg.append("g");

// Zet SVG expliciet fullscreen
function resize() {
  svg
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);
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
d3.json("data.json").then(data => {

  const person = g.selectAll(".person")
    .data(data.people)
    .enter()
    .append("g")
    .attr("class", "person")
    .attr("transform", "translate(0, 0)");

  person.append("image")
    .attr("href", d => d.photo)
    .attr("width", 120)
    .attr("height", 120)
    .attr("x", -60)
    .attr("y", -60);

  person.append("text")
    .attr("y", 90)
    .attr("text-anchor", "middle")
    .attr("fill", "#e0e0e0")
    .attr("font-size", "14px")
    .text(d => d.name);

  // ⏱ Wacht 1 frame zodat SVG echt bestaat
  requestAnimationFrame(() => {
    const bbox = svg.node().getBoundingClientRect();

    svg.call(
      zoom.transform,
d3.zoomIdentity.scale(1).translate(bbox.width / 2, bbox.height / 2)
    );
  });
});
