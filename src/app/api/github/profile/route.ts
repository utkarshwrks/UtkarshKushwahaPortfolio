import { NextResponse } from 'next/server'

// Live GitHub profile stats for the "Get to Know Me" section.
// Cached for an hour so we don't hammer the API on every visit.
export const revalidate = 3600

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME
  if (!token || !username) {
    return NextResponse.json({ ok: false, error: 'Missing env vars' }, { status: 200 })
  }

  const query = `query($login: String!) {
    user(login: $login) {
      repositories(privacy: PUBLIC, ownerAffiliations: OWNER, first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes { stargazerCount }
      }
      followers { totalCount }
      following { totalCount }
      contributionsCollection {
        contributionCalendar { totalContributions }
      }
    }
  }`

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: 3600 },
    })

    const json = await res.json()
    const user = json?.data?.user
    if (!user) return NextResponse.json({ ok: false, error: 'No data' }, { status: 200 })

    const repos: number = user.repositories?.totalCount ?? 0
    const stars: number = (user.repositories?.nodes ?? []).reduce(
      (sum: number, n: { stargazerCount?: number }) => sum + (n.stargazerCount ?? 0),
      0,
    )
    const followers: number = user.followers?.totalCount ?? 0
    const following: number = user.following?.totalCount ?? 0
    const contributions: number =
      user.contributionsCollection?.contributionCalendar?.totalContributions ?? 0

    return NextResponse.json({ ok: true, repos, stars, followers, following, contributions })
  } catch {
    return NextResponse.json({ ok: false, error: 'Fetch failed' }, { status: 200 })
  }
}
