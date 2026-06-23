const PAGINAS_POR_PERFIL = {
  bibliotecario: "/bibliotecario.html",
  leitor: "/leitor.html",
};

function redirecionarPorPerfil(req, res) {
  const usuario = req.usuario;

  if (!usuario || !usuario.perfil) {
    return res.status(400).json({ erro: "Perfil do usuário não informado." });
  }

  const destino = PAGINAS_POR_PERFIL[usuario.perfil];

  if (!destino) {
    return res
      .status(403)
      .json({ erro: `Perfil "${usuario.perfil}" não reconhecido.` });
  }

  return res.json({
    mensagem: `Bem-vindo, ${usuario.nome}!`,
    perfil: usuario.perfil,
    redirect: destino,
  });
}

module.exports = { redirecionarPorPerfil, PAGINAS_POR_PERFIL };
