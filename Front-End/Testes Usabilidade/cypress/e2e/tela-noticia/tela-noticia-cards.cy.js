import { environment } from "../../../environments/environments.development";

describe('Tela da noticia', () => {
  beforeEach(() => {
    cy.visit(`${environment.urlSite}`)
    cy.get('[data-test="loading"]').should('not.exist')
})

  it('Verificar se houve o carregamento da noticia pelos cards', () => {
    cy.get('[data-test="cardNoticia"]').then(($cards) => {
      const randomIndex = Math.floor(Math.random() * $cards.length)
      const $randomCard = $cards.eq(randomIndex)
      cy.wrap($randomCard).click()

      cy.get('[data-test="tituloNoticia"]')
      cy.get('[data-test="conteudoNoticia"]')
      cy.get('[data-test="linkNoticia"]')
    })
  })

  it('Verificar se houve o carregamento da noticia pelo carrossel', () => {
    cy.get('[data-test="noticiaCarrossel"]').then(($cards) => {
      const randomIndex = Math.floor(Math.random() * $cards.length)
      const $randomCard = $cards.eq(randomIndex)
      cy.wrap($randomCard).click()

      cy.get('[data-test="tituloNoticia"]')
      cy.get('[data-test="conteudoNoticia"]')
      cy.get('[data-test="linkNoticia"]')
    })
  })

  it('Verificar se houve o carregamento da noticia pelas principais', () => {
    cy.get('[data-test="noticiaPrincipal"]').then(($cards) => {
      const randomIndex = Math.floor(Math.random() * $cards.length)
      const $randomCard = $cards.eq(randomIndex)
      cy.wrap($randomCard).click()

      cy.get('[data-test="tituloNoticia"]')
      cy.get('[data-test="conteudoNoticia"]')
      cy.get('[data-test="linkNoticia"]')
    })
  })
})