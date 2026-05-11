# MiMo Orbit Workbench

MiMo Orbit Workbench is a runnable application kit for applying to Xiaomi MiMo's creator incentive program. It turns a project profile into an application-ready pack: project pitch, AI tool, foundation model, evidence materials, milestones, token-plan justification, and risk controls.

The project is designed for the 2026 MiMo Orbit "Creator 100T Token Incentive Plan", where applicants are asked to provide their AI tool, underlying model, project description, and proof materials.

## Why This Project Fits

- Uses the official MiMo OpenAI-compatible Chat Completions endpoint.
- Defaults to `mimo-v2.5-pro`, which is positioned for complex Agent and Coding scenarios.
- Demonstrates a concrete builder workflow instead of a static proposal.
- Keeps `MIMO_API_KEY` on the server and provides mock mode for reviewers without credentials.

## Features

- React workbench for editing the application profile.
- Node/Express API proxy for MiMo Chat Completions.
- Mock mode when `MIMO_API_KEY` is missing.
- Application-pack preview matching likely MiMo Orbit form fields.
- Unit tests for prompt construction and fallback behavior.

## Quick Start

```bash
npm install
cp .env.example .env
npm run test
```

Start the API in one terminal:

```bash
node api/server.js
```

Start the web app in another terminal:

```bash
npm run dev
```

Open `http://127.0.0.1:5173`.

Requires Node.js 20 or newer.

## Live MiMo API Mode

Set `MIMO_API_KEY` in `.env`:

```bash
MIMO_API_KEY=your_mimo_api_key
MIMO_API_BASE=https://api.xiaomimimo.com/v1/chat/completions
MIMO_MODEL=mimo-v2.5-pro
```

The server sends the key as the `api-key` header. The browser never receives the key.

## Official API Shape

The MiMo OpenAI-compatible endpoint used by this project:

```txt
POST https://api.xiaomimimo.com/v1/chat/completions
api-key: $MIMO_API_KEY
Content-Type: application/json
```

Default request settings:

- `model`: `mimo-v2.5-pro`
- `response_format`: `{ "type": "json_object" }`
- `thinking`: `{ "type": "disabled" }`
- `stream`: `false`

## Application Evidence

Recommended materials to submit with the incentive application:

- GitHub repository URL.
- README and setup instructions.
- Screenshot or short demo video of the workbench.
- `docs/APPLICATION.md` as the draft application text.
- Notes on intended token usage and rollout milestones.

## Roadmap

- Import README, issues, and design docs for long-context analysis.
- Export application packs as Markdown and PDF.
- Add prompt history and MiMo usage tracking.
- Publish example applications for multiple creator categories.

## License

MIT

## Sources

- Xiaomi MiMo Orbit creator incentive announcement: <https://platform.xiaomimimo.com/docs/zh-CN/news/v2.5-open-sourced>
- Xiaomi MiMo application page: <https://100t.xiaomimimo.com/>
- Xiaomi MiMo OpenAI-compatible API docs: <https://platform.xiaomimimo.com/docs/zh-CN/api/chat/openai-api>
