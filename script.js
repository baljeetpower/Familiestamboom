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

// ===== SVG GLOW FILTER =====
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

  // map id → persoon
  const map = {};
  data.people.forEach(p => {
    map[p.id] = p;
  });

  // ===== LIJNEN (240x360 foto) =====
  // horizontale offset: 140
  // verticale offset:   180
  g.selectAll(".link")
    .data(data.links || [])
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "#666")
    .attr("stroke-width", 2)
    .attr("opacity", 0.9)
    .attr("x1", d =>
      map[d.source].x + (map[d.source].x < map[d.target].x ? 140 : -140)
    )
    .attr("y1", d => map[d.source].y + 180)
    .attr("x2", d =>
      map[d.target].x + (map[d.source].x < map[d.target].x ? -140 : 140)
    )
    .attr("y2", d => map[d.target].y + 180)
    .attr("filter", "url(#glow)");

  // ===== PERSONEN =====
  const person = g.selectAll(".person")
    .data(data.people)
    .enter()
    .append("g")
    .attr("class", "person")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

  // Foto (240x360)
  person.append("image")
    .attr("xlink:href", d => d.photo)
    .attr("width", 240)
    .attr("height", 360)
    .attr("x", -120)
    .attr("y", -180);

  // Naam
  person.append("text")
    .attr("y", 210)
    .attr("text-anchor", "middle")
    .attr("fill", "#e0e0e0")
    .attr("font-size", "14px")
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

// ===== ECHTE DARK-KANTELING (CSS 3D CAMERA) =====
scene.addEventListener("mousemove", (e) => {
  const rect = scene.getBoundingClientRect();

  const x = (e.clientX - rect.width / 2) / rect.width;
  const y = (e.clientY - rect.height / 2) / rect.height;

  const rotateY = x * 14;   // links / rechts
  const rotateX = -y * 10;  // omhoog / omlaag

  scene.style.transform =
    `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

scene.addEventListener("mouseleave", () => {
  scene.style.transform =
    "perspective(1200px) rotateX(0deg) rotateY(0deg)";
});

// TESTLIJN (tijdelijk)
g.append("line")
  .attr("x1", -200)
  .attr("y1", 200)
  .attr("x2", 200)
  .attr("y2", 200)
  .attr("stroke", "red")
  .attr("stroke-width", 4);
