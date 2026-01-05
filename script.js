// ===== BASIS =====
const svg = d3.select("#canvas");
const scene = document.getElementById("scene");
const g = svg.append("g");

// Fullscreen SVG
function resize() {
  svg.attr("width", window.innerWidth);
  svg.attr("height", window.innerHeight);
}
resize();
window.addEventListener("resize", resize);

// ===== SVG GLOW FILTER (voor lijnen) =====
const defs = svg.append("defs");

const glow = defs.append("filter")
  .attr("id", "glow");

glow.append("feGaussianBlur")
  .attr("stdDeviation", "2")
  .attr("result", "blur");

const merge = glow.append("feMerge");
merge.append("feMergeNode").attr("in", "blur");
merge.append("feMergeNode").attr("in", "SourceGraphic");

// ===== ZOOM & PAN =====
const zoom = d3.zoom()
  .scaleExtent([0.3, 5])
  .on("zoom", (event) => {
    g.attr("transform", event.transform);
  });

svg.call(zoom);

// ===== DATA =====
d3.json("data.json").then(data => {

  const map = {};
  data.people.forEach(p => map[p.id] = p);

  // Lijnen
  g.selectAll(".link")
    .data(data.links || [])
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("x1", d => map[d.source].x)
    .attr("y1", d => map[d.source].y)
    .attr("x2", d => map[d.target].x)
    .attr("y2", d => map[d.target].y)
    .attr("filter", "url(#glow)");

  // Personen
  const person = g.selectAll(".person")
    .data(data.people)
    .enter()
    .append("g")
    .attr("class", "person")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

  person.append("image")
    .attr("xlink:href", d => d.photo)
    .attr("width", 120)
    .attr("height", 120)
    .attr("x", -60)
    .attr("y", -60);

  person.append("text")
    .attr("y", 90)
    .text(d => d.name);

  // Start gecentreerd
  requestAnimationFrame(() => {
    const r = svg.node().getBoundingClientRect();
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(r.width / 2, r.height / 2)
    );
  });
});

// ===== ECHTE DARK-KANTELING (3D CAMERA) =====
scene.addEventListener("mousemove", (e) => {
  const rect = scene.getBoundingClientRect();

  const x = (e.clientX - rect.width / 2) / rect.width;
  const y = (e.clientY - rect.height / 2) / rect.height;

  const rotateY = x * 14;    // links/rechts → zijkant komt naar voren
  const rotateX = -y * 10;   // omhoog/omlaag → boven/onder komt naar voren

  scene.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
  `;
});

scene.addEventListener("mouseleave", () => {
  scene.style.transform = "rotateX(0deg) rotateY(0deg)";
});
