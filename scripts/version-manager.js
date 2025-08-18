/**
 * Módulo para gerenciamento de versões
 * Integra com semver e git para versionamento automático
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class VersionManager {
  constructor(options = {}) {
    this.workingDir = options.workingDir || process.cwd();
    this.library = options.library;
    this.dryRun = options.dryRun !== false;
    this.verbose = options.verbose || false;
    
    if (!this.library) {
      throw new Error('Nome da biblioteca é obrigatório');
    }
    
    this.libraryPath = path.join(this.workingDir, 'libs', this.library);
    this.packageJsonPath = path.join(this.libraryPath, 'package.json');
  }

  log(message, level = 'info') {
    if (!this.verbose && level === 'debug') return;
    
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍'
    }[level] || '📋';
    
    console.log(`${prefix} ${message}`);
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
      this.log(`Erro ao executar: ${command}`, 'error');
      throw error;
    }
  }

  /**
   * Obtém a versão atual do package.json
   * @returns {string} Versão atual
   */
  getCurrentVersion() {
    if (!fs.existsSync(this.packageJsonPath)) {
      throw new Error(`package.json não encontrado: ${this.packageJsonPath}`);
    }
    
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
    return packageJson.version;
  }

  /**
   * Calcula nova versão baseada no tipo de bump
   * @param {string} currentVersion - Versão atual
   * @param {string} bumpType - Tipo de bump: major, minor, patch
   * @returns {string} Nova versão
   */
  calculateNewVersion(currentVersion, bumpType) {
    this.log(`Calculando nova versão: ${currentVersion} -> ${bumpType}`);
    
    const versionParts = currentVersion.split('.').map(Number);
    if (versionParts.length !== 3 || versionParts.some(isNaN)) {
      throw new Error(`Versão inválida: ${currentVersion}`);
    }
    
    let [major, minor, patch] = versionParts;
    
    switch (bumpType) {
      case 'major':
        major += 1;
        minor = 0;
        patch = 0;
        break;
      case 'minor':
        minor += 1;
        patch = 0;
        break;
      case 'patch':
        patch += 1;
        break;
      default:
        throw new Error(`Tipo de bump inválido: ${bumpType}`);
    }
    
    const newVersion = `${major}.${minor}.${patch}`;
    this.log(`Nova versão calculada: ${newVersion}`, 'success');
    return newVersion;
  }

  /**
   * Atualiza a versão no package.json
   * @param {string} newVersion - Nova versão
   * @returns {boolean} Sucesso da operação
   */
  updatePackageVersion(newVersion) {
    this.log(`Atualizando package.json para versão ${newVersion}`);
    
    if (this.dryRun) {
      this.log('[DRY-RUN] Versão do package.json não foi alterada', 'warning');
      return true;
    }
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      packageJson.version = newVersion;
      
      fs.writeFileSync(
        this.packageJsonPath, 
        JSON.stringify(packageJson, null, 2) + '\n'
      );
      
      this.log('package.json atualizado com sucesso', 'success');
      return true;
    } catch (error) {
      this.log(`Erro ao atualizar package.json: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Obtém todas as tags da biblioteca
   * @returns {Array} Lista de tags ordenadas por versão (mais recente primeiro)
   */
  getLibraryTags() {
    this.log('Buscando tags da biblioteca...');
    
    try {
      const tagsOutput = this.exec(`git tag -l "${this.library}-v*" --sort=-version:refname`);
      
      if (!tagsOutput) {
        this.log('Nenhuma tag encontrada');
        return [];
      }
      
      const tags = tagsOutput.split('\n').filter(tag => tag.trim());
      this.log(`${tags.length} tags encontradas: ${tags.slice(0, 3).join(', ')}${tags.length > 3 ? '...' : ''}`);
      
      return tags;
    } catch (error) {
      this.log('Erro ao buscar tags, assumindo nenhuma tag existente', 'warning');
      return [];
    }
  }

  /**
   * Obtém a última tag da biblioteca
   * @returns {string|null} Última tag ou null se não houver
   */
  getLastTag() {
    const tags = this.getLibraryTags();
    return tags.length > 0 ? tags[0] : null;
  }

  /**
   * Extrai a versão de uma tag
   * @param {string} tag - Tag no formato "library-vX.Y.Z"
   * @returns {string|null} Versão extraída ou null se inválida
   */
  extractVersionFromTag(tag) {
    const match = tag.match(new RegExp(`^${this.library}-v(.+)$`));
    return match ? match[1] : null;
  }

  /**
   * Cria uma nova tag
   * @param {string} version - Versão para a tag
   * @param {string} message - Mensagem da tag
   * @returns {boolean} Sucesso da operação
   */
  createTag(version, message = '') {
    const tagName = `${this.library}-v${version}`;
    this.log(`Criando tag: ${tagName}`);
    
    if (this.dryRun) {
      this.log(`[DRY-RUN] Tag ${tagName} não foi criada`, 'warning');
      return true;
    }
    
    try {
      // Verificar se a tag já existe
      try {
        this.exec(`git rev-parse ${tagName}`);
        this.log(`Tag ${tagName} já existe`, 'warning');
        return false;
      } catch {
        // Tag não existe, pode criar
      }
      
      // Criar a tag
      const tagMessage = message || `Release ${this.library} v${version}`;
      this.exec(`git tag -a "${tagName}" -m "${tagMessage}"`);
      
      this.log(`Tag ${tagName} criada com sucesso`, 'success');
      return true;
    } catch (error) {
      this.log(`Erro ao criar tag: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Faz push da tag para o repositório remoto
   * @param {string} version - Versão da tag
   * @returns {boolean} Sucesso da operação
   */
  pushTag(version) {
    const tagName = `${this.library}-v${version}`;
    this.log(`Fazendo push da tag: ${tagName}`);
    
    if (this.dryRun) {
      this.log(`[DRY-RUN] Push da tag ${tagName} não foi executado`, 'warning');
      return true;
    }
    
    try {
      this.exec(`git push origin "${tagName}"`);
      this.log(`Push da tag ${tagName} realizado com sucesso`, 'success');
      return true;
    } catch (error) {
      this.log(`Erro ao fazer push da tag: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Faz commit das mudanças de versão
   * @param {string} version - Nova versão
   * @returns {boolean} Sucesso da operação
   */
  commitVersionBump(version) {
    this.log(`Fazendo commit do bump de versão para ${version}`);
    
    if (this.dryRun) {
      this.log('[DRY-RUN] Commit não foi realizado', 'warning');
      return true;
    }
    
    try {
      // Adicionar o package.json modificado
      this.exec(`git add "${this.packageJsonPath}"`);
      
      // Fazer commit
      const commitMessage = `chore(${this.library}): bump version to ${version}`;
      this.exec(`git commit -m "${commitMessage}"`);
      
      this.log('Commit do bump de versão realizado com sucesso', 'success');
      return true;
    } catch (error) {
      this.log(`Erro ao fazer commit: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Verifica se há mudanças não commitadas
   * @returns {boolean} True se há mudanças pendentes
   */
  hasUncommittedChanges() {
    try {
      const status = this.exec('git status --porcelain');
      return status.length > 0;
    } catch (error) {
      this.log('Erro ao verificar status do git', 'warning');
      return false;
    }
  }

  /**
   * Obtém informações sobre commits desde uma tag
   * @param {string|null} fromTag - Tag de início (null para todos os commits)
   * @returns {Array} Lista de commits
   */
  getCommitsSince(fromTag = null) {
    this.log(`Obtendo commits desde ${fromTag || 'o início'}`);
    
    let gitCommand;
    if (fromTag) {
      gitCommand = `git log ${fromTag}..HEAD --pretty=format:"%H|%s|%b" --no-merges`;
    } else {
      // Se não há tag, pega todos os commits
      gitCommand = `git log --pretty=format:"%H|%s|%b" --no-merges`;
    }
    
    try {
      const commits = this.exec(gitCommand);
      
      if (!commits) {
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
      
      this.log(`${commitList.length} commits encontrados`);
      return commitList;
    } catch (error) {
      this.log('Erro ao obter commits', 'warning');
      return [];
    }
  }

  /**
   * Valida se uma versão é válida segundo semver
   * @param {string} version - Versão para validar
   * @returns {boolean} True se válida
   */
  static isValidVersion(version) {
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return semverRegex.test(version);
  }

  /**
   * Compara duas versões
   * @param {string} version1 - Primeira versão
   * @param {string} version2 - Segunda versão
   * @returns {number} -1 se v1 < v2, 0 se iguais, 1 se v1 > v2
   */
  static compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (v1Parts[i] < v2Parts[i]) return -1;
      if (v1Parts[i] > v2Parts[i]) return 1;
    }
    
    return 0;
  }

  /**
   * Executa todo o processo de versionamento
   * @param {string} bumpType - Tipo de bump
   * @param {string} releaseNotes - Notas da release
   * @returns {Object} Resultado do processo
   */
  async performVersionBump(bumpType, releaseNotes = '') {
    const result = {
      success: false,
      currentVersion: null,
      newVersion: null,
      tagCreated: false,
      tagPushed: false,
      committed: false,
      errors: []
    };
    
    try {
      // 1. Obter versão atual
      result.currentVersion = this.getCurrentVersion();
      
      // 2. Calcular nova versão
      result.newVersion = this.calculateNewVersion(result.currentVersion, bumpType);
      
      // 3. Atualizar package.json
      if (!this.updatePackageVersion(result.newVersion)) {
        result.errors.push('Falha ao atualizar package.json');
        return result;
      }
      
      // 4. Fazer commit das mudanças
      if (!this.dryRun) {
        result.committed = this.commitVersionBump(result.newVersion);
        if (!result.committed) {
          result.errors.push('Falha ao fazer commit');
        }
      }
      
      // 5. Criar tag
      result.tagCreated = this.createTag(result.newVersion, releaseNotes);
      if (!result.tagCreated && !this.dryRun) {
        result.errors.push('Falha ao criar tag');
      }
      
      // 6. Fazer push da tag
      if (result.tagCreated) {
        result.tagPushed = this.pushTag(result.newVersion);
        if (!result.tagPushed && !this.dryRun) {
          result.errors.push('Falha ao fazer push da tag');
        }
      }
      
      result.success = result.errors.length === 0;
      
    } catch (error) {
      result.errors.push(error.message);
    }
    
    return result;
  }
}

module.exports = VersionManager;