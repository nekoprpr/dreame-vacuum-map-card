import './ShortcutsButton.scss';

interface ShortcutsButtonProps {
  onClick: () => void;
}

export function ShortcutsButton({ onClick }: ShortcutsButtonProps) {
  return (
    <button
      className="shortcuts-button"
      onClick={onClick}
      title="View shortcuts"
    >
      ⚡
    </button>
  );
}
