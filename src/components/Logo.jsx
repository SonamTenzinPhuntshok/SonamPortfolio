// STee logo: a small dzong mark (tiered golden roofs, red kemar band,
// whitewashed walls) next to the wordmark.
export function LogoMark({ size = 34, title }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id="stee-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC94D" />
          <stop offset="1" stopColor="#E0452B" />
        </linearGradient>
      </defs>
      <path d="M20 4.5v4.5" stroke="url(#stee-gold)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="20" cy="4.2" r="2" fill="url(#stee-gold)" />
      <path d="M8.5 16.4 Q12 15.6 14 12 L26 12 Q28 15.6 31.5 16.4 Z" fill="url(#stee-gold)" />
      <rect x="14.5" y="16.4" width="11" height="2.6" fill="#B3261E" />
      <path d="M3.5 23.5 Q8.5 22.6 10.6 19 L29.4 19 Q31.5 22.6 36.5 23.5 Z" fill="url(#stee-gold)" />
      <rect x="9.5" y="23.5" width="21" height="11" rx="1" fill="#F3EFE6" />
      <rect x="9.5" y="23.5" width="21" height="2" fill="#B3261E" />
      <rect x="12.5" y="28" width="2.6" height="3" rx="0.5" fill="#3a1d12" />
      <rect x="24.9" y="28" width="2.6" height="3" rx="0.5" fill="#3a1d12" />
      <path d="M18 34.5 v-4.2 a2 2 0 0 1 4 0 v4.2 Z" fill="#3a1d12" />
    </svg>
  )
}

export default function Logo() {
  return (
    <span className="logo-inner">
      <LogoMark size={34} />
      <span className="logo-word">STee</span>
    </span>
  )
}
