import { type CSSResultGroup, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from '../css/stepper.css';
import { CardComponent } from './card-component';
import { HomeAssistantService } from '../service';
import { Template } from '../types';

@customElement('ds-stepper2')
export class Stepper extends CardComponent {
  static get styles(): CSSResultGroup {
    return styles;
  }

  private onChange = async (value: number): Promise<void> => {
    await this.hass.callService('input_number', 'set_value', {
      entity_id: this.config.entity,
      value: value,
    });
  };

  public template(s: HomeAssistantService): Template {
    const handleDecrement = () => {
      this.onChange(Math.max(s.getMin(), s.getNumberState() - s.getStep()));
    };

    const handleIncrement = () => {
      this.onChange(Math.min(s.getMax(), s.getNumberState() + s.getStep()));
    };

    return html`
      <ha-card>
        <div class="card-content">
          <div class="stepper">
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
            <div class="control-row">
              <button class="button" @click=${handleDecrement}>
                <ha-icon icon="mdi:minus"></ha-icon>
              </button>
              <div class="value-wrap">
                <span class="value">${s.getNumberState()}</span>
                <span class="unit">${s.getUnit()}</span>
              </div>
              <button class="button" @click=${handleIncrement}>
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}
