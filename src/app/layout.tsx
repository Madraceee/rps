'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen"}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange
        >
          <Provider store={store}>
            {children}
          </Provider>
          <Toaster />
        </ThemeProvider>
      </body>

    </html>
  )
}
