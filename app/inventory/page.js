
'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Box, Typography, Stack, TextField, Button, InputAdornment, Paper, IconButton, Modal, Alert, Chip } from '@mui/material'
import { Home, Search, Inventory2, Close as CloseIcon, Upload, FileUpload } from '@mui/icons-material'

export default function InventoryPage() {
  const [inventory, setInventory] = useState([])
  const [search, setSearch] = useState('')
  const [shippingOptionsOpen, setShippingOptionsOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState(null)
  const [csvParts, setCsvParts] = useState([])
  const [csvError, setCsvError] = useState('')
  const [showCsvResults, setShowCsvResults] = useState(false)

  const getShippingOptions = (partName) => [
    { vendor: 'FedEx', price: '$5.00', quantity: 2, quality: 'High' },
    { vendor: 'UPS', price: '$3.50', quantity: 5, quality: 'Medium' },
    { vendor: 'DHL', price: '$4.00', quantity: 3, quality: 'High' },
  ];

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset states
    setCsvError('');
    setCsvParts([]);
    setShowCsvResults(false);

    // Validate file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setCsvError('Please upload a valid CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const lines = csvText.split('\n');
        const parts = [];
        
        // Process each line - each line should be a part number
        lines.forEach((line) => {
          const trimmedLine = line.trim();
          if (trimmedLine) { // Skip empty lines
            const partNumber = trimmedLine.split(',')[0]?.trim(); // Get first column as part number
            if (partNumber) {
              parts.push(partNumber);
            }
          }
        });

        if (parts.length === 0) {
          setCsvError('No valid part numbers found in CSV file');
          return;
        }

        setCsvParts(parts);
        setShowCsvResults(true);
        setSearch(''); // Clear text search when CSV is uploaded
      } catch (error) {
        setCsvError('Error processing CSV file. Please check the format.');
      }
    };

    reader.onerror = () => {
      setCsvError('Error reading file');
    };

    reader.readAsText(file);
  };

  const clearCsvResults = () => {
    setCsvParts([]);
    setShowCsvResults(false);
    setCsvError('');
    // Clear the file input value to allow re-uploading the same file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

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

  // Filter inventory based on search or CSV parts
  const filteredInventory = inventory.filter(item => {
    if (showCsvResults && csvParts.length > 0) {
      return csvParts.some(part => item.name.toLowerCase().includes(part.toLowerCase()));
    }
    return search.trim() === '' ? true : item.name.toLowerCase().includes(search.toLowerCase());
  });

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

        {/* Search Section */}
        <Box mb={3}>
          {/* Search Bar with CSV Upload */}
          <Paper elevation={1} sx={{ maxWidth: 400, borderRadius: 3, p: 0.5, pl: 2, display: 'flex', alignItems: 'center' }}>
            <Search sx={{ color: '#b0b0b0', mr: 1 }} />
            <TextField
              variant="standard"
              placeholder="Search for an item..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (e.target.value.trim() !== '') {
                  clearCsvResults(); // Clear CSV results when text search is used
                }
              }}
              InputProps={{ disableUnderline: true }}
              sx={{ flex: 1, fontSize: 18 }}
            />
            <IconButton
              component="label"
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                color: '#666',
                '&:hover': { bgcolor: 'rgba(102, 102, 102, 0.04)' }
              }}
            >
              <FileUpload sx={{ fontSize: 20 }} />
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleCsvUpload}
              />
            </IconButton>
            <IconButton disabled>
              <Search />
            </IconButton>
          </Paper>

          {/* CSV Results Display */}
          {csvError && (
            <Alert severity="error" sx={{ mt: 2, maxWidth: 400 }}>
              {csvError}
            </Alert>
          )}

          {showCsvResults && csvParts.length > 0 && (
            <Box mt={2} maxWidth={400}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Searching for {csvParts.length} part(s):
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={clearCsvResults}
                  sx={{ color: '#666', minWidth: 'auto', p: 0.5 }}
                >
                  Clear
                </Button>
              </Stack>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {csvParts.map((part, index) => (
                  <Chip
                    key={index}
                    label={part}
                    size="small"
                    sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>



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
          {filteredInventory.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3,
                py: 4,
                fontSize: 16,
                color: '#666',
              }}
            >
              {showCsvResults && csvParts.length > 0 
                ? 'No inventory items found matching the uploaded CSV parts.'
                : 'No inventory items found matching your search.'
              }
            </Box>
          ) : (
            filteredInventory.map(({ name, description, quantity }, idx, arr) => (
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
            ))
          )}
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
