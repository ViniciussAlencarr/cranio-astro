import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import dotenv from 'dotenv';

// Carregue variáveis do .env
dotenv.config();

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react(), tailwind()]
});