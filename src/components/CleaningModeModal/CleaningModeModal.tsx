import { useState } from 'react';
import { Modal, SegmentedControl, Toggle, CircularButton } from '../common';
import type { Hass, HassEntity } from '../../types/homeassistant';
import './CleaningModeModal.scss';

interface CleaningModeModalProps {
  opened: boolean;
  onClose: () => void;
  entity: HassEntity;
  hass: Hass;
}

export function CleaningModeModal({
  opened,
  onClose,
  entity,
  hass,
}: CleaningModeModalProps) {
  // Get cleangenius mode from entity
  const cleangenius = entity.attributes.cleangenius || 'Off';
  const [isCleanGenius, setIsCleanGenius] = useState(cleangenius !== 'Off');
  
  // Get actual values from entity
  const cleaningMode = entity.attributes.cleaning_mode || 'Sweeping and mopping';
  const cleangeniusMode = entity.attributes.cleangenius_mode || 'Vacuum and mop';
  const suctionLevel = entity.attributes.suction_level || 'Standard';
  const wetnessLevel = entity.attributes.wetness_level || 20;
  const cleaningRoute = entity.attributes.cleaning_route || 'Standard';
  const tightMopping = entity.attributes.tight_mopping || false;
  const maxSuctionPower = entity.attributes.max_suction_power || false;
  const selfCleanArea = entity.attributes.self_clean_area || 20;
  const mopPadHumidity = entity.attributes.mop_pad_humidity || 'Moist';

  const modeOptions = [
    { value: 'CleanGenius', label: 'CleanGenius' },
    { value: 'Custom', label: 'Custom' },
  ];

  // Get available options from entity
  const cleaningModeList: string[] = entity.attributes.cleaning_mode_list || [
    'Sweeping',
    'Mopping',
    'Sweeping and mopping',
    'Mopping after sweeping',
  ];
  
  const cleangeniusModeList: string[] = entity.attributes.cleangenius_mode_list || [
    'Vacuum and mop',
    'Mop after vacuum',
  ];
  
  const suctionLevelList: string[] = entity.attributes.suction_level_list || ['Quiet', 'Standard', 'Strong', 'Turbo'];
  const cleaningRouteList: string[] = entity.attributes.cleaning_route_list || ['Quick', 'Standard', 'Intensive', 'Deep'];

  // Map cleaning modes to icons
  const getModeIcon = (mode: string): string => {
    if (mode.includes('Sweep') && mode.includes('Mop')) return '🔄';
    if (mode.includes('after')) return '➜';
    if (mode.includes('Mop')) return '💧';
    if (mode.includes('Sweep') || mode.includes('Vacuum')) return '🌀';
    return '⚙️';
  };

  // Map suction levels to icons
  const getSuctionIcon = (level: string): string => {
    if (level.includes('Quiet') || level.includes('Silent')) return '🌙';
    if (level.includes('Turbo')) return '⚡';
    if (level.includes('Strong')) return '🌀';
    return '🔄';
  };

  // Map routes to icons
  const getRouteIcon = (route: string): string => {
    if (route === 'Quick') return '⌇';
    if (route === 'Standard') return '≡';
    if (route === 'Intensive') return '⋮⋮';
    if (route === 'Deep') return '⫴';
    return '≡';
  };

  // Service call helpers
  const setSelectOption = (selectEntity: string, option: string) => {
    hass.callService('select', 'select_option', {
      entity_id: selectEntity,
      option: option,
    });
  };

  // Convert display value to service value for cleangenius mode
  const convertToServiceValue = (mode: string): string => {
    if (mode === 'Vacuum and mop') return 'vacuum_and_mop';
    if (mode === 'Mop after vacuum') return 'mop_after_vacuum';
    return mode;
  };

  const setSwitch = (switchEntity: string, turnOn: boolean) => {
    hass.callService('switch', turnOn ? 'turn_on' : 'turn_off', {
      entity_id: switchEntity,
    });
  };

  const setNumber = (numberEntity: string, value: number) => {
    hass.callService('number', 'set_value', {
      entity_id: numberEntity,
      value: value,
    });
  };

  // Get entity IDs based on the vacuum entity
  const baseEntityId = entity.entity_id.replace('vacuum.', '');
  const cleaningModeEntity = `select.${baseEntityId}_cleaning_mode`;
  const cleangeniusModeEntity = `select.${baseEntityId}_cleangenius_mode`;
  const suctionLevelEntity = `select.${baseEntityId}_suction_level`;
  const cleaningRouteEntity = `select.${baseEntityId}_cleaning_route`;
  const maxSuctionEntity = `switch.${baseEntityId}_max_suction_power`;
  const tightMoppingEntity = `switch.${baseEntityId}_tight_mopping`;
  const wetnessLevelEntity = `number.${baseEntityId}_wetness_level`;

  return (
    <Modal opened={opened} onClose={onClose}>
      <div className="cleaning-mode-modal">
        {/* Mode Toggle */}
        <div className="cleaning-mode-modal__header">
          <SegmentedControl
            value={isCleanGenius ? 'CleanGenius' : 'Custom'}
            onChange={(value) => setIsCleanGenius(value === 'CleanGenius')}
            options={modeOptions}
          />
        </div>

        {isCleanGenius ? (
          <div className="cleaning-mode-modal__content">
            {/* Cleaning Mode */}
            <section className="cleaning-mode-modal__section">
              <h3 className="cleaning-mode-modal__section-title">Cleaning Mode</h3>
              <div className="cleaning-mode-modal__mode-grid">
                {/* Use cleangenius_mode_list from entity */}
                {cleangeniusModeList.map((mode, idx) => {
                  const isVacMop = mode === 'Vacuum and mop';
                  const isMopAfter = mode === 'Mop after vacuum';
                  return (
                    <div
                      key={idx}
                      className={`cleaning-mode-modal__mode-card ${
                        mode === cleangeniusMode ? 'cleaning-mode-modal__mode-card--selected' : ''
                      }`}
                      onClick={() => setSelectOption(cleangeniusModeEntity, convertToServiceValue(mode))}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`cleaning-mode-modal__mode-icon cleaning-mode-modal__mode-icon--${isVacMop ? 'vac-mop' : 'mop-after'}`}>
                        <span>{isVacMop ? '🔄' : '➜'}</span>
                      </div>
                      <span className="cleaning-mode-modal__mode-label">
                        {isVacMop ? 'Vac & Mop' : isMopAfter ? 'Mop after Vac' : mode}
                      </span>
                      {mode === cleangeniusMode && (
                        <div className="cleaning-mode-modal__mode-checkmark">
                          <span>✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Deep Cleaning */}
            <div className="cleaning-mode-modal__setting">
              <span className="cleaning-mode-modal__setting-label">Deep Cleaning</span>
              <Toggle 
                checked={tightMopping} 
                onChange={(checked) => setSwitch(tightMoppingEntity, checked)} 
              />
            </div>
          </div>
        ) : (
          <div className="cleaning-mode-modal__content">
            {/* Custom Mode - Cleaning Mode */}
            <section className="cleaning-mode-modal__section">
              <h3 className="cleaning-mode-modal__section-title">Cleaning Mode</h3>
              <div className="cleaning-mode-modal__horizontal-scroll">
                {cleaningModeList.map((mode, idx) => (
                  <div key={idx} className="cleaning-mode-modal__mode-option">
                    <CircularButton
                      size="small"
                      selected={mode === cleaningMode}
                      onClick={() => setSelectOption(cleaningModeEntity, mode)}
                      icon={getModeIcon(mode)}
                    />
                    <span className="cleaning-mode-modal__mode-option-label">{mode}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Suction Power */}
            <section className="cleaning-mode-modal__section">
              <h3 className="cleaning-mode-modal__section-title">Suction Power</h3>
              <div className="cleaning-mode-modal__power-grid">
                {suctionLevelList.map((level, idx) => (
                  <div key={idx} className="cleaning-mode-modal__power-option">
                    <CircularButton
                      size="small"
                      selected={level === suctionLevel}
                      onClick={() => setSelectOption(suctionLevelEntity, level)}
                      icon={getSuctionIcon(level)}
                    />
                    <span className="cleaning-mode-modal__power-label">{level}</span>
                  </div>
                ))}
              </div>

              {/* Max+ toggle */}
              <div className="cleaning-mode-modal__max-plus">
                <div className="cleaning-mode-modal__max-plus-header">
                  <span className="cleaning-mode-modal__max-plus-title">Max+</span>
                  <Toggle 
                    checked={maxSuctionPower} 
                    onChange={(checked) => setSwitch(maxSuctionEntity, checked)} 
                  />
                </div>
                <p className="cleaning-mode-modal__max-plus-description">
                  The suction power will be increased to the highest level, which is a single-use mode.
                </p>
              </div>
            </section>

            {/* Wetness */}
            <section className="cleaning-mode-modal__section">
              <h3 className="cleaning-mode-modal__section-title">Wetness</h3>

              {/* Slider */}
              <div className="cleaning-mode-modal__slider-container">
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={wetnessLevel}
                  onChange={(e) => setNumber(wetnessLevelEntity, parseInt(e.target.value))}
                  className="cleaning-mode-modal__slider"
                />
                <div className="cleaning-mode-modal__slider-value">{wetnessLevel}</div>
              </div>

              {/* Labels */}
              <div className="cleaning-mode-modal__slider-labels">
                <span className={`cleaning-mode-modal__slider-label ${
                  mopPadHumidity === 'Slightly dry' ? 'cleaning-mode-modal__slider-label--active' : 'cleaning-mode-modal__slider-label--inactive'
                }`}>
                  Slightly dry
                </span>
                <span className={`cleaning-mode-modal__slider-label ${
                  mopPadHumidity === 'Moist' ? 'cleaning-mode-modal__slider-label--active' : 'cleaning-mode-modal__slider-label--inactive'
                }`}>
                  Moist
                </span>
                <span className={`cleaning-mode-modal__slider-label ${
                  mopPadHumidity === 'Wet' ? 'cleaning-mode-modal__slider-label--active' : 'cleaning-mode-modal__slider-label--inactive'
                }`}>
                  Wet
                </span>
              </div>
            </section>

            {/* Mop-washing frequency */}
            <div className="cleaning-mode-modal__setting cleaning-mode-modal__setting--clickable">
              <span className="cleaning-mode-modal__setting-label">Mop-washing frequency</span>
              <div className="cleaning-mode-modal__setting-value">
                <span>By Area {selfCleanArea}m²</span>
                <span className="cleaning-mode-modal__setting-arrow">›</span>
              </div>
            </div>

            {/* Route */}
            <section className="cleaning-mode-modal__section">
              <div className="cleaning-mode-modal__section-header">
                <h3 className="cleaning-mode-modal__section-title">Route</h3>
                <span className="cleaning-mode-modal__help-icon">?</span>
              </div>

              <div className="cleaning-mode-modal__route-grid">
                {cleaningRouteList.map((route, idx) => (
                  <div key={idx} className="cleaning-mode-modal__route-option">
                    <CircularButton
                      size="small"
                      selected={route === cleaningRoute}
                      onClick={() => setSelectOption(cleaningRouteEntity, route)}
                      icon={getRouteIcon(route)}
                    />
                    <span className="cleaning-mode-modal__route-label">{route}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </Modal>
  );
}
