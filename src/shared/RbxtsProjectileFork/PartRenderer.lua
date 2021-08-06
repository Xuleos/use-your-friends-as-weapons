local Workspace = game:GetService("Workspace")

local PartRenderer = {}
PartRenderer.ClassName = "PartRenderer"
PartRenderer.__index = PartRenderer

function PartRenderer.new(TemplatePart, Parent, OffsetCFrame)
	local self = setmetatable({
		OffsetCFrame = OffsetCFrame or CFrame.new();
		PhysicsIgnore = nil;
		TemplatePart = TemplatePart:Clone();
	}, PartRenderer)

	self.TemplatePart.Anchored = true
	self.TemplatePart.CanCollide = false
	self.TemplatePart.Massless = true
	self.TemplatePart.Parent = Parent or Workspace
	self.PhysicsIgnore = {self.TemplatePart}

	return self
end

function PartRenderer:Render(Position, DirectionUnit)
	self.TemplatePart.CFrame = CFrame.new(Position, Position + DirectionUnit) * self.OffsetCFrame
end

function PartRenderer:Destroy()
	self.TemplatePart:Destroy()
	setmetatable(self, nil)
end

function PartRenderer:__tostring()
	return "PartRenderer"
end

return {
	PartRenderer = PartRenderer;
}
