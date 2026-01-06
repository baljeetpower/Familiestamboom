const svg = document.getElementById("tree");

// ===== VIEWBOX =====
let viewBox = {
  x: 0,
  y: 0,
  w: 5000,
  h: 5000
};

// ===== PAN / INERTIA =====
let isPanning = false;
let start = { x: 0, y: 0 };
let velocity = { x: 0, y: 0 };
let lastMoveTime = 0;
let inertiaId = null;

// ===== VIEWBOX APPLY =====
function updateViewBox() {
  svg.setAttribute(
    "viewBox",
    `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`
  );
}

// ===== ZOOM (blijft hetzelfde) =====
svg.addEventListener("wheel", (e) => {
  e.preventDefault();

  const rect = svg.getBoundingClientRect();
  const mx = viewBox.x + (e.clientX - rect.left) / rect.width * viewBox.w;
  const my = viewBox.y + (e.clientY - rect.top) / rect.height * viewBox.h;

  const zoomIn = e.deltaY < 0;
  const zoomFactor = zoomIn ? 0.9 : 1.1;

  const newW = viewBox.w * zoomFactor;
  const newH = viewBox.h * zoomFactor;

  const minW = 500;
  const maxW = 8000;

  if (newW < minW || newW > maxW) return;

  viewBox.w = newW;
  viewBox.h = newH;

  viewBox.x = mx - (mx - viewBox.x) * zoomFactor;
  viewBox.y = my - (my - viewBox.y) * zoomFactor;

  updateViewBox();
}, { passive: false });

// ===== START PAN =====
svg.addEventListener("mousedown", (e) => {
  isPanning = true;
  start.x = e.clientX;
  start.y = e.clientY;
  velocity.x = 0;
  velocity.y = 0;
  lastMoveTime = performance.now();

  if (inertiaId) cancelAnimationFrame(inertiaId);
});

// ===== PAN MOVE =====
window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;

  const rect = svg.getBoundingClientRect();
  const now = performance.now();
  const dt = now - lastMoveTime || 16;

  const dx = (e.clientX - start.x) / rect.width * viewBox.w;
  const dy = (e.clientY - start.y) / rect.height * viewBox.h;

  viewBox.x -= dx;
  viewBox.y -= dy;

  velocity.x = dx / dt;
  velocity.y = dy / dt;

  start.x = e.clientX;
  start.y = e.clientY;
  lastMoveTime = now;

  updateViewBox();
});

// ===== END PAN → INERTIA =====
window.addEventListener("mouseup", () => {
  if (!isPanning) return;
  isPanning = false;

  const friction = 0.95;

  function inertia() {
    velocity.x *= friction;
    velocity.y *= friction;

    viewBox.x -= velocity.x * 16;
    viewBox.y -= velocity.y * 16;

    updateViewBox();

    if (Math.abs(velocity.x) > 0.001 || Math.abs(velocity.y) > 0.001) {
      inertiaId = requestAnimationFrame(inertia);
    }
  }

  inertia();
});
