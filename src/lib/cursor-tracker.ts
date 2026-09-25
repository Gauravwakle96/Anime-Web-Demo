interface TrackedCard {
  el: HTMLElement;
  rect: DOMRect;
}

let cursorX = 0;
let cursorY = 0;
let scheduled = false;
const trackedCards: TrackedCard[] = [];
let scrollTimer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  scheduled = false;
  if (trackedCards.length === 0) return;

  const viewportX = cursorX;
  const viewportY = cursorY;
  const xp = (cursorX / window.innerWidth).toFixed(4);
  const yp = (cursorY / window.innerHeight).toFixed(4);

  for (let i = 0; i < trackedCards.length; i++) {
    const card = trackedCards[i];
    const relX = viewportX - card.rect.left;
    const relY = viewportY - card.rect.top;

    card.el.style.setProperty("--x", relX.toFixed(2));
    card.el.style.setProperty("--xp", xp);
    card.el.style.setProperty("--y", relY.toFixed(2));
    card.el.style.setProperty("--yp", yp);
  }
}

function onPointerMove(e: PointerEvent) {
  cursorX = e.clientX;
  cursorY = e.clientY;

  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(flush);
  }
}

function refreshRects() {
  for (let i = 0; i < trackedCards.length; i++) {
    trackedCards[i].rect = trackedCards[i].el.getBoundingClientRect();
  }
}

function onScrollOrResize() {
  if (scrollTimer !== null) clearTimeout(scrollTimer);
  scrollTimer = setTimeout(refreshRects, 100);
}

window.addEventListener("pointermove", onPointerMove, { passive: true });
window.addEventListener("scroll", onScrollOrResize, { passive: true });
window.addEventListener("resize", onScrollOrResize);

export function trackCard(el: HTMLElement): () => void {
  const card: TrackedCard = { el, rect: el.getBoundingClientRect() };
  trackedCards.push(card);
  return () => {
    const index = trackedCards.indexOf(card);
    if (index !== -1) trackedCards.splice(index, 1);
  };
}

export function stopAllTracking() {
  trackedCards.length = 0;
}
