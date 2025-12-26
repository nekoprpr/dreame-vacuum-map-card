import './CleaningModeButton.scss';

interface CleaningModeButtonProps {
  cleaningMode: string;
  cleangenius: string;
  onClick: () => void;
}

export function CleaningModeButton({ cleaningMode, cleangenius, onClick }: CleaningModeButtonProps) {
  // Map cleaning mode to icon
  const getIcon = (mode: string): string => {
    if (mode.includes('Sweep') && mode.includes('Mop')) return '🔄';
    if (mode.includes('after')) return '➜';
    if (mode.includes('Mop')) return '💧';
    if (mode.includes('Sweep') || mode.includes('Vacuum')) return '🌀';
    return '⚙️';
  };

  // Map cleaning mode to friendly name
  const getFriendlyName = (mode: string): string => {
    // CleanGenius modes
    if (mode === 'Vacuum and mop') return 'Vac & Mop';
    if (mode === 'Mop after vacuum') return 'Mop after Vac';
    // Regular cleaning modes
    if (mode === 'Sweeping and mopping') return 'Vac & Mop';
    if (mode === 'Mopping after sweeping') return 'Mop after Vac';
    if (mode === 'Sweeping') return 'Vacuum';
    if (mode === 'Mopping') return 'Mop';
    return mode;
  };

  // Get prefix based on cleangenius status
  const getPrefix = (): string => {
    return cleangenius === 'Off' ? 'Custom: ' : 'CleanGenius: ';
  };

  return (
    <button onClick={onClick} className="cleaning-mode-button">
      <div className="cleaning-mode-button__content">
        <span className="cleaning-mode-button__icon">{getIcon(cleaningMode)}</span>
        <span className="cleaning-mode-button__text">
          {getPrefix()}{getFriendlyName(cleaningMode)}
        </span>
      </div>
      <span className="cleaning-mode-button__arrow">›</span>
    </button>
  );
}
