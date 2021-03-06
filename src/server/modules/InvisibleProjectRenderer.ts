import { IRenderer } from "shared/RbxtsProjectileFork";

/**
 * An empty renderer
 */
export class InvisibleProjectRenderer implements IRenderer {
	public readonly PhysicsIgnore: ReadonlyArray<Instance> = [];

	public constructor() {
		//
	}

	public Destroy() {
		//
	}

	public Render(position: Vector3, directionUnit: Vector3) {
		//
	}
}
