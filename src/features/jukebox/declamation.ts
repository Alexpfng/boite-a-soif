export interface InfosNavigateur {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
}

export function estNavigateurIOS(navigateur: InfosNavigateur): boolean {
  const ua = navigateur.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigateur.platform === 'MacIntel' && (navigateur.maxTouchPoints ?? 0) > 1;
}

export function estIOSCourant(): boolean {
  if (typeof navigator === 'undefined') return false;
  return estNavigateurIOS({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
  });
}

export function choisirRetourDeclamation({
  parle,
  ios,
}: {
  parle: boolean;
  ios: boolean;
}): { jouerTchin: boolean; dureeMs: number } {
  return {
    // Sur iPhone, le Web Speech et le Web Audio déclenchés dans le même geste
    // se marchent parfois dessus. On garde la priorité à la voix du tavernier.
    jouerTchin: !parle || !ios,
    dureeMs: parle ? 2800 : 1600,
  };
}
