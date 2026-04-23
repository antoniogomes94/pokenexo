# Pokenexo 🎮

Um clone temático Pokémon do jogo **Conexo** (inspirado em NYT Connections). Forme grupos de 4 Pokémon conectados por um tema oculto em um jogo diário aleatório.

## 🌐 Acesse Agora

**[Jogar Pokenexo →](https://antoniogomes94.github.io/pokenexo/)**

## 📋 Sobre o Jogo

- **Objetivo**: Forme 4 grupos de 3 Pokémon que compartilham um tema em comum
- **Mecânica**: Selecione 3 Pokémon para testar sua hipótese
- **Cores**: Cada grupo correto revela uma cor (Pikachu, Bulbasaur, Squirtle, Charmander)
- **Jogo Diário**: Um novo desafio gerado todos os dias de forma determinística

## ✨ Features

- ✅ **Tela home estilo Conexo.ws** — Logo Pokébola SVG, card jogo diário, faixa semanal
- ✅ **Jogo diário aleatório** — Gerado via seed com `themes.json` (1177+ temas)
- ✅ **Distribuição balanceada** — Nunca 2 temas fáceis (1 fácil + 2 médio + 1 difícil OU 1 fácil + 1 médio + 2 difícil)
- ✅ **Sem sobreposição** — Garantido: nenhum Pokémon aparece em mais de um grupo
- ✅ **Compatível com file://** — Funciona abrindo `index.html` direto ou via servidor
- ✅ **Persistência** — Estado salvo em localStorage
- ✅ **Compartilhamento** — Copie seu resultado com emojis
- ✅ **Botões de dev** — ↺ Resetar jogo, 🎲 Novo aleatório (temporários)

## 🚀 Como Rodar Localmente

### Opção 1: Abrir direto no navegador
```bash
# Navegue até o arquivo e abra no navegador
open index.html  # macOS
# ou ctrl+o no navegador e selecione o arquivo
```

### Opção 2: Usar servidor local
```bash
cd pokenexo
python3 -m http.server 8000
# Acesse: http://localhost:8000
```

### Opção 3: Live Server (VS Code)
1. Instale extensão "Live Server"
2. Clique direito em `index.html` → "Open with Live Server"

## 📁 Estrutura

```
pokenexo/
├── index.html              # Página principal
├── themes.json             # Banco de temas (1177+ entradas)
├── README.md               # Este arquivo
├── CLAUDE.md               # Documentação técnica
├── css/
│   └── styles.css          # Estilos (paleta Pokémon)
└── js/
    ├── app.js              # Router hash-based
    ├── home.js             # Tela inicial
    ├── game.js             # Loop do jogo
    ├── games.js            # Dados dos jogos + gerador diário
    ├── calendar.js         # Tela "Jogos anteriores" (mockada)
    ├── storage.js          # localStorage
    ├── share.js            # Compartilhamento
    └── themes.js           # Dados de temas (gerado)
```

## 🎨 Paleta de Cores

Inspirada nos iniciais de Kanto + Pikachu:

- **Amarelo** (`#F8D030`) — Pikachu ⚡
- **Verde** (`#78C850`) — Bulbasaur 🌱
- **Azul** (`#6890F0`) — Squirtle 💧
- **Laranja** (`#F08030`) — Charmander 🔥

## 🛠️ Tecnologias

- **HTML5** — Estrutura semântica
- **CSS3** — Variáveis, Grid, Flexbox, animações
- **Vanilla JavaScript** — Sem frameworks, sem build tools
- **localStorage** — Persistência de estado
- **JSON** — Banco de temas

## 📖 Como Jogar

1. Acesse [pokenexo.github.io/pokenexo](https://antoniogomes94.github.io/pokenexo/)
2. Clique em **"Jogar"** para iniciar o jogo diário
3. Selecione 3 Pokémon que acredita compartilhar um tema
4. Se acertar, o grupo é revelado; se errar, a seleção é resetada
5. Descubra todos os 4 grupos
6. Compartilhe seu resultado com amigos!

## 📝 Notas

- Cada jogo diário é determinístico por data (mesmo resultado para todos no mesmo dia)
- Estado salvo automaticamente em localStorage
- Botões de dev (↺ 🎲) são temporários para testes do MVP
- "Jogos anteriores" é um placeholder em construção

## 🔗 Links

- **Play**: [GitHub Pages](https://antoniogomes94.github.io/pokenexo/)
- **Repo**: [GitHub](https://github.com/antoniogomes94/pokenexo)
- **Inspirado em**: [conexo.ws](https://conexo.ws) e [NYT Connections](https://www.nytimes.com/games/connections)
- **Tema**: Pokémon © Nintendo/Game Freak

---

**Feito com ❤️ por [Antonio Gomes](https://github.com/antoniogomes94)**
