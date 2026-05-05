import './Toast.css';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface Props {
  toasts: ToastItem[];
}

export function Toast({ toasts }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-bar toast-bar-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
