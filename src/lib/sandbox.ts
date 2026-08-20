import { ProjectFileEntity, SandboxExecutionResult } from '../types';

export class SandboxEnvironment {
  executeCommand(
    command: string,
    files: ProjectFileEntity[]
  ): SandboxExecutionResult {
    const trimmed = command.trim();
    const startTime = performance.now();

    // Default resource usage
    let cpuUsage = 15.0 + Math.random() * 25.0;
    let ramUsage = 85.0 + Math.random() * 30.0;
    let exitCode = 0;
    let stdout = '';
    let stderr = '';

    if (trimmed === 'npm run build' || trimmed === 'npm build' || trimmed === 'next build') {
      cpuUsage = 68.4 + Math.random() * 20.0;
      ramUsage = 184.2 + Math.random() * 50.0;

      // Validate syntax of all files
      const syntaxErrors: string[] = [];
      for (const file of files) {
        if (file.path.endsWith('.tsx') || file.path.endsWith('.ts') || file.path.endsWith('.js')) {
          const openBraces = (file.content.match(/{/g) || []).length;
          const closeBraces = (file.content.match(/}/g) || []).length;
          if (openBraces !== closeBraces) {
            syntaxErrors.push(`SyntaxError in ${file.path}: Unexpected EOF or unmatched braces ({: ${openBraces}, }: ${closeBraces})`);
          }
        }
      }

      if (syntaxErrors.length > 0) {
        exitCode = 1;
        stderr = syntaxErrors.join('\n');
        stdout = `▲ Next.js 14.2.5\n- Environments: production\n- Creating an optimized production build ...\nFailed to compile.`;
      } else {
        stdout = `▲ Next.js 14.2.5\n- Environments: production\n- Creating an optimized production build ...\n✓ Compiled successfully in 1.4s\n✓ Linting and checking validity of types ...\n✓ Collecting page data ...\n✓ Generating static pages (5/5)\n✓ Finalizing page optimization ...\n\nRoute (app)                              Size     First Load JS\n┌ ○ /                                    5.2 kB         87.4 kB\n└ ○ /_not-found                          871 B          83.1 kB\n+ First Load JS shared by all            82.2 kB\n\n○  (Static)  prerendered as static content\nBuild complete. Output written to .next/`;
      }
    } else if (trimmed === 'npm test' || trimmed === 'npm run test' || trimmed === 'jest' || trimmed === 'pytest') {
      cpuUsage = 45.2 + Math.random() * 15.0;
      ramUsage = 142.0 + Math.random() * 20.0;

      stdout = `PASS tests/unit/components.test.tsx\n  ✓ Hero section renders with call-to-action button (28 ms)\n  ✓ ContactForm updates input states and submits transmission (42 ms)\n  ✓ ThemeToggle switches between dark and light modes (14 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total\nSnapshots:   0 total\nTime:        1.248 s\nRan all test suites.`;
    } else if (trimmed === 'git status') {
      const modified = files.filter(f => f.gitStatus === 'MODIFIED');
      const untracked = files.filter(f => f.gitStatus === 'UNTRACKED');

      stdout = `On branch main\nYour branch is up to date with 'origin/main'.\n\n`;
      if (modified.length > 0) {
        stdout += `Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n`;
        for (const m of modified) {
          stdout += `\tmodified:   ${m.path}\n`;
        }
        stdout += `\n`;
      }
      if (untracked.length > 0) {
        stdout += `Untracked files:\n  (use "git add <file>..." to include in what will be committed)\n`;
        for (const u of untracked) {
          stdout += `\t${u.path}\n`;
        }
        stdout += `\n`;
      }
      if (modified.length === 0 && untracked.length === 0) {
        stdout += `nothing to commit, working tree clean`;
      }
    } else if (trimmed === 'git diff') {
      const modified = files.filter(f => f.gitStatus === 'MODIFIED');
      if (modified.length === 0) {
        stdout = `(No unstaged changes)`;
      } else {
        stdout = modified.map(m => `diff --git a/${m.path} b/${m.path}\n--- a/${m.path}\n+++ b/${m.path}\n@@ -1,${m.originalContent.split('\n').length} +1,${m.content.split('\n').length} @@\n+ [Modified Content - ${m.linesCount} lines]`).join('\n\n');
      }
    } else if (trimmed === 'ls' || trimmed === 'ls -la' || trimmed === 'dir') {
      stdout = files.map(f => `${f.path.padEnd(30)} ${f.sizeBytes} B`).join('\n');
    } else if (trimmed.startsWith('cat ')) {
      const targetPath = trimmed.replace('cat ', '').trim();
      const file = files.find(f => f.path === targetPath || f.name === targetPath);
      if (file) {
        stdout = file.content;
      } else {
        exitCode = 1;
        stderr = `cat: ${targetPath}: No such file or directory`;
      }
    } else if (trimmed === 'pwd') {
      stdout = `/workspace/project`;
    } else if (trimmed === 'node -v' || trimmed === 'node --version') {
      stdout = `v20.14.0 (Alpine Container Isolated)`;
    } else if (trimmed === 'python --version' || trimmed === 'python3 --version') {
      stdout = `Python 3.12.3 (Sandboxed venv)`;
    } else if (trimmed === 'whoami') {
      stdout = `ownai-agent (uid=1000, gid=1000, isolated=true)`;
    } else {
      stdout = `Command executed successfully: "${trimmed}" (Sandbox runtime)`;
    }

    const durationMs = Math.round(performance.now() - startTime + (trimmed.includes('build') ? 320 : 60));

    return {
      command: trimmed,
      exitCode,
      stdout,
      stderr,
      durationMs,
      cpuUsagePct: Math.min(100, Math.round(cpuUsage * 10) / 10),
      ramUsageMb: Math.round(ramUsage * 10) / 10
    };
  }
}

export const sandbox = new SandboxEnvironment();
