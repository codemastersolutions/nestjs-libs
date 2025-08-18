/**
 * Módulo para análise de Conventional Commits
 * Implementa a especificação: https://www.conventionalcommits.org/
 */

class ConventionalCommitsAnalyzer {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    
    // Tipos de commit reconhecidos e seus impactos na versão
    this.commitTypes = {
      // Mudanças que quebram compatibilidade (major)
      'BREAKING CHANGE': { impact: 'major', description: 'Mudança que quebra compatibilidade' },
      
      // Novas funcionalidades (minor)
      'feat': { impact: 'minor', description: 'Nova funcionalidade' },
      
      // Correções de bugs (patch)
      'fix': { impact: 'patch', description: 'Correção de bug' },
      'perf': { impact: 'patch', description: 'Melhoria de performance' },
      
      // Outros tipos (não afetam versão semântica)
      'build': { impact: 'none', description: 'Mudanças no sistema de build' },
      'chore': { impact: 'none', description: 'Tarefas de manutenção' },
      'ci': { impact: 'none', description: 'Mudanças na CI/CD' },
      'docs': { impact: 'none', description: 'Documentação' },
      'refactor': { impact: 'none', description: 'Refatoração de código' },
      'revert': { impact: 'none', description: 'Reversão de commit' },
      'style': { impact: 'none', description: 'Formatação de código' },
      'test': { impact: 'none', description: 'Testes' }
    };
  }

  /**
   * Analisa uma lista de commits e retorna informações estruturadas
   * @param {Array} commits - Lista de commits com hash, subject e body
   * @returns {Object} Análise estruturada dos commits
   */
  analyzeCommits(commits) {
    if (this.verbose) {
      console.log(`🔍 Analisando ${commits.length} commits...`);
    }

    const analysis = {
      major: [],
      minor: [],
      patch: [],
      other: [],
      breakingChanges: [],
      summary: {
        totalCommits: commits.length,
        conventionalCommits: 0,
        nonConventionalCommits: 0,
        typeDistribution: {}
      }
    };

    commits.forEach((commit, index) => {
      const parsedCommit = this.parseCommit(commit);
      
      if (this.verbose) {
        console.log(`  ${index + 1}. ${parsedCommit.isConventional ? '✅' : '❌'} ${commit.subject}`);
      }

      // Atualizar estatísticas
      if (parsedCommit.isConventional) {
        analysis.summary.conventionalCommits++;
        const type = parsedCommit.type;
        analysis.summary.typeDistribution[type] = (analysis.summary.typeDistribution[type] || 0) + 1;
      } else {
        analysis.summary.nonConventionalCommits++;
      }

      // Categorizar commit baseado no impacto
      this.categorizeCommit(parsedCommit, analysis);
    });

    // Determinar o tipo de bump necessário
    analysis.recommendedBump = this.determineBumpType(analysis);

    if (this.verbose) {
      this.printAnalysisSummary(analysis);
    }

    return analysis;
  }

  /**
   * Faz o parse de um commit individual
   * @param {Object} commit - Commit com hash, subject e body
   * @returns {Object} Commit parseado
   */
  parseCommit(commit) {
    const result = {
      hash: commit.hash,
      originalSubject: commit.subject,
      originalBody: commit.body || '',
      isConventional: false,
      type: null,
      scope: null,
      description: null,
      isBreaking: false,
      breakingChangeDescription: null,
      impact: 'none'
    };

    // Regex para conventional commits: type(scope)!: description
    const conventionalRegex = /^(\w+)(\(([^)]+)\))?(!)?: (.+)$/;
    const match = commit.subject.match(conventionalRegex);

    if (match) {
      const [, type, , scope, breaking, description] = match;
      
      result.isConventional = true;
      result.type = type.toLowerCase();
      result.scope = scope || null;
      result.description = description.trim();
      result.isBreaking = breaking === '!';

      // Verificar se há BREAKING CHANGE no body
      const breakingChangeMatch = commit.body?.match(/BREAKING CHANGE:\s*(.+)/i);
      if (breakingChangeMatch) {
        result.isBreaking = true;
        result.breakingChangeDescription = breakingChangeMatch[1].trim();
      }

      // Determinar impacto na versão
      if (result.isBreaking) {
        result.impact = 'major';
      } else if (this.commitTypes[result.type]) {
        result.impact = this.commitTypes[result.type].impact;
      } else {
        result.impact = 'none';
      }
    } else {
      // Commit não convencional - tratar como patch se parecer ser uma correção
      result.description = commit.subject;
      if (this.looksLikeFix(commit.subject)) {
        result.impact = 'patch';
        result.type = 'fix';
      }
    }

    return result;
  }

  /**
   * Verifica se um commit não-convencional parece ser uma correção
   * @param {string} subject - Assunto do commit
   * @returns {boolean}
   */
  looksLikeFix(subject) {
    const fixKeywords = [
      'fix', 'fixes', 'fixed', 'fixing',
      'bug', 'bugfix', 'hotfix',
      'patch', 'repair', 'resolve',
      'correct', 'corrects', 'correction'
    ];

    const lowerSubject = subject.toLowerCase();
    return fixKeywords.some(keyword => lowerSubject.includes(keyword));
  }

  /**
   * Categoriza um commit parseado nas diferentes categorias de análise
   * @param {Object} parsedCommit - Commit parseado
   * @param {Object} analysis - Objeto de análise para atualizar
   */
  categorizeCommit(parsedCommit, analysis) {
    const commitInfo = {
      hash: parsedCommit.hash,
      type: parsedCommit.type || 'other',
      scope: parsedCommit.scope,
      description: parsedCommit.description,
      isBreaking: parsedCommit.isBreaking,
      isConventional: parsedCommit.isConventional,
      fullMessage: parsedCommit.originalSubject,
      impact: parsedCommit.impact
    };

    // Adicionar às categorias apropriadas
    switch (parsedCommit.impact) {
      case 'major':
        analysis.major.push(commitInfo);
        if (parsedCommit.isBreaking) {
          analysis.breakingChanges.push({
            ...commitInfo,
            breakingChangeDescription: parsedCommit.breakingChangeDescription
          });
        }
        break;
      
      case 'minor':
        analysis.minor.push(commitInfo);
        break;
      
      case 'patch':
        analysis.patch.push(commitInfo);
        break;
      
      default:
        analysis.other.push(commitInfo);
        break;
    }
  }

  /**
   * Determina o tipo de bump baseado na análise
   * @param {Object} analysis - Análise dos commits
   * @returns {string} Tipo de bump: 'major', 'minor', 'patch' ou 'none'
   */
  determineBumpType(analysis) {
    if (analysis.major.length > 0) {
      return 'major';
    }
    if (analysis.minor.length > 0) {
      return 'minor';
    }
    if (analysis.patch.length > 0) {
      return 'patch';
    }
    return 'none';
  }

  /**
   * Imprime um resumo da análise
   * @param {Object} analysis - Análise dos commits
   */
  printAnalysisSummary(analysis) {
    console.log('\n📊 RESUMO DA ANÁLISE:');
    console.log(`   Total de commits: ${analysis.summary.totalCommits}`);
    console.log(`   Conventional commits: ${analysis.summary.conventionalCommits}`);
    console.log(`   Não-conventional: ${analysis.summary.nonConventionalCommits}`);
    console.log(`   Bump recomendado: ${analysis.recommendedBump}`);
    
    console.log('\n📈 IMPACTO NA VERSÃO:');
    console.log(`   Major (breaking): ${analysis.major.length}`);
    console.log(`   Minor (features): ${analysis.minor.length}`);
    console.log(`   Patch (fixes): ${analysis.patch.length}`);
    console.log(`   Outros: ${analysis.other.length}`);
    
    if (Object.keys(analysis.summary.typeDistribution).length > 0) {
      console.log('\n🏷️ DISTRIBUIÇÃO POR TIPO:');
      Object.entries(analysis.summary.typeDistribution)
        .sort(([,a], [,b]) => b - a)
        .forEach(([type, count]) => {
          const typeInfo = this.commitTypes[type] || { description: 'Tipo desconhecido' };
          console.log(`   ${type}: ${count} (${typeInfo.description})`);
        });
    }
  }

  /**
   * Gera release notes baseadas na análise
   * @param {Object} analysis - Análise dos commits
   * @param {string} currentVersion - Versão atual
   * @param {string} newVersion - Nova versão
   * @returns {string} Release notes em markdown
   */
  generateReleaseNotes(analysis, currentVersion, newVersion) {
    let notes = `# Release ${newVersion}\n\n`;
    notes += `**Versão anterior:** ${currentVersion}\n`;
    notes += `**Tipo de release:** ${analysis.recommendedBump}\n`;
    notes += `**Commits analisados:** ${analysis.summary.totalCommits}\n\n`;

    // Breaking Changes
    if (analysis.breakingChanges.length > 0) {
      notes += `## 🚨 Breaking Changes\n\n`;
      analysis.breakingChanges.forEach(commit => {
        notes += `- **${commit.type}${commit.scope ? `(${commit.scope})` : ''}:** ${commit.description}`;
        if (commit.breakingChangeDescription) {
          notes += `\n  > ${commit.breakingChangeDescription}`;
        }
        notes += `\n`;
      });
      notes += '\n';
    }

    // Features
    if (analysis.minor.length > 0) {
      notes += `## ✨ Novas Funcionalidades\n\n`;
      analysis.minor.forEach(commit => {
        notes += `- **${commit.type}${commit.scope ? `(${commit.scope})` : ''}:** ${commit.description}\n`;
      });
      notes += '\n';
    }

    // Bug Fixes
    if (analysis.patch.length > 0) {
      notes += `## 🐛 Correções\n\n`;
      analysis.patch.forEach(commit => {
        notes += `- **${commit.type}${commit.scope ? `(${commit.scope})` : ''}:** ${commit.description}\n`;
      });
      notes += '\n';
    }

    // Other changes
    if (analysis.other.length > 0) {
      notes += `## 🔧 Outras Mudanças\n\n`;
      analysis.other.forEach(commit => {
        const prefix = commit.isConventional ? 
          `**${commit.type}${commit.scope ? `(${commit.scope})` : ''}:**` : '';
        notes += `- ${prefix} ${commit.description}\n`;
      });
      notes += '\n';
    }

    // Estatísticas
    notes += `## 📊 Estatísticas\n\n`;
    notes += `- Total de commits: ${analysis.summary.totalCommits}\n`;
    notes += `- Conventional commits: ${analysis.summary.conventionalCommits}\n`;
    notes += `- Commits com impacto na versão: ${analysis.major.length + analysis.minor.length + analysis.patch.length}\n`;

    return notes;
  }

  /**
   * Valida se uma string segue o padrão de conventional commit
   * @param {string} commitMessage - Mensagem do commit
   * @returns {boolean}
   */
  static isConventionalCommit(commitMessage) {
    const conventionalRegex = /^(\w+)(\(([^)]+)\))?(!)?: (.+)$/;
    return conventionalRegex.test(commitMessage);
  }

  /**
   * Obtém lista de tipos de commit suportados
   * @returns {Array} Lista de tipos com descrições
   */
  getSupportedTypes() {
    return Object.entries(this.commitTypes).map(([type, info]) => ({
      type,
      impact: info.impact,
      description: info.description
    }));
  }
}

module.exports = ConventionalCommitsAnalyzer;