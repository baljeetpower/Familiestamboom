const svg = d3.select("#canvas");
const g = svg.append("g");

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
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

  // Foto
  person.append("image")
    .attr("href", d => d.photo)
    .attr("width", 120)
    .attr("height", 120)
    .attr("x", -60)
    .attr("y", -60);

  // Naam
  person.append("text")
    .attr("y", 80)
    .attr("text-anchor", "middle")
    .attr("fill", "#e0e0e0")
    .attr("font-size", "14px")
    .text(d => d.name);
});
