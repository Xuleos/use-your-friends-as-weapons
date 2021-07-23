import { Service, OnStart, OnTick } from "@rbxts/flamework";
import Log from "@rbxts/log";
import { CollectionService, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import RandomPicker from "@rbxts/weighted-random-picker";
import { $dbg } from "rbxts-transform-debug";
import generateDistribution from "shared/utility/generateDistribution";
import { getRandomPositionOnPart } from "shared/utility/getRandomPositionOnPart";

@Service({})
export class SpawningService implements OnStart, OnTick {
	private random = new Random();
	private spawnRoll = new RandomPicker<Model | (Tool & { Handle: BasePart })>([ReplicatedStorage.assets.Dummy]);

	private nextSpawn = -1;
	private spawnParts: Array<BasePart> = [];

	onStart() {
		const spawnParts = CollectionService.GetTagged("SpawnPart");

		for (const spawnPart of spawnParts) {
			if (spawnPart.IsA("BasePart")) {
				this.spawnParts.push(spawnPart);
			}
		}

		CollectionService.GetInstanceAddedSignal("SpawnPart").Connect((instance) => {
			if (instance.IsA("BasePart")) {
				this.spawnParts.push(instance);
			}
		});

		CollectionService.GetInstanceRemovedSignal("SpawnPart").Connect((instance) => {
			if (instance.IsA("BasePart")) {
				const index = this.spawnParts.indexOf(instance);

				if (index > -1) {
					this.spawnParts.unorderedRemove(index);
				}
			}
		});

		//sorry
		const structures = ReplicatedStorage.assets.structures.GetChildren().filter(
			t.union(
				t.instanceIsA("Model"),
				t.intersection(
					t.instanceIsA("Tool"),
					t.children({
						Handle: t.instanceIsA("BasePart"),
					}),
				),
			),
		);
		const weightTable: Array<number> = [];

		for (const [index, structure] of pairs(structures)) {
			const weight = structure.GetAttribute("weight");

			if (t.number(weight)) {
				weightTable[index - 1] = weight;
			} else {
				weightTable[index - 1] = 1;
			}
		}

		this.spawnRoll = new RandomPicker(structures, weightTable);
	}

	onTick() {
		if (time() < this.nextSpawn) {
			return;
		}

		this.nextSpawn = time() + 5;

		if (this.spawnParts.size() === 0) {
			Log.Warn("There are no parts to spawn from");
			return;
		}

		const distribution = generateDistribution(this.spawnParts);
		const randomNumber = this.random.NextNumber();
		const index = distribution.findIndex((v) => v > randomNumber);

		const part = this.spawnParts[index];
		const randomPosition = getRandomPositionOnPart(this.random, part);
		const results = Workspace.Raycast(randomPosition, new Vector3(0, -1, 0).mul(100));

		if (results) {
			const chosen = this.spawnRoll();

			let yAdjustment = 0;
			if (chosen.IsA("Model") && chosen.PrimaryPart) {
				yAdjustment = chosen.PrimaryPart.Size.Y / 2;
			} else if (chosen.IsA("Tool")) {
				yAdjustment = chosen.Handle.Size.Y / 2;
			}

			const clone = chosen.Clone();

			if (clone.IsA("Model")) {
				clone.SetPrimaryPartCFrame(new CFrame(results.Position.add(new Vector3(0, yAdjustment, 0))));
			} else if (clone.IsA("Tool")) {
				clone.Handle.Anchored = true;
				clone.Handle.CFrame = new CFrame(results.Position.add(new Vector3(0, yAdjustment, 0)));
			} else {
				Log.Warn("What");
			}

			clone.Parent = Workspace;
			CollectionService.AddTag(clone, "Debris");
		}
	}
}
