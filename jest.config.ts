import type { Config } from "@jest/types";
import { defaults } from "jest-config";

const config: Config.InitialOptions = {
	testEnvironment: "node",
	preset: "ts-jest",
	testRegex: "/tests/.*\\.test\\.(js|ts)$",
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
	clearMocks: true,
	transform: {
		"^.+\\.test.ts$": [
			"ts-jest",
			{
				tsconfig: "<rootDir>/src/__tests__/tsconfig.json",
				diagnostics: true,
			},
		],
	},
	moduleNameMapper: {
		// Ignore '.js' at the end of imports; part of ESM support.
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	// TODO: Remove this once the following issue is resolved:
	testNamePattern: "^((?!MUST\\ require\\ a\\ request\\ body\\ on\\ POST).)*$",
};

export default config;
