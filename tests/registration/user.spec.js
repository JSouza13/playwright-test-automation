import { JSON_CADASTROUSUARIO } from '../../data/registration/userJson.js';
import { test } from '../../helpers/index.js';
import { logger } from '../../utils/logger.js';

test.describe('user registration', { tag: ['@CADASTRO_USUARIO'] }, () => {
  test.beforeEach(async ({}, testInfo) => {
    logger.test(testInfo.title);
  });

  test(
    '001 - Should register a user successfully',
    {
      tag: '@USUARIO_CADASTRO_001',
      annotation: [
        { type: 'issue', description: 'XXXX' },
        { type: 'type', description: 'Cadastro de usuário' },
      ],
    },
    async ({ page }) => {
      // Arrange: access the login screen.
      await page.userPage.accessScreen();

      // Act: register a new user with dynamic data.
      await page.userPage.registerUser(JSON_CADASTROUSUARIO);

      // Assert: validate the authenticated area is available.
      await page.userPage.validateSuccessfulRegistration();
    },
  );
});
