const svg = document.getElementById("tree");

// huidige viewBox
let viewBox = {
  x: 0,
  y: 0,
  w: 5000,
  h: 5000
};

let isPanning = false;
let start = { x: 0, y: 0 };

// ===== VIEWBOX UPDATEN =====
function updateViewBox() {
  svg.setAttribute(
    "viewBox",
    `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`
  );
}

// ===== ZOOM NAAR MUISPOSITIE =====
svg.addEventListener("wheel", (e) => {
  e.preventDefault();

  const rect = svg.getBoundingClientRect();

  // muispositie in SVG-coördinaten
  const mx = viewBox.x + (e.clientX - rect.left) / rect.width * viewBox.w;
  const my = viewBox.y + (e.clientY - rect.top) / rect.height * viewBox.h;

  const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;

  viewBox.w *= zoomFactor;
  viewBox.h *= zoomFactor;

  // center zoom rond muis
  viewBox.x = mx - (mx - viewBox.x) * zoomFactor;
  viewBox.y = my - (my - viewBox.y) * zoomFactor;

  // limieten (meer inzoomen toegestaan)
  viewBox.w = Math.max(500, Math.min(viewBox.w, 8000));
  viewBox.h = Math.max(500, Math.min(viewBox.h, 8000));

  updateViewBox();
}, { passive: false });

// ===== PAN MET MUIS =====
svg.addEventListener("mousedown", (e) => {
  isPanning = true;
  start.x = e.clientX;
  start.y = e.clientY;
});

window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;

  const rect = svg.getBoundingClientRect();

  const dx = (e.clientX - start.x) / rect.width * viewBox.w;
  const dy = (e.clientY - start.y) / rect.height * viewBox.h;

  viewBox.x -= dx;
  viewBox.y -= dy;

  start.x = e.clientX;
  start.y = e.clientY;

  updateViewBox();
});

window.addEventListener("mouseup", () => {
  isPanning = false;
});
