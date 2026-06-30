import { useEffect, useRef, useState } from 'react';
import { OutilCadre } from './OutilCadre';
import { lireStockage, ecrireStockage } from '../../lib/storage';
import { sauvegarderPhoto, lirePhoto, supprimerPhoto } from '../../lib/idb';
import { useToast } from '../../components/ui/Toast';
import { exporterOutilPdf } from '../../lib/pdf';
import { COL, FRAUNCES, CARD_SHADOW, CARD_SHADOW_SM } from '../../ui/theme';
import CONTENT from '../../content';

interface Proche {
  id: string | number;
  prenom: string;
  lien: string;
  niveau: number;
}

// Réduit une image en vignette carrée JPEG (~256 px) pour un stockage léger.
async function reduireImage(fichier: File): Promise<Blob> {
  const bmp = await createImageBitmap(fichier);
  const cote = Math.min(bmp.width, bmp.height);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bmp, (bmp.width - cote) / 2, (bmp.height - cote) / 2, cote, cote, 0, 0, 256, 256);
  bmp.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/jpeg', 0.82)
  );
}

const NIVEAUX = ['Grands-parents', 'Parents, fratrie — et moi', 'Enfants et petits-enfants'];
const ARBRE_DEFAUT: Proche[] = [{ id: 'moi', prenom: 'Moi', lien: '', niveau: 1 }];

const selectStyle: React.CSSProperties = {
  flex: 1, border: `2px solid ${COL.bleu1}`, borderRadius: 14,
  padding: '11px 10px', fontSize: '0.95rem', background: '#fff', color: COL.texte,
  minHeight: 52, width: '100%',
};

export default function ArbreGenealogique() {
  const [arbre, setArbre] = useState<Proche[]>(() => lireStockage<Proche[]>('arbre', ARBRE_DEFAUT));
  const [form, setForm] = useState({ prenom: '', lien: CONTENT.liensParente[0], niveau: 1 });
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const cibleRef = useRef<string | number | null>(null);
  const { annoncer } = useToast();

  // Charge les photos existantes (URLs objets, libérées au démontage)
  useEffect(() => {
    let urls: string[] = [];
    (async () => {
      const entrees: Record<string, string> = {};
      for (const p of lireStockage<Proche[]>('arbre', ARBRE_DEFAUT)) {
        try {
          const blob = await lirePhoto(`arbre-${p.id}`);
          if (blob) {
            const url = URL.createObjectURL(blob);
            entrees[String(p.id)] = url;
            urls.push(url);
          }
        } catch { /* photo illisible : ignorer */ }
      }
      setPhotos(entrees);
    })();
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)); urls = []; };
  }, []);

  function sauver(suivant: Proche[]) {
    setArbre(suivant);
    ecrireStockage('arbre', suivant);
  }

  function choisirPhoto(id: string | number) {
    cibleRef.current = id;
    fileRef.current?.click();
  }

  async function photoChoisie(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    const id = cibleRef.current;
    e.target.value = '';
    if (!fichier || id === null) return;
    try {
      const vignette = await reduireImage(fichier);
      await sauvegarderPhoto(`arbre-${id}`, vignette);
      setPhotos((prev) => {
        if (prev[String(id)]) URL.revokeObjectURL(prev[String(id)]);
        return { ...prev, [String(id)]: URL.createObjectURL(vignette) };
      });
      annoncer('Photo ajoutée');
    } catch {
      annoncer('Impossible de lire cette image');
    }
  }

  function retirer(p: Proche) {
    sauver(arbre.filter((x) => x.id !== p.id));
    void supprimerPhoto(`arbre-${p.id}`).catch(() => undefined);
    setPhotos((prev) => {
      const { [String(p.id)]: url, ...reste } = prev;
      if (url) URL.revokeObjectURL(url);
      return reste;
    });
    annoncer('Retiré de l’arbre');
  }

  function ajouter() {
    if (!form.prenom.trim()) {
      annoncer('Indiquez un prénom');
      return;
    }
    sauver([...arbre, { id: Date.now(), prenom: form.prenom.trim(), lien: form.lien, niveau: form.niveau }]);
    setForm({ ...form, prenom: '' });
    annoncer('Ajouté à l’arbre');
  }

  const outil = CONTENT.outils.find((o) => o.slug === 'arbre')!;

  return (
    <OutilCadre
      label="Arbre généalogique"
      action={
        <button
          onClick={() => { exporterOutilPdf(outil); annoncer('PDF téléchargé'); }}
          style={{
            border: `2px solid ${COL.bleu7}`, borderRadius: 999, background: '#fff',
            color: COL.bleu7, padding: '10px 20px', fontSize: '0.84rem', fontWeight: 600, minHeight: 48,
          }}
        >
          Exporter en PDF
        </button>
      }
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 24px 16px' }}>
        <h1 style={{ margin: '0 0 4px 4px', fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.33rem', color: COL.bleu9 }}>
          Ma famille
        </h1>
        <p style={{ margin: '0 0 14px 4px', fontSize: '0.84rem', color: COL.texte2 }}>
          Touchez un rond pour ajouter la photo du proche. Les photos restent uniquement sur cet appareil.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={photoChoisie}
          aria-hidden="true"
          style={{ display: 'none' }}
        />

        {NIVEAUX.map((label, n) => {
          const items = arbre.filter((p) => p.niveau === n);
          return (
            <section key={n} style={{ margin: '0 0 14px 0' }}>
              <h2 style={{ margin: '0 0 8px 4px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: COL.texte2 }}>
                {label}
              </h2>
              <div
                data-card="true"
                style={{
                  background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW_SM, padding: 14,
                  display: 'flex', flexWrap: 'wrap', gap: 14, minHeight: 96,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                {items.length === 0 && (
                  <p style={{ margin: 0, fontSize: '0.84rem', color: COL.gris }}>Personne pour l&apos;instant</p>
                )}
                {items.map((p) => {
                  const moi = p.id === 'moi';
                  const photo = photos[String(p.id)];
                  return (
                    <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'relative', width: 84 }}>
                      <button
                        onClick={() => choisirPhoto(p.id)}
                        aria-label={photo ? `Changer la photo de ${p.prenom}` : `Ajouter une photo pour ${p.prenom}`}
                        style={{
                          width: 62, height: 62, borderRadius: '50%', padding: 0, overflow: 'hidden',
                          background: photo ? 'transparent' : moi ? COL.bleu7 : COL.bleu1,
                          color: moi ? '#fff' : COL.bleu9,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: FRAUNCES, fontWeight: 700, fontSize: '1.33rem',
                          border: moi ? `3px solid ${COL.orange}` : `3px solid ${photo ? COL.bleu1 : 'transparent'}`,
                          cursor: 'pointer',
                        }}
                      >
                        {photo ? (
                          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          (p.prenom || '?')[0].toUpperCase()
                        )}
                      </button>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: COL.texte, textAlign: 'center', lineHeight: 1.2 }}>
                        {p.prenom}
                      </span>
                      <span style={{ fontSize: '0.67rem', color: COL.texte2, textAlign: 'center' }}>{p.lien}</span>
                      {!moi && (
                        <button
                          onClick={() => retirer(p)}
                          aria-label={`Retirer ${p.prenom}`}
                          style={{
                            position: 'absolute', top: -6, right: 2, width: 26, height: 26,
                            borderRadius: '50%', border: 'none', background: COL.rouge, color: '#fff',
                            fontSize: 13, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Formulaire d'ajout */}
        <div data-card="true" style={{ background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, padding: 20, margin: '6px 0 0 0' }}>
          <h2 style={{ margin: '0 0 12px 0', fontFamily: FRAUNCES, fontWeight: 600, fontSize: '1.11rem', color: COL.bleu9 }}>
            Ajouter un proche
          </h2>
          <input
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            placeholder="Prénom"
            aria-label="Prénom du proche"
            style={{
              width: '100%', border: `2px solid ${COL.bleu1}`, borderRadius: 14,
              padding: '11px 14px', fontSize: '1rem', margin: '0 0 10px 0',
              minHeight: 52, background: '#fff', color: COL.texte,
            }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <select
              value={form.lien}
              aria-label="Lien de parenté"
              onChange={(e) => setForm({ ...form, lien: e.target.value })}
              style={selectStyle}
            >
              {CONTENT.liensParente.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              value={form.niveau}
              aria-label="Génération"
              onChange={(e) => setForm({ ...form, niveau: Number(e.target.value) })}
              style={selectStyle}
            >
              {NIVEAUX.map((l, i) => (
                <option key={i} value={i}>{l}</option>
              ))}
            </select>
          </div>
          <button
            onClick={ajouter}
            style={{
              display: 'block', width: '100%', margin: '14px 0 0 0',
              border: 'none', borderRadius: 14, background: COL.bleu7, color: '#fff',
              padding: 13, fontSize: '0.95rem', fontWeight: 600, minHeight: 52,
            }}
          >
            Ajouter à l&apos;arbre
          </button>
        </div>
      </div>
    </OutilCadre>
  );
}
