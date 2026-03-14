/**
 * Logger customizado para o projeto de automação.
 * Encapsula saídas padrão em métodos de classe, evitando violação da regra SonarQube S106.
 * @example
 * import { logger } from '../../utils/logger.js';
 *
 * logger.info('Executando teste:', titulo);
 * logger.query('SELECT * FROM tabela WHERE id = $1');
 * logger.result('Registros encontrados:', resultado.length);
 * logger.error('Falha ao executar:', error.message);
 */

class TestLogger {
  /**
   * Log informativo geral (substitui console.log direto)
   * @param  {...*} args - Argumentos para log
   */
  info(...args) {
    console.log(...args); // NOSONAR - Logger centralizado do projeto
  }

  /**
   * Log de query SQL sendo executada (substitui console.log de queries)
   * @param  {...*} args - Query e parâmetros
   */
  query(...args) {
    console.log(...args); // NOSONAR - Logger centralizado do projeto
  }

  /**
   * Log de resultado de operação (substitui console.log de resultados)
   * @param  {...*} args - Resultado da operação
   */
  result(...args) {
    console.log(...args); // NOSONAR - Logger centralizado do projeto
  }

  /**
   * Log de warning (substitui console.warn)
   * @param  {...*} args - Argumentos para warning
   */
  warn(...args) {
    console.warn(...args); // NOSONAR - Logger centralizado do projeto
  }

  /**
   * Log de erro (substitui console.error)
   * @param  {...*} args - Argumentos para erro
   */
  error(...args) {
    console.error(...args); // NOSONAR - Logger centralizado do projeto
  }

  /**
   * Log do título do teste no beforeEach (substitui console.log do título)
   * @param {string} title - Título do teste (test.info().title)
   */
  test(title) {
    console.log(`Executando teste: ${title}`); // NOSONAR - Logger centralizado do projeto
  }
}

export const logger = new TestLogger();
