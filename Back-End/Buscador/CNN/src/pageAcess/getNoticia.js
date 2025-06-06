export default async function getNoticia(pageInstance, link, verificaData) {
  try {
    const pageContent = await pageInstance.evaluate(extractNoticia, link, verificaData);
    return pageContent;
  } catch (error) {
    console.error("Erro ao buscar os dados da página:", error.message);
    throw error;
  }
}

async function extractNoticia(link, verificaData) {

  const linkNoticia = link.link;
  const imagemCapa = `<img src='${link.imagem}' alt='${link.imagemAlt}'/>`;
  const dataPublicacaoElement = verificaData.dataPublicacao;
  const dataAtualizadaElement = verificaData.dataAtualizacao;
  const tags = Array.from(document.querySelectorAll(".tags__list__item")).map((tag) => tag.textContent.trim());
  const articleBody = document.querySelector('article');

  if (!articleBody) {
    throw new Error('Elemento article não encontrado');
  }

  const content = extractContent(articleBody);


  return {
    siteBuscado: 'CNN',
    linkDaNoticiaOficial: linkNoticia,
    imagemCapa: imagemCapa,
    titulo: document.querySelector(".post__title").innerHTML,
    sinopse: document.querySelector(".post__excerpt").innerHTML,
    autoria: document.querySelector(".author__group").innerHTML,
    categoria: tags[0]? tags[0]: "São Paulo",
    tags: tags,
    dataPublicacao: dataPublicacaoElement,
    dataModificada: dataAtualizadaElement,
    conteudo: content,
    numeroVisualizacao: 1
  };


  function extractContent(articleBody) {

    const elements = articleBody.querySelectorAll(
      ".post__content figcaption, " +
        ".post__content p:not(aside *,.instagram-media p, .twitter-tweet p),.post__content figure img, " +
        ".post__content blockquote, .post__content ul, " +
        ".post__content h2:not(aside *), .post__content h3:not(aside *), .content-intertitle," +
        ".post__content mediaelementwrapper video,"+
        " .post__video , .gallery__item " +
        ".instagram-media, .twitter-tweet, picture img:not(aside *)"
    );

    //extrair isso
    let content = "";

    elements.forEach((element) => {

      //pegar video youtube 
      if (element.classList.contains("post__video")) {
        const spanId = element.querySelector(".embedded-video")
        const youtubeId = spanId.getAttribute("data-youtube-id");
        if (youtubeId) {
          const iframe = document.createElement("iframe");
          iframe.setAttribute("src", `https://www.youtube.com/embed/${youtubeId}`);
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("allowfullscreen", "true");
         // iframe.classList.add("video__container");
          content +=  `<div class=video__container> ${iframe.outerHTML}</div>`;
          return;
        }
      } 



      //adicionar o controls em video 
      if (element.tagName.toLowerCase() === "video")  {
        
        element.setAttribute("controls", "")
      //  element.classList.add("video__container");
        content += `<div class=video__container> ${element.outerHTML}</div>`;
        return;
      }

      // if ul tive share__list || read__list eleminar
      //tags__list
      if (element.tagName.toLowerCase() === "ul" && 
      (element.classList.contains("share__list") ||
       element.classList.contains("read__list")) ||
       element.classList.contains("tags__list")) {
        // Se a ul tiver as classes share__list ou read__list, não adicionamos ao conteúdo
        element.remove();
        return;
      }
     
      if (element.tagName.toLowerCase() === "h2" && 
      (element.classList.contains("read__paragraph") ||
       element.classList.contains("tags__topics__title"))) {
        // Se a ul tiver as classes share__list ou read__list, não adicionamos ao conteúdo
        element.remove();
        return;
      }

      if (element.tagName.toLowerCase() === "img" && 
      (element.alt.includes("Facebook") ||
      element.alt.includes("Twitter") ||
      element.alt.includes("Linkedin") ||
      element.alt.includes("WhatsApp") ||
      element.alt.includes("flipboard") 
       
      )
       ) {
        // Se a ul tiver as classes share__list ou read__list, não adicionamos ao conteúdo
        element.remove();
        return;
      }

      if (element.tagName.toLowerCase() === "p" && (element.classList.contains("translated_stamp_text") || element.classList.contains("translated_stamp_subtext")) )  {
        
        return;
      }

      //adicionando classes 
      if (element.tagName.toLowerCase() === "p")  {
        
        element.classList.add("text__container");
        content += element.outerHTML;
        return;
      }

      if (element.tagName.toLowerCase() === "img")  {
        
        element.classList.add("imagem__container");
        content += element.outerHTML;
        return;
      }

      if (element.tagName.toLowerCase() === "figcaption")  {
        
        element.classList.add("descricao__midia");
        content += element.outerHTML;
        return;
      }

      if (element.tagName.toLowerCase() === "blockquote")  {
        
        element.classList.add("citacao");
        content += element.outerHTML;
        return;
      }


      if (element.tagName.toLowerCase() === "ul")  {
        
        element.classList.add("lista");
        content += element.outerHTML;
        return;
      }

      if (element.tagName.toLowerCase() === "h2" || element.tagName.toLowerCase() === "h3" )  {
        
        element.classList.add("subtitulo");
        content += element.outerHTML;
        return;
      }

      if (element.classList.contains("instagram-media") ||element.classList.contains("twitter-tweet") )  {
        
        element.classList.add("publi__externa");
        content += element.outerHTML;
        return;
      }

      if (element.classList.contains("translated_stamp_text")  )  {
        
        return;
      }

      content += element.outerHTML;
    });

    
    return content;
  }
}

 //if img alt = Facebook || Twitter || Linkedin || WhatsApp || flipboard eleminar 