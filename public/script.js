const formularioCadastro = document.getElementById("formularioCadastro");
const formularioLogin = document.getElementById("formularioLogin");
const msgCadastro = document.getElementById("msgCadastro");
const msgLogin = document.getElementById("msgLogin");

function mostrarMensagem(el, texto, tipo) {
  el.textContent = texto;
  el.className = "mensagem " + tipo;
  el.style.display = "block";
}

function cadastrarUsuario(nome, email, senha, perfil) {
  fetch("/api/usuarios/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha, perfil }),
  })
    .then(async (res) => {
      const dados = await res.json();
      if (!res.ok) {
        mostrarMensagem(
          msgCadastro,
          dados.erro || "Erro ao cadastrar.",
          "erro",
        );
        return;
      }
      mostrarMensagem(
        msgCadastro,
        "Cadastro realizado com sucesso!",
        "sucesso",
      );
      formularioCadastro.reset();
    })
    .catch(() =>
      mostrarMensagem(msgCadastro, "Erro de conexão com o servidor.", "erro"),
    );
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
        mostrarMensagem(
          msgLogin,
          dados.erro || "Não foi possível fazer login.",
          "erro",
        );
        return;
      }

      sessionStorage.setItem("usuario_id", dados.usuario_id);
      sessionStorage.setItem("usuario_nome", dados.usuario_nome);
      sessionStorage.setItem("usuario_perfil", dados.perfil);

      if (dados.redirect) {
        window.location.href = dados.redirect;
      }
    })
    .catch(() =>
      mostrarMensagem(msgLogin, "Erro de conexão com o servidor.", "erro"),
    );
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
