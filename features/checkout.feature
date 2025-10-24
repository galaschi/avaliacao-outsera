# language: pt

Funcionalidade: Fluxo de Checkout
  Como um cliente
  Quero adicionar produtos ao carrinho e finalizar a compra
  Para receber os produtos em casa

  Cenário: Compra bem-sucedida com dados válidos
    Dado que estou logado na loja
    E acesso o produto "Printed Summer Dress"
    E adiciono o produto ao carrinho
    E prossigo para o checkout
    E ja tenho endereço cadastrado
    E aceito os termos de serviço
    E seleciono pagamento com cartão de crédito
    Quando confirmo o pedido
    Então devo ver a mensagem de confirmação do pedido

  Cenário: Tentativa de compra sem aceitar os termos de serviço
    Dado que estou logado na loja
    E acesso o produto "Printed Summer Dress"
    E adiciono o produto ao carrinho
    E prossigo para o checkout
    E ja tenho endereço cadastrado
    Quando tento confirmar o pedido sem aceitar os termos de serviço
    Então devo ver uma mensagem de erro sobre os termos de serviço

  Cenário: Tentativa de compra de produto esgotado
    Dado que estou logado na loja
    E acesso o produto "Printed Summer Dress"
    E altero a quantidade para um valor maior que o estoque disponível
    Quando tento adicionar o produto ao carrinho
    Então devo ver uma mensagem de erro sobre estoque insuficiente