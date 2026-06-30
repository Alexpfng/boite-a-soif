import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Hero } from '../components/ui/Hero';
import { useRendezvous, type Rendez_vous } from '../features/rendezvous/useRendezvous';
import { useToast } from '../components/ui/Toast';
import { lireStockage, ecrireStockage } from '../lib/storage';
import { exporterDossierPdf } from '../lib/dossierPdf';
import { IconeCalendrier } from '../ui/icons';
import { COL, FRAUNCES, CARD_SHADOW, CARD_SHADOW_SM } from '../ui/theme';
import CONTENT from '../content';

// Carnet de liaison : noter ce qu'on veut dire au prochain rendez-vous
interface NoteCarnet {
  id: number;
  texte: string;
  date: string; // YYYY-MM-DD
}

function CarnetDeLiaison() {
  const [notes, setNotes] = useState<NoteCarnet[]>(() => lireStockage<NoteCarnet[]>('carnet', []));
  const [texte, setTexte] = useState('');
  const { annoncer } = useToast();

  function sauver(suivant: NoteCarnet[]) {
    setNotes(suivant);
    ecrireStockage('carnet', suivant);
  }

  function ajouter() {
    const t = texte.trim();
    if (!t) return;
    sauver([...notes, { id: Date.now(), texte: t, date: new Date().toISOString().slice(0, 10) }]);
    setTexte('');
    annoncer('Note ajoutée au carnet');
  }

  return (
    <section aria-label="Carnet de liaison" style={{ margin: '28px 0 0 0' }}>
      <h2 style={{ margin: '0 0 4px 2px', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.11rem', color: COL.bleu9 }}>
        Carnet de liaison
      </h2>
      <p style={{ margin: '0 0 12px 2px', fontSize: '0.84rem', color: COL.texte2 }}>
        Notez ici ce que vous voulez dire au prochain rendez-vous : questions, observations, changements.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ajouter()}
          placeholder="Ex. il confond les prénoms depuis lundi"
          aria-label="Nouvelle note pour le carnet de liaison"
          style={{
            flex: 1, border: `2px solid ${COL.bleu1}`, borderRadius: 14,
            padding: '11px 14px', fontSize: '1rem', minHeight: 52,
            background: '#fff', color: COL.texte,
          }}
        />
        <button
          onClick={ajouter}
          aria-label="Ajouter la note"
          style={{
            border: 'none', borderRadius: 14, background: COL.bleu7, color: '#fff',
            padding: '0 20px', fontSize: '0.95rem', fontWeight: 600, minHeight: 52,
          }}
        >
          Noter
        </button>
      </div>
      {notes.length > 0 && (
        <div data-card="true" style={{ background: '#fff', borderRadius: 16, boxShadow: CARD_SHADOW_SM, padding: '8px 18px', margin: '12px 0 0 0' }}>
          {[...notes].reverse().map((n, i, arr) => (
            <div
              key={n.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${COL.bleu1}` : 'none',
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.95rem', color: COL.texte }}>{n.texte}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: COL.texte2 }}>
                  {new Date(n.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <button
                onClick={() => { sauver(notes.filter((x) => x.id !== n.id)); annoncer('Note supprimée'); }}
                aria-label="Supprimer cette note"
                style={{
                  border: 'none', background: 'transparent', color: COL.rouge,
                  fontSize: '0.78rem', fontWeight: 600, padding: '4px 6px', minHeight: 44,
                }}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function fmtWhen(r: Rendez_vous): string {
  try {
    const d = new Date(`${r.date}T${r.heure || '09:00'}`);
    const day = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const h = (r.heure || '').replace(':', ' h ');
    return day + (h ? ', ' + h : '');
  } catch {
    return r.date;
  }
}

function downloadIcs(r: Rendez_vous) {
  const dt = (r.date || '').replace(/-/g, '') + 'T' + (r.heure || '09:00').replace(':', '') + '00';
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//APHASAIDE//FR', 'BEGIN:VEVENT',
    `UID:${r.id}@aphasaide`, `DTSTART:${dt}`, `SUMMARY:${r.type}`,
    `DESCRIPTION:${r.notes || ''}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'rendez-vous.ics';
  a.click();
  URL.revokeObjectURL(a.href);
}

const inputStyle: React.CSSProperties = {
  width: '100%', border: `2px solid ${COL.bleu1}`, borderRadius: 14,
  padding: '11px 14px', fontSize: '1rem', background: '#fff', color: COL.texte, minHeight: 52,
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.84rem', fontWeight: 600, color: COL.texte2, margin: '14px 0 4px 2px',
};

export default function Rendezvous() {
  const { rdvs, ajouter, supprimer } = useRendezvous();
  const { annoncer } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Orthophoniste', date: '', heure: '', notes: '' });

  function saveRdv() {
    if (!form.date) {
      annoncer('Choisissez une date');
      return;
    }
    ajouter({ titre: form.type, type: form.type, date: form.date, heure: form.heure || '09:00', notes: form.notes });
    setFormOpen(false);
    setForm({ type: 'Orthophoniste', date: '', heure: '', notes: '' });
    annoncer('Rendez-vous enregistré');
  }

  return (
    <AppShell>
      <Hero color={COL.bleu7}>
        <h1 style={{ margin: 0, fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.45rem' }}>Mes rendez-vous</h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.89rem', opacity: 0.94 }}>
          Les rendez-vous restent enregistrés sur cet appareil.
        </p>
      </Hero>

      <div style={{ padding: '18px 16px 0 16px' }}>
        {!formOpen ? (
          <button
            onClick={() => setFormOpen(true)}
            data-tone="orange"
            style={{
              display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10,
              border: 'none', borderRadius: 20, background: COL.orange, color: '#fff',
              padding: 16, fontSize: '1rem', fontWeight: 600, minHeight: 60,
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Ajouter un rendez-vous
          </button>
        ) : (
          <div data-card="true" style={{ background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, padding: 20 }}>
            <h2 style={{ margin: '0 0 14px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.11rem', color: COL.bleu9 }}>
              Nouveau rendez-vous
            </h2>
            <label style={{ ...labelStyle, margin: '0 0 4px 2px' }} htmlFor="rdv-type">Type de rendez-vous</label>
            <select
              id="rdv-type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={inputStyle}
            >
              {CONTENT.rdvTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <label style={labelStyle} htmlFor="rdv-date">Date</label>
            <input id="rdv-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
            <label style={labelStyle} htmlFor="rdv-heure">Heure</label>
            <input id="rdv-heure" type="time" value={form.heure} onChange={(e) => setForm({ ...form, heure: e.target.value })} style={inputStyle} />
            <label style={labelStyle} htmlFor="rdv-note">Note (facultatif)</label>
            <input
              id="rdv-note"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Ex. apporter le carnet de santé"
              style={inputStyle}
            />
            <div style={{ display: 'flex', gap: 10, margin: '18px 0 0 0' }}>
              <button
                onClick={() => setFormOpen(false)}
                style={{
                  flex: 1, border: `2px solid ${COL.bleu1}`, background: '#fff', borderRadius: 14,
                  padding: 12, color: COL.texte2, fontWeight: 600, fontSize: '0.95rem', minHeight: 52,
                }}
              >
                Annuler
              </button>
              <button
                onClick={saveRdv}
                style={{
                  flex: 1.4, border: 'none', background: COL.bleu7, borderRadius: 14,
                  padding: 12, color: '#fff', fontWeight: 600, fontSize: '0.95rem', minHeight: 52,
                }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}

        {rdvs.length === 0 && !formOpen && (
          <div style={{ textAlign: 'center', padding: '36px 20px 0 20px', color: COL.texte2 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <IconeCalendrier size={44} color={COL.gris} strokeWidth={1.6} />
            </div>
            <p style={{ margin: '12px 0 0 0', fontSize: '0.95rem' }}>
              Aucun rendez-vous. Ajoutez le prochain rendez-vous de votre proche pour le garder en mémoire.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '18px 0 0 0' }}>
          {rdvs.map((r) => (
            <div key={r.id} data-card="true" style={{ background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ width: 12, height: 44, borderRadius: 6, background: COL.bleu7, flexShrink: 0, marginTop: 3 }} aria-hidden="true" />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: COL.bleu9 }}>{r.type}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.89rem', color: COL.texte2 }}>{fmtWhen(r)}</p>
                  {r.notes && (
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: COL.texte2, fontStyle: 'italic' }}>{r.notes}</p>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, margin: '12px 0 0 0' }}>
                <button
                  onClick={() => downloadIcs(r)}
                  style={{
                    flex: 1, border: `2px solid ${COL.bleu1}`, background: '#fff', borderRadius: 12,
                    padding: 9, color: COL.bleu7, fontWeight: 600, fontSize: '0.78rem', minHeight: 48,
                  }}
                >
                  Ajouter à mon calendrier
                </button>
                <button
                  onClick={() => { supprimer(r.id); annoncer('Rendez-vous supprimé'); }}
                  aria-label="Supprimer ce rendez-vous"
                  style={{
                    border: '2px solid #F4D7CF', background: '#fff', borderRadius: 12,
                    padding: '9px 14px', color: COL.rouge, fontWeight: 600, fontSize: '0.78rem', minHeight: 48,
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        <CarnetDeLiaison />

        {/* Dossier complet à apporter en consultation */}
        <button
          onClick={() => { exporterDossierPdf(); annoncer('Dossier PDF téléchargé'); }}
          style={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10,
            margin: '28px 0 0 0', border: `2px solid ${COL.bleu7}`, borderRadius: 20,
            background: '#fff', color: COL.bleu7, padding: 15,
            fontSize: '0.95rem', fontWeight: 600, minHeight: 56,
          }}
        >
          Exporter mon dossier en PDF (RDV, carnet, bien-être)
        </button>
      </div>
    </AppShell>
  );
}
