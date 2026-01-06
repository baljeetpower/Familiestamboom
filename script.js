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

// ===== ZOOM NAAR MUISPOSITIE =====
svg.addEventListener("wheel", (e) => {
  e.preventDefault();

  const rect = svg.getBoundingClientRect();

  // Muispositie relatief aan SVG
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Oude schaal
  const oldScale = scale;

  // Zoom snelheid & limieten
  const zoomSpeed = 0.0015;
  scale += e.deltaY * -zoomSpeed;

  // 🔥 Meer inzoomen toegestaan
  scale = Math.min(Math.max(scale, 0.2), 6);

  // Houd muispunt op dezelfde plek
  translateX -= (mouseX / oldScale - mouseX / scale);
  translateY -= (mouseY / oldScale - mouseY / scale);

  updateTransform();
}, { passive: false });

// ===== PAN MET MUIS =====
svg.addEventListener("mousedown", (e) => {
  isPanning = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
});

window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;

  translateX = e.clientX - startX;
  translateY = e.clientY - startY;

  updateTransform();
});

window.addEventListener("mouseup", () => {
  isPanning = false;
});

// ===== KLIK TEST (blijft werken) =====
document.querySelectorAll(".persoon").forEach(p => {
  p.addEventListener("click", (e) => {
    e.stopPropagation();
    alert("Klik op: " + p.id);
  });
});
