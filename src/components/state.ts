import { type CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import styles from '../css/state.css';
import { DreamyCardConfig } from '../types';

@customElement('ds-state2')
export class State extends LitElement {
  @property() public hass!: HomeAssistant;
  @property() public config!: DreamyCardConfig;

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

  private getUnit(): string {
    const c = this.config.unit?.trim();
    if (c) return c;
    const u = this.getStateObj()?.attributes?.unit_of_measurement;
    return typeof u === 'string' && u.length ? u : '';
  }

  public render(): TemplateResult {
    const st = this.getStateObj();
    if (!st) {
      return html`
        <ha-card>
          <div class="preview card-content">
            <div class="state">
              <span class="label">${this.config.entity}</span>
            </div>
          </div>
        </ha-card>
      `;
    }

    const icon = this.getIcon();
    const unit = this.getUnit();

    return html`
      <ha-card>
        <div class="preview card-content">
          <div class="state">
            <div class="label-wrap">
              ${icon
                ? html`
                    <div class="label-icon-circle" aria-hidden="true">
                      <ha-icon icon=${icon}></ha-icon>
                    </div>
                  `
                : nothing}
              <span class="label">${this.getLabel()}</span>
            </div>
            <div class="state-aside" aria-label=${`State: ${st.state}`}>
              <span class="state-value">${st.state}</span>
              ${unit
                ? html`<span class="state-unit">${unit}</span>`
                : nothing}
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}