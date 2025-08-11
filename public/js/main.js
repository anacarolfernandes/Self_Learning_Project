// footer year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

/* helpers */
const rand = (min, max) => Math.random() * (max - min) + min;
const mqlReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power2.out" });

  /* rotate background */
  if (!mqlReduce.matches) gsap.to(".flag-bg", { rotate: 18, duration: 40, repeat: -1, yoyo: true, ease: "sine.inOut" });

  /* hero blobs */
  if (!mqlReduce.matches) {
    gsap.to(".b1", { y: 18, duration: 6,  repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".b2", { y: -14, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".b3", { y: 12,  duration: 6.5,repeat: -1, yoyo: true, ease: "sine.inOut" });
  }

  /* stars + subtle glitter */
  const starWrap = document.getElementById("stars");
  const sparkleLayer = document.getElementById("sparkleLayer");

  if (starWrap && !starWrap.dataset.init) {
    starWrap.dataset.init = "1";
    const COUNT = 28;
    for (let i=0;i<COUNT;i++){
      const s = document.createElement("span");
      s.className = "star";
      s.style.left = rand(4,96) + "%";
      s.style.top  = rand(8,92) + "%";
      starWrap.appendChild(s);
      if (!mqlReduce.matches) {
        const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults:{ ease:"sine.inOut" } });
        tl.to(s, { opacity: rand(0.3,0.9), duration: rand(1.4,2.8) })
          .to(s, { y: rand(-6,6), duration: rand(2.2,3.6) }, 0)
          .delay(rand(0,1.2));
      }
    }
  }

  function sparkleBurst(n = 8){
    if (!sparkleLayer) return;
    const rect = sparkleLayer.getBoundingClientRect();
    for (let i=0;i<n;i++){
      const sp = document.createElement("span");
      sp.className = "sparkle";
      sp.style.left = rand(rect.width*0.2, rect.width*0.8) + "px";
      sp.style.top  = rand(rect.height*0.25, rect.height*0.7) + "px";
      sp.style.opacity = 0;
      sparkleLayer.appendChild(sp);
      if (!mqlReduce.matches) {
        const tl = gsap.timeline({ onComplete: ()=> sp.remove() });
        tl.fromTo(sp, { scale: 0, opacity: 0 }, { scale: rand(0.8,1.5), opacity: 1, duration: 0.22, ease: "power2.out" })
          .to(sp, { opacity: 0.85, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" })
          .to(sp, { y: "-=" + rand(8,16), x: "+=" + rand(-8,8), opacity: 0, duration: 0.5, ease: "power1.in" }, "+=0.1");
      } else {
        setTimeout(()=> sp.remove(), 200);
      }
    }
  }
  if (!mqlReduce.matches) setInterval(()=> sparkleBurst(rand(5,9)), 1500);

  /* hero title letters */
  const splitTargets = document.querySelectorAll("[data-split]");
  splitTargets.forEach(el => {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split("").map(ch => ch === " " ? "<span class='char'>&nbsp;</span>" : `<span class="char">${ch}</span>`).join("");
    el.classList.add("split");
  });
  if (!mqlReduce.matches) {
    gsap.from(".hero .char", {
      y: 28, opacity: 0, rotation: 3, duration: 0.6, stagger: 0.03, ease: "power3.out",
      scrollTrigger: { trigger: ".hero", start: "top 75%" }
    });
    gsap.utils.toArray(".hero .char").forEach(ch => {
      gsap.to(ch, {
        y: rand(-1.2, 1.2), rotation: rand(-2, 2), duration: rand(2.2, 3.4),
        yoyo: true, repeat: -1, ease: "sine.inOut", delay: rand(0, 0.8)
      });
    });
  }

  /* mouse parallax */
  const hero = document.getElementById("hero");
  if (hero && !mqlReduce.matches) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width/2)) / r.width;
      const dy = (e.clientY - (r.top  + r.height/2)) / r.height;
      gsap.to(".b1", { x: dx * 30,  y: dy * 20,  duration: 0.4, ease: "power2.out" });
      gsap.to(".b2", { x: dx * -26, y: dy * -16, duration: 0.4, ease: "power2.out" });
      gsap.to(".b3", { x: dx * 20,  y: dy * -20, duration: 0.4, ease: "power2.out" });
    });
  }

  /* section title sweep */
  gsap.utils.toArray(".section-title").forEach(t => {
    gsap.fromTo(t, { backgroundPositionX: "0%" }, {
      backgroundPositionX: "120%", duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: t, start: "top 85%" }
    });
  });

  /* postcards entrance */
  const cards = gsap.utils.toArray(".postcard");
  gsap.from(cards, {
    y: 26, opacity: 0, duration: 0.55, stagger: 0.1,
    scrollTrigger: { trigger: ".pc-grid", start: "top 85%", once: true }
  });

  /* ROUTE: draw & pin */
  const path = document.getElementById("routePath");
  if (path) {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    ScrollTrigger.create({
      trigger: ".route",
      start: "top top",
      end: "bottom+=240 top",
      scrub: true,
      pin: ".route-wrap",
      onUpdate: (self) => {
        path.style.strokeDashoffset = length * (1 - self.progress);
      }
    });

    gsap.from(".route-svg .city circle", {
      scale: 0, transformOrigin: "center", duration: 0.3, stagger: 0.2,
      scrollTrigger: { trigger: ".route", start: "top 70%" }
    });
  }
}

/* -------- Modal viewer + confetti -------- */
const viewer = document.getElementById("viewer");
const vImg   = document.getElementById("viewerImg");
const vTitle = document.getElementById("viewerTitle");
const vNote  = document.getElementById("viewerNote");
const vClose = document.getElementById("viewerClose");
const flagBall = document.querySelector(".flagball");
const confettiLayer = document.getElementById("confettiLayer");

function confettiBurst(n = 26){
  if (!confettiLayer) return;
  const colors = ["var(--yellow)","var(--green)","var(--blue)","var(--white)"];
  for (let i=0;i<n;i++){
    const d = document.createElement("div");
    d.style.position = "absolute";
    d.style.width = rand(6,12) + "px";
    d.style.height = rand(10,18) + "px";
    d.style.background = colors[Math.floor(rand(0,colors.length))];
    d.style.left = "50%"; d.style.top = "40%";
    d.style.borderRadius = "2px";
    d.style.transform = "translate(-50%,-50%)";
    confettiLayer.appendChild(d);

    if (mqlReduce.matches) { setTimeout(()=>d.remove(), 200); continue; }

    const angle = rand(-80, -100);
    const velocity = rand(180, 320);
    const vx = Math.cos(angle * Math.PI/180) * velocity;
    const vy = Math.sin(angle * Math.PI/180) * velocity;

    gsap.fromTo(d, { x: 0, y: 0, rotate: rand(-90, 90), opacity: 1 }, {
      x: vx, y: vy, rotate: "+=" + rand(180, 540), duration: rand(0.9, 1.5), ease: "power2.out",
      onComplete: () => gsap.to(d, { y: "+=" + rand(120, 220), opacity: 0, duration: 0.6, ease: "power1.in", onComplete: ()=>d.remove() })
    });
  }
}

function openViewer(src, title, note){
  if (!viewer) return;
  vImg.src = src; vImg.alt = title || "";
  vTitle.textContent = title || "";
  vNote.textContent  = note || "";

  viewer.classList.add("show");
  gsap.fromTo(".viewer-fig", { y: 24, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" });

  if (flagBall && !mqlReduce.matches) {
    gsap.set(flagBall, { x: 0, y: 0, rotation: 0, left: "-16%", top: "12%" });
    gsap.to(flagBall, { duration: 3.0, x: () => window.innerWidth * 1.24, y: -18, rotation: 45, ease: "sine.inOut" });
  }

  confettiLayer.innerHTML = "";
  confettiBurst();
}

function closeViewer(){
  if (!viewer) return;
  gsap.to(".viewer-fig", { y: 12, opacity: 0, scale: 0.98, duration: 0.28, ease: "power2.in",
    onComplete: () => viewer.classList.remove("show") });
}

document.querySelectorAll(".postcard").forEach(card => {
  card.addEventListener("click", () => openViewer(card.dataset.img, card.dataset.title, card.dataset.note));
});
if (vClose) vClose.addEventListener("click", closeViewer);
if (viewer) viewer.addEventListener("click", (e) => { if (e.target === viewer) closeViewer(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape" && viewer.classList.contains("show")) closeViewer(); });