import { css, type CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { Template } from '../types';
import { customElement, property } from 'lit/decorators.js';
import styles from '../css/switcher.css';

@customElement('ds-switcher')
export class Stepper extends LitElement {
  @property({ type: String }) public icon: string = '';
  @property({ type: String }) public label: string = '';

  static get styles(): CSSResultGroup {
    return styles;
  }

  public render(): TemplateResult {
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
          </div>
    `;
  }
}