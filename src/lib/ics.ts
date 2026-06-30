// Génère un fichier .ics standard pour ajouter un RDV au calendrier

export interface RdvIcs {
  titre: string;
  type: string;
  date: string;   // YYYY-MM-DD
  heure: string;  // HH:MM
  notes?: string;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function dateToIcs(date: string, heure: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const [h, mn] = heure.split(':').map(Number);
  return `${y}${pad(m)}${pad(d)}T${pad(h)}${pad(mn)}00`;
}

export function genererIcs(rdv: RdvIcs): string {
  const uid = `${Date.now()}-aphasaide@local`;
  const debut = dateToIcs(rdv.date, rdv.heure);
  const debutMs = new Date(`${rdv.date}T${rdv.heure}`);
  const finMs = new Date(debutMs.getTime() + 60 * 60 * 1000);
  const fin = `${finMs.getFullYear()}${pad(finMs.getMonth() + 1)}${pad(finMs.getDate())}T${pad(finMs.getHours())}${pad(finMs.getMinutes())}00`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//A\'PHAS\'AIDE//FR',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${debut}`,
    `DTEND:${fin}`,
    `SUMMARY:${rdv.titre} — ${rdv.type}`,
    rdv.notes ? `DESCRIPTION:${rdv.notes.replace(/\n/g, '\\n')}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n');
}

export function telechargerIcs(rdv: RdvIcs): void {
  const contenu = genererIcs(rdv);
  const blob = new Blob([contenu], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rdv-${rdv.date}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

