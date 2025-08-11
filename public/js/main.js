// footer year
document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());

/* helper: random */
const rand = (min, max) => Math.random() * (max - min) + min;

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power2.out" });

  /* 0) rotate flag background very slowly */
  gsap.to(".flag-bg", { rotate: 18, duration: 40, repeat: -1, yoyo: true, ease: "sine.inOut" });

  /* 1) hero blobs */
  gsap.to(".b1", { y: 18, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".b2", { y: -14, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".b3", { y: 12, duration: 6.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

  /* 1b) hero stars */
  const starWrap = document.getElementById("stars");
  if (starWrap) {
    const COUNT = 16;
    for (let i=0;i<COUNT;i++){
      const s = document.createElement("span");
      s.className = "star";
      s.style.left = rand(5,95) + "%";
      s.style.top  = rand(10,90) + "%";
      starWrap.appendChild(s);
      gsap.to(s, { y: rand(-8,8), duration: rand(3,6), repeat: -1, yoyo: true, ease: "sine.inOut", delay: rand(0,2) });
      gsap.to(s, { opacity: rand(0.5,1), duration: rand(2,4), repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }

  /* 2) section title color sweep on enter */
  gsap.utils.toArray(".section-title").forEach(t => {
    gsap.fromTo(t, { backgroundPositionX: "0%" }, {
      backgroundPositionX: "120%",
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: t, start: "top 85%" }
    });
  });

  /* 3) postcards: entrance */
  const cards = gsap.utils.toArray(".postcard");
  gsap.from(cards, {
    y: 26, opacity: 0, duration: 0.55, stagger: 0.1,
    scrollTrigger: { trigger: ".pc-grid", start: "top 85%", once: true }
  });
}

/* -------- Viewer logic + airplane + confetti -------- */
const viewer = document.getElementById("viewer");
const vImg   = document.getElementById("viewerImg");
const vTitle = document.getElementById("viewerTitle");
const vNote  = document.getElementById("viewerNote");
const vClose = document.getElementById("viewerClose");
const plane  = document.querySelector(".plane");

function confettiBurst(container){
  // simple DOM confetti in Brazil colors
  const colors = ["var(--yellow)","var(--green)","var(--blue)","var(--white)"];
  const n = 24;
  const bits = [];
  for (let i=0;i<n;i++){
    const d = document.createElement("div");
    d.style.position = "absolute";
    d.style.width = rand(6,12) + "px";
    d.style.height = rand(10,18) + "px";
    d.style.background = colors[Math.floor(rand(0,colors.length))];
    d.style.left = "50%";
    d.style.top = "40%";
    d.style.borderRadius = "2px";
    d.style.transform = "translate(-50%,-50%)";
    container.appendChild(d);
    bits.push(d);
    const angle = rand(-80, -100); // mostly up
    const velocity = rand(180, 320);
    const vx = Math.cos(angle * Math.PI/180) * velocity;
    const vy = Math.sin(angle * Math.PI/180) * velocity;
    gsap.fromTo(d,
      { x: 0, y: 0, rotate: rand(-90, 90), opacity: 1 },
      {
        x: vx, y: vy,
        rotate: "+=" + rand(180, 540),
        duration: rand(0.9, 1.5),
        ease: "power2.out",
        onComplete: () => {
          gsap.to(d, { y: "+=" + rand(120, 220), opacity: 0, duration: 0.6, ease: "power1.in", onComplete: () => d.remove() });
        }
      }
    );
  }
}

function openViewer(src, title, note){
  if (!viewer) return;
  vImg.src = src;
  vImg.alt = title || "";
  vTitle.textContent = title || "";
  vNote.textContent = note || "";

  viewer.classList.add("show");

  // fade/scale in
  gsap.fromTo(".viewer-fig",
    { y: 24, opacity: 0, scale: 0.98 },
    { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }
  );

  // airplane fly
  if (plane) {
    gsap.set(plane, { x: 0, y: 0, rotation: 0, left: "-12%", top: "10%" });
    gsap.to(plane, {
      duration: 1.6,
      x: () => window.innerWidth * 1.3,
      y: -40,
      rotation: 6,
      ease: "power1.inOut"
    });
  }

  // confetti
  confettiBurst(viewer);
}

function closeViewer(){
  if (!viewer) return;
  gsap.to(".viewer-fig", {
    y: 12, opacity: 0, scale: 0.98, duration: 0.28, ease: "power2.in",
    onComplete: () => viewer.classList.remove("show")
  });
}

document.querySelectorAll(".postcard").forEach(card => {
  card.addEventListener("click", () => {
    const src   = card.dataset.img;
    const title = card.dataset.title;
    const note  = card.dataset.note;
    openViewer(src, title, note);
  });
});

vClose && vClose.addEventListener("click", closeViewer);
viewer && viewer.addEventListener("click", (e) => { if (e.target === viewer) closeViewer(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape" && viewer.classList.contains("show")) closeViewer(); });