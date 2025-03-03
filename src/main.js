import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", (event) => {
  // Initialize Lenis
  const lenis = new Lenis();

  // Use requestAnimationFrame to continuously update the scroll
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);

  //get all recognition wrapper
  let recognition = gsap.utils.toArray(".recognition");
  //get all recognition images
  let recognitionImages = gsap.utils.toArray('.recognition_image');

  gsap.set(recognitionImages, {
    scale: 0,
    opacity: 0,
    transformOrigin: 'center center'
  })

  recognition.forEach((recognition, index) => {
    const recognitionFrame = recognition.querySelector(".recognition_frame");
    const recognitionBottom = recognition.querySelector(".recognition_bottom");
    const recognitionTop = recognition.querySelector(".recognition_top");
    const recognitionBottomP = recognition.querySelector(".recognition_bottom p");

    //get corresponding image to each recognition wrapper
    const correspondingImage = recognitionImages[index] || null;

    gsap.set([recognitionFrame, recognitionBottom], {
      yPercent: -100,
    });

    const recognitionTl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "none",
        duration: 0.12,
      },
    });

    recognitionTl
      .to(recognitionTop, {
        yPercent: 100,
      }, 0)
      .to(
        recognitionFrame, {
        yPercent: 0,
      }, "<")
      .to(
        recognitionBottom, {
        yPercent: 0,
      }, "<")
      .set(
        recognitionBottomP, {
        color: "#fff",
      }, "<");

    //add image animation if the corresponding image exist 
    if (correspondingImage) {
      recognitionTl.to(correspondingImage, {
        scale: 1,
        opacity: 1,
        transformOrigin: 'center center',
        duration: 0.12
      }, 0);
    }

    let isPlaying = false;

    recognition.addEventListener("mouseenter", () => {
      if (isPlaying) return;
      isPlaying = true;

      //hide other images
      recognitionImages.forEach((img, i) => {
        if (i !== index) {
          gsap.set(img, {
            scale: 0,
            opacity: 0,
          });
        }
      });

      if (recognitionTl.progress() === 1) recognitionTl.progress(0);

      recognitionTl.play();
      recognitionTl.eventCallback("onComplete", () => {
        isPlaying = false;
      });
    });

    recognition.addEventListener("mouseleave", () => {
      if (recognitionTl.progress() < 1) {
        recognitionTl.reverse();
      } else {
        recognitionTl.reverse(0);
      }
      recognitionTl.eventCallback("onReverseComplete", () => {
        isPlaying = false;
      });
    });

  });
});
