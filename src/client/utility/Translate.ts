import Log from "@rbxts/log";
import { LocalizationService } from "@rbxts/services";

namespace Translator {
	const localizationTable = LocalizationService.WaitForChild("LocalizationTable", 5);

	if (!localizationTable || !localizationTable.IsA("LocalizationTable")) {
		error("Could not find localization table");
	}

	const translator = localizationTable.GetTranslator(LocalizationService.RobloxLocaleId);
	const backupTranslator = localizationTable.GetTranslator(localizationTable.SourceLocaleId);

	export function formatByKey(key: string, ...data: Array<unknown>) {
		const results = opcall(() => {
			return translator.FormatByKey(key, data);
		});

		if (results.success) {
			return results.value;
		} else {
			warn(results.error);

			const englishResults = opcall(() => {
				return backupTranslator.FormatByKey(key, data);
			});

			if (englishResults.success === true) {
				return englishResults.value;
			} else {
				error(englishResults.error);
			}
		}
	}

	export function translate(context: Instance, source: string) {
		if (translator === undefined) {
			const results = opcall(() => {
				return backupTranslator.Translate(context, source);
			});

			if (results.success === true) {
				return results.value;
			} else {
				warn(results.error);
				return source;
			}
		}

		const results = opcall(() => {
			return translator.Translate(context, source);
		});

		if (results.success) {
			return results.value;
		} else {
			warn(results.error);

			const englishResults = opcall(() => {
				return backupTranslator.Translate(context, source);
			});

			if (englishResults.success === true) {
				return englishResults.value;
			} else {
				warn(englishResults.error);
				return source;
			}
		}
	}
}

export = Translator;
