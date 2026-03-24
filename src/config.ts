import localize from './localize';
import { DreamyCardConfig } from './types';

export default function buildConfig(
  config?: Partial<DreamyCardConfig>,
): DreamyCardConfig {
  if (!config) {
    throw new Error(localize('error.invalid_config'));
  }

  if (!config.entity) {
    throw new Error(localize('error.missing_entity'));
  }

  return {
    mode: config.mode ?? 'number-stepper',
    entity: config.entity,
    icon: (config.icon ?? '').trim(),
    name: (config.name ?? '').trim(),
    unit: (config.unit ?? '').trim(),
  };
}
