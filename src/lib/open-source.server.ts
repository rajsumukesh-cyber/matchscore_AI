/**
 * Module 29 — AI Open Source Contribution & First PR Finder (server only).
 *
 * Guides students to make their first legitimate open-source contributions on GitHub
 * (GSoC, LFX, Hacktoberfest) with curated repositories, Git workflows, and PR pitches.
 */
import type { AppSupabase } from "./db.server";

export interface OpenSourceRepo {
  repository_name: string;
  github_url: string;
  primary_language: string;
  domain_category: string;
  beginner_friendly_tags: string[];
  recommended_first_issue_type: string;
}

export interface OpenSourceResult {
  preferred_stack: string;
  top_recommended_repositories: OpenSourceRepo[];
  step_by_step_git_pr_workflow: string[];
  pull_request_description_template: string;
  maintainer_etiquette_rules: string[];
}

export async function findOpenSourceContributions(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    primaryLanguage: "JavaScript / TypeScript" | "Python" | "Go / Rust" | "Java / C++";
    studentInterests: string;
  },
): Promise<OpenSourceResult> {
  const lang = input.primaryLanguage || "JavaScript / TypeScript";
  const interest = input.studentInterests.trim() || "Web Development, Developer Tools, AI Frameworks";

  const repos: OpenSourceRepo[] = [
    {
      repository_name: "shadcn/ui",
      github_url: "https://github.com/shadcn-ui/ui",
      primary_language: "TypeScript / React",
      domain_category: "UI Component Library & Design Systems",
      beginner_friendly_tags: ["good first issue", "documentation", "accessibility (a11y)"],
      recommended_first_issue_type: "Adding missing ARIA attributes to dialog components or fixing documentation typos.",
    },
    {
      repository_name: "freeCodeCamp/freeCodeCamp",
      github_url: "https://github.com/freeCodeCamp/freeCodeCamp",
      primary_language: "JavaScript / TypeScript / Node.js",
      domain_category: "Global Education Platform",
      beginner_friendly_tags: ["first timers only", "help wanted", "curriculum"],
      recommended_first_issue_type: "Translating coding lessons, fixing challenge test suites, or clarifying algorithm instructions.",
    },
    {
      repository_name: "langchain-ai/langchainjs",
      github_url: "https://github.com/langchain-ai/langchainjs",
      primary_language: "TypeScript",
      domain_category: "AI Agent Orchestration & LLM Tooling",
      beginner_friendly_tags: ["help wanted", "integrations", "doc fixes"],
      recommended_first_issue_type: "Writing example notebooks for new model integrations or improving error messages.",
    },
    {
      repository_name: "tiangolo/fastapi",
      github_url: "https://github.com/fastapi/fastapi",
      primary_language: "Python",
      domain_category: "High-Performance Web Framework",
      beginner_friendly_tags: ["documentation", "translations", "community review"],
      recommended_first_issue_type: "Translating official documentation pages or reviewing community bug reports.",
    },
  ];

  const prWorkflow = [
    "1. Fork the target repository on GitHub by clicking the 'Fork' button.",
    "2. Clone your fork locally: git clone https://github.com/your-username/repo-name.git",
    "3. Create a descriptive feature branch: git checkout -b fix-dialog-accessibility",
    "4. Make your code or documentation changes and verify all automated tests pass: npm test",
    "5. Commit with a conventional message: git commit -m 'fix(a11y): add missing aria-expanded attribute to dialog trigger'",
    "6. Push to your fork: git push origin fix-dialog-accessibility",
    "7. Open a Pull Request on the upstream repository referencing the issue number (#123).",
  ];

  const prTemplate = `### 📌 Description of Changes
This pull request resolves issue # [Issue Number]. 
- Added missing ARIA attributes to improve screen-reader accessibility.
- Verified that all unit and integration tests pass locally.

### 🧪 How This Was Tested
1. Ran \`npm test\` across the component package (100% tests passing).
2. Manually tested keyboard navigation using VoiceOver / screen-reader.

### 📸 Screenshots (if applicable)
[Attach screenshot or GIF showing working component]

### ✅ Contributor Checklist
- [x] My code follows the project's style guidelines (\`npm run lint\`).
- [x] I have added test coverage for the modified logic.
- [x] I have updated the documentation if necessary.`;

  return {
    preferred_stack: lang,
    top_recommended_repositories: repos,
    step_by_step_git_pr_workflow: prWorkflow,
    pull_request_description_template: prTemplate,
    maintainer_etiquette_rules: [
      "Always comment on an open issue asking 'Can I work on this?' before submitting a PR to avoid duplicate work.",
      "Keep PRs small and focused on ONE single bug or feature — never bundle 5 unrelated refactors into one PR.",
      "Be polite and patient: open-source maintainers review code in their spare volunteer time.",
      "Once your PR is merged, add 'Open Source Contributor @ [Project]' to your resume and LinkedIn!",
    ],
  };
}
