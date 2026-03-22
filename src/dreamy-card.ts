import { LitElement, html, TemplateResult } from 'lit';
import type { CSSResultGroup, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { hasConfigOrEntityChanged, HomeAssistant } from 'custom-card-helpers';
import registerTemplates from 'ha-template';
import localize from './localize';
import styles from './styles.css';
import buildConfig from './config';
import { DreamyCardConfig } from './types';

registerTemplates();

// Rollup will replace string on the right side
const PKG_VERSION = 'PKG_VERSION_VALUE';

console.info(
  `%c DREAMY-CARD %c ${PKG_VERSION}`,
  'color: white; background: blue; font-weight: 700;',
  'color: blue; background: white; font-weight: 700;',
);

@customElement('dreamy-card')
export class DreamyCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: DreamyCardConfig;

  @property({ type: Number }) public min: number = 0;
  @property({ type: Number }) public max: number = 100;
  @property({ type: Number }) public step: number = 1;

  static get styles(): CSSResultGroup {
    return styles;
  }

  public static async getConfigElement() {
    await import('./editor');
    return document.createElement('dreamy-card-editor');
  }

  static getStubConfig(_: unknown, entities: string[]) {
    const [vacuumEntity] = entities.filter((eid) => eid.startsWith('vacuum'));

    return {
      entity: vacuumEntity ?? '',
    };
  }

  public setConfig(config: DreamyCardConfig): void {
    this.config = buildConfig(config);
  }

  public getCardSize(): number {
    return this.config.compact_view ? 3 : 8;
  }

  public shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  private get(): number {
    return +this.hass.states[this.config.entity].state;
  };

  private onChange = async (value: number): Promise<void> => {
    await this.hass.callService('input_number', 'set_value', {
      entity_id: this.config.entity,
      value: value,
    });
  };

  protected render(): TemplateResult {
    const handleDecrement = () => {
      this.onChange(Math.max(this.min, this.get() - this.step));
    };

    const handleIncrement = () => {
      this.onChange(Math.min(this.max, this.get() + this.step));
    };
    return html`
      <ha-card>
        <div class="preview">
          <div class="header"></div>

          <div class="number-input">
            <div class="controls">
              <button class="button" @click=${handleDecrement}>
                <ha-icon icon="mdi:minus"></ha-icon>
              </button>
              <div class="content">
                <div class="value">${this.get()}</div>
              </div>
              <button class="button" @click=${handleIncrement}>
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}

declare global {
  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'dreamy-card',
  name: localize('common.name'),
  description: localize('common.description'),
});
