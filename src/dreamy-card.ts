import './components/stepper';
import './components/switcher';
import { LitElement, html, nothing, TemplateResult } from 'lit';
import type { CSSResultGroup, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { hasConfigOrEntityChanged, HomeAssistant } from 'custom-card-helpers';
import localize from './localize';
import styles from './css/styles.css';
import buildConfig from './config';
import { DreamyCardConfig } from './types';

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

  public shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  private get(): number {
    return +this.hass.states[this.config.entity].state;
  }

  private getUnit(): string {
    const custom = this.config.unit?.trim();
    if (custom) return custom;
    const u = this.hass.states[this.config.entity]?.attributes
      ?.unit_of_measurement;
    return typeof u === 'string' && u.length ? u : '';
  }

  private getLabel(): string {
    const custom = this.config.name?.trim();
    if (custom) return custom;
    const fn = this.hass.states[this.config.entity]?.attributes?.friendly_name;
    if (typeof fn === 'string' && fn.length) return fn;
    return this.config.entity;
  }

  private getIcon(): string | undefined {
    const fromConfig = this.config.icon?.trim();
    if (fromConfig) return fromConfig;
    const raw = this.hass.states[this.config.entity]?.attributes?.icon;
    return typeof raw === 'string' && raw.trim().length ? raw.trim() : undefined;
  }

  private onChange = async (value: number): Promise<void> => {
    await this.hass.callService('input_number', 'set_value', {
      entity_id: this.config.entity,
      value: value,
    });
  };

  protected render(): TemplateResult {
    const icon = this.getIcon();

    return html`
      <ha-card>
        <div class="preview card-content">
          <ds-stepper
            min="1"
            max="60"
            step="1"
            label="${this.getLabel()}"
            icon="${this.getIcon()}"
            unit="${this.getUnit()}"
            .value=${this.get()}
            .onChange=${this.onChange}
          ></ds-stepper>

          <ds-switcher
            label="${this.getLabel()}"
            icon="${this.getIcon()}"
          ></ds-switcher>
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
