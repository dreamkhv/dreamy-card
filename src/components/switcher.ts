import { type CSSResultGroup, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from '../css/switcher.css';
import { Template } from '../types';
import { CardComponent } from './card-component';
import { HomeAssistantService } from '../service';

@customElement('ds-switcher2')
export class Switcher extends CardComponent {
  static get styles(): CSSResultGroup {
    return styles;
  }

  private toggle = async (state: boolean): Promise<void> => {
    await this.hass.callService('homeassistant', 'toggle', {
      entity_id: this.config.entity,
    });

    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: !state },
      bubbles: true,
      composed: true,
    }));
  };

  public template(service: HomeAssistantService): Template {
    const state = service.getBooleanState();

    return html`
      <ha-card>
        <div class="preview card-content">
          <div class="switcher">
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
