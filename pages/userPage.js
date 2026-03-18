import { expect } from '@playwright/test';

import { USUARIO } from '../helpers/navegacao.js';

/**
 * Page Object da jornada publica de cadastro de usuario do ServeRest.
 */
export class UserPage {
  /**
   * Constructor da classe UserPage.
   * @param {import('@playwright/test').Page} page - Instancia da pagina do Playwright.
   */
  constructor(page) {
    this.page = page;
    this.locatorLoginHeading = this.page.getByRole('heading', { exact: true, name: 'Login' });
    this.locatorRegisterText = this.page.getByText('Cadastre-se', { exact: true });
    this.locatorRegistrationHeading = this.page.getByRole('heading', { exact: true, name: 'Cadastro' });
    this.locatorNameInput = this.page.getByPlaceholder('Digite seu nome');
    this.locatorEmailInput = this.page.getByPlaceholder('Digite seu email');
    this.locatorPasswordInput = this.page.getByPlaceholder('Digite sua senha');
    this.locatorRegisterButton = this.page.getByRole('button', { exact: true, name: 'Cadastrar' });
    this.locatorLogoutButton = this.page.getByRole('button', { exact: true, name: 'Logout' });
  }

  /**
   * Acessa a tela inicial de login e valida o titulo da pagina.
   */
  async accessScreen() {
    await this.page.goto(USUARIO.URL);
    await expect(this.locatorLoginHeading).toBeVisible();
  }

  /**
   * Executa o fluxo de cadastro de usuario com dados dinamicos.
   * Example: JSON_CADASTROUSUARIO
   * @param {object} data - Massa de dados do cadastro.
   */
  async registerUser(data) {
    await this.locatorRegisterText.click();
    await expect(this.locatorRegistrationHeading).toBeVisible();
    await this.locatorNameInput.fill(data.nome);
    await this.locatorEmailInput.fill(data.email);
    await this.locatorPasswordInput.fill(data.senha);
    await this.locatorRegisterButton.click();
  }

  /**
   * Valida que o usuario foi autenticado apos o cadastro.
   */
  async validateAuthenticatedUser() {
    await expect(this.locatorLogoutButton).toBeVisible();
  }
}
