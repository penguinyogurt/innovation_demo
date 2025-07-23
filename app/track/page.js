'use client'
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Stack } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!/^\d{11}$/.test(trackingNumber)) {
      setError('⚠️ Tracking number must be exactly 11 digits.');
      setStatus(null);
      return;
    }

    setError('');
    setStatus(null);
    setLoading(true);

    try {
      const docRef = doc(firestore, 'inventory', trackingNumber);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setStatus({
          status: data.status || 'Unknown',
          estimatedDelivery: data.estimatedDelivery || 'N/A',
        });
      } else {
        setError('Tracking number not found. Please check again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching tracking info.');
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 8,
        p: 4,
        backgroundColor: '#f0f8ff',
        borderRadius: '24px',
        boxShadow: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: 'primary.main' }}
      >
        📦 Track Your Package
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Enter 11-digit Tracking Number"
          variant="outlined"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          fullWidth
          error={!!error && trackingNumber.length > 0}
          helperText={error && trackingNumber.length > 0 ? error : ''}
          inputProps={{ maxLength: 11 }}
          disabled={loading}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleTrack}
          disabled={loading}
          sx={{ fontWeight: 'bold', py: 1.8 }}
        >
          {loading ? 'Loading...' : 'Track Package'}
        </Button>

        {status && (
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#ffffff' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Status: {status.status}
            </Typography>
            <Typography>Estimated Delivery: {status.estimatedDelivery}</Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}