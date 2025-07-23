'use client'

import { useEffect, useState } from 'react'
import { firestore } from '@/firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import {
  Box, Typography, Card, CardContent, Grid,
  List, ListItem, ListItemText, Divider
} from '@mui/material'

export default function OrdersPage() {
  const [totalItems, setTotalItems] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)
  const [activeShipments, setActiveShipments] = useState([])
  const [recentOrders, setRecentOrders] = useState([])

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

    // Active Shipments
    const unsubShipments = onSnapshot(
      collection(firestore, 'inventory'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setActiveShipments(data)
      }
    )

    // Recent Orders (last 5)
    const unsubOrders = onSnapshot(
      collection(firestore, 'inventory'),
      (snapshot) => {
        const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const sorted = allOrders.sort((a, b) => b.date.localeCompare(a.date))
        setRecentOrders(sorted.slice(0, 5))
      }
    )

    return () => {
      unsubItems()
      unsubPending()
      unsubShipments()
      unsubOrders()
    }
  }, [])

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Orders Dashboard</Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Items</Typography>
              <Typography variant="h4" color="primary">{totalItems}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending Orders</Typography>
              <Typography variant="h4" color="error">{pendingOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Shipments</Typography>
          <Card>
            <List>
              {activeShipments.map((s, i) => (
                <Box key={s.id}>
                  <ListItem>
                    <ListItemText
                      primary={s.id}
                      secondary={`${s.destination} • ${s.status}`}
                    />
                  </ListItem>
                  {i < activeShipments.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Recent Orders</Typography>
          <Card>
            <List>
              {recentOrders.map((o, i) => (
                <Box key={o.id}>
                  <ListItem>
                    <ListItemText
                      primary={o.id}
                      secondary={`Date: ${o.date} • Items: ${o.quantity || 0}`}
                    />
                  </ListItem>
                  {i < recentOrders.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
