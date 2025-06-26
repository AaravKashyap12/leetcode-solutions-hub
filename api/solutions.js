// File: api/solutions.js

import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const solution = req.body;
  console.log('[📥 Received] LeetCode solution:', solution);

  // Basic AI-like formatting (placeholder)
  const formattedContent = `
# Title: ${solution.problemTitle}
# Problem Number: ${solution.problemNumber}
# Difficulty: ${solution.difficulty}
# Tags: ${solution.tags.join(", ")}
# Language: ${solution.language}
# Captured At: ${solution.capturedAt}

# Solution Code:
${solution.code}
`;

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_USERNAME; // Set in Vercel env
    const repo = process.env.GITHUB_REPO || "leetcode-solutions";
    const path = `solutions/${solution.problemNumber}-${solution.problemTitle.replace(/\s+/g, '-')}.${getFileExtension(solution.language)}`;

    const { data: { sha } = {} } = await getExistingFileSha(octokit, owner, repo, path);

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Add solution for ${solution.problemTitle}`,
      content: Buffer.from(formattedContent).toString('base64'),
      sha,
    });

    res.status(200).json({ message: 'Solution received and uploaded to GitHub!' });
  } catch (error) {
    console.error("❌ GitHub Upload Error:", error.message);
    res.status(500).json({ error: 'GitHub upload failed' });
  }
}

function getFileExtension(language) {
  switch (language.toLowerCase()) {
    case 'python': return 'py';
    case 'java': return 'java';
    case 'cpp': return 'cpp';
    case 'c': return 'c';
    case 'javascript': return 'js';
    default: return 'txt';
  }
}

async function getExistingFileSha(octokit, owner, repo, path) {
  try {
    const response = await octokit.repos.getContent({ owner, repo, path });
    return { sha: response.data.sha };
  } catch {
    return {}; // file doesn't exist
  }
}