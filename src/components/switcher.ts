import { type CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import styles from '../css/switcher.css';
import { DreamyCardConfig } from '../types';

function isEntityStateOn(state: string | undefined): boolean {
  if (state === undefined) return false;
  return (
    state === 'on' ||
    state === 'home' ||
    state === 'open' ||
    state === 'unlocked' ||
    state === 'playing' ||
    state === 'active' ||
    state === 'True' ||
    state === 'true'
  );
}

@customElement('ds-switcher2')
export class Switcher extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: DreamyCardConfig;

  static get styles(): CSSResultGroup {
    return styles;
  }

  private getStateObj() {
    return this.hass?.states[this.config.entity];
  }

  private getLabel(): string {
    const n = this.config.name?.trim();
    if (n) return n;
    const fn = this.getStateObj()?.attributes?.friendly_name;
    if (typeof fn === 'string' && fn.length) return fn;
    return this.config.entity;
  }

  private getIcon(): string | undefined {
    const c = this.config.icon?.trim();
    if (c) return c;
    const raw = this.getStateObj()?.attributes?.icon;
    return typeof raw === 'string' && raw.trim().length ? raw.trim() : undefined;
  }

  private isUnavailable(): boolean {
    const s = this.getStateObj()?.state;
    return s === undefined || s === 'unavailable' || s === 'unknown';
  }

  private isOn(): boolean {
    return isEntityStateOn(this.getStateObj()?.state);
  }

  private toggle = async (): Promise<void> => {
    if (this.isUnavailable()) return;
    const wasOn = this.isOn();
    await this.hass.callService('homeassistant', 'toggle', {
      entity_id: this.config.entity,
    });
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: !wasOn },
        bubbles: true,
        composed: true,
      }),
    );
  };

  protected render(): TemplateResult {
    const icon = this.getIcon();
    const label = this.getLabel();
    const on = this.isOn();
    const disabled = this.isUnavailable();

    return html`
      <ha-card>
        <div class="preview card-content">
          <div class="switcher">
            <div class="label-wrap">
              ${icon
                ? html`
                    <div class="label-icon-circle" aria-hidden="true">
                      <ha-icon icon=${icon}></ha-icon>
                    </div>
                  `
                : nothing}
              <span class="label">${label}</span>
            </div>
            <button
              type="button"
              class="toggle"
              role="switch"
              aria-checked=${on ? 'true' : 'false'}
              aria-label=${label || 'Toggle'}
              ?disabled=${disabled}
              @click=${this.toggle}
            >
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }
}
