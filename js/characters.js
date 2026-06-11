const CHARACTERS = {
  "Pessoa Real": [
    { name: "Neymar",        clues: { esporte: true, futebol: true, brasileiro: true, homem: true, famoso: true } },
    { name: "Beyoncé",       clues: { musica: true, cantora: true, americana: true, mulher: true, famosa: true } },
    { name: "Elon Musk",     clues: { tecnologia: true, empresario: true, americano: true, homem: true, rico: true } },
    { name: "Anitta",        clues: { musica: true, cantora: true, brasileira: true, mulher: true, famosa: true } },
    { name: "Ronaldo",       clues: { esporte: true, futebol: true, brasileiro: true, homem: true, famoso: true } },
    { name: "Lady Gaga",     clues: { musica: true, cantora: true, americana: true, mulher: true, famosa: true } },
    { name: "Lula",          clues: { politica: true, presidente: true, brasileiro: true, homem: true, famoso: true } },
    { name: "Xuxa",          clues: { tv: true, apresentadora: true, brasileira: true, mulher: true, famosa: true } },
    { name: "Albert Einstein", clues: { ciencia: true, fisico: true, alemao: true, homem: true, morto: true } },
    { name: "Pelé",          clues: { esporte: true, futebol: true, brasileiro: true, homem: true, morto: true } },
    { name: "Madonna",       clues: { musica: true, cantora: true, americana: true, mulher: true, famosa: true } },
    { name: "Zuckerberg",    clues: { tecnologia: true, empresario: true, americano: true, homem: true, rico: true } },
  ],
  "Personagem Fictício": [
    { name: "Batman",        clues: { super_heroi: true, dc: true, humano: true, rico: true, masculino: true } },
    { name: "Mulher Maravilha", clues: { super_heroi: true, dc: true, feminino: true, guerreira: true } },
    { name: "Harry Potter",  clues: { livro: true, feiticeiro: true, britanico: true, masculino: true, jovem: true } },
    { name: "Sherlock Holmes", clues: { livro: true, detetive: true, britanico: true, masculino: true, humano: true } },
    { name: "Homem-Aranha",  clues: { super_heroi: true, marvel: true, jovem: true, masculino: true } },
    { name: "Darth Vader",   clues: { vilao: true, star_wars: true, masculino: true, humano: true } },
    { name: "Simba",         clues: { animal: true, disney: true, leao: true, masculino: true, animacao: true } },
    { name: "Elsa",          clues: { disney: true, princesa: true, feminino: true, poderes: true, animacao: true } },
    { name: "Shrek",         clues: { ogro: true, animacao: true, dreamworks: true, masculino: true, engraçado: true } },
    { name: "Doraemon",      clues: { anime: true, robo: true, japones: true, amigavel: true } },
    { name: "Naruto",        clues: { anime: true, ninja: true, japones: true, masculino: true, jovem: true } },
    { name: "Hermione",      clues: { livro: true, feiticeira: true, britanica: true, feminino: true, jovem: true } },
  ],
  "Animal": [
    { name: "Elefante",      clues: { mamifero: true, grande: true, africa: true, terrestre: true, herbivoro: true } },
    { name: "Golfinho",      clues: { mamifero: true, aquatico: true, inteligente: true, amigavel: true } },
    { name: "Leão",          clues: { mamifero: true, africa: true, carnivoro: true, rei: true, grande: true } },
    { name: "Pinguim",       clues: { ave: true, nao_voa: true, polo: true, aquatico: true, pequeno: true } },
    { name: "Polvo",         clues: { marinho: true, inteligente: true, tentaculos: true, muda_cor: true } },
    { name: "Cobra",         clues: { reptil: true, sem_pernas: true, perigosa: true, terrestre: true } },
    { name: "Coala",         clues: { mamifero: true, australia: true, herbivoro: true, arvore: true, fofo: true } },
    { name: "Tubarão",       clues: { peixe: true, aquatico: true, carnivoro: true, perigoso: true, grande: true } },
    { name: "Borboleta",     clues: { inseto: true, voa: true, colorida: true, metamorfose: true } },
    { name: "Gorila",        clues: { mamifero: true, primata: true, africa: true, forte: true, grande: true } },
  ]
};

function getRandomCharacter(category) {
  if (category === "Qualquer") {
    const cats = Object.keys(CHARACTERS);
    category = cats[Math.floor(Math.random() * cats.length)];
  }
  const list = CHARACTERS[category];
  const char = list[Math.floor(Math.random() * list.length)];
  return { ...char, category };
}
