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

function fazerLogin(nome, senha) {
  fetch("api/usuarios/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, senha }),
  });
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

  const nome = document.getElementById("Nome").value;
  const senha = document.getElementById("Senha").value;

  fazerLogin(nome, senha);
});
