import { type CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import styles from '../css/switcher.css';
import { DreamyCardConfig } from '../types';

@customElement('ds-switcher')
export class Switcher extends LitElement {
  @property() public hass!: HomeAssistant;
  @property() public config!: DreamyCardConfig;

  static get styles(): CSSResultGroup {
    return styles;
  }

  private toggle = (): void => {
    // const next = !this.checked;
    // this.checked = next;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: false },
        bubbles: true,
        composed: true,
      }),
    );
  };

  protected render(): TemplateResult {
    const icon = this.hass.states[this.config.entity]?.attributes?.icon ?? this.config.icon;
    const label = this.hass.states[this.config.entity]?.attributes?.friendly_name;
    const state = this.hass.states[this.config.entity].state === 'true';

    return html`
      <ha-card>
        <div class="card-content">
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
              aria-checked=${state ? 'true' : 'false'}
              aria-label=${label || 'Toggle'}
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
