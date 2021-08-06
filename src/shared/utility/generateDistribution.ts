//0 clear where i got this lmao but i dont think its my code. Found it in the repo for one of my older games

function generateDistribution(parts: Array<BasePart>) {
	const totalArea = parts.reduce((sum, part) => {
		return sum + (part.Size.X + part.Size.Y);
	}, 0);
	const cumulativeDistribution: Array<number> = [];

	for (let i = 0; i < parts.size(); i++) {
		const part = parts[i];

		// eslint-disable-next-line roblox-ts/lua-truthiness
		const lastValue = cumulativeDistribution[i - 1] || 0;
		const nextValue = lastValue + (part.Size.X + part.Size.Y) / totalArea;

		cumulativeDistribution.push(nextValue);
	}

	return cumulativeDistribution;
}

export = generateDistribution;
