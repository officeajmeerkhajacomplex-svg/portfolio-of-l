/**
 * A LIYAQAT-tuned Magic Card pattern: the pointer controls a soft spotlight
 * and a restrained gradient edge, while the card content remains semantic.
 */
export default function MagicCard({ children, className = '' }) {
  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty('--magic-x', `${x}%`);
    event.currentTarget.style.setProperty('--magic-y', `${y}%`);
    event.currentTarget.classList.add('is-active');
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty('--magic-x', '50%');
    event.currentTarget.style.setProperty('--magic-y', '50%');
    event.currentTarget.classList.remove('is-active');
  };

  return (
    <div
      className={`magic-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="magic-card__surface">{children}</div>
    </div>
  );
}
