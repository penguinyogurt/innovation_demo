'use client'
import { Typography, Box } from '@mui/material'

export default function HomePage() {
  return (
    <Box
      width = "100vw" 
      height = "100vh" 
      display = "flex" 
      flexDirection="column"
      justifyContent = "flex-end" 
      alignItems = "flex-start"
      style = {{
        backgroundImage: 'url(/home.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      sx={{ position: 'relative', p: { xs: 3, sm: 6 } }}
    >
      <Box textAlign="left" sx={{ mb: 10, ml: 1 }}>
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 2px 16px rgba(0,0,0,0.25)', lineHeight: 1.1 }}>
          Dematic<br />Warehouse App
        </Typography>
      </Box>
    </Box>
    
  )
}