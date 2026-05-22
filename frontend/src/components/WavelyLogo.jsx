/**
 * Wave emblem + serif wordmark. Set `color` via className/text-* or variant prop maps to CSS variables.
 */

const variantColor = {
  default: 'var(--wv-text)',
  onDark: 'var(--wv-on-hero)',
  gold: 'var(--wv-login-gold)',
};

const WavelyLogo = ({
  variant = 'default',
  showEmblem = true,
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Wavely"
    viewBox={showEmblem ? '0 0 188 40' : '0 0 120 40'}
    className={className}
    style={{ color: variantColor[variant] ?? variantColor.default }}
  >
    {showEmblem && (
      <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round">
        <circle cx="19" cy="20" r="14" />
        <path d="M10 17c3.2-3.2 6.4 0 9.6-3s6.4 6 9.6 3 6.4-6 9.6-3 6 4 6 4" />
        <path d="M10 20.5c3.2-3.2 6.4 0 9.6-3s6.4 6 9.6 3 6.4-6 9.6-3 6 4 6 4" />
        <path d="M10 24c3.2-3.2 6.4 0 9.6-3s6.4 6 9.6 3 6.4-6 9.6-3 6 4 6 4" />
      </g>
    )}
    <text
      x={showEmblem ? 41 : 2}
      y="27"
      fill="currentColor"
      style={{
        fontFamily: 'var(--wv-font-serif)',
        fontWeight: 600,
        fontSize: '26px',
        letterSpacing: '0.02em',
      }}
    >
      Wavely
    </text>
  </svg>
);

export default WavelyLogo;
