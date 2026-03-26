import './components/state';
import './components/stepper';
import './components/switcher';
import { LitElement, html, nothing, TemplateResult } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { hasConfigOrEntityChanged, HomeAssistant } from 'custom-card-helpers';
import localize from './localize';
import buildConfig from './config';
import { DreamyCardConfig, Template } from './types';

// Rollup will replace string on the right side
const PKG_VERSION = 'PKG_VERSION_VALUE';

console.info(
  `%c DREAMY-CARD2 %c ${PKG_VERSION}`,
  'color: white; background: blue; font-weight: 700;',
  'color: blue; background: white; font-weight: 700;',
);

@customElement('dreamy-card2')
export class DreamyCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: DreamyCardConfig;

  public static async getConfigElement() {
    await import('./editor');
    return document.createElement('dreamy-card-editor2');
  }

  public setConfig(config: DreamyCardConfig): void {
    this.config = buildConfig(config);
  }

  public shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

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
      <ds-state2
        .hass=${this.hass}
        .config=${this.config}
      ></ds-state2>
    `;
  }

  private stepper(): TemplateResult {
    return html`
      <ds-stepper2
        .hass=${this.hass}
        .config=${this.config}
      ></ds-stepper2>
    `;
  }

  private switcher(): TemplateResult {
    return html`
      <ds-switcher2
        .hass=${this.hass}
        .config=${this.config}
      ></ds-switcher2>
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
  type: 'dreamy-card2',
  name: localize('common.name'),
  description: localize('common.description'),
});
