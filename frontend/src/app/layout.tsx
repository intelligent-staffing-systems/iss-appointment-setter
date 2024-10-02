//src/app/layout.tsx
import './globals.css'
import { Providers } from './providers';
import { InactivityProvider } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="vsc-initialized">
        <Providers>
          <InactivityProvider>
                {children}
          </InactivityProvider>
        </Providers>
      </body>
    </html>
  )
}
