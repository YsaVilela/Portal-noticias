import getDataNoticia from "./pageAcess/getDataNotica.js";
import getNoticia from "./pageAcess/getNoticia.js";
import getLinkNoticias from "./pageAcess/geLinkNoticias.js";
import isDataDoDiaAnterior from "./utils/checkDate.js";
import saveFileLocal from "./repository/saveFileLocal.js";
import {cadastrarNoticia, atualizarNoticia} from "./repository/saveBd.js";

let pageInstance;
let linksVerificado = [];
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/58.0.3029.110 ';


export default async function fetchData(browserInstance) {

  // function delay(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  // console.log("Esperando 5 minutos...");
  // await delay(500000); // 5 minutos em milissegundos

  console.log("********************Iniciado busca*************************");

  let pagina = 1;
  let loop = true;
  let proximoLoop = false;

  if (!browserInstance) {
    console.log("Navegador não inicializado.");
    return;
  }

  if (!pageInstance) pageInstance = await browserInstance.newPage();

  await pageInstance.setUserAgent(userAgent);

  try {
    while (loop) {
      console.log("Inicio busca de links");

      console.log(pagina)
      let linkBuscado = `https://www.saopaulo.sp.gov.br/spnoticias/ultimas-noticias/page/${pagina}/`;

      await pageInstance.goto(linkBuscado, {
        timeout: 30000,
        waitUntil: "domcontentloaded",
      });

      const dados = await getLinkNoticias(pageInstance);

      // console.log('Dados encontrados:', dados);

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
            timeout: 30000,
            waitUntil: "load",
          });

          const verificaData = await getDataNoticia(pageInstance);

          // Verificar se o link já foi verificado
          let linkJaFoiVerificado = linksVerificado.find(
            (item) => item.link === link.link
          );

          if (linkJaFoiVerificado) {
            console.log("Link já verificado");
            // Verificar se a data de atualização é diferente
            if (linkJaFoiVerificado.dataAtualizacao !== verificaData.dataPublicacao) {
              console.log("A data de atualização é diferente");
              // console.log("\ndata registrada: " +linkJaFoiVerificado.dataAtualizacao);
              // console.log("nova data: "+ verificaData.dataAtualizada+"\n");
              atualizar = true;
            } else {
              console.log("A data de atualização é a mesma, verificando proxima notica\n");
              continue;
            }
          }

          if (isDataDoDiaAnterior(verificaData.dataPublicacao) ) {
            count++;
            console.log("Data da publicação/ Atualizacao é do dia anterior.\n");
         
              console.log("***********finalizado busca**************");
              loop = false;
              proximoLoop = true;
              continue;
          
            }
           else {

            console.log("processo de pegar conteudo");

            const pageContent = await getNoticia(pageInstance, link,verificaData.dataPublicacao);

            if (!pageContent) {
              console.error("Conteúdo da página não encontrado.");
              return; //throw erro
            }

          //  pageContent.conteudo = replaceClasses(pageContent.conteudo);
          //  pageContent.conteudo = cleanNoticia(pageContent.conteudo);

         // saveFileLocal(pageContent, link.link, pagina, count);
         pageContent.conteudo =  pageContent.conteudo.replace(/&nbsp;/g, '');
         
         pageContent.conteudo = pageContent.conteudo.replace(/<(?!video|img|iframe)(\w+)[^>]*>\s*<\/\1>/g, '');
            count++;

            let cache = {
              link: link.link,
              dataAtualizacao: pageContent.dataPublicacao,
            };
            linksVerificado.push(cache);

            if(atualizar) await atualizarNoticia(link.link, pageContent);
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
