import { Chip, ChipConfig } from './chip';

type ChipConnection = {
	input: {
		chipId: string;
		inputId: string;
	},
	output: {
		chipId: string;
		outputId: string;
	},
};

type ProcessorChipConfig = ChipConfig & {
	chips?: Chip[];
	connections?: ChipConnection[];
};

export class ProcessorChip extends Chip {
	chips: Chip[];
	connections: ChipConnection[];

	constructor(config: ProcessorChipConfig) {
		super(config, 'PROCESSOR');

		this.chips = config.chips ?? [];
		this.connections = config.connections ?? [];
	}

	addChip(chip: Chip): number {
		return this.chips.push(chip);
	}

	createConnection(connection: ChipConnection): number {
		return this.connections.push(connection)
	}
}

