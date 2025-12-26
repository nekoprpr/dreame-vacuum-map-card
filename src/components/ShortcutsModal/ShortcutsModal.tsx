import { Modal } from '../common';
import type { Hass, HassEntity } from '../../types/homeassistant';
import './ShortcutsModal.scss';

interface ShortcutsModalProps {
  opened: boolean;
  onClose: () => void;
  entity: HassEntity;
  hass: Hass;
}

export function ShortcutsModal({
  opened,
  onClose,
  entity,
  hass,
}: ShortcutsModalProps) {
  // Get shortcuts from entity attributes - it's an object with IDs as keys
  const shortcutsObj = entity.attributes.shortcuts || {};
  const shortcuts = Object.entries(shortcutsObj).map(([id, data]: [string, any]) => ({
    id: parseInt(id),
    ...data,
  }));
  
  const handleShortcutClick = (shortcutId: number) => {
    hass.callService('dreame_vacuum', 'vacuum_clean_shortcut', {
      entity_id: entity.entity_id,
      shortcut_id: shortcutId,
    });
    
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose}>
      <div className="shortcuts-modal">
        <h2 className="shortcuts-modal__title">Shortcuts</h2>
        
        {shortcuts.length === 0 ? (
          <div className="shortcuts-modal__empty">
            <p>No shortcuts available</p>
            <p className="shortcuts-modal__empty-hint">
              Create shortcuts in the Dreame app to quickly start your favorite cleaning routines
            </p>
          </div>
        ) : (
          <div className="shortcuts-modal__list">
            {shortcuts.map((shortcut) => (
              <button
                style={{width : '100%', height: '40px', marginBottom: '10px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'black'}}
                key={shortcut.id}
                className="shortcuts-modal__item"
                onClick={() => handleShortcutClick(shortcut.id)}
              >
                <span>▶   </span>
                <span>{shortcut.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
