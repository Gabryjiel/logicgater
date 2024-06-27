export type Position = {
	x: number;
	y: number;
};

export type ChipType = 'BATTERY' | 'PROCESSOR' | 'AND' | 'LIGHT' | 'TIMER';

type NormalChipConfig = {
	id?: string;
	position?: Position;
};

export type ChipConfig = Omit<NormalChipConfig, 'type'>;

export abstract class Chip {
	readonly id: string;
	readonly type: ChipType;
	position: Position;

	static chipTypeMap = new Map<ChipType, number>();

	constructor(config: NormalChipConfig, type: ChipType) {
		this.id = config.id ?? Chip.createId(type);
		this.position = config.position ?? { x: 0, y: 0 };
		this.type = type;
	}

	static createId(type: ChipType) {
		let count = Chip.chipTypeMap.get(type);

		if (count === undefined) {
			count = 1;
		} else {
			count++;
		}

		Chip.chipTypeMap.set(type, count);
		return `${type}_${count}`;
	}
}

