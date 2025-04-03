import dotenv from 'dotenv';

// Charger les variables d'environnement pour les tests
dotenv.config({ path: './.env.test' });

export default {
  globalSetup: './tests/globalSetup.js',
  globalTeardown: "./tests/globalTeardown.js",
  setupFilesAfterEnv: ["./tests/setupTests.js"],
  testEnvironment: 'node',
  transform: {
    "^.+\\.(js|jsx|mjs|cjs)$": "babel-jest",
  },
};
