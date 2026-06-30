import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

// Toast sombre en pilule, position exacte du design (bottom 112px)

interface ContexteToast {
  annoncer: (message: string) => void;
}

const Ctx = createContext<ContexteToast>({ annoncer: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number>();

  const annoncer = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(false), 2600);
  }, []);

  return (
    <Ctx.Provider value={{ annoncer }}>
      {children}
      <div aria-live="polite" role="status" className="sr-only">
        {message}
      </div>
      {visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 112,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 70,
            background: '#1C2B33',
            color: '#fff',
            borderRadius: 999,
            padding: '12px 24px',
            fontSize: '0.84rem',
            fontWeight: 600,
            boxShadow: '0 6px 20px rgba(14,58,77,0.3)',
            whiteSpace: 'nowrap',
            maxWidth: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'none',
          }}
        >
          {message}
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
