(function () {
  'use strict';

  const nomes = [];

  const STORAGE_KEY = 'amigoSecreto:nomes';
  function salvar() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nomes));
    } catch (e) {
      console.warn('Não foi possível salvar no localStorage:', e);
      mostrarErro('Atenção: não foi possível salvar os dados localmente. Suas mudanças podem não persistir.');
    }
  }
  function carregar() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.filter(v => typeof v === 'string' && v.trim()).forEach(v => nomes.push(v.trim()))
      }
    } catch (e) {
      console.warn('Não foi possível carregar do localStorage:', e);
    }
  }

  const form = document.getElementById('form-amigo');
  const input = document.getElementById('nome');
  const erro = document.getElementById('erro');
  const lista = document.getElementById('lista-amigos');
  const vazio = document.getElementById('vazio');
  const btnSortear = document.getElementById('btn-sortear');
  const btnSortearPares = document.getElementById('btn-sortear-pares');
  const btnLimpar = document.getElementById('btn-limpar');
  const resultadoTexto = document.getElementById('resultado-texto');
  const listaPares = document.getElementById('lista-pares');
  const paresSection = document.querySelector('.pares');
  const btnExportar = document.getElementById('btn-exportar');
  const btnImportar = document.getElementById('btn-importar');
  const inputArquivo = document.getElementById('arquivo-import');

  const MAX_LEN = 60;
  const nomeRegex = /^(?=\S)([\p{L}\p{M}][\p{L}\p{M}\-']*(?:\s[\p{L}\p{M}\-']+)*)$/u;

  function normalizar(str) {
    return str
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  function mostrarErro(msg) {
    erro.textContent = msg || '';
  }

  function limparErro() { mostrarErro(''); }

  function validarNome(valor) {
    const nome = (valor || '').trim();

    if (!nome) {
      return 'Por favor, digite um nome válido.';
    }
    if (nome.length > MAX_LEN) {
      return `O nome não pode ter mais de ${MAX_LEN} caracteres.`;
    }
    if (!nomeRegex.test(nome)) {
      return 'Use apenas letras, espaços, hífen ou apóstrofo.';
    }

    const canonical = normalizar(nome);
    const duplicado = nomes.some(n => normalizar(n) === canonical);
    if (duplicado) {
      return 'Este nome já foi adicionado.';
    }

    return null;
  }

  function atualizarBotoes() {
    btnSortear.disabled = nomes.length < 2;
    if (btnSortearPares) btnSortearPares.disabled = nomes.length < 2;
    document.getElementById('btn-adicionar').disabled = !input.value.trim();
  }

  function renderLista() {
    lista.innerHTML = '';

    if (nomes.length === 0) {
      vazio.style.display = 'block';
    } else {
      vazio.style.display = 'none';
    }

    nomes.forEach((nome, index) => {
      const li = document.createElement('li');

      const span = document.createElement('span');
      span.className = 'item-nome';
      span.textContent = nome;

      const remover = document.createElement('button');
      remover.className = 'btn-remove';
      remover.type = 'button';
      remover.setAttribute('aria-label', `Remover ${nome} da lista`);
      remover.title = 'Remover';
      remover.textContent = '×';
      remover.addEventListener('click', () => {
        nomes.splice(index, 1);
        renderLista();
        atualizarBotoes();
        resultadoTexto.textContent = '';
        salvar();
        if (listaPares) listaPares.innerHTML = '';
        atualizarParesVisibilidade();
      });

      li.appendChild(span);
      li.appendChild(remover);
      lista.appendChild(li);
    });
    atualizarParesVisibilidade();
  }

  function adicionarNome(event) {
    event?.preventDefault();
    limparErro();

    const valor = input.value;
    const erroMsg = validarNome(valor);
    if (erroMsg) {
      mostrarErro(erroMsg);
      if (!String(valor).trim()) {
        alert('Por favor, digite um nome válido.');
        input.focus();
      }
      return;
    }

    nomes.push(valor.trim());
    input.value = '';
    renderLista();
    atualizarBotoes();
    resultadoTexto.textContent = '';
    salvar();
    if (listaPares) listaPares.innerHTML = '';
    atualizarParesVisibilidade();
  }

  function sortear() {
    limparErro();
    if (nomes.length === 0) {
      mostrarErro('Adicione pelo menos um nome para sortear.');
      return;
    }
    const idx = Math.floor(Math.random() * nomes.length);
    const sorteado = nomes[idx];
    resultadoTexto.textContent = `Amigo secreto sorteado: ${sorteado}`;
    if (listaPares) listaPares.innerHTML = '';
    atualizarParesVisibilidade();
  }

  function sattoloShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
    return a;
  }

  function sortearPares() {
    limparErro();
    if (nomes.length < 2) {
      mostrarErro('Adicione pelo menos dois nomes para sortear pares.');
      return;
    }
    const remetentes = nomes.slice();
    const destinatarios = sattoloShuffle(nomes);
    for (let i = 0; i < remetentes.length; i++) {
      if (remetentes[i] === destinatarios[i]) {
        return sortearPares();
      }
    }
    if (listaPares) {
      listaPares.innerHTML = '';
      for (let i = 0; i < remetentes.length; i++) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = `${remetentes[i]} → ${destinatarios[i]}`;
        li.appendChild(span);
        listaPares.appendChild(li);
      }
    }
    resultadoTexto.textContent = '';
    atualizarParesVisibilidade();
  }

  function exportarJSON() {
    try {
      const data = JSON.stringify(nomes, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const agora = new Date();
      const pad = n => String(n).padStart(2, '0');
      const nomeArquivo = `amigos-${agora.getFullYear()}${pad(agora.getMonth()+1)}${pad(agora.getDate())}-${pad(agora.getHours())}${pad(agora.getMinutes())}.json`;
      a.href = url;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      mostrarErro('Não foi possível exportar o arquivo.');
    }
  }

  function importarJSONArquivos(files) {
    if (!files || !files[0]) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = JSON.parse(String(reader.result || '[]'));
        if (!Array.isArray(arr)) throw new Error('Formato inválido: esperado um array.');

        let adicionados = 0;
        for (const v of arr) {
          if (typeof v !== 'string') continue;
          const nome = v.trim();
          const erroMsg = validarNome(nome);
          if (!erroMsg) {
            nomes.push(nome);
            adicionados++;
          }
        }
        if (adicionados === 0) {
          mostrarErro('Nenhum nome válido para importar (ou todos já existiam).');
        } else {
          limparErro();
        }
        renderLista();
        atualizarBotoes();
        salvar();
      } catch (e) {
        mostrarErro('Arquivo inválido. Certifique-se de enviar um JSON com uma lista de nomes.');
      } finally {
        inputArquivo.value = '';
      }
    };
    reader.onerror = () => {
      mostrarErro('Falha ao ler o arquivo.');
      inputArquivo.value = '';
    };
    reader.readAsText(file);
  }

  function limparLista() {
    nomes.splice(0, nomes.length);
    renderLista();
    atualizarBotoes();
    resultadoTexto.textContent = '';
    salvar();
    atualizarParesVisibilidade();
  }

  form.addEventListener('submit', adicionarNome);
  input.addEventListener('input', () => {
    if (input.value.length > MAX_LEN) {
      input.value = input.value.slice(0, MAX_LEN);
    }
    limparErro();
    atualizarBotoes();
  });
  btnSortear.addEventListener('click', sortear);
  btnLimpar.addEventListener('click', limparLista);
  if (btnSortearPares) btnSortearPares.addEventListener('click', sortearPares);
  if (btnExportar) btnExportar.addEventListener('click', exportarJSON);
  if (btnImportar) btnImportar.addEventListener('click', () => inputArquivo?.click());
  if (inputArquivo) inputArquivo.addEventListener('change', (e) => importarJSONArquivos(e.target.files));

  carregar();
  renderLista();
  atualizarBotoes();
  function atualizarParesVisibilidade() {
    if (!paresSection) return;
    const hasPairs = !!(listaPares && listaPares.children.length);
    paresSection.style.display = hasPairs ? 'block' : 'none';
  }
  atualizarParesVisibilidade();
})();
