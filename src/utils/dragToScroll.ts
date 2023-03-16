const dragToScroll = (elementId: string) => {
  const slider: any = document.querySelector("#" + elementId);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  slider?.addEventListener("mousedown", (e: any) => {
    isDown = true;
    slider.classList.add("active");
    startX = e?.pageX - slider?.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider?.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider?.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider?.addEventListener("mousemove", (e: any) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
  });
};

export default dragToScroll;
