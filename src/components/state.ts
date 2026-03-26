import { type CSSResultGroup, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../css/state.css';
import { DreamyCardConfig, Template } from '../types';
import { CardElement } from './card-element';
import { HomeAssistantService } from '../service';

@customElement('ds-state2')
export class State extends CardElement {
  static get styles(): CSSResultGroup {
    return styles;
  }

  protected template(service: HomeAssistantService): Template {
    return html`
      <ha-card>
        <div class="preview card-content">
          <div class="state">
            <div class="label-wrap">
              ${service.getIcon()
                ? html`
                  <div class="label-icon-circle" aria-hidden="true">
                    <ha-icon icon=${service.getIcon()}></ha-icon>
                  </div>
                `
                : nothing}
              <span class="label">${service.getLabel()}</span>
            </div>
            <div class="state-aside">
              <span class="state-value">${service.getValue()}</span>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}