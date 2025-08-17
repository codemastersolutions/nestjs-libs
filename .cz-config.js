module.exports = {
  types: [
    { value: 'feat', name: '✨ feat:     A new feature' },
    { value: 'fix', name: '🐛 fix:      A bug fix' },
    { value: 'docs', name: '📚 docs:     Documentation only changes' },
    { value: 'style', name: '💄 style:    Markup, white-space, formatting, missing semi-colons...' },
    { value: 'refactor', name: '♻️  refactor: A code change that neither fixes a bug nor adds a feature' },
    { value: 'perf', name: '⚡ perf:     A code change that improves performance' },
    { value: 'test', name: '✅ test:     Adding missing tests or correcting existing tests' },
    { value: 'chore', name: '🔧 chore:    Build process or auxiliary tool changes' },
    { value: 'ci', name: '👷 ci:       Changes to CI configuration files and scripts' },
    { value: 'build', name: '📦 build:    Changes that affect the build system or external dependencies' },
    { value: 'revert', name: '⏪ revert:   Reverts a previous commit' }
  ],

  scopes: [
    { name: 'better-auth' },
    { name: 'core' },
    { name: 'config' },
    { name: 'docs' },
    { name: 'deps' },
    { name: 'ci' },
    { name: 'release' }
  ],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // it needs to match the value for field type. Eg.: 'fix'
  scopeOverrides: {
    fix: [
      { name: 'merge' },
      { name: 'style' },
      { name: 'e2eTest' },
      { name: 'unitTest' }
    ]
  },

  // override the messages, defaults are as follows
  messages: {
    type: "Select the type of change that you're committing:",
    scope: '\nDenote the SCOPE of this change (optional):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  skipQuestions: [],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
};