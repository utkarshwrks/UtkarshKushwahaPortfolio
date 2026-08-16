import projectsData from './projects.json'

export type Project = {
  slug: string
  name: string
  tech: string[]
  description: string
  achievements: string[]
  github: string
  live: string
  images: string[]
  /** Optional winning position / award — renders a highlighted badge only when present. */
  award?: string
  /** Optional manual feature flag — force a project into the large showcase layout. */
  featured?: boolean
  /** Optional case-study metadata — each renders only when present. */
  role?: string
  year?: string
  status?: string // 'live' | 'archived'
  /** When true, project is hidden from the portfolio without being deleted. */
  hidden?: boolean
}

export const projects: Project[] = projectsData as unknown as Project[]
