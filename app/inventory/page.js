
'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Box, Typography, Stack, TextField, Button, InputAdornment, Paper, IconButton, Modal } from '@mui/material'
import { Home, Search, Inventory2, Close as CloseIcon } from '@mui/icons-material'

export default function InventoryPage() {
  const [inventory, setInventory] = useState([])
  const [search, setSearch] = useState('')
  const [shippingOptionsOpen, setShippingOptionsOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState(null)

  const getShippingOptions = (partName) => [
    { vendor: 'FedEx', price: '$5.00', quantity: 2, quality: 'High' },
    { vendor: 'UPS', price: '$3.50', quantity: 5, quality: 'Medium' },
    { vendor: 'DHL', price: '$4.00', quantity: 3, quality: 'High' },
  ];

  const updateInventory = async () => {
    const snapshot = collection(firestore, 'inventory')
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box minHeight="100vh" bgcolor="#fafbfc" p={4} display="flex" justifyContent="center" alignItems="flex-start">
      <Box
        sx={{
          width: '100%',
          maxWidth: 900,
          bgcolor: '#fff',
          borderRadius: 4,
          boxShadow: 4,
          p: { xs: 2, sm: 4 },
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <Home sx={{ color: '#2196f3', fontSize: 36 }} />
          <Typography variant="h4" fontWeight={700} color="#222">
            Inventory Management
          </Typography>
        </Stack>

        {/* Search Bar */}
        <Paper elevation={1} sx={{ maxWidth: 400, mb: 3, borderRadius: 3, p: 0.5, pl: 2, display: 'flex', alignItems: 'center' }}>
          <Search sx={{ color: '#b0b0b0', mr: 1 }} />
          <TextField
            variant="standard"
            placeholder="Search for an item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ flex: 1, fontSize: 18 }}
          />
          <IconButton disabled>
            <Search />
          </IconButton>
        </Paper>

        {/* Table Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            height: 48, // Ensures vertical centering matches rows
            bgcolor: '#f7f7f7',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            border: '1px solid #eee',
            fontWeight: 600,
            fontSize: 17,
            color: '#444',
          }}
        >
          <Box flex={2} display="flex" alignItems="center">Part Number</Box>
          <Box flex={4} display="flex" alignItems="center">Description</Box>
          <Box flex={1} display="flex" alignItems="center">Quantity</Box>
          <Box flex={1}></Box>
        </Box>

        {/* Inventory List */}
        <Box
          sx={{
            bgcolor: '#fff',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            border: '1px solid #eee',
            borderTop: 'none',
            overflow: 'hidden',
          }}
        >
          {inventory
            .filter(item =>
              search.trim() === '' ? true : item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(({ name, description, quantity }, idx, arr) => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 3,
                  py: 2,
                  borderBottom: idx < arr.length - 1 ? '1px solid #f0f0f0' : 'none',
                  fontSize: 16,
                }}
              >
                <Box flex={2} display="flex" alignItems="center">{name}</Box>
                <Box flex={4} display="flex" alignItems="center">{description || 'Description goes here'}</Box>
                <Box flex={1} display="flex" alignItems="center">{quantity}</Box>
                <Box flex={1} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#7ed957',
                      color: '#fff',
                      borderRadius: 3,
                      fontWeight: 700,
                      px: 3,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#6cc24a' },
                    }}
                    onClick={() => {
                      setSelectedPart(name);
                      setShippingOptionsOpen(true);
                    }}
                  >
                    Order
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
      {/* Shipping Options Modal */}
      <Modal open={shippingOptionsOpen} onClose={() => setShippingOptionsOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 950,
            maxWidth: '98vw',
            bgcolor: 'transparent',
            boxShadow: 'none',
            outline: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Popup Card: header + 3 cards + close button */}
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 4,
              boxShadow: 4,
              p: 3, // increased padding
              minWidth: 320,
              maxWidth: 900,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 2,
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {/* Close X at top right */}
            <IconButton
              aria-label="close"
              onClick={() => setShippingOptionsOpen(false)}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: '#fff',
                bgcolor: 'rgba(0,0,0,0.18)',
                borderRadius: '50%',
                zIndex: 10,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.32)' },
              }}
            >
              <CloseIcon sx={{ fontSize: 28 }} />
            </IconButton>
            {/* Header Card */}
            <Box
              sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                boxShadow: 2,
                mb: 1,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Inventory2 sx={{ color: '#2196f3', fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Part: {selectedPart}
                </Typography>
                <Typography color="text.secondary">
                  Part Description: This Part is very important
                </Typography>
              </Box>
            </Box>

            {/* Shipping Options Cards */}
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={1}>
              {/* Internal Inventory 1 */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 260,
                  maxWidth: 300,
                  border: '3px solid #8bc34a',
                  borderRadius: 3,
                  bgcolor: '#fff',
                  boxShadow: 1,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#388e3c">
                  Internal Inventory
                </Typography>
                <Typography fontSize={15} color="text.secondary" mb={1}>
                  Sourced From: Monterrey Warehouse
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography fontSize={15} color="text.secondary">Quality</Typography>
                    <Typography fontWeight={700} color="#689f38">Used</Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography fontSize={15} color="text.secondary">Quantity</Typography>
                    <Typography fontWeight={700} color="#388e3c">3 units</Typography>
                  </Box>
                </Box>
                <Box borderTop="1px solid #eee" borderBottom="1px solid #eee" py={1} mb={1}>
                  <Box display="flex" justifyContent="space-between"><Typography>Unit Price</Typography><Typography>$1250.00</Typography></Box>
                  <Box display="flex" justifyContent="space-between"><Typography>Shipping</Typography><Typography>$100.00</Typography></Box>
                  <Box display="flex" justifyContent="space-between"><Typography>Tariffs</Typography><Typography>$00.00</Typography></Box>
                </Box>
                <Typography fontWeight={700} fontSize={18} mb={0.5}>Total Cost</Typography>
                <Typography fontWeight={500} mb={1}>$1350.00</Typography>
              </Box>
              {/* Internal Inventory 2 */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 260,
                  maxWidth: 300,
                  border: '3px solid #8bc34a',
                  borderRadius: 3,
                  bgcolor: '#fff',
                  boxShadow: 1,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#388e3c">
                  Internal Inventory
                </Typography>
                <Typography fontSize={15} color="text.secondary" mb={1}>
                  Sourced From: Grand Rapids Warehouse
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography fontSize={15} color="text.secondary">Quality</Typography>
                    <Typography fontWeight={700} color="#8bc34a">Slight Defect</Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography fontSize={15} color="text.secondary">Quantity</Typography>
                    <Typography fontWeight={700} color="#388e3c">3 units</Typography>
                  </Box>
                </Box>
                <Box borderTop="1px solid #eee" borderBottom="1px solid #eee" py={1} mb={1}>
                  <Box display="flex" justifyContent="space-between"><Typography>Unit Price</Typography><Typography>$1250.00</Typography></Box>
                  <Box display="flex" justifyContent="space-between"><Typography>Shipping</Typography><Typography>$100.00</Typography></Box>
                  <Box display="flex" justifyContent="space-between"><Typography>Tariffs</Typography><Typography>$00.00</Typography></Box>
                </Box>
                <Typography fontWeight={700} fontSize={18} mb={0.5}>Total Cost</Typography>
                <Typography fontWeight={500} mb={1}>$1350.00</Typography>
              </Box>
              {/* External Inventory */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 260,
                  maxWidth: 300,
                  border: '3px solid #2196f3',
                  borderRadius: 3,
                  bgcolor: '#fff',
                  boxShadow: 1,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#1976d2">
                  External Inventory
                </Typography>
                <Typography fontSize={15} color="text.secondary" mb={1}>
                  Sourced From: Amazon.ca
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography fontSize={15} color="text.secondary">Quality</Typography>
                    <Typography fontWeight={700} color="#2196f3">Brand New</Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography fontSize={15} color="text.secondary">Quantity</Typography>
                    <Typography fontWeight={700} color="#388e3c">3 units</Typography>
                  </Box>
                </Box>
                <Box borderTop="1px solid #eee" borderBottom="1px solid #eee" py={1} mb={1}>
                  <Box display="flex" justifyContent="space-between"><Typography>Unit Price</Typography><Typography>$1250.00</Typography></Box>
                  <Box display="flex" justifyContent="space-between"><Typography>Shipping</Typography><Typography>$100.00</Typography></Box>
                  <Box display="flex" justifyContent="space-between"><Typography>Tariffs</Typography><Typography>$00.00</Typography></Box>
                </Box>
                <Typography fontWeight={700} fontSize={18} mb={0.5}>Total Cost</Typography>
                <Typography fontWeight={500} mb={1}>$1350.00</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
