import { LitElement, html, nothing } from 'lit';
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from 'custom-card-helpers';
import localize from './localize';
import { customElement, property, state } from 'lit/decorators.js';
import { Template, DreamyCardConfig } from './types';
import styles from './css/editor.css';

type ConfigElement = HTMLInputElement & {
  configValue?: keyof DreamyCardConfig;
};

@customElement('dreamy-card-editor')
export class VacuumCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config!: Partial<DreamyCardConfig>;

  setConfig(config: LovelaceCardConfig & DreamyCardConfig): void {
    this.config = config;
  }

  static get styles() {
    return styles;
  }

  protected render(): Template {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const modes = [
      { id: 'state', name: 'Состояние' },
      { id: 'stepper', name: 'Счётчик' },
      { id: 'switcher', name: 'Переключатель' },
    ];

    return html`
      <div class="card-config">
        <div class="option">
          <ha-selector
            .hass=${this.hass}
            .selector=${{
              select: {
                mode: 'dropdown',
                options: modes.map(m => ({
                  label: m.name,
                  value: m.id
                }))
              }
            }}
            .value=${this.config.mode}
            .label=${localize('editor.type')}
            @value-changed=${this.valueChanged}
          ></ha-selector>
        </div>
        
        <div class="option">
          <ha-selector
            .hass=${this.hass}
            .selector=${{ entity: {} }}
            .value=${this.config.entity ?? ''}
            .configValue=${'entity'}
            @value-changed=${this.valueChanged}
          ></ha-selector>
        </div>

        <div class="option">
          <ha-icon-picker
            .hass=${this.hass}
            .value=${this.config.icon ?? ''}
            .configValue=${'icon'}
            label="${localize('editor.icon')}"
            @value-changed=${this.valueChanged}
          ></ha-icon-picker>
        </div>

        <div class="option">
          <ha-textfield
            label="${localize('editor.name')}"
            .value=${this.config.name ?? ''}
            .configValue=${'name'}
            @input=${this.valueChanged}
          ></ha-textfield>
        </div>

        <div class="option">
          <ha-textfield
            label="${localize('editor.unit')}"
            .value=${this.config.unit ?? ''}
            .configValue=${'unit'}
            @input=${this.valueChanged}
          ></ha-textfield>
        </div>
      </div>
    `;
  }

  private valueChanged(event: Event): void {
    if (!this.config || !this.hass || !event.target) {
      return;
    }
    const target = event.target as ConfigElement;
    if (
      !target.configValue ||
      this.config[target.configValue] === target?.value
    ) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this.config[target.configValue];
      } else {
        this.config = {
          ...this.config,
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.config });
  }
}
