import Roact from "@rbxts/roact";

declare class Scale extends Roact.PureComponent<{
	Scale: number;
	Size: Vector2;
}> {
	render(): Roact.Element;
}

export = Scale;
