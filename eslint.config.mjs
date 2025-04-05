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
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
        '@typescript-eslint/no-misused-promises': 'off',
    },
});
