/* eslint-disable n/no-unpublished-import */
import { defineConfig } from '@fullstacksjs/eslint-config';

export default defineConfig({
    node: true,
    prettier: true,
    typescript: {
        projects: true,
        tsconfigRootDir: './tsconfig.json',
    },
    rules: {
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
    },
});
