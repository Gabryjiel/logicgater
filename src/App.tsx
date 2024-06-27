import { AndChip } from "./nodes/and";
import { BatteryChip } from "./nodes/battery";
import { LightChip } from "./nodes/light";
import { ProcessorChip } from "./nodes/processor";
import { TimerChip } from "./nodes/timer";
import { useAppSelector } from "./providers/redux";

export function App() {
	const motherboard = useAppSelector((state) => state.motherboard.processor);
	return <Processor chip={motherboard} />;
}

export function Processor(props: { chip: ProcessorChip }) {
	return (
		<div>
			<span>{props.chip.id}</span>
			{props.chip.chips.map((chip) => {
				if (chip instanceof ProcessorChip) {
					return <Processor key={chip.id} chip={chip} />;
				}
				if (chip instanceof BatteryChip) {
					return <Battery key={chip.id} chip={chip} />;
				}
				if (chip instanceof TimerChip) {
					return <div>{chip.id}</div>;
				}
				if (chip instanceof AndChip) {
					return <div>{chip.id}</div>;
				}
				if (chip instanceof LightChip) {
					return <div>{chip.id}</div>;
				}
			})}
		</div>
	);
}

export function Battery(props: { chip: BatteryChip }) {
	return <div>{`${props.chip.id} ${props.chip.power}`}</div>;
}
