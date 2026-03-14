import { expect } from '@playwright/test';

import { USUARIO } from '../helpers/navegacao.js';

export class UsuarioPage {
  /**
   * Page Object da tela de cadastro de usuario.
   * @param {import('@playwright/test').Page} page - Contexto da pagina do Playwright.
   */
  constructor(page) {
    this.page = page;

    this.locatorLoginHeading = this.page.getByRole('heading', { name: 'Login' });
    this.locatorCadastreSeText = this.page.getByText('Cadastre-se', { exact: true });
    this.locatorCadastroHeading = this.page.getByRole('heading', { name: 'Cadastro' });
    this.locatorNomeInput = this.page.getByPlaceholder('Digite seu nome');
    this.locatorEmailInput = this.page.getByPlaceholder('Digite seu email');
    this.locatorSenhaInput = this.page.getByPlaceholder('Digite sua senha');
    this.locatorCadastrarButton = this.page.getByRole('button', { name: 'Cadastrar' });
    this.locatorCadastroRealizadoSucessoText = this.page.getByText('Cadastro realizado com sucesso', { exact: true });
    this.locatorLogoutButton = this.page.getByRole('button', { name: 'Logout' });
  }

  /**
   * Acessa a tela inicial do fluxo de cadastro.
   * @returns {Promise<void>}
   */
  async acessarTela() {
    await this.page.goto(USUARIO.URL);
    await expect(this.locatorLoginHeading).toBeVisible();
  }

  /**
   * Realiza o cadastro de um novo usuario pela interface.
   * Exemplo: JSON_CADASTROUSUARIO
   * @param {object} dadosCadastroUsuario - Dados do usuario que sera cadastrado.
   * @param {string} dadosCadastroUsuario.nome - Nome do usuario.
   * @param {string} dadosCadastroUsuario.email - E-mail do usuario.
   * @param {string} dadosCadastroUsuario.senha - Senha do usuario.
   * @returns {Promise<void>}
   */
  async cadastrarUsuario(dadosCadastroUsuario) {
    await this.locatorCadastreSeText.click();
    await expect(this.locatorCadastroHeading).toBeVisible();
    await this.locatorNomeInput.fill(dadosCadastroUsuario.nome);
    await this.locatorEmailInput.fill(dadosCadastroUsuario.email);
    await this.locatorSenhaInput.fill(dadosCadastroUsuario.senha);
    await this.locatorCadastrarButton.click();
  }

  /**
   * Valida que o cadastro foi concluido com sucesso e que o usuario foi autenticado.
   * @returns {Promise<void>}
   */
  async validarCadastroComSucesso() {
    await expect(this.locatorCadastroRealizadoSucessoText).toBeVisible();
    await expect(this.locatorLogoutButton).toBeVisible();
  }
}
