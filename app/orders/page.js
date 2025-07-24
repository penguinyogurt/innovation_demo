'use client'

import { useEffect, useState } from 'react'
import { firestore } from '@/firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import {
  Box, Typography, Card, CardContent, Grid,
  List, ListItem, ListItemText, Divider, Stack, Button, Link as MuiLink
} from '@mui/material'
import { LocalShipping, AccessTime, Inventory2 } from '@mui/icons-material'

export default function OrdersPage() {
  const [totalItems, setTotalItems] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)
  const [activeShipments, setActiveShipments] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStockItems, setLowStockItems] = useState(0)

  useEffect(() => {
    // Items Count
    const unsubItems = onSnapshot(collection(firestore, 'inventory'), (snapshot) => {
      setTotalItems(snapshot.size)
    })

    // Pending Orders
    const unsubPending = onSnapshot(
      query(collection(firestore, 'inventory'), where('status', '==', 'pending')),
      (snapshot) => setPendingOrders(snapshot.size)
    )

    // Low Stock Items (example: quantity < 10)
    const unsubLowStock = onSnapshot(
      query(collection(firestore, 'inventory'), where('quantity', '<', 10)),
      (snapshot) => setLowStockItems(snapshot.size)
    )

    // Active Shipments
    const unsubShipments = onSnapshot(
      collection(firestore, 'inventory'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setActiveShipments(data)
      }
    )

    // Recent Orders (last 6)
    const unsubOrders = onSnapshot(
      collection(firestore, 'inventory'),
      (snapshot) => {
        const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const sorted = allOrders.sort((a, b) => b.date.localeCompare(a.date))
        setRecentOrders(sorted)
      }
    )

    return () => {
      unsubItems()
      unsubPending()
      unsubLowStock()
      unsubShipments()
      unsubOrders()
    }
  }, [])

  // Helper for progress bar (fake progress for demo)
  const getProgress = (shipment) => {
    // You can replace this with real progress logic
    return shipment.status === 'shipped' ? 100 : 50
  }

  return (
    <Box p={2} sx={{ background: '#f7f7f7', minHeight: '100vh' }}>
      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        {[{
          label: 'Total Items',
          value: totalItems,
        }, {
          label: 'Low Stock Items',
          value: lowStockItems,
        }, {
          label: 'Pending Orders',
          value: pendingOrders,
        }, {
          label: 'Total Items',
          value: totalItems,
        }].map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={card.label + idx}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
              <CardContent>
                <Typography variant="body1" color="textSecondary" gutterBottom>{card.label}</Typography>
                <Typography variant="h4" fontWeight={700}>{card.value.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Active Shipments */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, p: 0 }}>
            <Box display="flex" alignItems="center" px={3} pt={3} pb={1}>
              <LocalShipping color="primary" sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h5" fontWeight={700}>Active Shipments</Typography>
            </Box>
            <Box px={2} pb={2}>
              {activeShipments.map((s, i) => (
                <Card key={s.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 1, background: '#fafbfc' }}>
                  <Box display="flex" alignItems="center" p={2}>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={700}>#{s.id}</Typography>
                      <Typography variant="body2" color="textSecondary">{s.destination || 'Warehouse A'}</Typography>
                    </Box>
                    <Box mr={2}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          background: '#eaeaea',
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Shipped
                      </Box>
                    </Box>
                    {/* Progress Bar */}
                    <Box width={80} height={12} bgcolor="#e0e0e0" borderRadius={6} mx={2}>
                      <Box
                        width={`${getProgress(s)}%`}
                        height="100%"
                        bgcolor="#000"
                        borderRadius={6}
                        sx={{ transition: 'width 0.3s' }}
                      />
                    </Box>
                    <AccessTime sx={{ color: '#f5b942', fontSize: 28, ml: 2 }} />
                  </Box>
                </Card>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, p: 0 }}>
            <Box display="flex" alignItems="center" px={3} pt={3} pb={1}>
              <Inventory2 color="warning" sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h5" fontWeight={700}>Recent Orders</Typography>
            </Box>
            <Box px={3} pb={2}>
              <Box display="flex" justifyContent="space-between" fontWeight={600} color="text.secondary" mb={1}>
                <Typography variant="body2">Order ID</Typography>
                <Typography variant="body2">Order Date</Typography>
              </Box>
              {recentOrders.map((o, i) => (
                <Box key={o.id} display="flex" justifyContent="space-between" alignItems="center" py={0.5} borderBottom={i < recentOrders.length - 1 ? '1px solid #eee' : 'none'}>
                  <MuiLink href={`#${o.id}`} underline="hover" fontWeight={600} fontSize={15} sx={{ color: '#2196f3', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.id}
                  </MuiLink>
                  <Typography variant="body2" color="textSecondary">{o.date || '-'}</Typography>
                </Box>
              ))}
              <Box textAlign="center" mt={2}>
                <Button variant="text" size="small" sx={{ color: '#b0b0b0', fontWeight: 500, textTransform: 'none' }} disabled>
                  Show More...
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
