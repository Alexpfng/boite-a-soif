import { Phone, Globe, AlertTriangle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Bloc } from '../../content/types';

interface Props {
  blocs: Bloc[];
}

export function BlocRenderer({ blocs }: Props) {
  return (
    <div className="space-y-4">
      {blocs.map((b, i) => {
        switch (b.t) {
          case 'h2':
            return (
              <h2 key={i} className="text-lg font-display font-bold text-bleu-900 mt-6 mb-2 first:mt-0">
                {b.x}
              </h2>
            );

          case 'p':
            return (
              <p key={i} className="text-base text-texte leading-relaxed">
                {b.x}
              </p>
            );

          case 'list':
            return (
              <ul key={i} className="space-y-2 pl-0">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-base text-texte leading-relaxed">
                    <span className="mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-bleu-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case 'enc':
            return (
              <div key={i} className="bg-bleu-100 rounded-2xl p-4 border-l-4 border-bleu-500">
                <p className="text-base text-bleu-900 leading-relaxed font-medium">{b.x}</p>
              </div>
            );

          case 'lien':
            return (
              <Link
                key={i}
                to={`/outils/${b.outil}/outil`}
                className="flex items-center gap-3 bg-bleu-100 hover:bg-bleu-500 hover:text-white text-bleu-700 font-semibold rounded-2xl p-4 transition-colors group"
              >
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                {b.x}
              </Link>
            );

          case 'urgence':
            return (
              <div key={i} className="bg-red-50 border-2 border-red-400 rounded-2xl p-4">
                <div className="flex gap-3 items-start">
                  <AlertTriangle size={22} className="text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-base text-red-900 leading-relaxed">{b.x}</p>
                    <a
                      href={`tel:${b.num}`}
                      className="mt-2 inline-flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-base"
                    >
                      <Phone size={16} aria-hidden="true" />
                      Appeler le {b.num}
                    </a>
                  </div>
                </div>
              </div>
            );

          case 'tel':
            return (
              <a
                key={i}
                href={`tel:${b.num}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-bleu-100 hover:bg-bleu-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-bleu-100 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-bleu-700" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-bleu-900 text-base">{b.label}</p>
                  <p className="text-sm text-texte-2">{b.x}</p>
                </div>
              </a>
            );

          case 'web':
            return (
              <a
                key={i}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-bleu-100 hover:bg-bleu-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-bleu-100 flex items-center justify-center flex-shrink-0">
                  <Globe size={20} className="text-bleu-700" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-bleu-900 text-base">{b.label}</p>
                  <p className="text-sm text-texte-2">{b.x}</p>
                </div>
              </a>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
