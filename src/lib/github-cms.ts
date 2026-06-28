// Git-based CMS helpers.
// Reads & writes files directly in the GitHub repo via the REST API.
// A commit to the data files / public images triggers a Vercel rebuild,
// so the public site updates automatically — no database needed.
//
// LOCAL MODE: in development we read/write the real files on disk instead of
// hitting GitHub, so the admin works fully offline (no token needed). Set
// CMS_FORCE_GITHUB=1 to use GitHub even in dev.

import { promises as fs } from 'fs'
import { join, dirname } from 'path'

const OWNER = process.env.GITHUB_REPO_OWNER
const REPO = process.env.GITHUB_REPO_NAME
const BRANCH = process.env.GITHUB_REPO_BRANCH || 'main'
const TOKEN = process.env.GITHUB_COMMIT_TOKEN

const API = 'https://api.github.com'

// Use the local filesystem when running in dev (and not explicitly forced to GitHub).
const USE_LOCAL =
  process.env.NODE_ENV !== 'production' && process.env.CMS_FORCE_GITHUB !== '1'

function localPath(repoPath: string): string {
  return join(process.cwd(), repoPath)
}

function assertEnv() {
  if (!OWNER || !REPO || !TOKEN) {
    throw new Error(
      'GitHub CMS not configured: set GITHUB_REPO_OWNER, GITHUB_REPO_NAME and GITHUB_COMMIT_TOKEN.'
    )
  }
}

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

type GhContentResponse = { sha: string; content?: string; encoding?: string }

/** Get the current sha (and optionally decoded text) of a file, or null if it doesn't exist. */
async function getFile(path: string): Promise<{ sha: string; text: string } | null> {
  assertEnv()
  const res = await fetch(
    `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`,
    { headers: headers(), cache: 'no-store' }
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub getFile ${path} failed: ${res.status} ${await res.text()}`)
  const data = (await res.json()) as GhContentResponse
  const text = data.content ? Buffer.from(data.content, 'base64').toString('utf-8') : ''
  return { sha: data.sha, text }
}

/** Read & parse a JSON data file from the repo. Returns [] if missing. */
export async function readJson<T = unknown>(path: string): Promise<T[]> {
  if (USE_LOCAL) {
    try {
      return JSON.parse(await fs.readFile(localPath(path), 'utf-8')) as T[]
    } catch {
      return []
    }
  }
  const file = await getFile(path)
  if (!file) return []
  try {
    return JSON.parse(file.text) as T[]
  } catch {
    return []
  }
}

/** Read & parse a JSON object (singleton, e.g. site settings). Returns fallback if missing/invalid. */
export async function readJsonObject<T>(path: string, fallback: T): Promise<T> {
  if (USE_LOCAL) {
    try {
      return JSON.parse(await fs.readFile(localPath(path), 'utf-8')) as T
    } catch {
      return fallback
    }
  }
  const file = await getFile(path)
  if (!file) return fallback
  try {
    return JSON.parse(file.text) as T
  } catch {
    return fallback
  }
}

/** Create or update a file with raw base64 content (used for images). */
export async function commitBase64(
  path: string,
  base64Content: string,
  message: string
): Promise<void> {
  if (USE_LOCAL) {
    const full = localPath(path)
    await fs.mkdir(dirname(full), { recursive: true })
    await fs.writeFile(full, Buffer.from(base64Content, 'base64'))
    return
  }
  assertEnv()
  const existing = await getFile(path)
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: BRANCH,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  })
  if (!res.ok) throw new Error(`GitHub commit ${path} failed: ${res.status} ${await res.text()}`)
}

/** Create or update a UTF-8 text file. */
export async function commitText(path: string, text: string, message: string): Promise<void> {
  await commitBase64(path, Buffer.from(text, 'utf-8').toString('base64'), message)
}

/** Write a JSON data file (pretty-printed) back to the repo. */
export async function writeJson(path: string, value: unknown, message: string): Promise<void> {
  await commitText(path, JSON.stringify(value, null, 2) + '\n', message)
}

// In local mode the admin is "configured" (it writes to disk, no token needed).
export const cmsConfigured = USE_LOCAL || Boolean(OWNER && REPO && TOKEN)
