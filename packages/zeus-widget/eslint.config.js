import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

import baseConfig from "../../eslint.config.js";

export default tseslint.config([baseConfig, globalIgnores(["dist"])]);
