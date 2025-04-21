# 🌐 Portal de Notícias

Este é um **portal de notícias** desenvolvido para buscar, armazenar e exibir notícias de **5 portais de notícias** conhecidos. O sistema utiliza crawlers para obter as últimas notícias e mantê-las sempre atualizadas. O portal é alimentado automaticamente com conteúdo de diversas fontes confiáveis.

## 📰 Funcionalidades

- **Crawlers**: Cinco crawlers são responsáveis por buscar notícias de 5 portais de notícias populares e alimentá-las automaticamente no portal.  
- **Notícias Atualizadas**: As notícias são exibidas no portal com frequência atualizada, conforme os crawlers vão coletando novas informações.  
- **Cache com Redis**: Utilização de **Redis** para cache das notícias, garantindo um acesso mais rápido e eficiente às informações.  
- **Banco de Dados**: O sistema utiliza **PostgreSQL** como banco de dados relacional para armazenar as notícias coletadas.

## 🖥️ Arquitetura

- **Front-end**: Desenvolvido com **Angular** para proporcionar uma interface de usuário dinâmica e responsiva.
- **Testes Front-end**: Utilização de **Cypress** para garantir a qualidade e confiabilidade da interface do usuário.
- **Back-end**: Implementado com **JavaScript** e **Express.js**, os crawlers são responsáveis pela coleta das notícias.
- **API**: A **API** foi desenvolvida com **Java** e **Spring Boot** para fornecer acesso aos dados armazenados no banco de dados.

## 🛠️ Tecnologias Utilizadas

- **Front-end**:  
  - **Angular**  
  - **Cypress** (para testes)

- **Back-end**:  
  - **Java** com **Spring Boot** (para API)  
  - **JavaScript** com **Express.js** (para crawlers)  
  - **Redis** (para cache)  
  - **PostgreSQL** (para banco de dados relacional)


Este portal de notícias foi desenvolvido com o objetivo de fornecer uma experiência de leitura sem **anúncios** ou **propagandas**, permitindo uma navegação mais agradável e focada nas informações.
