function locomotiveAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });

  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}

function loadingAnimation() {
  var tl = gsap.timeline();
  tl.from(".line h1", {
    y: 150,
    stagger: 0.25,
    duration: 0.6,
    delay: 0.5,
  });
  tl.from("#line1-part1", {
    opacity: 0,
    onStart: function () {
      var h5timer = document.querySelector("#line1-part1 h5");
      var grow = 0;
      setInterval(function () {
        if (grow < 100) {
          h5timer.innerHTML = grow++;
        } else {
          h5timer.innerHTML = grow;
        }
      }, 33);
    },
  });

  tl.to(".line h2", {
    opacity: 1,
    animationName: "loaderAnime",
  });

  tl.to("#loader", {
    opacity: 0,
    duration: 0.2,
    delay: 3.5,
  });

  tl.from("#page1", {
    opacity: 0,
    delay: 0.2,
    y: 1600,
    duration: 0.6,
    ease: Power4,
  });

  tl.to("#loader", {
    display: "none",
  });

  tl.from("#nav", {
    opacity: 0,
  });
  tl.from("#hero1 h1,#hero2 h1,#hero3 h1,#hero4 h1", {
    y: 120,
    stagger: 0.2,
  });
  tl.from(
    "#hero1 h1, #page2",
    {
      opacity: 0,
    },
    "-=1.2"
  ); //-=1.2 means start this animation 1.2 seconds before the previous one ends
}

function cursorAnimation() {
  const cursor = document.querySelector("#crsr");

  // Cursor position variables for smooth interpolation
  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;

  // Update mouse position
  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation with GSAP ticker
  gsap.ticker.add(() => {
    // Smooth interpolation - adjust 0.15 for more/less smoothness
    // Lower values = smoother but slower, higher values = faster but less smooth
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    // Apply transform for better performance
    gsap.set(cursor, {
      x: cursorX,
      y: cursorY,
    });
  });

  // Optional: Hide cursor when mouse leaves window
  document.addEventListener("mouseleave", () => {
    gsap.to(cursor, {
      opacity: 0,
      duration: 0.3,
    });
  });

  // Show cursor when mouse enters window
  document.addEventListener("mouseenter", () => {
    gsap.to(cursor, {
      opacity: 1,
      duration: 0.3,
    });
  });

  // Shery magnet effect
  Shery.makeMagnet("#nav-part2 h4");
}

// Alternative method using requestAnimationFrame (if you prefer not using GSAP ticker)
function cursorAnimationRAF() {
  const cursor = document.querySelector("#crsr");

  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // Smooth interpolation
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    // Use transform3d for hardware acceleration
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

    requestAnimationFrame(animate);
  }

  animate();

  Shery.makeMagnet("#nav-part2 h4");
}

// Initialize animations
loadingAnimation();
cursorAnimation();
locomotiveAnimation();
