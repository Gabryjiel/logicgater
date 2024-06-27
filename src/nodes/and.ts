import { Chip, type ChipConfig } from './chip';

type AndChipConfig = ChipConfig & {
	inputs?: Array<number>;
}

export class AndChip extends Chip {
	inputs: Array<number>; 

	constructor(config: AndChipConfig = {}) {
		super(config, 'AND');

		this.inputs = config.inputs ?? [];
	}
}

