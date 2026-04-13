import { type HomeAssistant } from 'custom-card-helpers';
import { LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import { HomeAssistantService } from '../service';
import { DreamyCardConfig, Template } from '../types';

export abstract class CardComponent extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: DreamyCardConfig;

  protected service(): HomeAssistantService | undefined {
    if (!this.config || !this.hass) {
      return undefined;
    }

    return new HomeAssistantService(this.config, this.hass);
  }
  public render(): Template {
    const service = this.service();

    return service ? this.template(service) : nothing;
  }

  protected abstract template(s: HomeAssistantService): Template;
}
