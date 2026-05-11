import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Braces,
  ClipboardList,
  Github,
  Loader2,
  Orbit,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import './styles.css';

const starterProfile = {
  name: 'MiMo Orbit Workbench',
  repository: 'https://github.com/your-name/mimo-orbit-workbench',
  model: 'mimo-v2.5-pro',
  audience: 'AI builders, open-source maintainers, creator teams',
  useCase: '长上下文仓库和文档分析，生成可提交的小米 MiMo 创作者激励计划申请材料',
  currentStatus: 'React 工作台 + Node API 代理 + mock mode 已可运行',
};

const localFallback = {
  projectTitle: 'MiMo Orbit Workbench',
  oneSentencePitch:
    '用 MiMo-V2.5-Pro 把开源项目、证明材料和使用计划整理成可审核的创作者激励计划申请包。',
  aiTool: 'MiMo Orbit Workbench Web App + Xiaomi MiMo OpenAI-compatible API',
  foundationModel: 'mimo-v2.5-pro',
  projectDescription:
    '这个项目面向希望申请 MiMo Orbit 创作者激励计划的 AI builders。用户填写 GitHub 仓库、应用场景、目标用户和当前进展后，工作台会生成项目摘要、证明材料清单、里程碑和 Token 计划说明。后端通过环境变量代理 MiMo API，前端不会暴露密钥；没有密钥时也能用 mock mode 完整演示流程。',
  evidenceMaterials: [
    'GitHub 仓库链接',
    'README 安装说明和架构说明',
    'docs/APPLICATION.md 申请草稿',
    '本地演示截图或视频',
  ],
  milestones: ['完成 MVP', '接入真实 API', '增加长文档上传', '发布教程和案例'],
  tokenPlanJustification:
    '需要较高 Token 额度来分析长 README、设计文档、issue 摘要和代码片段，并生成多个版本的申请材料。',
  riskControls: ['服务端保存 API Key', '默认 mock mode', '人工确认申请内容', '避免上传敏感仓库信息'],
  mock: true,
};

function App() {
  const [profile, setProfile] = useState(starterProfile);
  const [application, setApplication] = useState(localFallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const completion = useMemo(() => {
    const fields = Object.values(profile).filter(Boolean).length;
    return Math.round((fields / Object.keys(profile).length) * 100);
  }, [profile]);

  async function generateApplication() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setApplication(await response.json());
    } catch (generationError) {
      setError(
        `未能连接本地 API，已保留前端示例结果。详情：${
          generationError instanceof Error ? generationError.message : 'unknown error'
        }`,
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Orbit size={18} />
            MiMo Orbit Creator Application Kit
          </div>
          <h1>MiMo Orbit Workbench</h1>
          <p>
            一个可运行的申请材料工作台，把项目说明、证明材料、里程碑和 Token 需求整理成适合小米 MiMo
            创作者激励计划审核的申请包。
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={generateApplication} disabled={loading}>
              {loading ? <Loader2 className="spin" size={18} /> : <Sparkles size={18} />}
              生成申请包
            </button>
            <a className="ghost" href={profile.repository} target="_blank" rel="noreferrer">
              <Github size={18} />
              GitHub
            </a>
          </div>
        </div>
        <div className="signal-board" aria-label="project signals">
          <Signal label="表单完整度" value={`${completion}%`} />
          <Signal label="目标模型" value={profile.model} />
          <Signal label="运行模式" value={application.mock ? 'Mock ready' : 'MiMo live'} />
          <Signal label="适配场景" value="Agent + Coding" />
        </div>
      </section>

      <section className="workspace">
        <form className="panel input-panel">
          <PanelHeading icon={<ClipboardList size={18} />} title="项目资料" />
          <Field
            label="项目名称"
            value={profile.name}
            onChange={(value) => updateField('name', value)}
          />
          <Field
            label="GitHub 仓库"
            value={profile.repository}
            onChange={(value) => updateField('repository', value)}
          />
          <Field
            label="底层模型"
            value={profile.model}
            onChange={(value) => updateField('model', value)}
          />
          <Field
            label="目标用户"
            value={profile.audience}
            onChange={(value) => updateField('audience', value)}
          />
          <Field
            label="使用场景"
            value={profile.useCase}
            multiline
            onChange={(value) => updateField('useCase', value)}
          />
          <Field
            label="当前进度"
            value={profile.currentStatus}
            multiline
            onChange={(value) => updateField('currentStatus', value)}
          />
        </form>

        <section className="panel output-panel">
          <PanelHeading icon={<Braces size={18} />} title="申请包预览" />
          {error && <p className="error">{error}</p>}
          <ApplicationPreview application={application} />
        </section>
      </section>
    </main>
  );
}

function Signal({ label, value }) {
  return (
    <div className="signal">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PanelHeading({ icon, title }) {
  return (
    <div className="panel-heading">
      <span>{icon}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Field({ label, value, onChange, multiline = false }) {
  const id = label.replace(/\s+/g, '-');
  const Component = multiline ? 'textarea' : 'input';

  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <Component id={id} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ApplicationPreview({ application }) {
  return (
    <div className="application-preview">
      <div className="status-strip">
        <BadgeCheck size={18} />
        <span>{application.mock ? 'Mock mode: 可无密钥演示' : 'Live mode: MiMo API 生成'}</span>
      </div>
      <h3>{application.projectTitle}</h3>
      <p className="pitch">{application.oneSentencePitch}</p>

      <div className="mini-grid">
        <Fact icon={<Blocks size={17} />} label="AI 工具" value={application.aiTool} />
        <Fact icon={<ShieldCheck size={17} />} label="底层模型" value={application.foundationModel} />
      </div>

      <PreviewSection title="项目描述" content={application.projectDescription} />
      <PreviewSection title="证明材料" items={application.evidenceMaterials} />
      <PreviewSection title="里程碑" items={application.milestones} />
      <PreviewSection title="Token 计划理由" content={application.tokenPlanJustification} />
      <PreviewSection title="风险控制" items={application.riskControls} />
    </div>
  );
}

function Fact({ icon, label, value }) {
  return (
    <div className="fact">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function PreviewSection({ title, content, items }) {
  return (
    <section className="preview-section">
      <h4>
        {title}
        <ArrowRight size={15} />
      </h4>
      {content && <p>{content}</p>}
      {items && (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
