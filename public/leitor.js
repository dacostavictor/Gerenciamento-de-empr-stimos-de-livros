function listarLivros() {
  fetch("/api/livros/listar", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      listaLivros.innerHTML = "";
      data.forEach((livro) => {
        const li = document.createElement("li");
        li.innerHTML = `ID: ${livro.id} <br> Titulo: ${livro.titulo} <br> Autor: ${livro.autor} <br> Ano de publicação: ${livro.ano_publicacao} <br> Quantidade disponível: ${livro.quantidade_disponivel} <br>
                <button onclick="solicitarEmprestimo(${livro.id})" id="solicitarEmprestimo">Solicitar empréstimo</button>`;
        listaLivros.appendChild(li);
      });
    });
}

listarLivros();
