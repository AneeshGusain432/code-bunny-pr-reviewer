import { prisma } from "@/lib/db";
import { GithubInstallationStatus } from "./../../dashboard/lib/types";
import { getGithubApp } from "../utils/github-app";

async function getGithubLoginForUser(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      accounts: {
        where: { providerId: "github" },
        select: { accountId: true },
        take: 1,
      },
    },
  });

  if (!user) {
    return null;
  }

  return user.name?.trim() || null;
}

function buildDisconnectedStatus(): GithubInstallationStatus {
  return { connected: false, accountLogin: null, installedAt: null };
}

export async function getInstallationStatus(userId: string) {
  const installation = await prisma.githubInstallation.findUnique({
    where: {
      userId,
    },
  });

  if (!installation) {
    return buildDisconnectedStatus();
  }

  const accountLogin =
    installation.accountLogin ?? (await getGithubLoginForUser(userId));

  if (!installation.accountLogin && accountLogin) {
    await prisma.githubInstallation.update({
      where: { userId },
      data: { accountLogin },
    });
  }

  return {
    connected: true,
    accountLogin,
    installedAt: installation.createdAt.toISOString(),
  };
}

export async function saveInstallation(userId: string, installationId: number) {
  const accountLogin = await getGithubLoginForUser(userId);

  await prisma.githubInstallation.upsert({
    where: { userId },
    create: {
      userId,
      installationId,
      accountLogin,
    },
    update: {
      installationId,
      accountLogin,
    },
  });
}


export async function deleteInstallation(userId: string) {
  const installation = await prisma.githubInstallation.findUnique({
    where: { userId },
  });

  if (installation?.installationId) {
    try {
      const app = getGithubApp();
      await app.octokit.request("DELETE /app/installations/{installation_id}", {
        installation_id: installation.installationId,
      });
    } catch (error) {
      console.error(
        "Failed to delete installation from GitHub (it may already be uninstalled):",
        error,
      );
    }
  }

  await prisma.githubInstallation.deleteMany({
    where: {
      userId,
    },
  });
}

export async function getUserIdByInstallationId(installationId: number) {
  const installation = await prisma.githubInstallation.findFirst({
    where: { installationId },
    select: { userId: true },
  });

  if (!installation) {
    return null;
  }

  return installation.userId;
}

export async function getUserInstallationId(userId: string) {
  const installation = await prisma.githubInstallation.findUnique({
    where: { userId },
    select: { installationId: true },
  });

  if (!installation) {
    return null;
  }

  return installation.installationId;
}
