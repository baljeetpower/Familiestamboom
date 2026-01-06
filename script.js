const svg = document.getElementById("tree");

let scale = 1;
let translateX = 0;
let translateY = 0;

let isPanning = false;
let startX = 0;
let startY = 0;

// ===== APPLY TRANSFORM =====
function updateTransform() {
  svg.style.transform =
    `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// ===== ZOOM NAAR MUISPOSITIE (CORRECT) =====
svg.addEventListener("wheel", (e) => {
  e.preventDefault();

  const rect = svg.getBoundingClientRect();

  // Muispositie in scherm-coördinaten
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // SVG-positie
  const svgX = rect.left;
  const svgY = rect.top;

  // Muispositie relatief aan SVG, gecorrigeerd voor transform
  const x = (mouseX - svgX - translateX) / scale;
  const y = (mouseY - svgY - translateY) / scale;

  // Oude schaal
  const oldScale = scale;

  // Zoom instellingen
  const zoomSpeed = 0.0015;
  scale += e.deltaY * -zoomSpeed;
  scale = Math.min(Math.max(scale, 0.2), 6);

  // Nieuwe translate zodat muispunt vast blijft
  translateX = mouseX - svgX - x * scale;
  translateY = mouseY - svgY - y * scale;

  updateTransform();
}, { passive: false });

// ===== PAN MET MUIS =====
svg.addEventListener("mousedown", (e) => {
  isPanning = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
  svg.classList.add("grabbing");
});

window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;

  translateX = e.clientX - startX;
  translateY = e.clientY - startY;

  updateTransform();
});

window.addEventListener("mouseup", () => {
  isPanning = false;
  svg.classList.remove("grabbing");
});
