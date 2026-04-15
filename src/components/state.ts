import { type CSSResultGroup, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from '../css/state.css';
import { HomeAssistantService } from '../service';
import { Template } from '../types';
import { CardComponent } from './card-component';

@customElement('ds-state')
export class State extends CardComponent {
  static get styles(): CSSResultGroup {
    return styles;
  }

  protected template(s: HomeAssistantService): Template {
    return html`
      <ha-card>
        <ha-ripple></ha-ripple>
        <div class="card-content">
          <div class="state">
            <div class="label-wrap">
              ${s.getIcon()
                ? html`
                    <div class="label-icon-circle" aria-hidden="true">
                      <ha-icon icon=${s.getIcon()}></ha-icon>
                    </div>
                  `
                : nothing}
              <span class="label">${s.getLabel()}</span>
            </div>
            <div class="state-aside">
              <span class="state-value">${s.getState()}</span>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}
