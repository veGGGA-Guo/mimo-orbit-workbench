const DEFAULT_ENDPOINT = 'https://api.xiaomimimo.com/v1/chat/completions';
const DEFAULT_MODEL = 'mimo-v2.5-pro';

export function buildApplicationPrompt(profile) {
  const repository = profile.repository || 'https://github.com/your-name/mimo-orbit-workbench';
  const model = profile.model || DEFAULT_MODEL;
  const audience = profile.audience || 'AI builders, open-source maintainers, and creator teams';
  const useCase =
    profile.useCase ||
    'long-context repository and document analysis for preparing evidence-rich MiMo Orbit applications';

  return [
    {
      role: 'system',
      content:
        'You are MiMo Orbit Workbench. Produce concise, practical, application-ready material for the Xiaomi MiMo creator incentive program. Output valid JSON only.',
    },
    {
      role: 'user',
      content: JSON.stringify(
        {
          task: 'Create a creator incentive application pack.',
          requiredFields: [
            'projectTitle',
            'oneSentencePitch',
            'aiTool',
            'foundationModel',
            'projectDescription',
            'evidenceMaterials',
            'milestones',
            'tokenPlanJustification',
            'riskControls',
          ],
          projectProfile: {
            name: profile.name || 'MiMo Orbit Workbench',
            repository,
            model,
            audience,
            useCase,
            currentStatus:
              profile.currentStatus ||
              'prototype with React workbench, OpenAI-compatible MiMo API proxy, and mock mode',
          },
        },
        null,
        2,
      ),
    },
  ];
}

export function createMockApplication(profile = {}) {
  const repository = profile.repository || 'https://github.com/your-name/mimo-orbit-workbench';
  const model = profile.model || DEFAULT_MODEL;

  return {
    projectTitle: profile.name || 'MiMo Orbit Workbench',
    oneSentencePitch:
      '一个面向创作者和开源维护者的长上下文项目分析工作台，用 MiMo-V2.5-Pro 把仓库、文档和申请材料整理成可提交的激励计划申请包。',
    aiTool: 'MiMo Orbit Workbench Web App + MiMo OpenAI-compatible Chat Completions API',
    foundationModel: model,
    projectDescription:
      '项目提供可运行的 React 工作台和 Node API 代理。用户填写仓库、使用场景、目标受众与当前进度后，系统调用 MiMo-V2.5-Pro 生成申请摘要、证明材料清单、里程碑和 Token 使用计划。项目尤其利用 MiMo-V2.5-Pro 的 100 万上下文、Agent 与 Coding 场景适配能力，帮助开发者把零散的仓库证据整理为可审核材料。',
    evidenceMaterials: [
      repository,
      'docs/APPLICATION.md 中的申请表草稿',
      '本地运行截图或演示视频',
      'README.md 中的安装、API 配置与模拟模式说明',
      '后续可补充真实 MiMo API 调用日志、prompt 样例和用户反馈',
    ],
    milestones: [
      '第 1 周：完成可交互申请工作台、模拟模式和 GitHub 项目说明',
      '第 2 周：接入真实 MiMo API Key，沉淀 5 个开源仓库申请样例',
      '第 3 周：加入文件上传、长文档摘要和申请包导出',
      '第 4 周：整理教程文章和演示视频，邀请创作者试用',
    ],
    tokenPlanJustification:
      'Max 档 Token Plan 将用于长上下文仓库分析、多轮申请材料改写、不同项目方向 A/B 生成和教程样例制作。高 Token 额度能覆盖真实开源仓库的 README、issue、设计文档和代码片段输入。',
    riskControls: [
      'API Key 仅保存在服务端环境变量，不进入浏览器 bundle',
      '默认提供 mock mode，审核者无需密钥即可体验核心流程',
      '申请材料生成结果需要人工确认后再提交',
      'README 明确说明数据边界和不上传敏感仓库内容的建议',
    ],
    mock: true,
  };
}

export function parseApplicationContent(content) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonText = fenced ? fenced[1] : trimmed;

  return JSON.parse(jsonText);
}

export async function generateApplication(profile, env = process.env) {
  const apiKey = env.MIMO_API_KEY;

  if (!apiKey) {
    return createMockApplication(profile);
  }

  const endpoint = env.MIMO_API_BASE || DEFAULT_ENDPOINT;
  const model = profile.model || env.MIMO_MODEL || DEFAULT_MODEL;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      model,
      messages: buildApplicationPrompt({ ...profile, model }),
      max_completion_tokens: 1600,
      temperature: 0.4,
      top_p: 0.9,
      response_format: { type: 'json_object' },
      stream: false,
      thinking: { type: 'disabled' },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`MiMo API request failed (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('MiMo API returned an empty message.');
  }

  return {
    ...parseApplicationContent(content),
    usage: data.usage || null,
    mock: false,
  };
}
