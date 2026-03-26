import { DreamyCardConfig } from './types';
import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket/dist/types';

export class HomeAssistantService {
  constructor(
    private config: DreamyCardConfig,
    private hass: HomeAssistant,
  ) {}

  public getLabel(): string | undefined {
    return this.config.name ?? this.hass.states[this.config.entity]?.attributes.friendly_name;
  }

  public getIcon(): string | undefined {
    return this.config.icon ?? this.hass.states[this.config.entity]?.attributes.icon;
  }

  public getValue(): string {
    return this.hass.states[this.config.entity]?.state ?? '';
  }
}
