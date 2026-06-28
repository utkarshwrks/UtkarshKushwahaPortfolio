import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
// Always fetch fresh so newly-solved problems show up immediately (no caching).
export const dynamic = 'force-dynamic'
export const revalidate = 0

export type RatingPoint = { name: string; date: number; rating: number }

type LeetCode = {
  total: number
  easy: number
  medium: number
  hard: number
  totalEasy: number
  totalMedium: number
  totalHard: number
  ranking: number | null
  contestRating: number | null
  contestCount: number
  topPercentage: number | null
  ratingHistory: RatingPoint[]
} | null

type Codeforces = {
  handle: string
  rating: number | null
  maxRating: number | null
  rank: string | null
  solved: number
  ratingHistory: RatingPoint[]
} | null

type DiffCount = { difficulty: string; count: number }
const countOf = (arr: DiffCount[] | undefined, d: string) =>
  Array.isArray(arr) ? (arr.find((n) => n.difficulty === d)?.count ?? 0) : 0

async function getLeetCode(username: string): Promise<LeetCode> {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
      body: JSON.stringify({
        query: `query($username: String!) {
          allQuestionsCount { difficulty count }
          matchedUser(username: $username) {
            profile { ranking }
            submitStatsGlobal { acSubmissionNum { difficulty count } }
          }
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            topPercentage
          }
          userContestRankingHistory(username: $username) {
            attended
            rating
            contest { title startTime }
          }
        }`,
        variables: { username },
      }),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = await res.json()
    const u = json?.data?.matchedUser
    const solvedNums: DiffCount[] = u?.submitStatsGlobal?.acSubmissionNum
    if (!Array.isArray(solvedNums)) return null

    const all: DiffCount[] = json?.data?.allQuestionsCount ?? []
    const cr = json?.data?.userContestRanking
    const hist = json?.data?.userContestRankingHistory

    const ratingHistory: RatingPoint[] = Array.isArray(hist)
      ? hist
          .filter((h: { attended?: boolean }) => h?.attended)
          .map((h: { rating?: number; contest?: { title?: string; startTime?: number } }) => ({
            name: h.contest?.title ?? '',
            date: (h.contest?.startTime ?? 0) * 1000,
            rating: Math.round(h.rating ?? 0),
          }))
      : []

    return {
      total: countOf(solvedNums, 'All'),
      easy: countOf(solvedNums, 'Easy'),
      medium: countOf(solvedNums, 'Medium'),
      hard: countOf(solvedNums, 'Hard'),
      totalEasy: countOf(all, 'Easy'),
      totalMedium: countOf(all, 'Medium'),
      totalHard: countOf(all, 'Hard'),
      ranking: u?.profile?.ranking ?? null,
      contestRating: cr?.rating != null ? Math.round(cr.rating) : null,
      contestCount: cr?.attendedContestsCount ?? 0,
      topPercentage: cr?.topPercentage != null ? Math.round(cr.topPercentage * 100) / 100 : null,
      ratingHistory,
    }
  } catch {
    return null
  }
}

async function getCodeforces(handle: string): Promise<Codeforces> {
  try {
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`, {
      cache: 'no-store',
    })
    const info = await infoRes.json()
    const user = info?.result?.[0]

    let solved = 0
    try {
      const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`, {
        cache: 'no-store',
      })
      const status = await statusRes.json()
      if (status?.status === 'OK') {
        const set = new Set<string>()
        for (const sub of status.result) {
          if (sub.verdict === 'OK' && sub.problem) {
            set.add(`${sub.problem.contestId}-${sub.problem.index}`)
          }
        }
        solved = set.size
      }
    } catch {
      /* ignore solved count failure */
    }

    let ratingHistory: RatingPoint[] = []
    try {
      const rRes = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`, {
        cache: 'no-store',
      })
      const rJson = await rRes.json()
      if (rJson?.status === 'OK' && Array.isArray(rJson.result)) {
        ratingHistory = rJson.result.map(
          (c: { contestName?: string; ratingUpdateTimeSeconds?: number; newRating?: number }) => ({
            name: c.contestName ?? '',
            date: (c.ratingUpdateTimeSeconds ?? 0) * 1000,
            rating: c.newRating ?? 0,
          })
        )
      }
    } catch {
      /* ignore rating history failure */
    }

    return {
      handle,
      rating: user?.rating ?? null,
      maxRating: user?.maxRating ?? null,
      rank: user?.rank ?? null,
      solved,
      ratingHistory,
    }
  } catch {
    return null
  }
}

export async function GET() {
  const lcUser = process.env.LEETCODE_USERNAME
  const cfHandle = process.env.CODEFORCES_HANDLE

  const [leetcode, codeforces] = await Promise.all([
    lcUser ? getLeetCode(lcUser) : Promise.resolve(null),
    cfHandle ? getCodeforces(cfHandle) : Promise.resolve(null),
  ])

  return NextResponse.json({ leetcode, codeforces })
}
