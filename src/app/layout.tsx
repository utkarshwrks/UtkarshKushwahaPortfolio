// app/layout.tsx
import './globals.css'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/Navbar/Navbar'
import Loader from '@/components/Loader/Loader'

export const metadata = {
  title: 'Utkarsh-Portfolio',
  description: 'Portfolio of Utkarsh Kushwaha — FullStack Developer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logoo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="light">
          <Loader />
          <Navbar />
          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}