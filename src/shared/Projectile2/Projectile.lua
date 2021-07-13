local Workspace = game:GetService("Workspace")
local RunService = game:GetService("RunService")
local CylinderRenderer = require(script.Parent.CylinderRenderer).CylinderRenderer

local Projectile = {}

Projectile.ClassName = "Projectile"
Projectile.ElapsedTime = 0
Projectile.GlobalPhysicsIgnore = {}
Projectile.Projectiles = {}
Projectile.RemoveList = {}

Projectile.__index = Projectile

function Projectile.new(Configuration)
	local Renderer = Configuration.Renderer
	if Renderer == nil then
		Renderer = CylinderRenderer.new(Color3.new(1, 1, 1))
	end

	local Acceleration = Configuration.Acceleration
	local Position = Configuration.Position
	local Velocity = Configuration.Velocity

	local self = setmetatable({
		DistanceSquare = 0,
		AccelerationX = Acceleration.X,
		AccelerationY = Acceleration.Y,
		AccelerationZ = Acceleration.Z,

		PositionX = Position.X,
		PositionY = Position.Y,
		PositionZ = Position.Z,

		VelocityX = Velocity.X,
		VelocityY = Velocity.Y,
		VelocityZ = Velocity.Z,

		Bounce = not not Configuration.Bounce,
		CanCollide = not not not Configuration.CanCollide,
		Lifetime = Projectile.ElapsedTime + (Configuration.Lifespan or 2),
		MaxRangeSquare = (Configuration.MaxRange or 5000) ^ 2,
		MinExitVelocity = Configuration.MinExitVelocity or 100,

		PhysicsIgnore = nil,
		Penetration = not not Configuration.Penetration,
		Resistance = Configuration.Resistance or 1,
		OnTouch = Configuration.OnTouch,
		Renderer = Renderer,
	}, Projectile)

	local PhysicsIgnore = {}
	local Length = 0
	for _, Object in ipairs(Projectile.GlobalPhysicsIgnore) do
		Length += 1
		PhysicsIgnore[Length] = Object
	end

	for _, Object in ipairs(Renderer.PhysicsIgnore) do
		Length += 1
		PhysicsIgnore[Length] = Object
	end

	for _, Object in ipairs(Configuration.PhysicsIgnore or {}) do
		Length += 1
		PhysicsIgnore[Length] = Object
	end

	self.PhysicsIgnore = PhysicsIgnore
	table.insert(Projectile.Projectiles, self)

	if Configuration.ElapsedTime then
		self:Step(Configuration.ElapsedTime)
	end
	
	return self
end

function Projectile.AddToPhysicsIgnore(Object)
	local GlobalPhysicsIgnore = Projectile.GlobalPhysicsIgnore
	if not table.find(GlobalPhysicsIgnore, Object) then
		table.insert(GlobalPhysicsIgnore, Object)
		Object:GetPropertyChangedSignal("Parent"):Connect(function()
			if not Object.Parent then
				local Index = table.find(GlobalPhysicsIgnore, Object)
				if Index then
					table.remove(GlobalPhysicsIgnore, Index)
				end
			end
		end)
	end
end

function Projectile.Raycast(Start: Vector3, Direction: Vector3, IgnoreList: { Instance })
	local Parameters = RaycastParams.new()
	Parameters.FilterType = Enum.RaycastFilterType.Blacklist
	Parameters.FilterDescendantsInstances = IgnoreList or {}
	Parameters.IgnoreWater = true

	return Workspace:Raycast(Start, Direction, Parameters)
end

function Projectile.RaycastLegacy(Start: Vector3, Direction: Vector3, IgnoreList: { Instance })
	local Parameters = RaycastParams.new()
	Parameters.FilterType = Enum.RaycastFilterType.Blacklist
	Parameters.FilterDescendantsInstances = IgnoreList or {}
	Parameters.IgnoreWater = true

	local RaycastResult = Workspace:Raycast(Start, Direction, Parameters)
	if RaycastResult then
		return RaycastResult.Instance, RaycastResult.Position, RaycastResult.Normal, RaycastResult.Material
	else
		return nil, Start + Direction, Vector3.new(), Enum.Material.Air
	end
end

function Projectile:Step(DeltaTime)
	local PositionXOriginal = self.PositionX
	local PositionYOriginal = self.PositionY
	local PositionZOriginal = self.PositionZ
	local VelocityXOriginal = self.VelocityX
	local VelocityYOriginal = self.VelocityY
	local VelocityZOriginal = self.VelocityZ

	local VelocityX = VelocityXOriginal + DeltaTime * self.AccelerationX
	local VelocityY = VelocityYOriginal + DeltaTime * self.AccelerationY
	local VelocityZ = VelocityZOriginal + DeltaTime * self.AccelerationZ

	self.VelocityX = VelocityX
	self.VelocityY = VelocityY
	self.VelocityZ = VelocityZ

	local DeltaX = DeltaTime * (VelocityXOriginal + VelocityX) / 2
	local DeltaY = DeltaTime * (VelocityYOriginal + VelocityY) / 2
	local DeltaZ = DeltaTime * (VelocityZOriginal + VelocityZ) / 2

	if self.CanCollide and (DeltaX ~= 0 or DeltaY ~= 0 or DeltaZ ~= 0) then
		local Direction = Vector3.new(DeltaX, DeltaY, DeltaZ)
		local StartPosition = Vector3.new(PositionXOriginal, PositionYOriginal, PositionZOriginal)

		local PhysicsIgnore = self.PhysicsIgnore
		local RaycastResult = Projectile.Raycast(StartPosition, Direction, PhysicsIgnore)
		local Position = RaycastResult and RaycastResult.Position or StartPosition + Direction

		if RaycastResult then
			local Part = RaycastResult.Instance

			local DidPenetrate = false
			if self.Penetration then
				local UnitDirection = Direction.Unit
				local ExitDirection = UnitDirection * Part.Size.Magnitude
				local _, NextPosition = Projectile.RaycastLegacy(Position, ExitDirection, PhysicsIgnore)
				local _, Exit = Projectile.RaycastLegacy(NextPosition, ExitDirection * -1, PhysicsIgnore)
				local Distance = UnitDirection:Dot(Exit - Position)

				if Distance > 0 then
					local CurrentVelocity =
						Vector3.new(VelocityXOriginal, VelocityYOriginal, VelocityZOriginal).Magnitude
					if Distance < math.log(CurrentVelocity / self.MinExitVelocity) / self.Resistance then
						self.PositionX = Exit.X
						self.PositionY = Exit.Y
						self.PositionZ = Exit.Z

						local ResistanceValue = math.exp(-self.Resistance * Distance)
						VelocityX *= ResistanceValue
						VelocityY *= ResistanceValue
						VelocityZ *= ResistanceValue

						self.VelocityX = VelocityX
						self.VelocityY = VelocityY
						self.VelocityZ = VelocityZ
						DidPenetrate = true
					end
				end
			end

			local Normal = RaycastResult.Normal
			if not DidPenetrate then
				self.PositionX = Position.X
				self.PositionY = Position.Y
				self.PositionZ = Position.Z
				if self.Bounce then
					local VelocityDot = -2 * (VelocityX * Normal.X + VelocityY * Normal.Y + VelocityZ * Normal.Z)
					VelocityX = 0.9 * (VelocityDot * Normal.X + VelocityX)
					VelocityY = 0.9 * (VelocityDot * Normal.Y + VelocityY)
					VelocityZ = 0.9 * (VelocityDot * Normal.Z + VelocityZ)

					self.VelocityX = VelocityX
					self.VelocityY = VelocityY
					self.VelocityZ = VelocityZ
				else
					self:Remove()
				end
			end

			local OnTouch = self.OnTouch
			if
				OnTouch
				and (
					OnTouch(Part, Position, Normal, Vector3.new(VelocityX, VelocityY, VelocityZ).Unit) == true
				)
			then
				return self:Remove(true)
			end
		else
			self.PositionX = Position.X
			self.PositionY = Position.Y
			self.PositionZ = Position.Z
		end

		DeltaX = self.PositionX - PositionXOriginal
		DeltaY = self.PositionY - PositionYOriginal
		DeltaZ = self.PositionZ - PositionZOriginal
	else
		self.PositionX += DeltaX
		self.PositionY += DeltaY
		self.PositionZ += DeltaZ
	end

	local DistanceSquare = self.DistanceSquare + (DeltaX ^ 2 + DeltaY ^ 2 + DeltaZ ^ 2)
	self.DistanceSquare = DistanceSquare
	if DistanceSquare > self.MaxRangeSquare then
		return self:Remove()
	end

	self.Renderer:Render(
		Vector3.new(PositionXOriginal, PositionYOriginal, PositionZOriginal),
		Vector3.new(DeltaX, DeltaY, DeltaZ).Unit
	)
end

function Projectile:Remove(Instantly)
	if Instantly then
		self.Renderer:Destroy()
	end

	Projectile.RemoveList[self] = true
end

local RaycastIgnore = Workspace:FindFirstChild("Ignore")
if RaycastIgnore then
	table.insert(Projectile.GlobalPhysicsIgnore, RaycastIgnore)
end

RunService.Heartbeat:Connect(function(DeltaTime)
	debug.profilebegin("LuauHeartbeat")
	local ElapsedTime = Projectile.ElapsedTime + DeltaTime
	Projectile.ElapsedTime = ElapsedTime

	local NewProjectiles = {}
	local RemoveList = Projectile.RemoveList
	local Length = 0

	for _, CurrentProjectile in ipairs(Projectile.Projectiles) do
		if RemoveList[CurrentProjectile] ~= nil or CurrentProjectile.Lifetime < ElapsedTime then
			CurrentProjectile.Renderer:Destroy()
			RemoveList[CurrentProjectile] = nil
		else
			Length += 1
			NewProjectiles[Length] = CurrentProjectile
			CurrentProjectile:Step(DeltaTime)
		end
	end

	Projectile.Projectiles = NewProjectiles
	debug.profileend()
end)

return {
	Projectile = Projectile,
}
