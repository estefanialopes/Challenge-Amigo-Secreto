# Amigo Secreto

Aplicação web simples e acessível para cadastrar nomes de amigos e realizar sorteios de Amigo Secreto, incluindo sorteio de pares (derangement) onde ninguém tira a si mesmo.

## Tecnologias utilizadas
- HTML5 (estrutura semântica)
- CSS3 (UI/UX com foco em contrastes, acessibilidade e responsividade)
- JavaScript (ES6+), sem frameworks
- Web Storage API (`localStorage`) para persistência local

## Funcionalidades
- Cadastro de nomes com validações:
  - Campo obrigatório, tamanho máximo e caracteres válidos
  - Bloqueio de duplicados com normalização (ignora acentos e caixa)
- Lista dinâmica com remoção de itens e botão "Limpar"
- Sorteio aleatório de um único amigo
- Sorteio de pares (algoritmo de Sattolo) garantindo que ninguém se sorteie
- Persistência automática no navegador via `localStorage`
- Acessibilidade:
  - Mensagens com `aria-live`
  - Foco visível
  - Rótulos e `aria-label` nos controles
- UI/UX:
  - Cabeçalho (hero) com gradiente em tons de rosa/azul/roxo
  - Quadro central com azul claro e textos roxos escuros para ótima leitura
  - Ilustração SVG fofa e abstrata no topo (sem pessoas reais)

## Como executar
Não é necessário servidor. Basta abrir o arquivo `index.html` no navegador:

1. Localize o arquivo:
   `c:/Users/estef/OneDrive/Área de Trabalho/amigosecreto/index.html`
2. Clique duas vezes para abrir no navegador (Chrome/Edge/Firefox) ou arraste o arquivo para a janela do navegador.

## Como usar
1. Digite um nome e clique em "Adicionar" (ou Enter).
2. Adicione pelo menos 2 nomes.
3. Use as ações:
   - "Sortear Amigo": escolhe uma pessoa aleatória da lista
   - "Sortear Pares": cria todos os pares (ninguém tira a si mesmo)
   - "Limpar": esvazia a lista

Notas:
- A lista é salva automaticamente e restaurada ao reabrir a página (via `localStorage`).
- Em ambientes com restrições de armazenamento, uma mensagem avisa que a persistência pode falhar.

## Estrutura do projeto
```
amigosecreto/
├─ index.html        # Interface principal
├─ css/
│  └─ style.css      # Estilos e tema (cores, foco, acessibilidade)
└─ js/
   └─ app.js         # Lógica de cadastro, validação, sorteios e persistência
```

## Decisões de design
- Segurança: todo conteúdo dinâmico é inserido via `textContent` para mitigar XSS.
- Validação: regex permite letras (inclui acentos), espaços, hífen e apóstrofo.
- Derangement: o sorteio de pares usa Sattolo para evitar pontos fixos (ninguém tira a si mesmo).
- Acessibilidade/UX: foco visível, mensagens vivas, hierarquia de ações e contraste adequado.

## Melhorias futuras
- Atalhos de teclado e microinterações adicionais
- Exportar/Importar JSON (feature já implementada no código, atualmente sem botões na UI)
- Tema escuro manual (além do suporte a preferências do sistema)

## Licença
Projeto para fins educacionais/demonstração.
