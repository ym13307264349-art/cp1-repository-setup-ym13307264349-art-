'use strict';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSection(body, label) {
  const escaped = escapeRegex(label);
  const re = new RegExp(`### ${escaped}\\s*\\n+([\\s\\S]*?)(?=\\n### |$)`, 'i');
  const value = body?.match(re)?.[1]?.trim() || '';
  return value === '_No response_' ? '' : value;
}

function parseRepoUrl(url) {
  try {
    const parsed = new URL((url || '').trim());
    if (parsed.protocol !== 'https:' || parsed.hostname.toLowerCase() !== 'github.com') return null;

    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, '');
    if (!owner || !repo) return null;

    return { owner, repo };
  } catch {
    return null;
  }
}

function evaluateRepository({
  meta,
  readme = '',
  gitignore = '',
  license = '',
  readmePresent,
  gitignorePresent,
  licensePresent,
  licensePath = 'LICENSE',
  student,
  statedUsername = ''
}) {
  const expectedRepo = `cp1-repository-setup-${student}`;
  const officialTemplate = 'klis-cs/github-repository-setup';
  const templateSource = meta?.template_repository?.full_name?.toLowerCase() || '';

  const repoAccessible = Boolean(meta && meta.private === false);
  const ownerMatches = Boolean(
    meta &&
    meta.owner?.login?.toLowerCase() === student.toLowerCase() &&
    (!statedUsername || statedUsername.toLowerCase() === student.toLowerCase())
  );
  const nameMatches = Boolean(meta && meta.name?.toLowerCase() === expectedRepo.toLowerCase());
  const sourceAllowed = Boolean(
    meta &&
    meta.fork === false &&
    (!templateSource || templateSource === officialTemplate)
  );
  const mainIsDefault = Boolean(meta && (meta.default_branch || '').toLowerCase() === 'main');

  const hasReadme = readmePresent ?? Boolean(readme.trim());
  const hasGitignore = gitignorePresent ?? Boolean(gitignore.trim());
  const hasLicense = licensePresent ?? Boolean(license.trim());

  const readmeHasH1 = /^#\s+\S/m.test(readme);
  const readmeSubstantial = readme.trim().length >= 120;
  const readmeHasSetup = /^#{1,3}\s+(setup|usage|getting started|installation|how to run)\b/im.test(readme);

  const ignoreRules = gitignore
    .split(/\r?\n/)
    .map(x => x.trim())
    .filter(x => x && !x.startsWith('#'));
  const ignoreMeaningful = ignoreRules.length > 0;

  const licenseSubstantial = license.trim().length >= 400 && /(copyright|permission|license|licensed)/i.test(license);

  const repoSetupScore =
    (repoAccessible ? 2 : 0) +
    (ownerMatches ? 2 : 0) +
    (nameMatches ? 2 : 0) +
    (sourceAllowed ? 2 : 0) +
    (mainIsDefault ? 2 : 0);

  const readmeScore =
    (hasReadme ? 5 : 0) +
    (readmeHasH1 ? 5 : 0) +
    (readmeSubstantial ? 5 : 0) +
    (readmeHasSetup ? 5 : 0);

  const ignoreScore = (hasGitignore ? 5 : 0) + (ignoreMeaningful ? 10 : 0);
  const licenseScore = (hasLicense ? 5 : 0) + (licenseSubstantial ? 10 : 0);

  const repoDetail = !repoAccessible ? 'Repository not found or not public.' :
    !ownerMatches ? `Repository must belong to @${student}.` :
    !nameMatches ? `Repository must be named ${expectedRepo}.` :
    !sourceAllowed ? 'Use the official KLIS-CS CP1 Copy Exercise; forks and unrelated templates are not accepted.' :
    !mainIsDefault ? 'CP1 must use main as the default branch.' :
    templateSource === officialTemplate ? 'Official CP1 Copy Exercise detected; repository setup passed.' :
    'Approved legacy CP1 repository detected; repository setup passed.';

  const checks = [
    ['Repository setup', repoSetupScore, 10, repoDetail],
    ['README.md', readmeScore, 20,
      !hasReadme ? 'README.md was not found at repository root.' :
      !readme.trim() ? 'README.md exists, but it is empty. Add your project information.' :
      !readmeHasH1 ? 'Add an H1 project title.' :
      !readmeSubstantial ? 'Add at least 120 characters of useful project information.' :
      !readmeHasSetup ? 'Add a Setup, Usage, Getting Started, Installation, or How to Run section.' :
      'README automatic checks passed.'],
    ['.gitignore', ignoreScore, 15,
      !hasGitignore ? '.gitignore was not found at repository root.' :
      !ignoreMeaningful ? '.gitignore exists; add at least one non-comment ignore rule.' :
      `${ignoreRules.length} ignore rule(s) detected.`],
    ['LICENSE', licenseScore, 15,
      !hasLicense ? 'No license file found. Use LICENSE, LICENSE.md, or LICENSE.txt at repository root.' :
      !licenseSubstantial ? `${licensePath} exists but appears incomplete; add the full license text.` :
      `${licensePath} detected with substantial license text.`]
  ];

  return {
    checks,
    automatic: checks.reduce((sum, [, score]) => sum + score, 0),
    expectedRepo,
    templateSource,
    officialTemplate,
    detectedLicensePath: hasLicense ? licensePath : null
  };
}

function evaluateSubmission({
  meta,
  readme = '',
  gitignore = '',
  license = '',
  readmePresent,
  gitignorePresent,
  licensePresent,
  licensePath = 'LICENSE',
  issueBody = '',
  student
}) {
  const repositoryUrl = extractSection(issueBody, 'Practice Repository URL');
  const statedUsername = extractSection(issueBody, 'GitHub Username').replace(/^@/, '').trim();
  const readmeAnswer = extractSection(issueBody, 'README Explanation');
  const gitignoreAnswer = extractSection(issueBody, '.gitignore Explanation');
  const licenseAnswer = extractSection(issueBody, 'LICENSE Explanation');
  const reflection = extractSection(issueBody, 'Reflection');
  const integrity = extractSection(issueBody, 'Integrity Check');
  const parsed = parseRepoUrl(repositoryUrl);

  const repoResult = evaluateRepository({
    meta,
    readme,
    gitignore,
    license,
    readmePresent,
    gitignorePresent,
    licensePresent,
    licensePath,
    student,
    statedUsername
  });

  return {
    repositoryUrl,
    statedUsername,
    parsed,
    integrityConfirmed: /\[x\]/i.test(integrity),
    responses: {
      readme: readmeAnswer,
      gitignore: gitignoreAnswer,
      license: licenseAnswer,
      reflection
    },
    checks: repoResult.checks,
    automatic: repoResult.automatic,
    detectedLicensePath: repoResult.detectedLicensePath
  };
}

module.exports = {
  extractSection,
  parseRepoUrl,
  evaluateRepository,
  evaluateSubmission
};
