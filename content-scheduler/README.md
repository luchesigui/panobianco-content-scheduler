# Content Scheduler

A simple, single-user Content Scheduler web application built with Next.js. Parse structured text content plans and display them on an interactive monthly calendar with drag-and-drop functionality.

## Features

- **Text Parsing**: Paste structured Portuguese content plans and automatically extract content pieces
- **Interactive Calendar**: View content on a monthly calendar using react-big-calendar
- **Drag & Drop**: Reorganize content by dragging events between dates
- **Content Status**: Track published vs unpublished content with visual indicators
- **Detailed Tooltips**: Hover over events to see full content details
- **Publish Tracking**: Mark content as published directly from tooltips
- **Local Storage**: All data persists in browser localStorage

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Calendar**: react-big-calendar with drag-and-drop addon
- **Date Handling**: moment.js
- **Storage**: Browser localStorage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd content-scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Input Page (/)

The main page features a clean, GPT-like interface where you can:

1. Paste your structured content plan in the large textarea
2. Click "Generate Schedule" to parse and save the content
3. Automatically redirect to the calendar view

### 2. Expected Input Format

The application parses Portuguese content plans with this structure:

```
🗓️ Plano de Conteúdo Semanal (02/08 a 08/08)
Aqui estão 10 ideias de posts e 3 roteiros de Reels focados na primeira semana cheia de agosto.

💡 10 Ideias de Conteúdo Estático (Feed)
1. Post de Sábado (Foco: Geral/Comunidade)

Descrição do Post (Imagem/Arte): Foto energética de uma aula de funcional ou jump acontecendo no sábado, com pessoas sorrindo. Texto na imagem: "Fim de semana também é dia de cuidar de você."

Legenda:
Atenção: Aquele gás extra para o seu fim de semana começa aqui! ⚡

Interesse: Sabia que nossos horários de sábado (08h às 18h) e domingo (09h às 13h) são pensados para você que não para?  Comece o dia com uma aula contagiante ou faça aquele treino de musculação sem pressa.

Desejo: Imagine a sensação de dever cumprido, saindo da academia no sábado com a energia renovada para aproveitar o resto do dia. É o melhor jeito de começar o fds!

Ação: Qual a sua meta de treino para este fim de semana? Comente aqui! 👇 #FimDeSemanaAtivo #PanobiancoSatelite #SaudeEmDia

2. Post de Domingo (Foco: Mariana, a Executiva)

Descrição do Post (Imagem/Arte): Carousel. Slide 1: Uma mulher olhando para o celular com uma agenda, com a logo do "App Panobianco Academia"  em destaque. Texto: "Sua semana começa organizada aqui". Slide 2: Print da tela do app mostrando o agendamento de aulas.

Legenda:
Atenção: Domingo à noite e a ansiedade da semana já está batendo? 😟

Interesse: Com o App Panobianco, você planeja sua semana de treinos e aulas em minutos. Deixe as aulas de Pilates, Funcional ou Muay Thai já agendadas e garanta seu compromisso com o bem-estar.

Desejo: Comece a segunda-feira com a certeza de que sua "válvula de escape" já está programada. Menos uma coisa para se preocupar, mais tempo para focar nos seus resultados.

Ação: Você já usa nosso app para agendar suas aulas? Salve este post como lembrete para planejar sua semana! 📲 #Organizacao #AppPanobianco #MarianaNaPano #MenosEstresse
```

### 3. Calendar Page (/calendar)

The calendar page provides:

- **Monthly View**: Full month calendar displaying all content pieces
- **Color Coding**: 
  - Gray/Dark: Unpublished content
  - Green: Published content
- **Drag & Drop**: Click and drag events to different dates
- **Hover Tooltips**: Hover over events to see:
  - Full content details
  - Post description
  - Complete caption
  - Publish button (for unpublished content)

### 4. Parsing Logic

The application automatically:

1. Extracts the week date range from the header
2. Maps Portuguese day names to actual dates
3. Parses individual content pieces with:
   - Title extraction
   - Post description parsing
   - Caption content extraction
4. Generates unique IDs for each content piece
5. Saves to localStorage in structured JSON format

### 5. Data Structure

Each content piece follows this schema:

```typescript
{
  id: string;           // Unique identifier
  date: string;         // ISO date (YYYY-MM-DD)
  title: string;        // Post title
  isPublished: boolean; // Publication status
  fullContent: {
    postDescription: string; // Image/art description
    caption: string;         // Full post caption
  };
}
```

## Development

### Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main input page
│   ├── calendar/
│   │   └── page.tsx      # Calendar view page
│   ├── globals.css       # Global styles + calendar CSS
│   └── layout.tsx        # Root layout
├── components/
│   └── ContentTooltip.tsx # Tooltip component
├── types/
│   └── content.ts        # TypeScript interfaces
└── utils/
    ├── parser.ts         # Text parsing logic
    └── localStorage.ts   # Storage utilities
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Browser Support

- Modern browsers with localStorage support
- Chrome, Firefox, Safari, Edge (latest versions)

## Limitations

- Single-user application (no authentication)
- Data stored only in browser localStorage
- Portuguese language content parsing
- Month view only (no week/day views)

## Future Enhancements

- Multi-language support
- Database persistence
- User authentication
- Week/day calendar views
- Content export functionality
- Bulk operations
- Content templates

## License

This project is licensed under the MIT License.
