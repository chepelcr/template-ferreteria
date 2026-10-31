/**
 * The hero part as a technical drawing (white lines on the blueprint): the art
 * the 3D scene starts from and falls back to — reduced motion, no WebGL, a
 * modest device. Dimension lines carry arrows only, never invented figures.
 */
export function BoltDrawing({ className = '' }: { className?: string }) {
  // An isometric hexagon around (cx, cy): six points, flattened vertically.
  const hex = (cx: number, cy: number, rx: number, ry: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return `${(cx + Math.cos(a) * rx).toFixed(1)},${(cy + Math.sin(a) * ry).toFixed(1)}`;
    }).join(' ');
  const threads = Array.from({ length: 13 }, (_, i) => 206 + i * 9.5);
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <g stroke="currentColor" strokeWidth="2">
        {/* Center line */}
        <path d="M200 36V372" strokeWidth="1" strokeDasharray="14 5 2 5" opacity="0.55" />
        {/* Head: top face, sides, lower edge */}
        <polygon points={hex(200, 78, 72, 26)} fill="currentColor" fillOpacity="0.07" />
        <path d="M272 78V114M236 100V136M164 100V136M128 78V114M128 114L164 136H236L272 114" />
        {/* Washer */}
        <ellipse cx="200" cy="154" rx="64" ry="22" fill="currentColor" fillOpacity="0.05" />
        <ellipse cx="200" cy="154" rx="30" ry="10" />
        <path d="M136 154v7c0 12 29 22 64 22s64-10 64-22v-7" />
        {/* Shank and tip */}
        <path d="M171 170V328M229 170V328" />
        <path d="M171 328c0 6 13 11 29 11s29-5 29-11" />
        {/* Thread */}
        {threads.map((y) => (
          <path key={y} d={`M171 ${y + 6}L229 ${y - 3}`} strokeWidth="1.5" opacity="0.8" />
        ))}
        {/* Nut on the thread */}
        <polygon points={hex(200, 238, 60, 22)} fill="currentColor" fillOpacity="0.1" />
        <ellipse cx="200" cy="238" rx="28" ry="9.5" />
        <path d="M260 238V266M230 257V285M170 257V285M140 238V266M140 266L170 285H230L260 266" />
        {/* Dimension line: arrows and extension lines, no figures */}
        <g strokeWidth="1.25" opacity="0.75">
          <path d="M236 170H330M236 339H330M318 178V331" />
          <path d="M312 186l6-8 6 8M312 323l6 8 6-8" />
          <path d="M120 78H68M118 154H68M80 86V146" />
          <path d="M74 94l6-8 6 8M74 138l6 8 6-8" />
        </g>
      </g>
    </svg>
  );
}
