const DEFAULT_BASE_URL = 'https://front.serverest.dev/';
const normalizedBaseUrl = process.env.BASE_URL || DEFAULT_BASE_URL;

export const USUARIO = {
  URL: new URL('login', normalizedBaseUrl).toString(),
};
