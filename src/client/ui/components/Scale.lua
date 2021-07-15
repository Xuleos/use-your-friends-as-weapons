local Workspace = game:GetService("Workspace")
local GuiService = game:GetService("GuiService")

local Camera = Workspace.CurrentCamera
local TopInset, BottomInset = GuiService:GetGuiInset()

local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Roact = TS.import(script, TS.getModule(script, "roact").src)

local Scale = Roact.PureComponent:extend("Scale")

function Scale:init()
	self:update()

	self.Listener = Camera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
		self:update()
	end)
end

function Scale:update()
	local currentSize = self.props.Size
	local viewportSize = Camera.ViewportSize - (TopInset + BottomInset)

	self:setState({
		Scale = 1 / math.max(currentSize.X / viewportSize.X, currentSize.Y / viewportSize.Y),
	})
end

function Scale:willUnmount()
	self.Listener:Disconnect()
end

function Scale:render()
	return Roact.createElement("UIScale", {
		Scale = self.state.Scale * self.props.Scale,
	})
end

Scale.defaultProps = {
	Scale = 1,
}

return Scale
