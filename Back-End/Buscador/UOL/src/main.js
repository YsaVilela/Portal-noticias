import getDataNoticia from "./pageAcess/getDataNotica.js";
import getNoticia from "./pageAcess/getNoticia.js";
import getLinkNoticias from "./pageAcess/geLinkNoticias.js";
import isDataDoDiaAnterior from "./utils/checkDate.js";
import saveFileLocal from "./repository/saveFileLocal.js";
import {cadastrarNoticia, atualizarNoticia} from "./repository/saveBd.js";

let pageInstance;
let linksVerificado = [];
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/58.0.3029.110 ';
let categoriaLink = [ 'politica', 'ultimas', 'cotidiano', 'saude']

export default async function fetchData(browserInstance) {

  // function delay(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  // console.log("Esperando 5 minutos...");
  // await delay(500000); // 5 minutos em milissegundos

  console.log("********************Iniciado busca*************************");

  let pagina = 0;
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
      console.log(categoriaLink[pagina]);
      let linkBuscado = `https://noticias.uol.com.br/${categoriaLink[pagina]}/`;

      await pageInstance.goto(linkBuscado, {
        timeout: 50000,
        waitUntil: "load",
      });

      const dados = await getLinkNoticias(pageInstance);

    //   console.log('Dados encontrados:', dados);

      let count = 1;

      for (const link of dados) {
        let atualizar = false;

        try {
          await pageInstance.goto(link.link, {
            timeout: 50000,
            waitUntil: "load",
          });

          const verificaData = await getDataNoticia(pageInstance);
          console.log(link.link)

          // Verificar se o link já foi verificado
          let linkJaFoiVerificado = linksVerificado.find(
            (item) => item.link === link.link
          );

        if (linkJaFoiVerificado) {
            console.log("Link já verificado");
            // Verificar se a data de atualização é diferente
            if (linkJaFoiVerificado.dataAtualizacao !== verificaData.dataAtualizada) {
             console.log("A data de atualização é diferente");
              // console.log("\ndata registrada: " +linkJaFoiVerificado.dataAtualizacao);
              // console.log("nova data: "+ verificaData.dataAtualizada+"\n");
              atualizar = true;
            } else {
              console.log("A data de atualização é a mesma, verificando proxima notica\n");
              continue;
            }
          }

          if (isDataDoDiaAnterior(verificaData.dataPublicacao)||isDataDoDiaAnterior(verificaData.dataAtualizada) ) {
            count++;
            console.log(verificaData.dataPublicacao)
            console.log("Data da publicação/ Atualizacao é do dia anterior.\n");
         

            if(pagina >=3){
             console.log("***********finalizado busca**************");
             loop = false;
              break;
            }

            break;
          
            }
           else {

            console.log("\nprocesso de pegar conteudo\n");

     //       const pageContent = await getNoticia(pageInstance, link,verificaData.dataPublicacao);

     //       if (!pageContent) {
      //        console.error("Conteúdo da página não encontrado.");
      //        return; //throw erro
      //      }

          //  pageContent.conteudo = replaceClasses(pageContent.conteudo);
          //  pageContent.conteudo = cleanNoticia(pageContent.conteudo);

         // saveFileLocal(pageContent, link.link, pagina, count);
     //    pageContent.conteudo =  pageContent.conteudo.replace(/&nbsp;/g, '');
         
     //    pageContent.conteudo = pageContent.conteudo.replace(/<(?!video|img|iframe)(\w+)[^>]*>\s*<\/\1>/g, '');
      //      count++;

           let cache = {
             link: link.link,
              dataAtualizacao: verificaData.dataAtualizada,
            };
            linksVerificado.push(cache);

      //      if(atualizar) await atualizarNoticia(link.link, pageContent);
      //       else await cadastrarNoticia(pageContent);

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
