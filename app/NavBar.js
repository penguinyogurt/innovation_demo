'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AppBar, Toolbar, Button, Box } from '@mui/material'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Orders', href: '/orders' },
  { label: 'Search', href: '/inventory' },
  { label: 'Track', href: '/track' },
]

export default function NavBar() {
  const pathname = usePathname()
  return (
    <Box sx={{ width: '100%', position: 'relative', zIndex: 1100 }}>
      {/* Gold accent bar */}
      <Box sx={{ height: 4, width: '100%', bgcolor: '#FFB517' }} />
      <AppBar position="static" elevation={2} sx={{ backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 72, px: { xs: 2, sm: 6 } }}>
          {/* Logo and title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/" passHref legacyBehavior>
              <a style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Image src="/dematic.png" alt="Dematic Logo" width={140} height={48} priority style={{ height: 48, width: 'auto' }} />
              </a>
            </Link>
          </Box>
          {/* Navigation links */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link key={href} href={href} passHref legacyBehavior>
                  <Button
                    sx={{
                      color: isActive ? '#FFB517' : '#222',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      borderBottom: isActive ? '3px solid #FFB517' : '3px solid transparent',
                      borderRadius: 0,
                      backgroundColor: 'transparent',
                      transition: 'color 0.2s, border-bottom 0.2s',
                      '&:hover': {
                        color: '#FFB517',
                        backgroundColor: 'rgba(255,181,23,0.08)',
                        borderBottom: '3px solid #FFB517',
                      },
                      px: 2,
                      py: 1.2,
                    }}
                    disableElevation
                  >
                    {label}
                  </Button>
                </Link>
              )
            })}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}