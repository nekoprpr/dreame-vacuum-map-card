import { SLIDER_CONFIG, MOP_PAD_HUMIDITY } from '../../../constants';

interface WetnessSliderProps {
  wetnessLevel: number;
  mopPadHumidity: string;
  onChangeWetness: (entityId: string, value: number) => void;
  entityId: string;
  slightlyDryLabel: string;
  moistLabel: string;
  wetLabel: string;
}

export function WetnessSlider({
  wetnessLevel,
  mopPadHumidity,
  onChangeWetness,
  entityId,
  slightlyDryLabel,
  moistLabel,
  wetLabel,
}: WetnessSliderProps) {
  const wetnessPercent = ((wetnessLevel - SLIDER_CONFIG.WETNESS.MIN) / (SLIDER_CONFIG.WETNESS.MAX - SLIDER_CONFIG.WETNESS.MIN)) * 100;

  return (
    <>
      {/* Slider */}
      <div className="cleaning-mode-modal__slider-container">
        <input
          type="range"
          min={SLIDER_CONFIG.WETNESS.MIN}
          max={SLIDER_CONFIG.WETNESS.MAX}
          value={wetnessLevel}
          onChange={(e) => onChangeWetness(entityId, parseInt(e.target.value))}
          className="cleaning-mode-modal__slider"
          style={{
            background: `linear-gradient(to right, var(--accent-bg-secondary) 0%, var(--accent-bg-secondary) ${wetnessPercent}%, var(--accent-bg-secondary-hover) ${wetnessPercent}%, var(--accent-bg-secondary-hover) 100%)`
          }}
        />
        <div 
          className="cleaning-mode-modal__slider-value"
          style={{
            left: `calc(${wetnessPercent}% + ${8 - wetnessPercent * 0.16}px)`
          }}
        >
          {wetnessLevel}
        </div>
      </div>

      {/* Labels */}
      <div className="cleaning-mode-modal__slider-labels">
        <span className={`cleaning-mode-modal__slider-label ${
          mopPadHumidity === MOP_PAD_HUMIDITY.SLIGHTLY_DRY ? 'cleaning-mode-modal__slider-label--active' : 'cleaning-mode-modal__slider-label--inactive'
        }`}>
          {slightlyDryLabel}
        </span>
        <span className={`cleaning-mode-modal__slider-label ${
          mopPadHumidity === MOP_PAD_HUMIDITY.MOIST ? 'cleaning-mode-modal__slider-label--active' : 'cleaning-mode-modal__slider-label--inactive'
        }`}>
          {moistLabel}
        </span>
        <span className={`cleaning-mode-modal__slider-label ${
          mopPadHumidity === MOP_PAD_HUMIDITY.WET ? 'cleaning-mode-modal__slider-label--active' : 'cleaning-mode-modal__slider-label--inactive'
        }`}>
          {wetLabel}
        </span>
      </div>
    </>
  );
}
