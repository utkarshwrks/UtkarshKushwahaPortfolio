import { isAuthed } from '@/lib/auth'
import { cmsConfigured } from '@/lib/github-cms'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export const metadata = {
  title: 'Admin · Utkarsh Kushwaha',
  robots: { index: false, follow: false },
}

// Always render fresh — never cache the admin gate.
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const authed = await isAuthed()

  return (
    <>
      {/* Mark the document as admin so the site chrome (navbar/loader/chat) is
          hidden regardless of the (possibly secret) URL. Runs before paint. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "try{document.documentElement.setAttribute('data-admin','1')}catch(e){}",
        }}
      />
      {authed ? <AdminDashboard cmsConfigured={cmsConfigured} /> : <AdminLogin />}
    </>
  )
}
