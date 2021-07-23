export function getRandomPositionOnPart(random: Random, part: BasePart) {
	const position = part.Position;
	const size = part.Size;

	const minX = position.X - size.X / 2;
	const maxX = position.X + size.X / 2;

	const minY = position.Y - size.Y / 2;
	const maxY = position.Y + size.Y / 2;

	const minZ = position.Z - size.Z / 2;
	const maxZ = position.Z + size.Z / 2;

	const X = random.NextNumber(minX, maxX);
	const Y = random.NextNumber(minY, maxY);
	const Z = random.NextNumber(minZ, maxZ);

	return new Vector3(X, Y, Z);
}
