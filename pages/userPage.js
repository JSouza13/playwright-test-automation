import { expect } from '@playwright/test';

import { USUARIO } from '../helpers/navegacao.js';

export class UserPage {
  /**
   * Creates a page object for the user registration flow.
   * @param {import('@playwright/test').Page} page - The Playwright page instance.
   */
  constructor(page) {
    this.page = page;

    this.locatorLoginHeading = page.getByRole('heading', { name: 'Login', exact: true });
    this.locatorSignUpText = page.getByText('Cadastre-se', { exact: true });
    this.locatorRegistrationHeading = page.getByRole('heading', { name: 'Cadastro', exact: true });
    this.locatorNameTextbox = page.getByPlaceholder('Digite seu nome');
    this.locatorEmailTextbox = page.getByPlaceholder('Digite seu email');
    this.locatorPasswordTextbox = page.getByPlaceholder('Digite sua senha');
    this.locatorRegisterButton = page.getByRole('button', { name: 'Cadastrar', exact: true });
    this.locatorLogoutButton = page.getByRole('button', { name: 'Logout', exact: true });
  }

  /**
   * Opens the login screen and validates the initial state.
   * @returns {Promise<void>}
   */
  async accessScreen() {
    await this.page.goto(USUARIO.URL);
    await expect(this.locatorLoginHeading).toBeVisible();
  }

  /**
   * Registers a new user from the login screen.
   * @param {object} userData - Data used for registration.
   * Example: JSON_CADASTROUSUARIO
   * @returns {Promise<void>}
   */
  async registerUser(userData) {
    await this.locatorSignUpText.click();
    await expect(this.locatorRegistrationHeading).toBeVisible();
    await this.locatorNameTextbox.fill(userData.nome);
    await this.locatorEmailTextbox.fill(userData.email);
    await this.locatorPasswordTextbox.fill(userData.senha);
    await this.locatorRegisterButton.click();
  }

  /**
   * Validates that the registration flow reached the authenticated area.
   * @returns {Promise<void>}
   */
  async validateSuccessfulRegistration() {
    await expect(this.page).toHaveURL(/\/home$/);
    await expect(this.locatorLogoutButton).toBeVisible();
  }
}
