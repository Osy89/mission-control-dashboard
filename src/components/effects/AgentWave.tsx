import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function AgentWave() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const waveContainer = containerRef.current;
    if (!waveContainer) return;

    // Clear any existing content
    waveContainer.innerHTML = '';

    const rows = Math.floor(waveContainer.offsetHeight / 14);

    for (let r = 0; r < rows; r++) {
      const row = document.createElement('div');
      row.className = 'wave-container__row';
      waveContainer.appendChild(row);

      const total = Math.floor(waveContainer.offsetWidth / 8);

      for (let i = 0; i < total; i++) {
        const el = document.createElement('div');
        el.className = 'wave-container__col';
        row.appendChild(el);
      }
    }

    const update = (time: number) => {
      const tm = time * 0.00125;
      const rowElements = waveContainer.querySelectorAll('.wave-container__row');

      rowElements.forEach((row, rIndex) => {
        const cols = row.querySelectorAll('.wave-container__col');
        const sin = Math.sin((tm + rIndex));
        const cos = Math.cos((tm + rIndex));

        if (sin > 0.5) {
          const perc = (cos * 0.5 + 0.5);
          const i = Math.floor(perc * cols.length);
          const min = i;
          const max = i + 4;
          const off = cols.length * 0.25;

          cols.forEach((col, index) => {
            const htmlCol = col as HTMLElement;
            let b = false;
            if (index >= min && index <= max) b = true;
            else if (index >= min - off && index <= max - off) b = true;
            else if (index >= min + off && index <= max + off) b = true;

            if (b) {
              const x = Math.abs(index - i - 1.5) * 0.25;
              htmlCol.style.transform = `scaleY(${1 - x})`;
              htmlCol.style.opacity = `${1 - x}`;
            } else {
              htmlCol.style.transform = 'scaleY(0)';
              htmlCol.style.opacity = '0';
            }
          });
        } else {
          cols.forEach((col) => {
            const htmlCol = col as HTMLElement;
            htmlCol.style.transform = 'scaleY(0)';
            htmlCol.style.opacity = '0';
          });
        }
      });
    };

    gsap.ticker.add(update);

    const handleResize = () => {
      // Rebuild on resize
      waveContainer.innerHTML = '';
      const newRows = Math.floor(waveContainer.offsetHeight / 14);
      for (let r = 0; r < newRows; r++) {
        const row = document.createElement('div');
        row.className = 'wave-container__row';
        waveContainer.appendChild(row);
        const total = Math.floor(waveContainer.offsetWidth / 8);
        for (let i = 0; i < total; i++) {
          const el = document.createElement('div');
          el.className = 'wave-container__col';
          row.appendChild(el);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}
