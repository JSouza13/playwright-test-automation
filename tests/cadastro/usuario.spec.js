import { JSON_CADASTROUSUARIO } from '../../data/cadastro/usuarioJson.js';
import { test } from '../../helpers/index.js';
import { logger } from '../../utils/logger.js';

test.describe('cadastro de usuario na servrest', { tag: ['@CADASTRO_USUARIO'] }, () => {
  test.beforeEach(async () => {
    logger.test(test.info().title);
  });

  test(
    '001 - Deve cadastrar usuario com sucesso',
    {
      tag: '@USUARIO_CADASTRO_001',
      annotation: { type: 'FEAT', description: 'XXXX' },
    },
    async ({ page }) => {
      // Arrange: Acessar a tela inicial do fluxo de cadastro de usuario
      await page.usuarioPage.acessarTela();

      // Act: Submeter o formulario de cadastro com uma massa unica gerada em tempo de execucao
      await page.usuarioPage.cadastrarUsuario(JSON_CADASTROUSUARIO);

      // Assert: Validar a mensagem de sucesso e a autenticacao do usuario apos o cadastro
      await page.usuarioPage.validarCadastroComSucesso();
    },
  );
});
