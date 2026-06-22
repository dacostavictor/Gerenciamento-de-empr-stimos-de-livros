const listaLivros = document.getElementById("listaLivros");
const registrarLivro = document.getElementById("registrarLivro");

function adicionarLivro(titulo, autor, ano_publicacao, quantidade_disponivel) {
  fetch("/api/livros/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo,
      autor,
      ano_publicacao,
      quantidade_disponivel,
    }),
  }).then(() => {
    registrarLivro.reset();
    listarLivros();
  });
}

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
                <button onclick="editarLivro(${livro.id})" id="editar">Editar</button>
                <button onclick="excluirLivro(${livro.id})" id="excluir">Excluir</button>`;
        listaLivros.appendChild(li);
      });
    });
}

listarLivros();

function editarLivro(id) {
  const titulo = prompt("Titulo do livro: ");
  const autor = prompt("Autor do livro: ");
  const ano_publicacao = prompt("Ano de publicação do livro: ");
  const quantidade_disponivel = prompt("Quantidade disponível: ");

  if (!titulo || !autor || !ano_publicacao || !quantidade_disponivel) {
    alert("Todos os campos devem ser preenchidos!");
    return;
  }

  fetch(`/api/livros/editar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo,
      autor,
      ano_publicacao,
      quantidade_disponivel,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao editar livro!");
      return res.json();
    })
    .then(() => {
      listarLivros();
    })
    .catch((err) => {
      alert("Não foi possível editar o livro!");
      console.error(err);
    });
}

function excluirLivro(id) {
  const confirmacao = confirm(
    "Tem certeza de que deseja excluir o livro selecionado?",
  );

  if (!confirmacao) {
    return;
  }

  fetch(`/api/livros/excluir/${id}`, {
    method: "DELETE",
  }).then(() => {
    listarLivros();
  });
}

registrarLivro.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const ano_publicacao = document.getElementById("ano_publicacao").value;
  const quantidade_disponivel = document.getElementById(
    "quantidade_disponivel",
  ).value;

  adicionarLivro(titulo, autor, ano_publicacao, quantidade_disponivel);
});
