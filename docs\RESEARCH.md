# Research Notes

## Creator Incentive Plan

Official Xiaomi MiMo materials describe the MiMo Orbit plan as an ecosystem program around the MiMo-V2.5 series. The creator incentive part distributes up to 100T tokens during the campaign window, uses an application process, and asks applicants to provide concrete project context and proof materials.

Key facts used by this repository:

- Campaign window: Beijing time 2026-04-28 00:00 to 2026-05-28 00:00.
- Application URL: <https://100t.xiaomimimo.com/>
- Applicants can receive Token Plan credits after review.
- Project review depends on use case, requested needs, and submitted materials.

## MiMo API

The workbench follows the official OpenAI-compatible Chat Completions shape:

- Endpoint: `https://api.xiaomimimo.com/v1/chat/completions`
- Header: `api-key: $MIMO_API_KEY`
- Default model in this project: `mimo-v2.5-pro`

The implementation keeps API keys on the local server and exposes only `/api/generate-application` to the browser.

## Sources

- <https://platform.xiaomimimo.com/docs/zh-CN/news/v2.5-open-sourced>
- <https://platform.xiaomimimo.com/docs/zh-CN/api/chat/openai-api>
- <https://100t.xiaomimimo.com/>
