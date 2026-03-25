import { type CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import styles from '../css/state.css';
import { DreamyCardConfig } from '../types';

@customElement('ds-state')
export class State extends LitElement {
  @property() public hass!: HomeAssistant;
  @property() public config!: DreamyCardConfig;

  static get styles(): CSSResultGroup {
    return styles;
  }

  public render(): TemplateResult {
    const icon = this.hass.states[this.config.entity]?.attributes?.icon;
    const label = this.config.name ?? this.hass.states[this.config.entity]?.attributes?.friendly_name;
    const state = this.hass.states[this.config.entity].state;

    return html`
      <ha-card>
        <div class="card-content">
          <div class="state">
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
          </div>
        </div>
      </ha-card>
    `;
  }
}