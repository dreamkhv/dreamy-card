import { type CSSResultGroup, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';

import styles from '../css/switcher.css';
import { HomeAssistantService } from '../service';
import { Template } from '../types';
import { CardComponent } from './card-component';

@customElement('ds-switcher')
export class Switcher extends CardComponent {
  static get styles(): CSSResultGroup {
    return [super.styles, styles];
  }

  private toggle = async (state: boolean): Promise<void> => {
    await this.hass.callService('homeassistant', 'toggle', {
      entity_id: this.config.entity,
    });

    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { checked: !state },
      }),
    );
  };

  public template(s: HomeAssistantService): Template {
    const state = s.getBooleanState();

    return html`
      <ha-card>
        <ha-ripple></ha-ripple>
        <div class="card-content">
          <div class="switcher">
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
            <button
              type="button"
              class="toggle"
              role="switch"
              aria-checked=${state ? 'true' : 'false'}
              @click=${() => this.toggle(state)}
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
