document.querySelectorAll(".persoon").forEach(p => {
  p.addEventListener("click", () => {
    alert("Klik op: " + p.id);
  });
});
