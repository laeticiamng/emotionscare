// @ts-nocheck
import confetti from 'canvas-confetti';

export { confetti };

export function triggerConfetti() {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star']
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle']
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

export function celebrateAchievement() {
  const end = Date.now() + 1000;

  // Launch fireworks
  const interval = setInterval(() => {
    if (Date.now() > end) {
      return clearInterval(interval);
    }

    confetti({
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      },
      colors: ['#ff0000', '#00ff00', '#0000ff'],
      particleCount: 50,
    });
  }, 150);
}
