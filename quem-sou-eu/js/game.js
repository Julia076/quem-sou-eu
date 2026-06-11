// ── Estado global ──
let state = {
  mode: null,           // 'player' | 'bot'
  secretChar: null,     // { name, category, clues }
  questionsLeft: 10,
  questionsAsked: 0,
  score: { player: 0, bot: 0 },
  botEngine: null,
  botCategory: null,
  waitingBotAnswer: false,
  currentBotQ: null,
};

// ── Sugestões de perguntas ──
const SUGGESTIONS = [
  "É humano?", "É vivo?", "É famoso?", "É brasileiro?",
  "É homem?", "É real?", "É de filme?", "É animal?",
  "Tem poderes?", "É vilão?", "É músico?", "É esportista?"
];

// ── Navegação ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startGame(mode) {
  state.mode = mode;
  if (mode === 'player') {
    // Personagem aleatório para o jogador adivinhar
    const cat = randomCat();
    state.secretChar = getRandomCharacter(cat);
    state.questionsLeft = 10;
    state.questionsAsked = 0;

    document.getElementById('secret-char-display').textContent = '???';
    document.getElementById('secret-cat-display').textContent = `Categoria: ${state.secretChar.category}`;
    document.getElementById('questions-left').textContent = '10';

    clearChat('chat-box-player');
    addMsg('chat-box-player', 'bot', 'Oi! Escolhi um personagem. Faça perguntas de sim/não para descobrir quem sou eu!');
    loadSuggestions();
    showScreen('screen-player-guess');
  } else {
    showScreen('screen-setup');
  }
}

function randomCat() {
  const cats = ["Pessoa Real", "Personagem Fictício", "Animal"];
  return cats[Math.floor(Math.random() * cats.length)];
}

function startBotMode(category) {
  state.botCategory = category;
  state.questionsLeft = 10;
  state.questionsAsked = 0;
  state.botEngine = new BotEngine(category);
  state.waitingBotAnswer = false;

  document.getElementById('bot-category-display').textContent = category === 'Qualquer' ? '?' : category;
  document.getElementById('bot-questions-left').textContent = '10';

  clearChat('chat-box-bot');
  addMsg('chat-box-bot', 'bot', `Ótimo! Estou pronto para descobrir seu personagem de "${category}". Vou fazer perguntas, responda Sim ou Não!`);
  showScreen('screen-bot-guess');

  setTimeout(botAskNext, 800);
}

// ── Modo: Jogador Adivinha ──
function askQuestion() {
  const input = document.getElementById('question-input');
  const q = input.value.trim();
  if (!q) return;

  input.value = '';
  addMsg('chat-box-player', 'player', q);

  const answer = evaluateAnswer(q, state.secretChar);
  state.questionsLeft--;
  state.questionsAsked++;
  document.getElementById('questions-left').textContent = state.questionsLeft;

  setTimeout(() => {
    if (answer) {
      addMsg('chat-box-player', 'yes', '✅ Sim!');
    } else {
      addMsg('chat-box-player', 'no', '❌ Não!');
    }

    if (state.questionsLeft <= 0) {
      setTimeout(() => {
        addMsg('chat-box-player', 'bot', 'Acabaram suas perguntas! Quem você acha que sou?');
        showGuessInput();
      }, 600);
    }
    scrollChat('chat-box-player');
  }, 500);
}

function evaluateAnswer(question, char) {
  const q = question.toLowerCase();
  const clues = char.clues;

  // Detecção por palavras-chave simples
  const checks = {
    homem: ['homem', 'masculino', 'menino', 'cara', 'man'],
    mulher: ['mulher', 'feminino', 'menina', 'fem'],
    brasileiro: ['brasileiro', 'brasil', 'br'],
    americano: ['americano', 'eua', 'estados unidos', 'america'],
    musica: ['cantor', 'cantora', 'músic', 'music', 'canção', 'banda'],
    esporte: ['atleta', 'esport', 'sport'],
    futebol: ['futebol', 'soccer', 'bola'],
    tecnologia: ['tecnolog', 'empresar', 'ceo', 'startup'],
    politica: ['polític', 'president', 'govern'],
    tv: ['tv', 'televisão', 'apresent'],
    morto: ['morto', 'falecido', 'mort', 'dead'],
    super_heroi: ['super-herói', 'super heroi', 'herói', 'heroi', 'super'],
    vilao: ['vilão', 'vilao', 'malo'],
    anime: ['anime', 'mangá', 'manga', 'japonês', 'japones'],
    disney: ['disney', 'pixar'],
    marvel: ['marvel'],
    dc: ['dc', 'batman', 'superman'],
    livro: ['livro', 'book', 'literatur'],
    animal: ['animal', 'bicho', 'bichinho'],
    mamifero: ['mamíf', 'mamif'],
    aquatico: ['aquát', 'aquat', 'água', 'agua', 'mar', 'oceano', 'nada'],
    grande: ['grande', 'gigante', 'enorme'],
    perigoso: ['perigoso', 'perigo', 'danger'],
    africa: ['afric'],
    inseto: ['inseto', 'insect', 'bug'],
    real: ['real', 'existe', 'existiu', 'vivo', 'verdadeiro', 'pessoa real'],
    famoso: ['famoso', 'famosa', 'celebridade', 'celebr'],
    rico: ['rico', 'milion', 'bilion', 'dinheiro'],
    ficcao: ['fictíc', 'ficção', 'ficao', 'fict', 'inventado', 'personagem'],
  };

  for (const [key, keywords] of Object.entries(checks)) {
    if (keywords.some(kw => q.includes(kw))) {
      // Clue existe e é verdadeiro?
      if (key === 'real') return true; // todos são "reais" em algum sentido — avalia contexto
      if (key === 'ficcao') return char.category === 'Personagem Fictício';
      if (key === 'animal') return char.category === 'Animal';
      if (key === 'mulher') return !!clues['feminino'] || !!clues['mulher'] || !!clues['cantora'] || !!clues['apresentadora'];
      if (key === 'homem') return !!clues['homem'] || !!clues['masculino'];
      return !!clues[key];
    }
  }

  // Pergunta não mapeada: retorna resposta aleatória (50/50 com leve tendência a não)
  return Math.random() > 0.55;
}

function loadSuggestions() {
  const container = document.getElementById('suggestion-chips');
  container.innerHTML = '';
  const sample = SUGGESTIONS.sort(() => 0.5 - Math.random()).slice(0, 4);
  sample.forEach(s => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = s;
    chip.onclick = () => {
      document.getElementById('question-input').value = s;
      askQuestion();
    };
    container.appendChild(chip);
  });
}

// ── Palpite final do jogador ──
function showGuessInput() {
  document.getElementById('guess-modal').style.display = 'flex';
  document.getElementById('final-guess-input').focus();
}

function closeModal() {
  document.getElementById('guess-modal').style.display = 'none';
}

function submitFinalGuess() {
  const guess = document.getElementById('final-guess-input').value.trim();
  if (!guess) return;
  closeModal();

  const correct = guess.toLowerCase().includes(state.secretChar.name.toLowerCase()) ||
                  state.secretChar.name.toLowerCase().includes(guess.toLowerCase());

  if (correct) {
    state.score.player++;
    updateScoreboard();
    showResult(true, 'player', guess);
  } else {
    showResult(false, 'player', guess);
  }
}

// ── Modo: Bot Adivinha ──
function botAskNext() {
  if (!state.botEngine) return;

  const next = state.botEngine.nextQuestion();
  if (!next) {
    addMsg('chat-box-bot', 'bot', 'Não consigo mais adivinhar! Desisti 😅 Você ganhou!');
    state.score.player++;
    updateScoreboard();
    setTimeout(() => showResult(false, 'bot', '???'), 1000);
    return;
  }

  state.currentBotQ = next;

  if (next.type === 'question') {
    addMsg('chat-box-bot', 'bot', next.question);
    enableAnswerButtons(true);
    scrollChat('chat-box-bot');
  } else if (next.type === 'guess') {
    addMsg('chat-box-bot', 'bot', `🎯 Acho que é… ${next.guess}! Acertei?`);
    enableAnswerButtons(true);
    scrollChat('chat-box-bot');
  }
}

function answerBot(isYes) {
  if (!state.currentBotQ) return;
  enableAnswerButtons(false);

  const answer = isYes ? 'Sim!' : 'Não!';
  addMsg('chat-box-bot', 'player', answer);

  if (state.currentBotQ.type === 'guess') {
    if (isYes) {
      state.score.bot++;
      updateScoreboard();
      setTimeout(() => showResult(true, 'bot', state.currentBotQ.guess), 600);
    } else {
      state.botEngine.questionsAsked++;
      state.questionsLeft--;
      document.getElementById('bot-questions-left').textContent = state.questionsLeft;

      if (state.questionsLeft <= 0) {
        addMsg('chat-box-bot', 'bot', 'Esgotei minhas tentativas! Você ganhou 🏆 Quem era?');
        state.score.player++;
        updateScoreboard();
        setTimeout(() => showResult(false, 'bot', '???'), 1000);
        return;
      }
      setTimeout(botAskNext, 800);
    }
  } else {
    state.botEngine.receiveAnswer(state.currentBotQ.key, isYes);
    state.questionsLeft--;
    document.getElementById('bot-questions-left').textContent = state.questionsLeft;

    if (state.questionsLeft <= 0) {
      // Última chance: bot chuta
      const candidates = state.botEngine._filterCandidates();
      const guess = candidates.length > 0 ? candidates[0].name : 'Não sei!';
      setTimeout(() => {
        addMsg('chat-box-bot', 'bot', `Última chance! É ${guess}?`);
        state.currentBotQ = { type: 'guess', guess };
        enableAnswerButtons(true);
      }, 600);
    } else {
      setTimeout(botAskNext, 800);
    }
  }

  scrollChat('chat-box-bot');
}

function enableAnswerButtons(enabled) {
  const btns = document.querySelectorAll('#answer-buttons button');
  btns.forEach(b => b.disabled = !enabled);
}

// ── Resultado ──
function showResult(won, whoWon, guess) {
  const screen = document.getElementById('screen-result');
  const icon   = document.getElementById('result-icon');
  const title  = document.getElementById('result-title');
  const msg    = document.getElementById('result-message');
  const card   = document.getElementById('result-char-card');
  const stats  = document.getElementById('result-stats');

  if (state.mode === 'player') {
    if (won) {
      icon.textContent = '🏆';
      title.textContent = 'Acertou!';
      msg.textContent = `"${guess}" estava certo! Você é ótimo nisso!`;
    } else {
      icon.textContent = '😅';
      title.textContent = 'Quase!';
      msg.textContent = `Não era "${guess}". O personagem era:`;
    }
    card.innerHTML = `<div style="font-size:32px; margin-bottom:8px">🎭</div>
      <div style="font-size:20px; font-weight:800; color:var(--primary)">${state.secretChar.name}</div>
      <div style="font-size:14px; color:var(--text-muted); margin-top:4px">${state.secretChar.category}</div>`;
    stats.textContent = `Perguntas usadas: ${state.questionsAsked} de 10`;

  } else {
    // modo bot
    if (whoWon === 'bot') {
      icon.textContent = '🤖';
      title.textContent = 'Bot acertou!';
      msg.textContent = `O bot descobriu que era "${guess}". Tente dificultar mais!`;
    } else {
      icon.textContent = '🏆';
      title.textContent = 'Você ganhou!';
      msg.textContent = `O bot não conseguiu adivinhar seu personagem! Parabéns!`;
    }
    card.innerHTML = `<div style="font-size:32px; margin-bottom:8px">📊</div>
      <div style="font-size:16px; font-weight:600; color:var(--primary)">Placar Atual</div>
      <div style="display:flex; justify-content:center; gap:24px; margin-top:12px; font-size:24px; font-weight:800;">
        <div><div>${state.score.player}</div><div style="font-size:12px;color:var(--text-muted)">Você</div></div>
        <div style="color:var(--text-muted);font-weight:400">×</div>
        <div><div>${state.score.bot}</div><div style="font-size:12px;color:var(--text-muted)">Bot</div></div>
      </div>`;
    stats.textContent = '';
  }

  showScreen('screen-result');
}

function playAgain() {
  if (state.mode === 'player') startGame('player');
  else showScreen('screen-setup');
}

// ── Utils ──
function addMsg(chatId, type, text) {
  const chat = document.getElementById(chatId);
  const div = document.createElement('div');
  div.className = `msg ${type === 'player' ? 'player-msg' : type === 'yes' ? 'bot-msg msg-yes' : type === 'no' ? 'bot-msg msg-no' : 'bot-msg'}`;
  div.innerHTML = `<span>${text}</span>`;
  chat.appendChild(div);
  scrollChat(chatId);
}

function clearChat(chatId) {
  const chat = document.getElementById(chatId);
  chat.innerHTML = '';
}

function scrollChat(chatId) {
  const chat = document.getElementById(chatId);
  setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 50);
}

function updateScoreboard() {
  document.getElementById('sc-player').textContent = state.score.player;
  document.getElementById('sc-bot').textContent = state.score.bot;
}

// ── Enter para enviar ──
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('question-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') askQuestion();
  });
  document.getElementById('final-guess-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitFinalGuess();
  });
});

// ── PWA Install Banner ──
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.innerHTML = `
    <span>📱 Instale o app no seu celular!</span>
    <button onclick="installPWA()">Instalar</button>
    <button class="close-banner" onclick="this.parentElement.remove()">×</button>
  `;
  document.body.appendChild(banner);
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      const banner = document.getElementById('install-banner');
      if (banner) banner.remove();
    });
  }
}
