import getDataNoticia from "./pageAcess/getDataNotica.js";
import getNoticia from "./pageAcess/getNoticia.js";
import getLinkNoticias from "./pageAcess/geLinkNoticias.js";
import isDataDoDiaAnterior from "./utils/checkDate.js";
import saveFileLocal from "./repository/saveFileLocal.js";
import { cadastrarNoticia, atualizarNoticia } from "./repository/saveBd.js";

let pageInstance;
let linksVerificado = [];

export default async function fetchData(browserInstance) {
  console.log("********************Iniciado busca*************************");

  let pagina = 1;
  let loop = true;
  let primeiroLink = true;
  let segundoLink = false;
  let proximoLoop = false;

  if (!browserInstance) {
    console.log("Navegador não inicializado.");
    return;
  }

  if (!pageInstance) pageInstance = await browserInstance.newPage();

  try {
    while (loop) {
      console.log("Inicio busca de links\n");
console.log("pagina: "+ pagina)

      let linkBuscado = segundoLink
        ? `https://vejasp.abril.com.br/?page=2&s=s%C3%A3o+paulo&orderby=date`
        : `https://vejasp.abril.com.br/?s=sp&orderby=date`;

        //apertar botao carregar mais 3x

      await pageInstance.goto(linkBuscado, {
        timeout: 50000,
        waitUntil: "load",
      });

      const dados = await getLinkNoticias(pageInstance);
     //  console.log('Dados encontrados:', dados);
      let count = 1;

      for (const link of dados) {
        let atualizar = false;

        if (proximoLoop) {
          console.log("executando proximo Loop");
          proximoLoop = false;
          break;
        }

        try {
          await pageInstance.goto(link.link, {
            timeout: 50000,
            waitUntil: "load",
          });

        const verificaData = await getDataNoticia(pageInstance);
       
          // Verificar se o link já foi verificado
          let linkJaFoiVerificado = linksVerificado.find((item) => item.link === link.link);

          if (linkJaFoiVerificado) {
            console.log("Link já verificado");
            // Verificar se a data de atualização é diferente
            if (linkJaFoiVerificado.dataAtualizacao !== verificaData.dataAtualizacao) {
              console.log("A data de atualização é diferente");
             atualizar = true;
            } else {
              console.log("A data de atualização é a mesma, verificando proxima notica\n");
             continue;
            }
          }

         if (isDataDoDiaAnterior(verificaData.dataPublicacao)
          ||isDataDoDiaAnterior(verificaData.dataAtualizacao) ) {
            count++;
            console.log(verificaData.dataPublicacao)
            console.log("Data da publicação/ Atualizacao é do dia anterior.\n");

           if (primeiroLink) {
              console.log("finaliza primeiro loop\n");
              pagina = 0;
              primeiroLink = false;
              segundoLink = true;
              proximoLoop = true;
              continue;
            } else {
              console.log("***********finalizado busca**************");
              loop = false;
              proximoLoop = true;
             continue;
           }
          } else {

            console.log("processo de pegar conteudo");



            const pageContent = await getNoticia(pageInstance, link, verificaData);

            if (!pageContent) {
              console.error("Conteúdo da página não encontrado.");
              return; //throw erro
           }

           pageContent.conteudo = pageContent.conteudo.replace(
            /<p\s+(?:[^>]*\s)?class="([^"]+)"[^>]*>(.*?)<\/p>/g,
            '<p class="$1">$2</p>'
          );

          pageContent.conteudo = pageContent.conteudo.replace(
            /<h3\s+(?:[^>]*\s)?class="([^"]+)"[^>]*>(.*?)<\/h3>/g,
            '<h3 class="$1">$2</h3>'
          );

          pageContent.conteudo = pageContent.conteudo.replace(
            /<h2\s+(?:[^>]*\s)?class="([^"]+)"[^>]*>(.*?)<\/h2>/g,
            '<h2 class="$1">$2</h2>'
          );

          pageContent.conteudo = pageContent.conteudo.replace(
            /<blockquote\s+(?:[^>]*\s)?class="([^"]+)"[^>]*>(.*?)<\/blockquote>/g,
            '<blockquote class="$1">$2</blockquote>'
          );

          pageContent.conteudo = pageContent.conteudo.replace(
            /<ul\s+(?:[^>]*\s)?class="([^"]+)"[^>]*>(.*?)<\/ul>/g,
            '<ul class="$1">$2</ul>'
          );

          pageContent.conteudo = pageContent.conteudo.replace(/<(?!video|img|iframe)(\w+)[^>]*>\s*<\/\1>/g, '');
        //talves só eleminar tags em branco resolva
          

        //    saveFileLocal(pageContent, link.link, pagina, segundoLink, count);

            count++;

            let cache = {
              link: link.link,
          dataAtualizacao: verificaData.dataAtualizacao,
            };

            linksVerificado.push(cache);

            if (atualizar) await atualizarNoticia(link.link, pageContent);
           else await cadastrarNoticia(pageContent);

          }
        } catch (error) {
          console.error("\nErro ao buscar os dados da página:", error.message);
          // Pular para a próxima iteração do loop
          continue;
        }
      }
      pagina++;
    }
  } catch (error) {
    console.error("\nErro ao buscar os dados:", error.message);

    // Se der erro de timeout, tenta novamente
    if (error instanceof puppeteer.TimeoutError) {
      console.log("Tentando novamente...");
      fetchData();
    }
  }
}
