// Bot que adivinha o personagem do jogador
const BOT_QUESTIONS = [
  // Perguntas de triagem ampla
  { question: "É uma pessoa real (não fictícia)?", key: "pessoa_real", affects: ["Pessoa Real"] },
  { question: "É um animal?", key: "animal", affects: ["Animal"] },
  { question: "É um personagem de filme, série ou livro?", key: "ficcao", affects: ["Personagem Fictício"] },

  // Pessoa real
  { question: "É do Brasil?", key: "brasileiro", cat: "Pessoa Real" },
  { question: "É homem?", key: "homem", cat: "Pessoa Real" },
  { question: "É cantor(a) ou músico(a)?", key: "musica", cat: "Pessoa Real" },
  { question: "É atleta ou esportista?", key: "esporte", cat: "Pessoa Real" },
  { question: "É jogador(a) de futebol?", key: "futebol", cat: "Pessoa Real" },
  { question: "Já morreu?", key: "morto", cat: "Pessoa Real" },
  { question: "É empresário ou ligado à tecnologia?", key: "tecnologia", cat: "Pessoa Real" },

  // Personagem fictício
  { question: "É um super-herói?", key: "super_heroi", cat: "Personagem Fictício" },
  { question: "É um vilão?", key: "vilao", cat: "Personagem Fictício" },
  { question: "Vem de um anime japonês?", key: "anime", cat: "Personagem Fictício" },
  { question: "É um personagem da Disney?", key: "disney", cat: "Personagem Fictício" },
  { question: "É do universo Marvel?", key: "marvel", cat: "Personagem Fictício" },
  { question: "É do universo DC (Batman, Superman)?", key: "dc", cat: "Personagem Fictício" },
  { question: "É personagem de livro?", key: "livro", cat: "Personagem Fictício" },
  { question: "É feminino?", key: "feminino", cat: "Personagem Fictício" },

  // Animal
  { question: "É um mamífero?", key: "mamifero", cat: "Animal" },
  { question: "Vive na água?", key: "aquatico", cat: "Animal" },
  { question: "É grande (maior que um cachorro)?", key: "grande", cat: "Animal" },
  { question: "É perigoso para humanos?", key: "perigoso", cat: "Animal" },
  { question: "Vive na África?", key: "africa", cat: "Animal" },
  { question: "É inseto?", key: "inseto", cat: "Animal" },
];

const BOT_GUESSES = {
  "Pessoa Real": [
    "Neymar","Beyoncé","Elon Musk","Anitta","Ronaldo","Lady Gaga",
    "Lula","Xuxa","Albert Einstein","Pelé","Madonna","Zuckerberg"
  ],
  "Personagem Fictício": [
    "Batman","Mulher Maravilha","Harry Potter","Sherlock Holmes",
    "Homem-Aranha","Darth Vader","Simba","Elsa","Shrek","Doraemon","Naruto","Hermione"
  ],
  "Animal": [
    "Elefante","Golfinho","Leão","Pinguim","Polvo",
    "Cobra","Coala","Tubarão","Borboleta","Gorila"
  ]
};

class BotEngine {
  constructor(category) {
    this.category = category;
    this.knownFacts = {};
    this.askedKeys = new Set();
    this.detectedCat = category !== "Qualquer" ? category : null;
    this.questionsAsked = 0;
    this.maxQ = 10;
    this.candidates = this._buildCandidates();
  }

  _buildCandidates() {
    if (this.detectedCat && this.detectedCat !== "Qualquer") {
      return [...(CHARACTERS[this.detectedCat] || [])];
    }
    return Object.values(CHARACTERS).flat();
  }

  _filterCandidates() {
    let pool = this._buildCandidates();
    // filter by detectedCat
    if (this.detectedCat) {
      pool = CHARACTERS[this.detectedCat] || pool;
    }
    // apply known facts
    for (const [key, val] of Object.entries(this.knownFacts)) {
      pool = pool.filter(c => !!c.clues[key] === val);
    }
    return pool;
  }

  receiveAnswer(key, answer) {
    this.knownFacts[key] = answer;
    this.askedKeys.add(key);

    // Detect category from first 3 questions
    if (key === "pessoa_real" && answer) this.detectedCat = "Pessoa Real";
    if (key === "animal" && answer)      this.detectedCat = "Animal";
    if (key === "ficcao" && answer)      this.detectedCat = "Personagem Fictício";

    this.questionsAsked++;
  }

  nextQuestion() {
    const remaining = this.maxQ - this.questionsAsked;
    if (remaining <= 0) return null;

    // Se só tem 1 candidato, chute
    const candidates = this._filterCandidates();
    if (candidates.length === 1 && this.questionsAsked >= 3) {
      return { type: "guess", guess: candidates[0].name };
    }

    // Escolhe próxima pergunta
    for (const q of BOT_QUESTIONS) {
      if (this.askedKeys.has(q.key)) continue;
      if (q.cat && q.cat !== this.detectedCat) continue;
      if (!q.cat && this.detectedCat) continue; // triagem já feita
      return { type: "question", question: q.question, key: q.key };
    }

    // Fallback: chute pelo candidato mais plausível
    if (candidates.length > 0) {
      return { type: "guess", guess: candidates[0].name };
    }

    // Último recurso
    const guessPool = BOT_GUESSES[this.detectedCat] || Object.values(BOT_GUESSES).flat();
    const g = guessPool[Math.floor(Math.random() * guessPool.length)];
    return { type: "guess", guess: g };
  }

  canGuessNow() {
    const remaining = this.maxQ - this.questionsAsked;
    return remaining <= 2 || this._filterCandidates().length === 1;
  }
}
