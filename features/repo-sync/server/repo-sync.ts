import { CodeChunk } from "@/features/reviews/types/review";
import { RepoFile } from "../types/repo";
import { getGithubApp } from "@/features/github/utils/github-app";
import { getPineConeIndex } from "@/features/pinecone/client";
import { prisma } from "@/lib/db";
import { inngest } from "@/features/inngest/client";

const MAX_FILE_SIZE_BYTES = 100_000;
const MAX_FILES = 200;
const MAX_CHUNK_LINES = 80;
const UPSERT_BATCH_SIZE = 90;

const CODE_EXTENSIONS = [
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".py",
  ".pyw",
  ".pyi",
  ".go",
  ".rs",
  ".rb",
  ".rake",
  ".java",
  ".kt",
  ".kts",
  ".swift",
  ".c",
  ".h",
  ".cc",
  ".cpp",
  ".cxx",
  ".hpp",
  ".hxx",
  ".cs",
  ".fs",
  ".fsx",
  ".vb",
  ".php",
  ".dart",
  ".lua",
  ".pl",
  ".pm",
  ".r",
  ".jl",
  ".hs",
  ".lhs",
  ".ex",
  ".exs",
  ".erl",
  ".hrl",
  ".clj",
  ".cljs",
  ".scala",
  ".groovy",
  ".m",
  ".mm",
  ".zig",
  ".nim",
  ".cr",
  ".d",
  ".pas",
  ".f",
  ".f90",
  ".f95",
  ".f03",
  ".f08",
  ".asm",
  ".s",
  ".sol",
  ".move",
  ".sql",
  ".prisma",
  ".graphql",
  ".gql",
  ".proto",
  ".vue",
  ".svelte",
  ".astro",
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".md",
  ".mdx",
  ".yaml",
  ".yml",
  ".json",
  ".jsonc",
  ".json5",
  ".toml",
  ".xml",
  ".svg",
  ".tf",
  ".tfvars",
  ".hcl",
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".ps1",
  ".bat",
  ".cmd",
];

const SKIPPED_FOLDERS = [
  // Dependencies
  "node_modules",
  "vendor",
  "bower_components",

  // Build output
  "dist",
  "build",
  "out",
  "target",
  "obj",

  // Framework-generated
  ".next",
  ".nuxt",
  ".output",
  ".svelte-kit",
  ".astro",
  ".turbo",
  ".vercel",
  ".netlify",

  // Generated code
  "generated",
  "__generated__",
  "codegen",
  ".generated",

  // Python
  "__pycache__",
  ".pytest_cache",
  ".mypy_cache",
  ".ruff_cache",
  ".venv",
  "venv",

  // Test / coverage
  "coverage",
  ".nyc_output",
  "test-results",
  "playwright-report",

  // Version control
  ".git",
  ".svn",
  ".hg",

  // IDE
  ".idea",
  ".vscode",
  ".vs",

  // Caches
  ".cache",
  ".parcel-cache",
  ".vite",

  // Build tools
  ".gradle",
  ".mvn",
  ".terraform",

  // Temporary
  "logs",
  "tmp",
  "temp",
];

type TreeEntry = {
  path?: string;
  type?: string;
  sha?: string;
  size?: number;
};

export function buildRepoNamespace(repoFullName: string) {
  return `${repoFullName.replace("/", "--")}--codebase`;
}

function hasCodeExtension(path: string) {
  return CODE_EXTENSIONS.some((extension) => path.endsWith(extension));
}

function isSkippedPath(path: string) {
  return SKIPPED_FOLDERS.some((folder) => path.includes(folder));
}

function isIndexableFile(entry: TreeEntry) {
  if (entry.type !== "blob" || !entry.path || !entry.sha) {
    return false;
  }

  if (entry.size && entry.size > MAX_FILE_SIZE_BYTES) {
    return false;
  }

  if (isSkippedPath(entry.path)) {
    return false;
  }

  return hasCodeExtension(entry.path);
}

function buildChunkId(filePath: string, part: number) {
  return `repo--${filePath}--part-${part}`;
}

export function chunkRepoFiles(files: RepoFile[]): CodeChunk[] {
  const chunks: CodeChunk[] = [];

  for (const file of files) {
    const lines = file.content.split("\n");

    for (let start = 0; start < lines.length; start += MAX_CHUNK_LINES) {
      const part = start / MAX_CHUNK_LINES;
      const text = lines.slice(start, start + MAX_CHUNK_LINES).join("\n");

      chunks.push({
        id: buildChunkId(file.filePath, part),
        filePath: file.filePath,
        text,
      });
    }
  }

  return chunks;
}

export async function getRepoFiles(
  installationId: number,
  repoFullName: string,
  branch: string,
): Promise<RepoFile[]> {
  const app = getGithubApp();
  const octokit = await app.getInstallationOctokit(installationId);
  const [owner, repo] = repoFullName.split("/");

  const { data: tree } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    { owner, repo, tree_sha: branch, recursive: "1" },
  );

  const entries = tree.tree.filter(isIndexableFile).slice(0, MAX_FILES);
  const files: RepoFile[] = [];

  for (const entry of entries) {
    const { data: blob } = await octokit.request(
      "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
      { owner, repo, file_sha: entry.sha! },
    );

    const content = Buffer.from(blob.content, "base64").toString("utf-8");
    files.push({ filePath: entry.path!, content });
  }

  return files;
}

export async function deleteRepoNamespace(namespace: string) {
  const index = await getPineConeIndex();
  await index.deleteNamespace(namespace);
}

export async function saveRepoChunks(namespace: string, chunks: CodeChunk[]) {
  const index = await getPineConeIndex();

  const validChunks = chunks.filter(
    (chunk) => typeof chunk.text === "string" && chunk.text.trim().length > 0,
  );

  const skipped = chunks.length - validChunks.length;
  if (skipped > 0) {
    console.warn(`Skipped ${skipped} empty chunks for namespace ${namespace}`);
  }

  if (validChunks.length === 0) return;

  const ns = index.namespace(namespace);

  for (let start = 0; start < validChunks.length; start += UPSERT_BATCH_SIZE) {
    const batch = validChunks.slice(start, start + UPSERT_BATCH_SIZE);

    await ns.upsertRecords({
      records: batch.map((chunk) => ({
        id: chunk.id,
        text: chunk.text,
        filePath: chunk.filePath,
      })),
    });
  }
}

export async function getRepoSyncStatuses(repoFullNames: string[]) {
  const syncs = await prisma.repoSync.findMany({
    where: { repoFullName: { in: repoFullNames } },
    select: { repoFullName: true, status: true },
  });

  const statusByRepo: Record<string, string> = {};

  for (const sync of syncs) {
    statusByRepo[sync.repoFullName] = sync.status;
  }

  return statusByRepo;
}

export async function triggerRepoSync(
  installationId: number,
  repoFullName: string,
  branch: string,
) {
  const repoSync = await prisma.repoSync.upsert({
    where: { repoFullName },
    create: { installationId, repoFullName, branch, status: "pending" },
    update: { installationId, branch, status: "pending" },
  });

  await inngest.send({
    name: "repo/sync.requested",
    data: { repoSyncId: repoSync.id },
  });
}
