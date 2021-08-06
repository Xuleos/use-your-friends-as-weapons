/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { IRenderer } from "./IRenderer";
/**
 * A lightweight renderer that uses CylinderHandleAdornments to render the movement of projectiles frame by frame
 * Unless you _need_ a more specific renderer, this is highly encouraged!
 */
export declare class CylinderRenderer implements IRenderer {
	readonly PhysicsIgnore: ReadonlyArray<Instance>;
	private CylinderHandleAdornment;
	private PreviousPosition?;
	constructor(Color: Color3, Radius?: number);
	private static CreateCylinderAdornment;
	Destroy(): void;
	Render(Position: Vector3, DirectionUnit: Vector3): void;
}
