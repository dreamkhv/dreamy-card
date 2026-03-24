import { type CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../css/switcher.css';
@customElement('ds-switcher')
export class Switcher extends LitElement {
  @property({ type: Boolean, reflect: true }) public checked = false;
  @property({ type: Boolean }) public disabled = false;
  @property({ type: String }) public icon = '';
  @property({ type: String }) public label = '';

  static get styles(): CSSResultGroup {
    return styles;
  }

  private toggle = (): void => {
    if (this.disabled) return;
    const next = !this.checked;
    this.checked = next;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: next },
        bubbles: true,
        composed: true,
      }),
    );
  };

  protected render(): TemplateResult {
    return html`
      <div class="switcher">
        <div class="label-wrap">
          ${this.icon
            ? html`
                <div class="label-icon-circle" aria-hidden="true">
                  <ha-icon icon=${this.icon}></ha-icon>
                </div>
              `
            : nothing}
          <span class="label">${this.label}</span>
        </div>
        <button
          type="button"
          class="toggle"
          role="switch"
          aria-checked=${this.checked ? 'true' : 'false'}
          aria-label=${this.label || 'Toggle'}
          ?disabled=${this.disabled}
          @click=${this.toggle}
        >
          <span class="toggle-track">
            <span class="toggle-thumb"></span>
          </span>
        </button>
      </div>
    `;
  }
}
