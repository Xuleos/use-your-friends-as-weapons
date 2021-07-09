local defaultCharacters = string.split("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", "")
return function(length, entries, separator)
	length = length or 5
	entries = entries or defaultCharacters
	separator = separator or ""

	local entriesLength = #entries
	local result = table.create(length)

	for i = 1, length do
		result[i] = entries[math.random(1, entriesLength)]
	end

	return table.concat(result, separator)
end
