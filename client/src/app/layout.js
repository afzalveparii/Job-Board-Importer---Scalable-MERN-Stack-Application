import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Job Board - Import System',
  description: 'Scalable job import system with queue processing',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center py-6 mt-12">
          <p>&copy; 2025 Job Board. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
