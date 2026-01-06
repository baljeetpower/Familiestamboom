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

// ===== ZOOM MET MUISWIEL =====
svg.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomSpeed = 0.001;
  scale += e.deltaY * -zoomSpeed;

  scale = Math.min(Math.max(scale, 0.3), 3);

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
