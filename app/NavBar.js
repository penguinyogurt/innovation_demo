'use client'

import Link from 'next/link'
import { AppBar, Toolbar, Button } from '@mui/material'

export default function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#D6D6D6' }}>
      <Toolbar sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', paddingRight: 4,}}>
        <Link href="/" passHref><Button sx={{color:"#FFB517", textTransform: 'none', fontWeight: 'bold', fontSize: '1.25rem'}}>Home</Button></Link>
        <Link href="/orders" passHref><Button sx={{color:"#FFB517", textTransform: 'none', fontWeight: 'bold', fontSize: '1.25rem'}}>Orders</Button></Link>
        <Link href="/inventory" passHref><Button sx={{color:"#FFB517", textTransform: 'none', fontWeight: 'bold', fontSize: '1.25rem'}}>Search</Button></Link>
        <Link href="/track" passHref><Button sx={{color:"#FFB517", textTransform: 'none', fontWeight: 'bold', fontSize: '1.25rem'}}>Track</Button></Link>
      </Toolbar>
    </AppBar>
  )
}