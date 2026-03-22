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
    entity: config.entity,
    name: (config.name ?? '').trim(),
    image: config.image ?? 'default',
    compact_view: config.compact_view ?? false,
  };
}
