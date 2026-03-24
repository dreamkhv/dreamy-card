import { type CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../css/state.css';

@customElement('ds-state')
export class State extends LitElement {
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
    return html`
          <div class="state">
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
          </div>
    `;
  }
}