// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Wrapper from './components/Wrapper'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MeetWise - Connect with Trusted Professionals',
  description: 'Where Clients Meet Trusted Professionals',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div >
          <Wrapper>
            <Navbar />
          <main className='mt-6' >
            {children}
          </main>
          <Footer />
          </Wrapper>
        </div>
      </body>
    </html>
  )
}