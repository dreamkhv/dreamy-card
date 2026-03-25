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

  private onSwitchChange = (e: CustomEvent<{ checked: boolean }>): void => {
    this.switchChecked = e.detail.checked;
  };

  protected render(): Template {
    switch (this.config.mode) {
      case 'state':
        return this.state();
      case 'stepper':
        return this.stepper();
      case 'switcher':
        return this.switcher();
      default:
        return nothing;
    }
  }

  private state(): TemplateResult {
    return html`
      <ds-state
        .hass=${this.hass}
        .config=${this.config}
      ></ds-state>
    `;
  }

  private stepper(): TemplateResult {
    return html`
      <ds-stepper
        .hass=${this.hass}
        .config=${this.config}
      ></ds-stepper>
    `;
  }

  private switcher(): TemplateResult {
    return html`
      <ds-switcher
        .hass=${this.hass}
        .config=${this.config}
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
