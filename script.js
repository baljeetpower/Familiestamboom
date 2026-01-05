// ===== BASIS SVG =====
const svg = d3.select("#canvas");
const root = svg.append("g");

// Lagen (belangrijk!)
const bgLayer = root.append("g"); // lijnen (achtergrond)
const fgLayer = root.append("g"); // personen (voorgrond)

// Fullscreen SVG
function resize() {
  svg.attr("width", window.innerWidth);
  svg.attr("height", window.innerHeight);
}
resize();
window.addEventListener("resize", resize);

// ===== ZOOM =====
let zoomTransform = d3.zoomIdentity;

const zoom = d3.zoom()
  .scaleExtent([0.3, 5])
  .on("zoom", (event) => {
    zoomTransform = event.transform;
  });

svg.call(zoom);

// ===== TILT VARIABELEN =====
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

const EASING = 0.08;

// Hoe “diep” het effect is
const BG_STRENGTH = 6;   // achtergrond beweegt weinig
const FG_STRENGTH = 18;  // voorgrond beweegt veel

// ===== MOUSE INPUT =====
svg.on("mousemove", (event) => {
  const rect = svg.node().getBoundingClientRect();

  const mouseX = (event.clientX - rect.width / 2) / rect.width;
  const mouseY = (event.clientY - rect.height / 2) / rect.height;

  targetX = mouseX;
  targetY = -mouseY; // omkeren = kantel-gevoel
});

// ===== ANIMATIE LOOP =====
function animate() {
  currentX += (targetX - currentX) * EASING;
  currentY += (targetY - currentY) * EASING;

  // Achtergrond (lijkt verder weg)
  bgLayer.attr(
    "transform",
    zoomTransform.translate(
      currentX * BG_STRENGTH,
      currentY * BG_STRENGTH
    )
  );

  // Voorgrond (lijkt dichterbij)
  fgLayer.attr(
    "transform",
    zoomTransform.translate(
      currentX * FG_STRENGTH,
      currentY * FG_STRENGTH
    )
  );

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// ===== DATA LADEN =====
d3.json("data.json").then(function (data) {

  const peopleMap = {};
  data.people.forEach(p => peopleMap[p.id] = p);

  // Lijnen → ACHTERGROND
  bgLayer.selectAll(".link")
    .data(data.links || [])
    .enter()
    .append("line")
    .attr("x1", d => peopleMap[d.source].x)
    .attr("y1", d => peopleMap[d.source].y)
    .attr("x2", d => peopleMap[d.target].x)
    .attr("y2", d => peopleMap[d.target].y)
    .attr("stroke", "#444")
    .attr("stroke-width", 1);

  // Personen → VOORGROND
  const person = fgLayer.selectAll(".person")
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
    .attr("font-size", "14px")
    .text(d => d.name);

  // Start gecentreerd
  requestAnimationFrame(() => {
    const bbox = svg.node().getBoundingClientRect();

    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(bbox.width / 2, bbox.height / 2)
    );
  });
});
