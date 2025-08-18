#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ConventionalCommitsAnalyzer = require('./conventional-commits');
const VersionManager = require('./version-manager');

/**
 * Simulador da GitHub Action build-and-release.yml
 * Executa localmente toda a lógica de detecção de commits, versionamento e release
 */
class ReleaseSimulator {
  constructor(options = {}) {
    this.library = options.library || 'better-auth';
    this.dryRun = options.dryRun !== false; // Por padrão é dry-run
    this.verbose = options.verbose || false;
    this.workingDir = process.cwd();
    // Configurações
    const PROJECT_ROOT = path.resolve(__dirname, '..');
    const LIBS_DIR = path.join(PROJECT_ROOT, 'libs');
    this.libraryPath = path.join(LIBS_DIR, this.library);
    
    this.log('🚀 Iniciando simulador de release');
    this.log(`📦 Biblioteca: ${this.library}`);
    this.log(`🔍 Modo: ${this.dryRun ? 'DRY-RUN (simulação)' : 'EXECUÇÃO REAL'}`);
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍'
    }[level] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  exec(command, options = {}) {
    if (this.verbose) {
      this.log(`Executando: ${command}`, 'debug');
    }
    
    try {
      const result = execSync(command, {
        cwd: this.workingDir,
        encoding: 'utf8',
        stdio: this.verbose ? 'inherit' : 'pipe',
        ...options
      });
      return result?.toString().trim();
    } catch (error) {
      this.log(`Erro ao executar comando: ${command}`, 'error');
      this.log(`Erro: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Verifica se a biblioteca existe
   */
  checkLibraryExists() {
    this.log('🔍 Verificando se a biblioteca existe...');
    
    if (!fs.existsSync(this.libraryPath)) {
      throw new Error(`Biblioteca '${this.library}' não encontrada em: ${this.libraryPath}`);
    }
    
    const packageJsonPath = path.join(this.libraryPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`package.json não encontrado em: ${packageJsonPath}`);
    }
    
    this.log('✅ Biblioteca encontrada');
    return true;
  }

  /**
   * Obtém a versão atual da biblioteca
   */
  getCurrentVersion() {
    this.log('📋 Obtendo versão atual...');
    
    const packageJsonPath = path.join(this.libraryPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    this.log(`📦 Versão atual: ${packageJson.version}`);
    return packageJson.version;
  }

  /**
   * Obtém a última tag da biblioteca
   */
  getLastTag() {
    this.log('🏷️ Buscando última tag...');
    
    try {
      const tags = this.exec(`git tag -l "${this.library}-v*" --sort=-version:refname`);
      const lastTag = tags.split('\n')[0];
      
      if (lastTag) {
        this.log(`🏷️ Última tag encontrada: ${lastTag}`);
        return lastTag;
      } else {
        this.log('🏷️ Nenhuma tag encontrada, usando commit inicial');
        return null;
      }
    } catch (error) {
      this.log('⚠️ Erro ao buscar tags, usando commit inicial', 'warning');
      return null;
    }
  }

  /**
   * Obtém commits desde a última tag
   */
  getCommitsSinceLastTag(lastTag) {
    this.log('📝 Analisando commits...');
    
    let gitCommand;
    if (lastTag) {
      gitCommand = `git log ${lastTag}..HEAD --pretty=format:"%H|%s|%b" --no-merges`;
    } else {
      // Se não há tags, pega todos os commits
      gitCommand = `git log --pretty=format:"%H|%s|%b" --no-merges`;
    }
    
    try {
      const commits = this.exec(gitCommand);
      
      if (!commits) {
        this.log('📝 Nenhum commit novo encontrado');
        return [];
      }
      
      const commitList = commits.split('\n').map(line => {
        const [hash, subject, body] = line.split('|');
        return {
          hash: hash?.trim(),
          subject: subject?.trim(),
          body: body?.trim() || ''
        };
      }).filter(commit => commit.hash);
      
      this.log(`📝 ${commitList.length} commits encontrados`);
      return commitList;
    } catch (error) {
      this.log('⚠️ Erro ao obter commits', 'warning');
      return [];
    }
  }

  /**
   * Analisa commits usando Conventional Commits
   */
  analyzeCommits(commits) {
    this.log('🔍 Analisando conventional commits...');
    
    const analyzer = new ConventionalCommitsAnalyzer({ verbose: this.verbose });
    const analysis = analyzer.analyzeCommits(commits);
    
    this.log(`🔍 Análise: ${analysis.major.length} major, ${analysis.minor.length} minor, ${analysis.patch.length} patch, ${analysis.other.length} outros`);
    
    return analysis;
  }

  /**
   * Determina o tipo de bump de versão
   */
  determineBumpType(analysis) {
    this.log('📊 Determinando tipo de bump...');
    
    const bumpType = analysis.recommendedBump || 'patch';
    
    this.log(`📊 Tipo de bump determinado: ${bumpType}`);
    return bumpType;
  }

  /**
   * Calcula a nova versão
   */
  calculateNewVersion(currentVersion, bumpType) {
    this.log(`🧮 Calculando nova versão (${currentVersion} -> ${bumpType})...`);
    
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    let newVersion;
    switch (bumpType) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }
    
    this.log(`🧮 Nova versão: ${newVersion}`);
    return newVersion;
  }

  /**
   * Gera release notes
   */
  generateReleaseNotes(analysis, currentVersion, newVersion, bumpType) {
    this.log('📝 Gerando release notes...');
    
    const analyzer = new ConventionalCommitsAnalyzer({ verbose: this.verbose });
    const releaseNotes = analyzer.generateReleaseNotes(analysis, currentVersion, newVersion);
    
    this.log('📝 Release notes geradas');
    return releaseNotes;
  }

  /**
   * Simula o build da biblioteca
   */
  simulateBuild() {
    this.log('🔨 Simulando build da biblioteca...');
    
    if (this.dryRun) {
      this.log('🔨 [DRY-RUN] Build simulado com sucesso');
      return true;
    }
    
    try {
      // Instalar dependências
      this.exec('pnpm install');
      
      // Build da biblioteca específica
      this.exec(`pnpm run build:lib ${this.library}`);
      
      this.log('🔨 Build executado com sucesso', 'success');
      return true;
    } catch (error) {
      this.log('🔨 Erro no build', 'error');
      return false;
    }
  }

  /**
   * Simula os testes
   */
  simulateTests() {
    this.log('🧪 Simulando testes...');
    
    if (this.dryRun) {
      this.log('🧪 [DRY-RUN] Testes simulados com sucesso');
      return true;
    }
    
    try {
      // Executar testes da biblioteca específica
      this.exec(`pnpm run test ${this.library}`);
      
      this.log('🧪 Testes executados com sucesso', 'success');
      return true;
    } catch (error) {
      this.log('🧪 Erro nos testes', 'error');
      return false;
    }
  }

  /**
   * Executa toda a simulação
   */
  async run() {
    try {
      this.log('🚀 Iniciando simulação completa...');
      
      // 1. Verificar se a biblioteca existe
      this.checkLibraryExists();
      
      // 2. Obter versão atual
      const currentVersion = this.getCurrentVersion();
      
      // 3. Obter última tag
      const lastTag = this.getLastTag();
      
      // 4. Obter commits desde a última tag
      const commits = this.getCommitsSinceLastTag(lastTag);
      
      if (commits.length === 0) {
        this.log('📋 Nenhum commit novo encontrado. Nada para fazer.', 'warning');
        return;
      }
      
      // 5. Analisar commits
      const analysis = this.analyzeCommits(commits);
      
      // 6. Determinar tipo de bump
      const bumpType = this.determineBumpType(analysis);
      
      // 7. Calcular nova versão
      const newVersion = this.calculateNewVersion(currentVersion, bumpType);
      
      // 8. Gerar release notes
      const releaseNotes = this.generateReleaseNotes(analysis, currentVersion, newVersion, bumpType);
      
      // 9. Simular build
      const buildSuccess = this.simulateBuild();
      if (!buildSuccess) {
        throw new Error('Build falhou');
      }
      
      // 10. Simular testes
      const testsSuccess = this.simulateTests();
      if (!testsSuccess) {
        throw new Error('Testes falharam');
      }
      
      // 11. Mostrar resumo
      this.showSummary({
        library: this.library,
        currentVersion,
        newVersion,
        bumpType,
        commitsCount: commits.length,
        releaseNotes,
        lastTag
      });
      
      this.log('🎉 Simulação concluída com sucesso!', 'success');
      
    } catch (error) {
      this.log(`❌ Erro na simulação: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  /**
   * Mostra resumo da simulação
   */
  showSummary(data) {
    console.log('\n' + '='.repeat(80));
    console.log('📋 RESUMO DA SIMULAÇÃO');
    console.log('='.repeat(80));
    console.log(`📦 Biblioteca: ${data.library}`);
    console.log(`🏷️ Versão atual: ${data.currentVersion}`);
    console.log(`🆕 Nova versão: ${data.newVersion}`);
    console.log(`📊 Tipo de bump: ${data.bumpType}`);
    console.log(`📝 Commits analisados: ${data.commitsCount}`);
    console.log(`🏷️ Última tag: ${data.lastTag || 'Nenhuma'}`);
    console.log('\n📝 RELEASE NOTES:');
    console.log('-'.repeat(40));
    console.log(data.releaseNotes);
    console.log('='.repeat(80));
    
    if (this.dryRun) {
      console.log('\n⚠️  MODO DRY-RUN: Nenhuma alteração foi feita no repositório.');
      console.log('💡 Para executar de verdade, use: --no-dry-run');
    }
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse argumentos
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--library' || arg === '-l') {
      options.library = args[++i];
    } else if (arg === '--no-dry-run') {
      options.dryRun = false;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Simulador de Release - GitHub Actions

Uso: node simulate-release.js [opções]

Opções:
  -l, --library <nome>    Nome da biblioteca (padrão: better-auth)
  --no-dry-run           Executa de verdade (padrão: dry-run)
  -v, --verbose          Modo verboso
  -h, --help             Mostra esta ajuda

Exemplos:
  node simulate-release.js
  node simulate-release.js --library better-auth --verbose
  node simulate-release.js --no-dry-run
`);
      process.exit(0);
    }
  }
  
  const simulator = new ReleaseSimulator(options);
  simulator.run();
}

module.exports = ReleaseSimulator;