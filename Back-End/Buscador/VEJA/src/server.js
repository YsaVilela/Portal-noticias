import express from 'express';
import puppeteer from 'puppeteer';
import main  from './main.js';

const port = 3005;
const server = express();
/*{
  headless: false,
  args: ['--start-maximized', '--disable-infobars']
}*/
(async () => {
  const browserInstance = await puppeteer.launch();
  main(browserInstance); // Executa a busca ao iniciar o servidor
  // Agendar a busca a cada 2 minutos
  setInterval(() => main(browserInstance), 8 * 60 * 1000);
})();

server.listen(port, () => {
  console.log("Servidor rodando na porta " + port);
});
