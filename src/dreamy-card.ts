import './components/state';
import './components/stepper';
import './components/switcher';
import { LitElement, html, nothing, TemplateResult } from 'lit';
import type { CSSResultGroup, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { hasConfigOrEntityChanged, HomeAssistant } from 'custom-card-helpers';
import localize from './localize';
import buildConfig from './config';
import { DreamyCardConfig, Template } from './types';

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
  @state() private switchChecked = false;

  public static async getConfigElement() {
    await import('./editor');
    return document.createElement('dreamy-card-editor');
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
    console.log(this.hass.states[this.config.entity]?.attributes);
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

  private onSwitchChange = (e: CustomEvent<{ checked: boolean }>): void => {
    this.switchChecked = e.detail.checked;
  };

  protected render(): Template {
    switch (this.config.mode) {
      case 'stepper':
        return this.stepper();
      case 'switcher':
        return this.switcher();
      default:
        return nothing;
    }
  }

  private stepper(): TemplateResult {
    return html`
      <ds-stepper
        min="1"
        max="60"
        step="1"
        label="${this.getLabel()}"
        .icon=${this.getIcon()}
        unit="${this.getUnit()}"
        .value=${this.get()}
        .onChange=${this.onChange}
      ></ds-stepper>
    `;
  }

  private switcher(): TemplateResult {
    return html`
      <ds-switcher
        label="${this.getLabel()}"
        .icon=${this.getIcon()}
        .checked=${this.switchChecked}
        @change=${this.onSwitchChange}
      ></ds-switcher>
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
