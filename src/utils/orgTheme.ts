export interface OrgTheme {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorder: string;
  cardBg: string;
  accentText: string;
  colorName: string;
  logoBg: string;
}

export function getOrgTheme(orgNameOrId?: string): OrgTheme {
  if (!orgNameOrId) {
    return {
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-950',
      badgeBorder: 'border-emerald-300',
      cardBorder: 'border-emerald-200',
      cardBg: 'bg-emerald-50/30',
      accentText: 'text-emerald-800',
      colorName: 'Hijau Muda',
      logoBg: 'bg-emerald-50',
    };
  }

  const normalized = orgNameOrId.toLowerCase();

  // 1. Dompet Dhuafa -> Hijau muda
  if (normalized.includes('dompet dhuafa') || normalized.includes('dhuafa')) {
    return {
      badgeBg: 'bg-lime-100',
      badgeText: 'text-lime-950',
      badgeBorder: 'border-lime-400',
      cardBorder: 'border-lime-400/80',
      cardBg: 'bg-lime-50/40',
      accentText: 'text-lime-800',
      colorName: 'Hijau Muda',
      logoBg: 'bg-lime-100',
    };
  }

  // 2. Rumah Zakat -> Oranye
  if (normalized.includes('rumah zakat') || normalized.includes('rz')) {
    return {
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-950',
      badgeBorder: 'border-orange-400',
      cardBorder: 'border-orange-400/80',
      cardBg: 'bg-orange-50/40',
      accentText: 'text-orange-800',
      colorName: 'Oranye',
      logoBg: 'bg-orange-100',
    };
  }

  // 3. Lazismu (Muhammadiyah) -> Biru
  if (normalized.includes('lazismu') || normalized.includes('muhammadiyah')) {
    return {
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-950',
      badgeBorder: 'border-blue-400',
      cardBorder: 'border-blue-400/80',
      cardBg: 'bg-blue-50/40',
      accentText: 'text-blue-800',
      colorName: 'Biru',
      logoBg: 'bg-blue-100',
    };
  }

  // 4. NU Care - LAZISNU -> Hijau tua
  if (normalized.includes('lazisnu') || normalized.includes('nu care') || normalized.includes('nu')) {
    return {
      badgeBg: 'bg-emerald-900',
      badgeText: 'text-emerald-50',
      badgeBorder: 'border-emerald-950',
      cardBorder: 'border-emerald-800',
      cardBg: 'bg-emerald-950/5',
      accentText: 'text-emerald-950',
      colorName: 'Hijau Tua',
      logoBg: 'bg-emerald-900',
    };
  }

  // 5. Human Initiative -> Biru muda
  if (normalized.includes('human initiative') || normalized.includes('initiative')) {
    return {
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-950',
      badgeBorder: 'border-sky-400',
      cardBorder: 'border-sky-400/80',
      cardBg: 'bg-sky-50/40',
      accentText: 'text-sky-800',
      colorName: 'Biru Muda',
      logoBg: 'bg-sky-100',
    };
  }

  // 6. BAZNAS RI -> Kuning
  if (normalized.includes('baznas')) {
    return {
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-950',
      badgeBorder: 'border-amber-400',
      cardBorder: 'border-amber-400/80',
      cardBg: 'bg-amber-50/40',
      accentText: 'text-amber-800',
      colorName: 'Kuning',
      logoBg: 'bg-amber-100',
    };
  }

  // Default fallback
  return {
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-950',
    badgeBorder: 'border-emerald-300',
    cardBorder: 'border-emerald-200',
    cardBg: 'bg-emerald-50/30',
    accentText: 'text-emerald-800',
    colorName: 'Hijau',
    logoBg: 'bg-emerald-50',
  };
}
