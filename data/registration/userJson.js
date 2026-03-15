import { fakerPT_BR as faker } from '@faker-js/faker';

export const JSON_CADASTROUSUARIO = {
  nome: faker.person.fullName(),
  email: `qa_${Date.now()}_${faker.string.alphanumeric(6)}@mailinator.com`.toLowerCase(),
  senha: faker.internet.password({
    length: 12,
    memorable: false,
    pattern: /[A-Za-z0-9!@#$%]/,
  }),
};