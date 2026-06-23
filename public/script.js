const formularioCadastro = document.getElementById("formularioCadastro");
const formularioLogin = document.getElementById("formularioLogin");

function cadastrarUsuario(nome, email, senha, perfil) {
  fetch("/api/usuarios/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha, perfil }),
  }).then(() => {
    formularioCadastro.reset();
  });
}

function fazerLogin(email, senha) {
  fetch("/api/usuarios/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  })
    .then(async (resposta) => {
      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || "Não foi possível fazer login.");
        return;
      }

      // O backend (middleware redirecionarPorPerfil) devolve a página
      // de destino de acordo com o perfil do usuário.
      if (dados.redirect) {
        window.location.href = dados.redirect;
      }
    })
    .catch(() => alert("Erro de conexão com o servidor."));
}

formularioCadastro.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const perfil = document.getElementById("perfil").value;

  cadastrarUsuario(nome, email, senha, perfil);
});

formularioLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("Email").value;
  const senha = document.getElementById("Senha").value;

  fazerLogin(email, senha);
});
