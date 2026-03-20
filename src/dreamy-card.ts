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

  protected render(): TemplateResult {
    return html`
      <ha-card>
        <ha-ripple></ha-ripple>
        <div class="preview">
          <div class="header"></div>

          <div class="metadata"></div>
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
