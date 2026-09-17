'use strict';

const assert = require('assert');
const { extractSection, parseRepoUrl, evaluateRepository, evaluateSubmission } = require('../scripts/cp1-utils');

const student = 'octocat';
const issueBody = `### Practice Repository URL

https://github.com/octocat/cp1-repository-setup-octocat

### GitHub Username

octocat

### README Explanation

A README explains the project and how to use it.

### .gitignore Explanation

I ignore dependencies and local environment files.

### LICENSE Explanation

I chose MIT and understand its reuse conditions.

### Reflection

Choosing project-specific ignore rules required the most judgment.

### Integrity Check

- [x] I used the official KLIS-CS CP1 Copy Exercise and did not fork another repository.
`;

const baseMeta = {
  private: false,
  fork: false,
  owner: { login: student },
  name: 'cp1-repository-setup-octocat',
  default_branch: 'main'
};

const officialTemplateMeta = {
  ...baseMeta,
  template_repository: { full_name: 'KLIS-CS/GitHub-Repository-Setup' }
};

const readme = `# CP1 Repository Setup Practice

This public practice repository demonstrates a clean professional GitHub repository setup for a small JavaScript project. It gives another developer enough information to understand the project and begin using it.

## Setup

Run npm install before starting development, then open the project files in your editor.
`;

const gitignore = `node_modules/\n.env\n.DS_Store\n`;
const license = `MIT License\n\nCopyright (c) 2026 Student\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n`;

const expectedParsed = {
  owner: 'octocat',
  repo: 'cp1-repository-setup-octocat'
};
assert.deepStrictEqual(parseRepoUrl('https://github.com/octocat/cp1-repository-setup-octocat'), expectedParsed);
assert.deepStrictEqual(parseRepoUrl('https://github.com/octocat/cp1-repository-setup-octocat/tree/main'), expectedParsed);
assert.deepStrictEqual(parseRepoUrl('https://github.com/octocat/cp1-repository-setup-octocat/blob/main/README.md'), expectedParsed);
assert.deepStrictEqual(parseRepoUrl('https://github.com/octocat/cp1-repository-setup-octocat.git'), expectedParsed);
assert.strictEqual(parseRepoUrl('https://example.com/octocat/cp1-repository-setup-octocat'), null);
assert.strictEqual(extractSection(issueBody, 'GitHub Username'), 'octocat');

const local = evaluateRepository({
  meta: officialTemplateMeta,
  readme,
  gitignore,
  license,
  readmePresent: true,
  gitignorePresent: true,
  licensePresent: true,
  licensePath: 'LICENSE',
  student
});
assert.strictEqual(local.automatic, 60, `Expected local automatic score 60, got ${local.automatic}`);

const central = evaluateSubmission({
  meta: officialTemplateMeta,
  readme,
  gitignore,
  license,
  readmePresent: true,
  gitignorePresent: true,
  licensePresent: true,
  licensePath: 'LICENSE',
  issueBody,
  student
});
assert.strictEqual(central.automatic, 60, `Expected central automatic score 60, got ${central.automatic}`);
assert.deepStrictEqual(central.checks, local.checks, 'Central and student automatic checks must match');

const licenseMarkdown = evaluateRepository({
  meta: officialTemplateMeta,
  readme,
  gitignore,
  license,
  readmePresent: true,
  gitignorePresent: true,
  licensePresent: true,
  licensePath: 'LICENSE.md',
  student
});
assert.strictEqual(licenseMarkdown.automatic, 60, 'LICENSE.md must be accepted as a valid license filename');
assert.strictEqual(licenseMarkdown.detectedLicensePath, 'LICENSE.md');

const emptyButPresent = evaluateRepository({
  meta: officialTemplateMeta,
  readme: '',
  gitignore: '',
  license: '',
  readmePresent: true,
  gitignorePresent: true,
  licensePresent: true,
  licensePath: 'LICENSE.md',
  student
});
assert.strictEqual(emptyButPresent.automatic, 25, 'Existing empty files should receive existence credit, not be reported as missing');

const legacy = evaluateRepository({ meta: baseMeta, readme, gitignore, license, student });
assert.strictEqual(legacy.automatic, 60, 'Legacy non-template CP1 repositories remain compatible');

const unrelatedTemplate = evaluateRepository({
  meta: { ...baseMeta, template_repository: { full_name: 'someone/other-template' } },
  readme,
  gitignore,
  license,
  student
});
assert.ok(unrelatedTemplate.automatic < 60, 'Unrelated templates must lose repository setup credit');

const weakFiles = evaluateRepository({
  meta: officialTemplateMeta,
  readme: '# Too short',
  gitignore: '# comments only',
  license: 'MIT',
  student
});
assert.ok(weakFiles.automatic < 60, 'Weak files must not receive full automatic credit');

const wrongDefaultBranch = evaluateRepository({
  meta: { ...officialTemplateMeta, default_branch: 'feature' },
  readme,
  gitignore,
  license,
  student
});
assert.ok(wrongDefaultBranch.automatic < 60, 'CP1 must use main as the default branch');

console.log('CP1 grader fixture tests passed.');
