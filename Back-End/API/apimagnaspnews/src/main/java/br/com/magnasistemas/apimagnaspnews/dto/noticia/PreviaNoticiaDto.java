package br.com.magnasistemas.apimagnaspnews.dto.noticia;

import java.io.Serializable;
import java.time.LocalDateTime;

import br.com.magnasistemas.apimagnaspnews.entity.Noticia;

public class PreviaNoticiaDto implements Serializable{
	

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
//	LocalDateTime dataHoraCache = LocalDateTime.now();
//	LocalDateTime agora;

	Long id;
	String titulo;
	String sinopse;
	String imagemCapa;
	String siteBuscado;
	LocalDateTime dataPublicacao;
	
	
	public PreviaNoticiaDto() {
	
	}

	
	public PreviaNoticiaDto(Noticia noticia) {
		this(noticia.getId(),
				noticia.getTitulo(),
				noticia.getSinopse(),
				noticia.getImagemCapa(),
				noticia.getSiteBuscado().toUpperCase(),
				noticia.getDataPublicacao()
				);
	}

	public PreviaNoticiaDto(Long id, String titulo, String sinopse, String imagemCapa, String siteBuscado, LocalDateTime dataPublicacao) {
		this.id = id;
		this.titulo = titulo;
		this.sinopse = sinopse;
		this.imagemCapa = imagemCapa;
		this.dataPublicacao = dataPublicacao;
		this.siteBuscado = siteBuscado;
//		this.setDataHora(LocalDateTime.now());
	}



	public LocalDateTime getDataPublicacao() {
		return dataPublicacao;
	}


	public Long getId() {
		return id;
	}

	public String getTitulo() {
		return titulo;
	}

	public String getSinopse() {
		return sinopse;
	}

	public String getImagemCapa() {
		return imagemCapa;
	}

	public String getSiteBuscado() {
		return siteBuscado;
	}

//	public void setDataHora(LocalDateTime now) {
//	        this.agora = now;	
//	}
//	
//
//	public LocalDateTime getAgora() {
//		return agora;
//	}
//
//	public LocalDateTime getDataHoraCache() {
//		return dataHoraCache;
//	}

}
