import { type TemplateResult, nothing } from 'lit';

export * from 'home-assistant-js-websocket';

export type TemplateNothing = typeof nothing;
export type Template = TemplateResult | TemplateNothing;

export interface DreamyCardConfig {
  mode: string;
  entity: string;
  name?: string;
  icon?: string;
  unit?: string;
}
