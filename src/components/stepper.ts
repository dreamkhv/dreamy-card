import { type CSSResultGroup, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import styles from '../css/stepper.css';
import { DreamyCardConfig } from '../types';

@customElement('ds-stepper')
export class Stepper extends LitElement {
  @property() public hass!: HomeAssistant;
  @property() public config!: DreamyCardConfig;

  static get styles(): CSSResultGroup {
    return styles;
  }

  private onChange = async (value: number): Promise<void> => {
    await this.hass.callService('input_number', 'set_value', {
      entity_id: this.config.entity,
      value: value,
    });
  };

  public render(): TemplateResult {
    const icon = this.hass.states[this.config.entity]?.attributes?.icon;
    const label = this.config.name ?? this.hass.states[this.config.entity]?.attributes?.friendly_name;
    const max = this.hass.states[this.config.entity]?.attributes?.max;
    const min = this.hass.states[this.config.entity]?.attributes?.min;
    const step = this.hass.states[this.config.entity]?.attributes?.step;
    const unit = this.hass.states[this.config.entity]?.attributes?.unit_of_measurement;
    const value = +this.hass.states[this.config.entity].state;


    const handleDecrement = () => {
      this.onChange(Math.max(min, value - step));
    };

    const handleIncrement = () => {
      this.onChange(Math.min(max, value + step));
    };

    return html`
      <ha-card>
        <div class="card-content">
          <div class="stepper">
            <div class="label-wrap">
              <div class="label-icon-circle" aria-hidden="true">
                <ha-icon icon=${icon}></ha-icon>
              </div>
              <span class="label">${label}</span>
            </div>
            <div class="control-row">
              <button
                type="button"
                class="button"
                @click=${handleDecrement}
              >
                <ha-icon icon="mdi:minus"></ha-icon>
              </button>
              <div class="value-wrap">
                <span class="value">${value}</span>
                <span class="unit">${unit}</span>
              </div>
              <button
                type="button"
                class="button"
                @click=${handleIncrement}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}