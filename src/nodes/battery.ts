import { Chip, ChipConfig } from './chip';

type BatteryChipConfig = ChipConfig & {
	power?: number;
};

export class BatteryChip extends Chip {
	power: number;

	constructor(config: BatteryChipConfig = {}) {
		super(config, 'BATTERY');

		this.power = config.power ?? 0;
	}
}
