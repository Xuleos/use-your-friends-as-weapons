export function takeDamageToHumanoid(humanoid: Humanoid, damage: number) {
	if (humanoid.Health - damage <= 0) {
		//remove welds
		if (humanoid.Parent) {
			for (const weld of humanoid.Parent.GetChildren()) {
				if (weld.IsA("JointInstance")) {
					weld.Destroy();
				}
			}
		}
	}

	humanoid.TakeDamage(damage);
}
