import type { HassEntity } from '../../types/homeassistant';
import './Header.scss';

interface HeaderProps {
  entity: HassEntity;
  deviceName: string;
}

export function Header({ entity, deviceName }: HeaderProps) {
  const getStatusText = () => {
    // Use the status attribute which has more detailed state info
    return entity.attributes.status || entity.state;
  };

  const getCleanedArea = () => entity.attributes.cleaned_area || 0;
  const getCleaningTime = () => entity.attributes.cleaning_time || 0;
  const getBatteryLevel = () => entity.attributes.battery || 0;

  // Check if vacuum is drying based on vacuum_state or drying attribute
  const isDrying = entity.attributes.vacuum_state === 'drying' || entity.attributes.drying === true;
  const dryingProgress = entity.attributes.drying_progress || 0;

  return (
    <div className="header">
      <h2 className="header__title">{deviceName}</h2>
      <p className="header__status">{getStatusText()}</p>

      {isDrying && (
        <div className="header__progress">
          <div className="header__progress-bar">
            <div
              className="header__progress-fill"
              style={{ width: `${dryingProgress}%` }}
            />
          </div>
          <p className="header__progress-text">{dryingProgress}%</p>
        </div>
      )}

      <div className="header__stats">
        <div className="header__stat">
          <span className="header__stat-icon">🏠</span>
          <span className="header__stat-value">{getCleanedArea()} m²</span>
        </div>
        <div className="header__stat">
          <span className="header__stat-icon">⏱️</span>
          <span className="header__stat-value">{getCleaningTime()} min</span>
        </div>
        <div className="header__stat">
          <span className="header__stat-icon">🔋</span>
          <span className="header__stat-value">{getBatteryLevel()} %</span>
        </div>
      </div>
    </div>
  );
}
