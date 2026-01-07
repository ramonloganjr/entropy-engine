# The Entropy Engine

A cryptographically secure lottery number generator built with Next.js and TypeScript. This application uses the Web Crypto API to generate truly random number combinations, mirroring the unbiased mechanics of established lottery systems like UAE Lottery and PCSO.

---

## Features

### Core Lottery Engine
- **Cryptographically Secure Randomness**: Uses `crypto.getRandomValues()` for true randomness
- **Multiple Lottery Configurations**: Supports Powerball, UAE Lottery, PCSO 6/49, and PCSO Ultra Lotto 6/58
- **Statistical Independence**: Each draw is a completely independent event
- **Validation Utilities**: Built-in chi-square and runs tests for randomness verification
- **Zero Deterministic Patterns**: Pure probability-based generation with no bias

### User Interface
- **Modern Glass Design**: Apple-inspired translucent interface with refined aesthetics
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Real-time Generation**: Instant lottery combination generation with smooth animations
- **Probability Visualization**: Visual representation of odds and statistical breakdowns
- **Ticket Scanner**: Upload losing tickets to contribute to the learning database

### Technical Features
- **Server-Side Rendering**: Next.js 16 with Turbopack for optimal performance
- **Type Safety**: Full TypeScript implementation with strict typing
- **Comprehensive Testing**: Statistical tests for randomness validation
- **Accessibility Focused**: Semantic HTML and ARIA-compliant components

---

## Technology Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="48" height="48" alt="Next.js" />
      <br><strong>Next.js 16</strong>
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
      <br><strong>React 19</strong>
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
      <br><strong>TypeScript</strong>
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind CSS" />
      <br><strong>Tailwind CSS</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="48" height="48" alt="Node.js" />
      <br><strong>Node.js</strong>
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg" width="48" height="48" alt="ESLint" />
      <br><strong>ESLint</strong>
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" width="48" height="48" alt="Jest" />
      <br><strong>Jest</strong>
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="48" height="48" alt="Git" />
      <br><strong>Git</strong>
    </td>
  </tr>
</table>

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ramonloganjr/entropy-engine.git
cd entropy-engine/frontend
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

### Production Build

```bash
npm run build
npm start
```

---

## Usage

### Generating Lottery Combinations

1. Select the number of combinations to generate (5, 10, 20, or 50)
2. Click the **Generate** button
3. View your cryptographically secure random combinations
4. Each combination displays white balls and the Powerball number

### Contributing Losing Tickets

1. Use the **Ticket Scanner** to upload images of losing tickets
2. Alternatively, enter numbers manually
3. Your contributions help build the learning database

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css      # Design system and styles
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Main application page
│   ├── components/
│   │   ├── Footer.tsx       # Application footer
│   │   ├── Icons.tsx        # SVG icon components
│   │   ├── LotteryBalls.tsx # Lottery ball display
│   │   ├── ProbabilityCone.tsx
│   │   ├── RealityCheck.tsx
│   │   └── TicketScanner.tsx
│   └── lib/
│       ├── api.ts           # API client
│       ├── lottery.ts       # Lottery engine core
│       └── lottery.test.ts  # Randomness tests
├── public/                   # Static assets
└── package.json
```

---

## Open Source

This project is **open source** and intended for **community-driven improvement** and **public benefit**. We welcome contributions from developers of all skill levels.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## License

This project is dual-licensed under:

- **MIT License** - For code and software components
- **Creative Commons Attribution 4.0 International (CC BY 4.0)** - For documentation and creative assets

See the [LICENSE](LICENSE) file for details.

---

## Security

For security concerns, please review our [Security Policy](SECURITY.md) and report vulnerabilities responsibly.

---

## Author

**Ramon Logan Jr.**

[![Website](https://img.shields.io/badge/Website-ramonloganjr.com-4da6ff?style=for-the-badge&logo=safari&logoColor=white)](https://www.ramonloganjr.com)
[![Email](https://img.shields.io/badge/Email-iam@ramonloganjr.com-4da6ff?style=for-the-badge&logo=gmail&logoColor=white)](mailto:iam@ramonloganjr.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ramonloganjr-4da6ff?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ramonloganjr)

---

## Disclaimer

The Entropy Engine is for **entertainment and mathematical exploration only**. No algorithm, filtering system, or random number generator can guarantee or improve lottery winning odds. All lottery outcomes remain subject to pure chance.

---

<p align="center">
  <strong>The Entropy Engine</strong><br>
  Variance Reduction Through Inverse Probability
</p>
