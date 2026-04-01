import { LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { DreamyCardConfig, Template } from '../types';
import { HomeAssistantService } from '../service';
import { HomeAssistant } from 'custom-card-helpers';

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
