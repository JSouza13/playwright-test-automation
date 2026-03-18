import { JSON_CADASTROUSUARIO } from '../../data/registration/userJson.js';
import { test } from '../../helpers/index.js';
import { logger } from '../../utils/logger.js';

test.describe('user registration', { tag: ['@CADASTRO_USUARIO'] }, () => {
  test.beforeEach(async () => {
    logger.test(test.info().title);
  });

  test(
    '001 - must register a new user successfully',
    {
      annotation: { type: 'Issue', description: 'https://jira.example.com/browse/XXXX' },
      tag: '@CADASTRO_USUARIO_001',
    },
    async ({ page }) => {
      // Arrange: Open the public login screen before starting the registration journey
      await page.userPage.accessScreen();

      // Act: Submit the registration form with unique runtime data
      await page.userPage.registerUser(JSON_CADASTROUSUARIO);

      // Assert: Validate that the app redirects to the authenticated area after sign up
      await page.userPage.validateAuthenticatedUser();
    },
  );
});
