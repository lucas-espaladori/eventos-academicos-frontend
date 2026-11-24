// URL pública da API hospedada no Render
const API_URL = 'https://eventos-academicos-backend.onrender.com';

const form = document.getElementById('form-evento');
const lista = document.getElementById('lista-eventos');
const mensagem = document.getElementById('mensagem');

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

async function listarEventos() {
  try {
    const resposta = await fetch(`${API_URL}/eventos`);
    if (!resposta.ok) throw new Error('Erro ao buscar eventos');
    const eventos = await resposta.json();

    if (eventos.length === 0) {
      lista.textContent = 'Nenhum evento cadastrado.';
      return;
    }

    lista.innerHTML = eventos.map(e => `
      <article class="evento">
        <h3>${escapeHtml(e.titulo)}</h3>
        <p>${escapeHtml(e.descricao)}</p>
        <p class="info"><strong>Data:</strong> ${escapeHtml(e.data_evento)}
           &nbsp;|&nbsp; <strong>Local:</strong> ${escapeHtml(e.local)}</p>
      </article>
    `).join('');
  } catch (erro) {
    lista.textContent = 'Não foi possível carregar os eventos. Se a API estava inativa, aguarde cerca de 1 minuto e recarregue a página.';
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const novoEvento = {
    titulo: document.getElementById('titulo').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    data_evento: document.getElementById('data_evento').value.trim(),
    local: document.getElementById('local').value.trim()
  };

  const botao = form.querySelector('button');
  botao.disabled = true;
  mensagem.className = '';
  mensagem.textContent = 'Enviando...';

  try {
    const resposta = await fetch(`${API_URL}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoEvento)
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao cadastrar');

    mensagem.className = 'ok';
    mensagem.textContent = 'Evento cadastrado com sucesso!';
    form.reset();
    listarEventos();
  } catch (erro) {
    mensagem.className = 'erro';
    mensagem.textContent = 'Erro: ' + erro.message;
  } finally {
    botao.disabled = false;
  }
});

listarEventos();
