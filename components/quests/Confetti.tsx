'use client';

const COLORS = ['#a78bfa', '#23d97e', '#facc15', '#f87171', '#60a5fa'];

const PIECES = Array.from({ length: 36 }, (_, index) => ({
  id: index,
  left: Math.random() * 100,
  delay: Math.random() * 0.4,
  duration: 1.6 + Math.random() * 1.2,
  rotation: Math.random() * 360,
  color: COLORS[index % COLORS.length]
}));

export function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {PIECES.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece absolute top-[-10px] h-3 w-2"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
}
