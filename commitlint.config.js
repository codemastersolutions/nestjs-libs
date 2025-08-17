module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Documentação
        'style',    // Formatação, ponto e vírgula ausente, etc; sem mudança de código
        'refactor', // Refatoração de código que não corrige bug nem adiciona funcionalidade
        'perf',     // Mudança de código que melhora performance
        'test',     // Adição de testes ausentes ou correção de testes existentes
        'chore',    // Mudanças no processo de build ou ferramentas auxiliares
        'ci',       // Mudanças nos arquivos e scripts de CI
        'build',    // Mudanças que afetam o sistema de build ou dependências externas
        'revert'    // Reverte um commit anterior
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100]
  }
};