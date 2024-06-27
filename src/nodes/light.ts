import { Chip, ChipConfig } from './chip';

type LightChipConfig = ChipConfig & {
	lightLevel?: number;
};

export class LightChip extends Chip {
	lightLevel: number;

	constructor(config: LightChipConfig = {}) {
		super(config, 'LIGHT');

		this.lightLevel = config.lightLevel ?? 100;
	}
}
