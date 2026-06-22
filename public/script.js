const formularioCadastro = document.getElementById("formularioCadastro");

function cadastrarUsuario(nome, email, senha, perfil) {
  fetch("/api/usuarios/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha, perfil }),
  }).then(() => {
    formularioCadastro.reset();
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
