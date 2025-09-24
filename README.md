# Challenge Amigo Secreto

Aplicação web simples, acessível e segura para cadastrar nomes e sortear o "Amigo Secreto" — com duas formas de sorteio: um único nome aleatório ou o sorteio de pares (derangement: ninguém tira a si mesmo).

## Demo (como rodar)
- Local: basta abrir o arquivo `index.html` no seu navegador (Chrome/Edge/Firefox). Não precisa de servidor.
- Deploy (GitHub Pages):
  1. Abra o repositório no GitHub e vá em `Settings` → `Pages`.
  2. Em "Build and deployment", selecione "Deploy from a branch".
  3. Escolha `main` e a pasta `/root`. Salve. Em alguns minutos o link ficará disponível.

## Recursos e funcionalidades
- Cadastro de nomes com validações:
  - Obrigatório (bloqueia vazio) e limite de 60 caracteres.
  - Formato permitido: letras (com acentos), espaços, hífen e apóstrofo.
  - Bloqueio de duplicados com normalização de acentos e caixa ("José" = "jose").
- Lista dinâmica:
  - Exibição dos nomes adicionados.
  - Remoção de itens individualmente (botão `×`).
  - Botão "Limpar" para esvaziar a lista.
- Sorteio:
  - "Sortear Amigo": escolhe um único nome aleatório da lista.
  - "Sortear Pares": cria pares remetente → destinatário sem permitir que alguém tire a si mesmo (Sattolo/derangement).
- Persistência:
  - A lista é salva automaticamente no navegador via `localStorage` e restaurada ao recarregar.
- Acessibilidade e UX:
  - Mensagens de erro com `aria-live`.
  - Foco visível em inputs e botões.
  - Botões habilitam/desabilitam conforme o contexto.
  - Seção "Pares sorteados" só aparece quando houver resultados.
- Segurança (front-end):
  - Uso de `textContent` ao renderizar nomes e resultados, mitigando XSS.

## Tecnologias
- HTML5 semântico
- CSS3 (layout responsivo, foco em contraste e legibilidade)
- JavaScript (ES6+), sem frameworks
- Web Storage API (`localStorage`)

## Estrutura do projeto
```
.
├─ index.html          # Interface e layout base
├─ css/
│  └─ style.css        # Tema (roxo/azul/rosa), acessibilidade e responsividade
└─ js/
   └─ app.js           # Lógica de cadastro, validação, sorteios e persistência
```

## Validações e regras
- Vazio: alerta e mensagem de erro.
- Tamanho: até 60 caracteres.
- Formato: letras (com acentos), espaços, hífen e apóstrofo.
- Duplicados: comparação normalizada (sem acentos, caixa baixa) para evitar repetição.

## Como contribuir (local)
1. Clone o repositório (ou baixe o zip).
2. Abra `index.html` no navegador.
3. Edite os arquivos em `css/` e `js/`. Ao salvar, recarregue a página.

Commits e push
```
git add .
git commit -m "feat: descreva sua mudança"
git push
```

## Publicação (GitHub Pages)
- `Settings` → `Pages` → Configure `main` /root e aguarde a URL ficar ativa.

## Roadmap de melhorias
- Exportar/Importar JSON (a lógica já existe no código; os botões não estão visíveis na UI atual).
- Página de impressão para compartilhar os pares sorteados.
- Tema escuro manual (além de seguir a preferência do sistema).
- Testes automatizados básicos (unitários para validações e sorteio).

## Licença
Projeto para fins educacionais/demonstração.
