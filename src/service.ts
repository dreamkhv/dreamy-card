import { type HomeAssistant } from 'custom-card-helpers';

import { DreamyCardConfig } from './types';

export class HomeAssistantService {
  constructor(
    private config: DreamyCardConfig,
    private hass: HomeAssistant,
  ) {}

  public getLabel(): string | undefined {
    return (
      this.config.name ??
      this.hass.states[this.config.entity]?.attributes.friendly_name
    );
  }

  public getIcon(): string | undefined {
    return (
      this.config.icon ?? this.hass.states[this.config.entity]?.attributes.icon
    );
  }

  public getMax(): number {
    return +this.hass.states[this.config.entity]?.attributes.max;
  }

  public getMin(): number {
    return +this.hass.states[this.config.entity]?.attributes.min;
  }

  public getStep(): number {
    return +this.hass.states[this.config.entity]?.attributes.step;
  }

  public getUnit(): string | undefined {
    return (
      this.config.unit ??
      this.hass.states[this.config.entity]?.attributes.unit_of_measurement
    );
  }

  public getState(): string {
    return this.hass.states[this.config.entity]?.state ?? '';
  }

  public getBooleanState(): boolean {
    return this.hass.states[this.config.entity]?.state === 'on';
  }

  public getNumberState(): number {
    return +this.hass.states[this.config.entity]?.state;
  }
}
