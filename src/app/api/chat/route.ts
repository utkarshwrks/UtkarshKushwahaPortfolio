import { NextResponse } from 'next/server'
import projects from '@/data/projects.json'
import experience from '@/data/experience.json'
import certificates from '@/data/certificates.json'
import achievements from '@/data/achievements.json'

export const runtime = 'nodejs'

// Build a compact knowledge base from the real portfolio data so the
// assistant answers about Utkarsh accurately and never invents facts.
function knowledgeBase() {
  const proj = projects
    .map(
      (p) =>
        `- ${p.name} [${p.tech.join(', ')}]: ${p.description}${
          p.achievements?.length ? ` (Achievements: ${p.achievements.join('; ')})` : ''
        }${p.github ? ` GitHub: ${p.github}` : ''}`
    )
    .join('\n')

  const exp = experience
    .map((e) => `- ${e.role} @ ${e.company} (${e.time}): ${e.points.join(' ')}`)
    .join('\n')

  const certs = certificates.map((c) => `- ${c.title} (${c.issuer})`).join('\n')

  const wins = achievements
    .map((a) => `- ${a.rank} at ${a.title} (${a.year}) with ${a.project} — prize: ${a.prize}`)
    .join('\n')

  return `ABOUT UTKARSH KUSHWAHA
Computer Science & Engineering (AI & ML) undergraduate. Backend developer and AI enthusiast.
Skilled in building scalable APIs, real-time systems and cloud-integrated solutions.
Languages: Python, JavaScript, C++, C, SQL.
Web: Next.js, Node.js, Express.js, Django, Flask, HTML, CSS.
Databases & Cloud: MongoDB, MySQL, Firebase, Microsoft Azure.
Core CS: DSA, OOP, Machine Learning. Solved 400+ DSA problems on LeetCode and Codeforces.
Tools: Git, GitHub, Postman, VS Code, Vercel, Linux, Twilio.
Links: GitHub github.com/utkarshwrks · LinkedIn linkedin.com/in/utkarshwrks

EXPERIENCE
${exp}

PROJECTS
${proj}

HACKATHONS & ACHIEVEMENTS
${wins}

CERTIFICATIONS
${certs}`
}

const SYSTEM_PROMPT = `You are "Utkarsh's AI" — a friendly assistant embedded on Utkarsh Kushwaha's portfolio website.
You answer questions about Utkarsh: his skills, projects, experience, certifications, and how to contact or hire him.
Rules:
- Speak about Utkarsh in the third person ("Utkarsh built…", "He has experience in…"). Be warm, concise and professional.
- ONLY use the facts in the knowledge base below. If something isn't covered, say you don't have that detail and point them to his GitHub/LinkedIn or the contact section.
- Never invent employers, dates, metrics, or projects.
- Keep answers short (2–5 sentences) unless asked for detail. Recruiters are the main audience.

KNOWLEDGE BASE:
${'${KB}'}`

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Chat is not configured (missing GROQ_API_KEY).' }, { status: 503 })
  }

  let messages: ChatMessage[] = []
  try {
    const body = await req.json()
    messages = Array.isArray(body?.messages) ? body.messages : []
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // keep it lightweight: last 8 turns, cap content length
  const trimmed = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  const system = SYSTEM_PROMPT.replace('${KB}', knowledgeBase())

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.4,
        max_tokens: 500,
        messages: [{ role: 'system', content: system }, ...trimmed],
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      return NextResponse.json({ error: `Groq error: ${res.status}`, detail }, { status: 502 })
    }

    const data = await res.json()
    const reply: string =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response. Try asking about Utkarsh's projects or skills."
    return NextResponse.json({ reply })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
