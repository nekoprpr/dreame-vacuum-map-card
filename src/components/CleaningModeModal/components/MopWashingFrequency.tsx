import { CircularButton } from '../../common';
import type { SelfCleanFrequency } from '../../../types/vacuum';
import {
  getSelfCleanFrequencyIcon,
  convertSelfCleanFrequencyToService,
} from '../../../utils';

interface MopWashingFrequencyProps {
  selfCleanFrequency: string;
  selfCleanFrequencyList: string[];
  selfCleanArea: number;
  selfCleanAreaMin: number;
  selfCleanAreaMax: number;
  selfCleanTime: number;
  selfCleanTimeMin: number;
  selfCleanTimeMax: number;
  onSelectFrequency: (entityId: string, value: string) => void;
  onChangeArea: (entityId: string, value: number) => void;
  onChangeTime: (entityId: string, value: number) => void;
  frequencyEntityId: string;
  areaEntityId: string;
  timeEntityId: string;
}

export function MopWashingFrequency({
  selfCleanFrequency,
  selfCleanFrequencyList,
  selfCleanArea,
  selfCleanAreaMin,
  selfCleanAreaMax,
  selfCleanTime,
  selfCleanTimeMin,
  selfCleanTimeMax,
  onSelectFrequency,
  onChangeArea,
  onChangeTime,
  frequencyEntityId,
  areaEntityId,
  timeEntityId,
}: MopWashingFrequencyProps) {
  const selfCleanAreaPercent = ((selfCleanArea - selfCleanAreaMin) / (selfCleanAreaMax - selfCleanAreaMin)) * 100;
  const selfCleanTimePercent = ((selfCleanTime - selfCleanTimeMin) / (selfCleanTimeMax - selfCleanTimeMin)) * 100;

  return (
    <>
      {/* Frequency type selector */}
      <div className="cleaning-mode-modal__horizontal-scroll">
        {selfCleanFrequencyList.map((freq, idx) => (
          <div key={idx} className="cleaning-mode-modal__mode-option">
            <CircularButton
              size="small"
              selected={freq === selfCleanFrequency}
              onClick={() => onSelectFrequency(frequencyEntityId, convertSelfCleanFrequencyToService(freq as SelfCleanFrequency))}
              icon={getSelfCleanFrequencyIcon(freq as SelfCleanFrequency)}
            />
            <span className="cleaning-mode-modal__mode-option-label">{freq}</span>
          </div>
        ))}
      </div>

      {/* Slider for By area or By time */}
      {(selfCleanFrequency === 'By area' || selfCleanFrequency === 'By time') && (
        <div className="cleaning-mode-modal__slider-container" style={{ marginTop: '1rem' }}>
          <input
            type="range"
            min={selfCleanFrequency === 'By area' ? selfCleanAreaMin : selfCleanTimeMin}
            max={selfCleanFrequency === 'By area' ? selfCleanAreaMax : selfCleanTimeMax}
            value={selfCleanFrequency === 'By area' ? selfCleanArea : selfCleanTime}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (selfCleanFrequency === 'By area') {
                onChangeArea(areaEntityId, value);
              } else {
                onChangeTime(timeEntityId, value);
              }
            }}
            className="cleaning-mode-modal__slider"
            style={{
              background: selfCleanFrequency === 'By area'
                ? `linear-gradient(to right, var(--accent-bg-secondary) 0%, var(--accent-bg-secondary) ${selfCleanAreaPercent}%, var(--accent-bg-secondary-hover) ${selfCleanAreaPercent}%, var(--accent-bg-secondary-hover) 100%)`
                : `linear-gradient(to right, var(--accent-bg-secondary) 0%, var(--accent-bg-secondary) ${selfCleanTimePercent}%, var(--accent-bg-secondary-hover) ${selfCleanTimePercent}%, var(--accent-bg-secondary-hover) 100%)`
            }}
          />
          <div 
            className="cleaning-mode-modal__slider-value"
            style={{
              left: selfCleanFrequency === 'By area'
                ? `calc(${selfCleanAreaPercent}% + ${8 - selfCleanAreaPercent * 0.16}px)`
                : `calc(${selfCleanTimePercent}% + ${8 - selfCleanTimePercent * 0.16}px)`
            }}
          >
            {selfCleanFrequency === 'By area' ? `${selfCleanArea}m²` : `${selfCleanTime}m`}
          </div>
        </div>
      )}
    </>
  );
}
