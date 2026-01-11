import type { UserConfig } from '@commitlint/types'

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-atom',
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Formatting, lint, white-space (no logic change)
        'refactor', // Code change without feature or bug fix
        'perf', // Performance improvement
        'test', // Tests
        'build', // Build system or external dependencies
        'ci', // CI configuration
        'chore', // Other changes (no src/test)
        'revert', // Revert previous commit
      ],
    ],

    'scope-enum': [
      2,
      'always',
      [
        'setup',
        'config',
        'deps',
        'docs',
        'release',
        'seo',

        // Application layers / domains
        'api',
        'web',
        'mobile',
        'backend',
        'frontend',
        'database',
        'auth',

        // UI / Frontend structure
        'ui',
        'components',
        'pages',
        'hooks',

        // Shared / Core
        'core',
        'shared',
        'utils',
        'services',

        // Infrastructure
        'infra',

        'other',
      ],
    ],
  },
}

export default Configuration
