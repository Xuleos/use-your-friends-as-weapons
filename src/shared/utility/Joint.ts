namespace Joint {
	export function weld(part0: BasePart, part1: BasePart, jointType: "Motor6D" | "Weld", parent?: BasePart) {
		const weld = new Instance(jointType);
		weld.Part0 = part0;
		weld.Part1 = part1;
		weld.C0 = new CFrame();
		weld.C1 = part1.CFrame.ToObjectSpace(part0.CFrame);
		weld.Parent = parent !== undefined ? parent : part0;
	}
}

export = Joint;
