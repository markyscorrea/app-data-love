class Registro {
	constructor(ano, mes, dia, tipo, descricao){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
	}

	validarDados(){
		for(let i in this){
			if(this[i] === undefined || this[i] === null || this[i] === '')
				return false
		}
		return true
	}
}

class Bd {
	constructor(){
		let id = localStorage.getItem('id')

		if(id === null){
			localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar (r){
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(r))
		localStorage.setItem('id', id)
		
	}

	recuperarTodosRegistros(){

		let registros = Array()

		let id = localStorage.getItem('id')

		for(let i = 1; i <= id; i++){

			let registro = JSON.parse(localStorage.getItem(i))

			if(registro === null){
				continue
			}
			registro.id = i
			registros.push(registro)
		}

		return registros

	}

	pesquisar(registro){

		let registrosFiltrados = Array()
		registrosFiltrados = this.recuperarTodosRegistros()

		console.log(registro) //quais filtros estou selecionando na tela

		console.log(registrosFiltrados) //registros antes do filtro

		//ano
		if (registro.ano != '') {
			registrosFiltrados = registrosFiltrados.filter(r => r.ano == registro.ano)
		}
		//mes
		if (registro.mes != '') {
			registrosFiltrados = registrosFiltrados.filter(r => r.mes == registro.mes)
		}
		//dia
		if (registro.dia != '') {
			registrosFiltrados = registrosFiltrados.filter(r => r.dia == registro.dia)
		}
		//tipo
		if (registro.tipo != '') {
			registrosFiltrados = registrosFiltrados.filter(r => r.tipo == registro.tipo)
		}
		//descricao
		/*if (registro.descricao != '') {
			registrosFiltrados = registrosFiltrados.filter(r => r.descricao == registro.descricao)
		}*/

		return registrosFiltrados //registros depois do filtro
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function cadastrarRegistro() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')

	let registro = new Registro(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value
	)
	if(registro.validarDados()){

		bd.gravar(registro)

		document.getElementById('modal_titulo').innerHTML = 'Gravado com sucesso!'
		document.getElementById('modal_titulo_classe').className = 'text-success'
		document.getElementById('modal_conteudo').innerHTML = 'A data foi registrada com sucesso.'
		document.getElementById('btn_modal').className = 'btn btn-success'

		$('#modalRegistraDespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''

	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na gravação!'
		document.getElementById('modal_titulo_classe').className = 'text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Existem campos a serem preenchidos.'
		document.getElementById('btn_modal').className = 'btn btn-danger'

		$('#modalRegistraDespesa').modal('show')
	}
}

function carregaListaRegistros(registros = Array()){

	if(registros.length == 0){
		registros = bd.recuperarTodosRegistros()
	}
	
	//selecionando tbody
	let listaRegistros = document.getElementById('listaRegistros')
	listaRegistros.innerHTML = ''

	registros.forEach(function(r){

		//criando tr
		let linha = listaRegistros.insertRow()
		//criando td
		linha.insertCell(0).innerHTML = `${r.dia}/${r.mes}/${r.ano}`

		switch(r.tipo){
			case '1' : r.tipo = 'Aniversário'
				break
			case '2' : r.tipo = 'Namoro'
				break
			case '3' : r.tipo = 'Noivado'
				break
			case '4' : r.tipo = 'Casamento'
				break
		}

		linha.insertCell(1).innerHTML = r.tipo
		linha.insertCell(2).innerHTML = r.descricao

		//botão de excluir
		let btn = document.createElement("button")
		btn.className = 'btn btn-secondary'
		btn.innerHTML = '<i class="fas fa-times fa-2xs"></i>'
		btn.id = 'id_registro_' + r.id
		btn.onclick = function(){
			let id = this.id.replace('id_registro_','')
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(3).append(btn)
	})
}

function pesquisarRegistros(){

	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value

	let registro = new Registro(ano, mes, dia, tipo)

	let registros = bd.pesquisar(registro)

	this.carregaListaRegistros(registros)


}