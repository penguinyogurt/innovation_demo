import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from './NavBar' // this will be a client component

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dematic App',
  description: 'Warehouse management system powered by Firebase + Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}