/**
 * AvatarInitial – shows a vibrant gradient circle with the user's first letter.
 * Falls back to a "?" when no name is available.
 */

// 26 distinct, vivid gradients – one per letter of the alphabet
const LETTER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // A – purple
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // B – pink-red
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // C – cyan
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // D – green-teal
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // E – pink-yellow
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // F – lavender-pink
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)', // G – peach-purple
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', // H – sky
  'linear-gradient(135deg, #fd7043 0%, #ff8a65 100%)', // I – deep orange
  'linear-gradient(135deg, #e96c0e 0%, #f7b733 100%)', // J – orange-gold
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // K – emerald
  'linear-gradient(135deg, #6a3093 0%, #a044ff 100%)', // L – violet
  'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)', // M – hot pink-orange
  'linear-gradient(135deg, #3f51b1 0%, #5a55ae 100%)', // N – indigo
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', // O – gold
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', // P – deep navy (light letter)
  'linear-gradient(135deg, #e53935 0%, #e35d5b 100%)', // Q – red
  'linear-gradient(135deg, #16a085 0%, #f4d03f 100%)', // R – teal-yellow
  'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)', // S – purple-blue
  'linear-gradient(135deg, #1abc9c 0%, #2ecc71 100%)', // T – turquoise
  'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)', // U – magenta
  'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)', // V – teal-sky
  'linear-gradient(135deg, #373b44 0%, #4286f4 100%)', // W – dark-blue
  'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)', // X – pink-purple
  'linear-gradient(135deg, #c471ed 0%, #f64f59 100%)', // Y – orchid-red
  'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)', // Z – lime-green
];

function getGradient(name) {
  if (!name || name.trim() === '') return 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';
  const firstChar = name.trim()[0].toUpperCase();
  const code = firstChar.charCodeAt(0);
  if (code >= 65 && code <= 90) return LETTER_GRADIENTS[code - 65];
  // Non-letter: hash to a gradient
  return LETTER_GRADIENTS[code % 26];
}

/**
 * Props:
 *  name        – user's display name (string)
 *  photoURL    – if provided & non-null, shows the photo instead
 *  size        – pixel size of the avatar circle (default 100)
 *  fontSize    – font size for the letter (default auto-calculated)
 *  style       – extra inline styles for the container
 *  className   – extra CSS class for the container
 */
export default function AvatarInitial({ name, photoURL, size = 100, fontSize, style = {}, className = '' }) {
  const letter = name ? name.trim()[0].toUpperCase() : '?';
  const computedFontSize = fontSize ?? Math.round(size * 0.42);

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name || 'Avatar'}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid #fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          display: 'block',
          ...style,
        }}
      />
    );
  }

  return (
    <div
      className={`avatar-initial ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: getGradient(name),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '4px solid #fff',
        boxShadow: '0 4px 16px rgba(99,102,241,0.25)',
        flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
    >
      <span
        style={{
          fontSize: computedFontSize,
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1,
          letterSpacing: '-0.5px',
          textShadow: '0 2px 8px rgba(0,0,0,0.18)',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {letter}
      </span>
    </div>
  );
}
