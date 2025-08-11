// Year
document.getElementById("year").textContent = new Date().getFullYear();

const DEBUG = window.__DEBUG === true;

if (!window.gsap || !window.ScrollTrigger) {
  console.warn("GSAP/ScrollTrigger not loaded.");
} else {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power2.out" });

  /* 1) HERO: per-letter reveal */
  document.querySelectorAll("[data-split]").forEach(el => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split("").map(ch => {
      const c = ch === " " ? "&nbsp;" : ch;
      return `<span class="char">${c}</span>`;
    }).join("");
  });

  gsap.from(".hero .char", {
    y: 24, opacity: 0, rotate: 2,
    duration: 0.6, stagger: 0.015,
    ease: "power3.out",
    scrollTrigger: { trigger: ".hero", start: "top 70%", markers: DEBUG }
  });

  /* floating blobs */
  gsap.to(".b1", { y: 22, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".b2", { y: -18, duration: 5.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".b3", { y: 16, duration: 6.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

  /* 2) MARQUEE */
  const marquee = document.querySelector(".marquee");
  if (marquee) {
    const width = marquee.scrollWidth;
    gsap.fromTo(marquee, { x: 0 }, {
      x: () => -width,
      duration: 18,
      ease: "none",
      repeat: -1
    });
  }

  /* 3) Section background color shifts */
  gsap.utils.toArray("[data-bg]").forEach(sec => {
    const color = sec.getAttribute("data-bg");
    ScrollTrigger.create({
      trigger: sec,
      start: "top 60%",
      onEnter: () => gsap.to("body", { background: color, duration: 0.6 }),
      onLeaveBack: () => gsap.to("body", { background: "#101216", duration: 0.6 }),
      markers: DEBUG
    });
  });

  /* 4) Reveal on scroll */
  gsap.utils.toArray("[data-reveal]").forEach(el => {
    gsap.from(el, {
      y: 16, opacity: 0, duration: 0.6,
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse", markers: DEBUG }
    });
  });

  /* 5) Parallax cards */
  gsap.utils.toArray(".card").forEach(card => {
    const speed = Number(card.getAttribute("data-speed") || 1);
    gsap.from(card, {
      y: 24, opacity: 0, duration: 0.6,
      scrollTrigger: { trigger: card, start: "top 90%", markers: DEBUG }
    });
    gsap.to(card, {
      yPercent: -6 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        markers: DEBUG
      }
    });
  });

  /* 6) Magnetic buttons */
  document.querySelectorAll(".btn-magnetic").forEach(btn => {
    const strength = 20;
    const move = (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      gsap.to(btn, { x: dx * strength, y: dy * strength, duration: 0.2 });
    };
    const reset = () => gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: "power3.out" });
    btn.addEventListener("mousemove", move);
    btn.addEventListener("mouseleave", reset);
  });
}