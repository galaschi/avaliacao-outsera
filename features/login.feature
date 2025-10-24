# language: pt

Funcionalidade: Login no site de exemplo
  Como um usuário do site de demonstração
  Quero fazer login na minha conta de usuário
  Para acessar a área de conta (minha conta)

  Contexto:
    Dado que estou na página de login

  Cenário: Login com sucesso
    Quando faço login com credenciais válidas
    Então devo ser redirecionado para a página da minha conta
    E devo ver o link de logout

  Cenário: Login com senha incorreta
    Quando faço login com credenciais inválidas
    Então devo ver uma mensagem de erro de login

  Esquema do Cenário: Campo obrigatório não preenchido
    Quando tento fazer login sem preencher o <campo>
    Então devo ver uma mensagem de erro para o campo <campo>

    Exemplos:
      | campo |
      | email |
      | senha |
