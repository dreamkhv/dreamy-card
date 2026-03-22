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
import styles from './editor.css';

type ConfigElement = HTMLInputElement & {
  configValue?: keyof DreamyCardConfig;
};

@customElement('dreamy-card-editor')
export class VacuumCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config!: Partial<DreamyCardConfig>;

  @state() private image? = undefined;
  @state() private compact_view = false;

  setConfig(config: LovelaceCardConfig & DreamyCardConfig): void {
    this.config = config;

    if (!this.config.entity) {
      this.config.entity = this.getEntitiesByType('input_number')[0] || '';
      fireEvent(this, 'config-changed', { config: this.config });
    }
  }

  private getEntitiesByType(type: string): string[] {
    if (!this.hass) {
      return [];
    }
    return Object.keys(this.hass.states).filter((id) => id.startsWith(type));
  }

  protected render(): Template {
    if (!this.hass) {
      return nothing;
    }

    const entities = this.getEntitiesByType('input_number');

    return html`
      <div class="card-config">
        <div class="option">
          <ha-select
            .label=${localize('editor.entity')}
            @selected=${this.valueChanged}
            .configValue=${'entity'}
            .value=${this.config.entity}
            @closed=${(e: Event) => e.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
            required
            validationMessage=${localize('error.missing_entity')}
          >
            ${entities.map(
              (entity) =>
                html` <mwc-list-item .value=${entity}
                  >${entity}</mwc-list-item
                >`,
            )}
          </ha-select>
        </div>

        <div class="option">
          <paper-input
            label="${localize('editor.name')}"
            .value=${this.config.name ?? ''}
            .configValue=${'name'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>

        <div class="option">
          <paper-input
            label="${localize('editor.image')}"
            .value=${this.image}
            .configValue=${'image'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(
              this.compact_view
                ? 'editor.compact_view_aria_label_off'
                : 'editor.compact_view_aria_label_on',
            )}
            .checked=${Boolean(this.compact_view)}
            .configValue=${'compact_view'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.compact_view')}
        </div>

        <strong>${localize('editor.code_only_note')}</strong>
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

  static get styles() {
    return styles;
  }
}
