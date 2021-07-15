import { Janitor } from "@rbxts/janitor";
import * as Roact from "@rbxts/roact";
import { ContextActionService, RunService, UserInputService } from "@rbxts/services";

interface SideThingProps {
	anchorPoint: Vector2;
	position: UDim2;
	rotation?: number;
	text: string;
	keycode: Enum.KeyCode;
	mouseButton1Down: (dt: number) => void;
}

export default class SideThing extends Roact.Component<SideThingProps> {
	down: Roact.Binding<boolean>;
	setDown: Roact.BindingFunction<boolean>;

	janitor = new Janitor();

	constructor(props: SideThingProps) {
		super(props);

		[this.down, this.setDown] = Roact.createBinding(false as boolean);
	}

	render() {
		let text = this.props.text;

		if (UserInputService.KeyboardEnabled) {
			text = `<font color="rgb(255,255,255)" size="30">(${tostring(
				this.props.keycode.Name,
			)})</font><br />${text}`;
		}

		return (
			<imagebutton
				BackgroundTransparency={1}
				AnchorPoint={this.props.anchorPoint}
				Position={this.props.position}
				Rotation={this.props.rotation}
				Size={new UDim2(0.3, 0, 0.5, 0)}
				Image={"http://www.roblox.com/asset/?id=7097808296"}
				ImageColor3={Color3.fromRGB(17, 17, 17)}
				ImageTransparency={0.2}
				ScaleType={"Fit"}
				Event={{
					MouseButton1Down: () => {
						this.setDown(true);
					},

					MouseButton1Up: () => {
						this.setDown(false);
					},
				}}
			>
				<textlabel
					BackgroundTransparency={1}
					Size={new UDim2(1, 0, 1, 0)}
					Rotation={this.props.rotation}
					Text={text}
					RichText={true}
					TextSize={20}
					Font={"GothamSemibold"}
					TextColor3={Color3.fromRGB(178, 178, 178)}
				/>
			</imagebutton>
		);
	}

	didMount() {
		this.janitor.Add(
			RunService.Heartbeat.Connect((dt) => {
				if (this.down.getValue() === true) {
					this.props.mouseButton1Down(dt);
				}
			}),
		);

		ContextActionService.BindAction(
			`turn${this.props.text}`,
			(_, state, input) => {
				if (state === Enum.UserInputState.Begin) {
					this.setDown(true);
				} else if (state === Enum.UserInputState.End) {
					this.setDown(false);
				}
			},
			false,
			this.props.keycode,
		);

		this.janitor.Add(() => {
			ContextActionService.UnbindAction(`turn${this.props.text}`);
		});
	}

	willUnmount() {
		this.janitor.Destroy();
	}
}
