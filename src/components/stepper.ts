import { css, type CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { Template } from '../types';
import { customElement, property } from 'lit/decorators.js';
import styles from '../css/stepper.css';

@customElement('ds-stepper')
export class Stepper extends LitElement {
  @property({ type: Number }) public min: number = 0;
  @property({ type: Number }) public max: number = 100;
  @property({ type: Number }) public step: number = 1;
  @property({ type: String }) public unit: string = '';
  @property({ type: String }) public icon: string = '';
  @property({ type: String }) public label: string = '';
  @property({ type: Number }) public value: number = 10;
  @property({ type: Function }) public onChange: (value: number) => void = () => {};

  static get styles(): CSSResultGroup {
    return styles;
  }

  public render(): TemplateResult {
    const handleDecrement = () => {
      this.onChange(Math.max(this.min, this.value - this.step));
    };

    const handleIncrement = () => {
      this.onChange(Math.min(this.max, this.value + this.step));
    };

    return html`
          <div class="number-input">
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
            <div class="control-row">
              <button
                type="button"
                class="button"
                aria-label="Decrease"
                @click=${handleDecrement}
              >
                <ha-icon icon="mdi:minus"></ha-icon>
              </button>
              <div class="value-wrap">
                <span class="value">${this.value}</span>
                ${this.unit ? html`<span class="unit">${this.unit}</span>` : nothing}
              </div>
              <button
                type="button"
                class="button"
                aria-label="Increase"
                @click=${handleIncrement}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            </div>
          </div>
    `;
  }
}