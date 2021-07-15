import * as Roact from "@rbxts/roact";
import SideThing from "./SideThing";

interface TurnProps {
	leftTriggered: (dt: number) => void;
	rightTriggered: (dt: number) => void;
}

export default class Turn extends Roact.Component<TurnProps> {
	render() {
		return (
			<Roact.Fragment>
				<frame
					BackgroundTransparency={1}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={new UDim2(0, 800, 0, 400)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
				>
					<SideThing
						text={"Left"}
						keycode={Enum.KeyCode.A}
						anchorPoint={new Vector2(0, 0.5)}
						position={new UDim2(0, 0, 0.5, 0)}
						rotation={0}
						mouseButton1Down={this.props.leftTriggered}
					/>
					<SideThing
						text={"Right"}
						keycode={Enum.KeyCode.D}
						anchorPoint={new Vector2(1, 0.5)}
						position={new UDim2(1, 0, 0.5, 0)}
						rotation={180}
						mouseButton1Down={this.props.rightTriggered}
					/>
				</frame>
			</Roact.Fragment>
		);
	}
}
