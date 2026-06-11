# 🎭 Quem Sou Eu?

Jogo de adivinha de personagens como PWA (Progressive Web App), desenvolvido para a disciplina de **Programação para Dispositivos Móveis**.

## 🎮 Como Jogar

- **Modo 1 - Eu Adivinharei:** O app sorteia um personagem secreto. Faça até 10 perguntas de Sim/Não para descobrir quem é!
- **Modo 2 - Bot Vai Adivinhar:** Você pensa em um personagem. O bot fará perguntas inteligentes e tentará adivinhar!

## ✨ Funcionalidades

- Dois modos de jogo (jogador vs bot)
- Bot com lógica de eliminação por pistas
- 3 categorias: Pessoas Reais, Personagens Fictícios e Animais
- Placar persistente na sessão
- Instalável como PWA no celular (ícone na tela inicial)
- Funciona offline após primeira visita
- Interface responsiva e otimizada para mobile

## 📱 Instalar no Celular

1. Acesse o link do projeto no navegador do celular
2. Toque em "Adicionar à tela inicial" (iOS) ou aguarde o banner de instalação (Android)
3. O app aparecerá na tela inicial como qualquer outro aplicativo!

## 🚀 Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- PWA: Service Worker + Web App Manifest
- Sem dependências externas — 100% client-side

## 🗂️ Estrutura do Projeto

```
quem-sou-eu/
├── index.html          # Estrutura do app
├── manifest.json       # Configuração PWA
├── sw.js               # Service Worker (offline)
├── css/
│   └── style.css       # Estilos
├── js/
│   ├── characters.js   # Banco de personagens
│   ├── bot.js          # Lógica de IA do bot
│   └── game.js         # Lógica principal do jogo
└── icons/
    ├── icon-192.png    # Ícone PWA
    └── icon-512.png    # Ícone PWA
```

## 👨‍💻 Autor

Desenvolvido como projeto individual para Programação para Dispositivos Móveis.

## 📋 Roadmap (próximas versões)

- [ ] Mais personagens e categorias
- [ ] Modo multiplayer local
- [ ] Histórico de partidas
- [ ] Tema escuro
- [ ] Sons e animações
