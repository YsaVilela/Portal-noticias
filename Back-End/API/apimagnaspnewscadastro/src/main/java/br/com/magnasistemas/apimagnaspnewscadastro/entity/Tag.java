package br.com.magnasistemas.apimagnaspnewscadastro.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Table(name = "tb_tag")
@Entity(name = "Tag")
public class Tag {
	

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nome;

	@ManyToMany(mappedBy = "tags", cascade = CascadeType.MERGE)
	private List<Noticia> noticias = new ArrayList<>();
	
	public Tag(String nome) {
	
		this.nome = nome;
		
	}

	public Tag() {
		super();
	}

	public Long getId() {
		return id;
	}

	public String getNome() {
		return nome;
	}


}
