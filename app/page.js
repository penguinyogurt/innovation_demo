'use client'
import { Typography, Box } from '@mui/material'

export default function HomePage() {
  return (
    <Box
      width = "100vw" 
      height = "100vh" 
      display = "flex" 
      flexDirection="column"
      justifyContent = "center" 
      alignItems = "center"
      gap = {2}
      style = {{
        backgroundImage: 'url(https://www.parcelandpostaltechnologyinternational.com/wp-content/uploads/2023/12/Dematic_Radial-2-1200x800.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box textAlign="center">
      <Typography variant="h2" color = "#FFF01F">📦 Dematic Warehouse App</Typography>
      {/* <Typography variant="subtitle1" mt={2}>
        HOME
      </Typography> */}
      </Box>
    </Box>
    
  )
}