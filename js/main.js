/* Xavora portfolio v2: preloader, WebGL hero, kinetic type, horizontal work scroll */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var isDesktop = window.matchMedia("(min-width: 861px)").matches;

  /* ================= Preloader + hero intro ================= */
  var preloader = document.getElementById("preloader");
  var preCount = document.getElementById("pre-count");

  function heroIntro() {
    if (reduceMotion || !window.gsap) return;
    var tl = gsap.timeline();
    tl.from(".hero-title .line-in", {
      yPercent: 115,
      duration: 1,
      stagger: 0.12,
      ease: "power4.out"
    });
    tl.from(".hero-sub", { y: 26, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5");
    tl.from(".hero-cta", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.55");
    tl.from(".hero-stats", { opacity: 0, y: 24, duration: 0.8, ease: "power3.out" }, "-=0.5");
  }

  function runPreloader() {
    if (reduceMotion || !window.gsap || !preloader) {
      if (preloader) preloader.remove();
      heroIntro();
      return;
    }
    document.body.style.overflow = "hidden";
    var state = { n: 0 };
    gsap.to(state, {
      n: 100,
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: function () { preCount.textContent = Math.round(state.n); },
      onComplete: function () {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
          onStart: heroIntro,
          onComplete: function () {
            preloader.remove();
            document.body.style.overflow = "";
          }
        });
      }
    });
  }

  /* ================= Scroll reveals ================= */
  function initReveals() {
    var revealEls = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ================= Nav hide on scroll down ================= */
  function initNav() {
    if (!window.gsap || !window.ScrollTrigger) return;
    var nav = document.getElementById("nav");
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: function (self) {
        if (self.direction === 1 && self.scroll() > 140) nav.classList.add("hidden");
        else nav.classList.remove("hidden");
      }
    });
  }

  /* ================= Horizontal work scroll (desktop) ================= */
  function initHorizontal() {
    if (reduceMotion || !isDesktop || !window.gsap || !window.ScrollTrigger) return;
    var wrap = document.getElementById("work-wrap");
    var track = document.getElementById("work-track");
    if (!wrap || !track) return;

    gsap.to(track, {
      x: function () { return -(track.scrollWidth - window.innerWidth); },
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: function () { return "+=" + (track.scrollWidth - window.innerWidth); },
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  /* ================= Stats counters ================= */
  function initCounters() {
    var nums = document.querySelectorAll(".stat-num");
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
      nums.forEach(function (el) { el.textContent = el.dataset.count; });
      return;
    }
    nums.forEach(function (el) {
      var target = parseInt(el.dataset.count, 10);
      var state = { n: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: function () {
          gsap.to(state, {
            n: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: function () { el.textContent = Math.round(state.n); }
          });
        }
      });
    });
  }

  /* ================= Section title reveals (GSAP) ================= */
  function initTitles() {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
    document.querySelectorAll(".work-head, .kicker").forEach(function (el) {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
  }

  /* ================= Contact title: per-char wave in ================= */
  function initContactTitle() {
    var title = document.getElementById("contact-title");
    if (!title) return;
    var text = title.textContent;
    title.textContent = "";
    title.setAttribute("aria-label", text);
    text.split(" ").forEach(function (word, wi) {
      if (wi > 0) title.appendChild(document.createTextNode(" "));
      var w = document.createElement("span");
      w.className = "word";
      w.setAttribute("aria-hidden", "true");
      for (var i = 0; i < word.length; i++) {
        var span = document.createElement("span");
        span.className = "ch";
        span.textContent = word[i];
        w.appendChild(span);
      }
      title.appendChild(w);
    });
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
    gsap.from(title.querySelectorAll(".ch"), {
      yPercent: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.045,
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: title, start: "top 85%", once: true }
    });
  }

  /* ================= Magnetic buttons ================= */
  function initMagnetic() {
    if (reduceMotion || !finePointer || !window.gsap) return;
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      var yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.25);
      });
      el.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
    });
  }

  /* ================= Card spotlight ================= */
  function initSpotlight() {
    if (!finePointer) return;
    document.querySelectorAll(".build-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ================= Nav link scramble ================= */
  function initScramble() {
    if (reduceMotion || !finePointer) return;
    var GLYPHS = "XAVOR#/\\<>_-+=*";
    document.querySelectorAll("[data-scramble]").forEach(function (el) {
      var original = el.textContent;
      var frame = null;
      el.addEventListener("pointerenter", function () {
        var i = 0;
        cancelAnimationFrame(frame);
        (function tick() {
          i += 0.34;
          var out = "";
          for (var c = 0; c < original.length; c++) {
            out += c < i ? original[c] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          el.textContent = out;
          if (i < original.length) frame = requestAnimationFrame(tick);
          else el.textContent = original;
        })();
      });
      el.addEventListener("pointerleave", function () {
        cancelAnimationFrame(frame);
        el.textContent = original;
      });
    });
  }

  /* ================= Three.js hero: red particle field + wireframe core ================= */
  function initHero3D() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || !window.THREE) return;

    var isMobile = !isDesktop;
    var COUNT = isMobile ? 700 : 2200;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 9;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    } catch (err) {
      canvas.remove();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function cloud(count, spread, color, size, opacity) {
      var positions = new Float32Array(count * 3);
      for (var i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread[0];
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      var mat = new THREE.PointsMaterial({
        color: color,
        size: size,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      return new THREE.Points(geo, mat);
    }

    var red = cloud(COUNT, [24, 15, 9], 0xe8323e, 0.04, 0.6);
    var ember = cloud(Math.floor(COUNT / 3), [26, 16, 10], 0xff7a58, 0.028, 0.35);
    var ash = cloud(Math.floor(COUNT / 2), [28, 18, 11], 0x8a8a90, 0.045, 0.16);
    scene.add(red, ember, ash);

    var core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.6, 1),
      new THREE.MeshBasicMaterial({ color: 0xe8323e, wireframe: true, transparent: true, opacity: 0.14 })
    );
    core.position.set(4.5, 0.4, -2);
    scene.add(core);

    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.2, 0.012, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0xe8323e, transparent: true, opacity: 0.22 })
    );
    ring.position.copy(core.position);
    ring.rotation.x = 1.2;
    scene.add(ring);

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

    /* Reduced motion: the scene stays visible as a still frame, it just does not move */
    if (reduceMotion) {
      var renderStill = function () {
        resize();
        core.rotation.set(0.4, 0.8, 0);
        ring.rotation.z = 0.5;
        renderer.render(scene, camera);
      };
      requestAnimationFrame(renderStill);
      window.addEventListener("resize", renderStill);
      return;
    }

    var visible = true;
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }).observe(canvas);

    var clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      resize();
      var t = clock.getElapsedTime();
      red.rotation.y = t * 0.035 + mouseX * 0.09;
      red.rotation.x = Math.sin(t * 0.14) * 0.05 + mouseY * 0.06;
      ember.rotation.y = -t * 0.05 + mouseX * 0.05;
      ash.rotation.y = t * 0.018 + mouseX * 0.03;
      core.rotation.y = t * 0.22;
      core.rotation.x = t * 0.1;
      ring.rotation.z = t * 0.16;
      camera.position.x = mouseX * 0.35;
      camera.position.y = -mouseY * 0.25;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    })();
  }

  /* ================= Boot ================= */
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  runPreloader();
  initReveals();
  initNav();
  initHorizontal();
  initCounters();
  initTitles();
  initContactTitle();
  initMagnetic();
  initSpotlight();
  initScramble();
  initHero3D();
})();
