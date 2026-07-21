/* Xavora portfolio: hero particles + scroll reveals */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll reveals (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero intro (GSAP) ---------- */
  if (!reduceMotion && window.gsap) {
    gsap.from(".hero-title", { y: 40, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 1, delay: 0.15, ease: "power3.out" });
    gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
  }

  /* ---------- Hero particle field (Three.js) ---------- */
  var canvas = document.getElementById("hero-canvas");
  if (!canvas || !window.THREE || reduceMotion) return;

  var isMobile = window.matchMedia("(max-width: 860px)").matches;
  var COUNT = isMobile ? 500 : 1400;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 8;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var positions = new Float32Array(COUNT * 3);
  for (var i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  var material = new THREE.PointsMaterial({
    color: 0xc6f24e,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });

  var points = new THREE.Points(geometry, material);
  scene.add(points);

  var dimMaterial = material.clone();
  dimMaterial.color = new THREE.Color(0x9aa0a8);
  dimMaterial.opacity = 0.25;
  dimMaterial.size = 0.05;
  var dimPoints = new THREE.Points(geometry.clone(), dimMaterial);
  dimPoints.rotation.z = 1.3;
  scene.add(dimPoints);

  var mouseX = 0, mouseY = 0;
  document.addEventListener("pointermove", function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  var heroVisible = true;
  new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting;
  }).observe(canvas);

  var clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    if (!heroVisible) return;
    resize();
    var t = clock.getElapsedTime();
    points.rotation.y = t * 0.03 + mouseX * 0.08;
    points.rotation.x = Math.sin(t * 0.12) * 0.05 + mouseY * 0.05;
    dimPoints.rotation.y = -t * 0.02 + mouseX * 0.05;
    renderer.render(scene, camera);
  })();
})();