import { Chip, ChipConfig } from './chip';

type TimerChipConfig = ChipConfig & {
	duration?: number;
};

export class TimerChip extends Chip {
	duration: number;

	constructor(config: TimerChipConfig = {}) {
		super(config, 'TIMER');

		this.duration = config.duration ?? 1000;
	}
}
