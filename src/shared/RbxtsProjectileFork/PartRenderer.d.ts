/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { IRenderer } from "./IRenderer";
/**
 * Renders a BasePart object as a projectile renderer
 */
export declare class PartRenderer implements IRenderer {
	PhysicsIgnore: ReadonlyArray<Instance>;
	private TemplatePart;
	private OffsetCFrame;
	/**
	 * Creates a new PartRenderer with a clone of the given `BasePart`
	 * @param TemplatePart The base part to clone
	 * @param OffsetCFrame The offset CFrame to apply every frame - applied as following: `new CFrame(position, position.add(directionUnit)).mul(offsetCFrame)`
	 */
	constructor(TemplatePart: BasePart, Parent?: Instance, OffsetCFrame?: CFrame);
	Destroy(): void;
	Render(Position: Vector3, DirectionUnit: Vector3): void;
}
