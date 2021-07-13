local Workspace = game:GetService("Workspace")
local DEFAULT_RADIUS = 0.05

local CylinderRenderer = {}
CylinderRenderer.ClassName = "CylinderRenderer"
CylinderRenderer.__index = CylinderRenderer

local Recyclables = {}
local RecyclablesLength = 0

function CylinderRenderer.new(Color, Radius)
	return setmetatable({
		CylinderHandleAdornment = CylinderRenderer:CreateCylinderAdornment(Color, Radius);
		PhysicsIgnore = {};
		PreviousPosition = nil;
	}, CylinderRenderer)
end

function CylinderRenderer:CreateCylinderAdornment(Color, Radius)
	local Line
	if RecyclablesLength > 0 then
		Line = Recyclables[RecyclablesLength]
		Recyclables[RecyclablesLength] = nil
		RecyclablesLength -= 1
	else
		Line = Instance.new("CylinderHandleAdornment")
	end

	Line.Adornee = Workspace.Terrain
	Line.Color3 = Color
	Line.Radius = Radius or DEFAULT_RADIUS
	Line.Parent = Workspace.Terrain
	return Line
end

function CylinderRenderer:Render(Position: Vector3, DirectionUnit: Vector3)
	--- @type Vector3
	local PreviousPosition = self.PreviousPosition
	if PreviousPosition then
		local CylinderHandleAdornment = self.CylinderHandleAdornment
		local Length = (Position - PreviousPosition).Magnitude
		CylinderHandleAdornment.Height = Length
		CylinderHandleAdornment.CFrame = CFrame.new(Position, Position + DirectionUnit) * CFrame.new(0, 0, -Length / 2)
	end

	self.PreviousPosition = Position
end

function CylinderRenderer:Destroy()
	self.CylinderHandleAdornment.Adornee = nil
	RecyclablesLength += 1
	Recyclables[RecyclablesLength] = self.CylinderHandleAdornment
	setmetatable(self, nil)
end

return {
	CylinderRenderer = CylinderRenderer;
}
