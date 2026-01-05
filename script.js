const svg = d3.select("#canvas");

// fullscreen
function resize() {
  svg.attr("width", window.innerWidth);
  svg.attr("height", window.innerHeight);
}
resize();
window.addEventListener("resize", resize);

// ===== ZOOM & PAN (blijft SVG) =====
const g = svg.append("g");

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

  g.selectAll("line")
    .data(data.links || [])
    .enter()
    .append("line")
    .attr("x1", d => map[d.source].x)
    .attr("y1", d => map[d.source].y)
    .attr("x2", d => map[d.target].x)
    .attr("y2", d => map[d.target].y)
    .attr("stroke", "#444");

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
    .attr("text-anchor", "middle")
    .attr("fill", "#e0e0e0")
    .text(d => d.name);

  // start midden
  requestAnimationFrame(() => {
    const r = svg.node().getBoundingClientRect();
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(r.width / 2, r.height / 2)
    );
  });
});

// ===== ECHTE 3D TILT (DIT IS HET DARK-GEVOEL) =====
const scene = document.getElementById("scene");

scene.addEventListener("mousemove", (e) => {
  const rect = scene.getBoundingClientRect();

  const x = (e.clientX - rect.width / 2) / rect.width;
  const y = (e.clientY - rect.height / 2) / rect.height;

  const rotateY = x * 12;   // links/rechts kantelen
  const rotateX = -y * 10;  // omhoog/omlaag kantelen

  scene.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
  `;
});

scene.addEventListener("mouseleave", () => {
  scene.style.transform = `rotateX(0deg) rotateY(0deg)`;
});
