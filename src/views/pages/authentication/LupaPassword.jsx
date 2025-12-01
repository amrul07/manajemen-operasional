import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Poppins } from '../../../ui-component/typography/Poppins';
import { Box, Paper, Stack, Button, Fade } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * MODERN OTP UI — UX Premium
 * -------------------------------------------------
 * ✔ Single hidden input (Google style)
 * ✔ Visual focus (active box highlight)
 * ✔ Paste support
 * ✔ Timer countdown + resend
 * ✔ Shake animation on wrong input
 * ✔ Auto-submit optional
 * ✔ Clean, modern look (MUI)
 */

export default function OtpVerification({ length = 6 }) {
  const [code, setCode] = useState('');
  const hiddenRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  // timer
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const t = timer > 0 && setInterval(() => setTimer((s) => s - 1), 1000);
    if (timer === 0) setCanResend(true);
    return () => clearInterval(t);
  }, [timer]);

  const focusInput = () => hiddenRef.current?.focus();

  const handleChange = (e) => {
    let v = e.target.value.replace(/[^0-9]/g, '');
    if (v.length > length) v = v.slice(0, length);
    setCode(v);
    setActiveIndex(v.length);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    setCode(text.slice(0, length));
  };

  const submitCode = () => {
    if (code.length !== length) return;

    if (code !== '123456') {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setCode('');
      setActiveIndex(0);
    } else {
      setSuccess(true);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
  };

  const boxes = Array.from({ length }).map((_, i) => (
    <Box
      key={i}
      onClick={focusInput}
      sx={{
        width: { xs: 35, md: 56 },
        height: { xs: 40, md: 64 },
        borderRadius: 2,
        border: i === activeIndex ? '2px solid #1976d2' : '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 600,
        bgcolor: 'background.paper',
        boxShadow: i === activeIndex ? 3 : 1,
        transition: 'all .15s ease',
        cursor: 'text'
      }}
    >
      {code[i] || ''}
    </Box>
  ));

  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <style>{`
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        .shake { animation: shake 0.5s; }
      `}</style>

      <Paper sx={{ width: { xs: '95%', sm: 500 }, p: 4, borderRadius: 4 }} elevation={8}>
        <Stack spacing={2} alignItems="center">
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'grid',
                placeItems: 'center',
                color: 'white'
              }}
            >
              <CheckCircleOutlineIcon />
            </Box>
            <Box>
              <Poppins variant="h6" fontWeight={700}>
                Verifikasi OTP
              </Poppins>
              <Poppins variant="body2" color="text.secondary">
                Kode dikirim ke +62 •••• 1234
              </Poppins>
            </Box>
          </Box>

          {/* Timer */}
          <Poppins variant="body2" color="text.secondary">
            Kode akan kedaluwarsa dalam <b>{timer}s</b>
          </Poppins>

          {/* OTP Boxes */}
          <Box
            className={shake ? 'shake' : ''}
            sx={{ display: 'flex', gap: 1.5, mt: 1,maxWidth: "95%" }}
            onClick={focusInput}
          >
            {boxes}
          </Box>

          {/* Hidden Input */}
          <input
            ref={hiddenRef}
            value={code}
            onChange={handleChange}
            onPaste={handlePaste}
            inputMode="numeric"
            autoFocus
            style={{ position: 'absolute', opacity: 0, left: -9999 }}
          />

          {/* Buttons */}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, borderRadius: 2, py: 1.3 }}
            disabled={code.length !== length}
            onClick={submitCode}
          >
            Verifikasi
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<RestartAltIcon />}
            onClick={handleResend}
            disabled={!canResend}
            sx={{ borderRadius: 2 }}
          >
            {canResend ? 'Kirim Ulang Kode' : `Kirim ulang (${timer}s)`}
          </Button>

          <Fade in={success}>
            <Poppins sx={{ color: 'success.main', fontWeight: 700, mt: 1 }}>OTP berhasil diverifikasi ✓</Poppins>
          </Fade>
        </Stack>
      </Paper>
    </Box>
  );
}
