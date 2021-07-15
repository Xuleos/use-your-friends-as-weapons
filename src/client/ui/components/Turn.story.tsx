import Roact from "@rbxts/roact";
import Turn from "./Turn";

export = (target: Instance) => {
	const thing = Roact.mount(<Turn leftTriggered={() => {}} rightTriggered={() => {}} />, target);

	return () => {
		Roact.unmount(thing);
	};
};
