// ===== Basis SVG =====
const svg = d3.select("#canvas");
const g = svg.append("g");

// Fullscreen SVG
function resize() {
  svg.attr("width", window.innerWidth);
  svg.attr("height", window.innerHeight);
}
resize();
window.addEventListener("resize", resize);

// ===== Zoom + Parallax (Dark-style) =====
let zoomTransform = d3.zoomIdentity;
let parallaxX = 0;
let parallaxY = 0;

function updateTransform() {
  const combined = zoomTransform.translate(parallaxX, parallaxY);
  g.attr("transform", combined);
}

// Zoom
const zoom = d3.zoom()
  .scaleExtent([0.3, 5])
  .on("zoom", (event) => {
    zoomTransform = event.transform;
    updateTransform();
  });

svg.call(zoom);

// Subtiele parallax op muis
svg.on("mousemove", (event) => {
  const rect = svg.node().getBoundingClientRect();

  const mouseX = (event.clientX - rect.width / 2) / rect.width;
  const mouseY = (event.clientY - rect.height / 2) / rect.height;

  parallaxX = mouseX * 12; // pas aan voor sterker/zwakker
  parallaxY = mouseY * 12;

  updateTransform();
});

// ===== Data laden =====
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
    .attr("class", "link")
    .attr("x1", d => peopleMap[d.source].x)
    .attr("y1", d => peopleMap[d.source].y)
    .attr("x2", d => peopleMap[d.target].x)
    .attr("y2", d => peopleMap[d.target].y)
    .attr("stroke", "#444")
    .attr("stroke-width", 1);

  // Personen
  const person = g.selectAll(".person")
    .data(data.people)
    .enter()
    .append("g")
    .attr("class", "person")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

  // Foto
  person.append("image")
    .attr("xlink:href", d => d.photo)
    .attr("width", 120)
    .attr("height", 120)
    .attr("x", -60)
    .attr("y", -60);

  // Naam
  person.append("text")
    .attr("y", 90)
    .attr("text-anchor", "middle")
    .attr("fill", "#e0e0e0")
    .attr("font-size", "14px")
    .text(d => d.name);

  // Startpositie: midden van scherm
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
