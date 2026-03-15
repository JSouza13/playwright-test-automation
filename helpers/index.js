import { test as base, chromium } from '@playwright/test';

import { Api } from '../api/index.js';
import { UserPage } from '../pages/userPage.js';

const test = base.extend({
  /**
   * Estende o contexto da página para incluir objetos personalizados (Page Objects).
   * @param {object} root0 - Objeto de contexto do Playwright.
   * @param {object} root0.page - Contexto da página do Playwright.
   * @param {Function} use Função fornecida pelo Playwright para passar o contexto estendido.
   */
  page: async ({ page }, use) => {
    const context = page;

    context['userPage'] = new UserPage(page);

    await use(context);
  },
  /**
   * Estende o contexto de requisição para incluir APIs personalizadas.
   * @param {object} root0 - Objeto de contexto do Playwright.
   * @param {object} root0.request - Contexto de requisição do Playwright.
   * @param {Function} use Função fornecida pelo Playwright para passar o contexto estendido.
   */
  request: async ({ request }, use) => {
    const context = request;
    context['api'] = new Api(request);

    await use(context);
  },
  /**
   * Gerencia o ciclo de vida do navegador.
   * @param {Function} use Função fornecida pelo Playwright para passar o navegador.
   */
  browser: async ({}, use) => {
    const browser = await chromium.launch();
    await use(browser);
    await browser.close();
  },
});

export { test };
export { expect } from '@playwright/test';
