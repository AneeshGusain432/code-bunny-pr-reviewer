import { App } from "octokit";

let githubApp: App | null = null;

function formatPrivateKey(rawKey: string | undefined): string | undefined {
  if (!rawKey) return undefined;
  let key = rawKey.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
}

export function getGithubApp() {
  if (!githubApp) {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = formatPrivateKey(process.env.GITHUB_APP_PRIVATE_KEY);
    const webhookSecret = process.env.GITHUB_APP_WEBHOOK_SECRET;

    if (!appId || !privateKey || !webhookSecret) {
      throw new Error(
        "GitHub App configuration is incomplete. Set GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, and GITHUB_APP_WEBHOOK_SECRET.",
      );
    }

    githubApp = new App({
      appId,
      privateKey,
      webhooks: {
        secret: webhookSecret,
      },
    });
  }
  return githubApp;
}

export function getGithubInstallUrl(userId: string) {
  const appName = process.env.GITHUB_APP_NAME!;
  const url = new URL(`https://github.com/apps/${appName}/installations/new`);
  url.searchParams.set("state", userId);
  return url.toString();
}
