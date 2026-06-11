// src/app/loading.tsx

export default function GlobalLoading() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(19,27,38,0.85)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="global-spinner" />
      <style>{`
        .global-spinner {
          width: 64px;
          height: 64px;
          border: 6px solid #f8aa0b;
          border-top: 6px solid #361b5d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 