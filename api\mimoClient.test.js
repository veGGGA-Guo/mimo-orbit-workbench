import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildApplicationPrompt,
  createMockApplication,
  generateApplication,
  parseApplicationContent,
} from './mimoClient.js';

test('buildApplicationPrompt includes model and repository context', () => {
  const messages = buildApplicationPrompt({
    repository: 'https://github.com/example/demo',
    model: 'mimo-v2.5-pro',
  });

  assert.equal(messages.length, 2);
  assert.match(messages[1].content, /https:\/\/github.com\/example\/demo/);
  assert.match(messages[1].content, /mimo-v2.5-pro/);
});

test('generateApplication falls back to mock mode without an API key', async () => {
  const result = await generateApplication(
    {
      name: 'Demo Project',
      repository: 'https://github.com/example/demo',
    },
    {},
  );

  assert.equal(result.mock, true);
  assert.equal(result.projectTitle, 'Demo Project');
  assert.ok(result.evidenceMaterials.some((item) => item.includes('github.com/example/demo')));
});

test('mock application contains the fields needed by the MiMo Orbit form', () => {
  const result = createMockApplication();

  for (const key of [
    'projectTitle',
    'oneSentencePitch',
    'aiTool',
    'foundationModel',
    'projectDescription',
    'evidenceMaterials',
    'milestones',
    'tokenPlanJustification',
    'riskControls',
  ]) {
    assert.ok(result[key], `${key} should be present`);
  }
});

test('parseApplicationContent accepts raw JSON and fenced JSON', () => {
  assert.deepEqual(parseApplicationContent('{"projectTitle":"A"}'), { projectTitle: 'A' });
  assert.deepEqual(parseApplicationContent('```json\n{"projectTitle":"B"}\n```'), {
    projectTitle: 'B',
  });
});
