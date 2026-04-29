'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

// ── Ring catalog ─────────────────────────────────────────────────────────────
const RING_CATALOG = [
  {
    id: 'Marquise',
    name: 'Marquise Round Brilliant',
    description: 'Six-prong classic solitaire',
    price: 2490,
    colors: [
      { id: 'gold',     label: '18K Gold',    swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold.png' },
      { id: 'rose',     label: 'Rose Gold',   swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Gold.png' },
      { id: 'yellow',   label: 'Yellow Gold', swatch: 'linear-gradient(135deg,#f5e070,#c8a020)', image: '/rings/Yellow_Gold.png' },
    ],
  },
  {
    id: 'Emerald',
    name: 'Round Diamond Emerald',
    description: 'Pavé halo with center stone',
    price: 3290,
    colors: [
      { id: 'gold',     label: '18K Gold',    swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Emerald.png' },
      { id: 'rose',     label: 'Rose Gold',   swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Gold_Emerald.png' },
      { id: 'yellow',   label: 'Yellow Gold', swatch: 'linear-gradient(135deg,#f5e070,#c8a020)', image: '/rings/Yellow_Gold_Emerald.png' },
      { id: 'platinum', label: 'Platinum',    swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/Platinum_Emerald.png' },
    ],
  },
  {
    id: 'Square-stone',
    name: 'Square Stone',
    description: 'Past, present & future',
    price: 4190,
    colors: [
      { id: 'gold',     label: '18K Gold',    swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Square.png' },
      { id: 'rose',     label: 'Rose Gold',   swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Square.png' },
      { id: 'yellow',   label: 'Yellow Gold', swatch: 'linear-gradient(135deg,#f5e070,#c8a020)', image: '/rings/Yellow_Square.png' },
      { id: 'platinum', label: 'Platinum',    swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/Platinum_Square.png' },
    ],
  },
  {
    id: 'Oval Love',
    name: 'Oval Love',
    description: 'Continuous diamond band',
    price: 1890,
    colors: [
      { id: 'gold',     label: '18K Gold',    swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Oval.png' },
      { id: 'rose',     label: 'Rose Gold',   swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Oval.png' },
      { id: 'platinum', label: 'Platinum',    swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/Platinum_Oval.png' },
      { id: 'yellow',   label: 'Yellow Gold', swatch: 'linear-gradient(135deg,#f5e070,#c8a020)', image: '/rings/Yellow_Oval.png' },
    ],
  },
  {
    id: 'Pear Beauty',
    name: 'Pear Beauty',
    description: 'Step-cut architectural beauty',
    price: 3890,
    colors: [
      { id: 'white',    label: 'White Gold',  swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/White_Pear.png' },
      { id: 'gold',     label: '18K Gold',    swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Pear.png' },
      { id: 'rose',     label: 'Rose Gold',   swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Pear.png' },
      { id: 'yellow',   label: 'Yellow Gold', swatch: 'linear-gradient(135deg,#f5e070,#c8a020)', image: '/rings/Yellow_Pear.png' },
    ],
  },
  {
    id: 'vintage',
    name: 'Vintage Filigree',
    description: 'Art deco hand-engraved band',
    price: 2890,
    colors: [
      { id: 'rose',     label: 'Rose Gold',   swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Vintage.png' },
      { id: 'gold',     label: '18K Gold',    swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Vintage.png' },
      { id: 'yellow',   label: 'Yellow Gold', swatch: 'linear-gradient(135deg,#f5e070,#c8a020)', image: '/rings/Yellow_Vintage.png' },
      { id: 'white',    label: 'White Gold',  swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/White_Vintage.png' },
    ],
  },
  {
    id: 'Heart Triumph',
    name: 'Heart Triumph',
    description: 'Hand-made heart shape band',
    price: 5600,
    colors: [
      { id: 'rose',     label: 'Rose Gold',   swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Heart.png' },
      { id: 'gold',     label: '18K Gold',    swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Heart.png' },
      { id: 'yellow',   label: 'Yellow Gold', swatch: 'linear-gradient(135deg,#f5e070,#c8a020)', image: '/rings/Yellow_Heart.png' },
      { id: 'white',    label: 'White Gold',  swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/White_Heart.png' },
    ],
  },
]

type CartItem = { ring: typeof RING_CATALOG[0]; color: typeof RING_CATALOG[0]['colors'][0]; qty: number }
type Phase = 'intro' | 'camera' | 'tryOn' | 'cart' | 'checkout'

export default function RingTryOn() {
  const [phase, setPhase]         = useState<Phase>('intro')
  const [photo, setPhoto]         = useState<string | null>(null)
  const [selectedRingId, setSelectedRingId] = useState(RING_CATALOG[0].id)
  const [selectedColorId, setSelectedColorId] = useState(RING_CATALOG[0].colors[0].id)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [cart, setCart]           = useState<CartItem[]>([])
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null)
  const [introCard, setIntroCard] = useState(0)

  const [ringPos, setRingPos]       = useState({ x: 50, y: 42 })
  const [ringSize, setRingSize]     = useState(200)
  const [ringRotation, setRingRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [cameraReady, setCameraReady] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [photoSaved, setPhotoSaved] = useState(false)
  const [caratValue, setCaratValue] = useState(0.5)  // 0–1 scale for diamond size

  const videoRef     = useRef<HTMLVideoElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const fileRef      = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const streamRef    = useRef<MediaStream | null>(null)
  const lastPinchDist  = useRef<number | null>(null)
  const lastPinchAngle = useRef<number | null>(null)

  const selectedRing  = RING_CATALOG.find(r => r.id === selectedRingId)!
  const selectedColor = selectedRing.colors.find(c => c.id === selectedColorId) ?? selectedRing.colors[0]

  // Auto-cycle intro cards
  useEffect(() => {
    if (phase !== 'intro') return
    const t = setInterval(() => setIntroCard(i => (i + 1) % 3), 3800)
    return () => clearInterval(t)
  }, [phase])

  // When ring changes, reset color to first available
  const selectRing = useCallback((id: string) => {
    setSelectedRingId(id)
    const ring = RING_CATALOG.find(r => r.id === id)!
    setSelectedColorId(ring.colors[0].id)
    setDropdownOpen(false)
  }, [])

  // ── Camera ─────────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setPhase('camera'); setCameraReady(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        videoRef.current.onloadeddata = () => setCameraReady(true)
      }
    } catch { alert('Camera denied — upload a photo instead.'); setPhase('intro') }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current; const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    stopCamera()
    setPhoto(canvas.toDataURL('image/jpeg', 0.95))
    setPhase('tryOn')
    setRingPos({ x: 50, y: 42 })
  }, [stopCamera])

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setPhoto(ev.target?.result as string); setPhase('tryOn'); setRingPos({ x: 50, y: 42 }) }
    reader.readAsDataURL(file)
  }, [])

  // ── Drag + Pinch ───────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length === 2) return
    e.preventDefault()
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
    const cy = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragOffset({ x: ((cx - rect.left) / rect.width) * 100 - ringPos.x, y: ((cy - rect.top) / rect.height) * 100 - ringPos.y })
    setIsDragging(true)
  }, [ringPos])

  const onPointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if ('touches' in e && (e as TouchEvent).touches.length === 2) {
      const t = (e as TouchEvent).touches
      const dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY
      const dist = Math.sqrt(dx*dx + dy*dy)
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      if (lastPinchDist.current !== null) setRingSize(s => Math.max(30, Math.min(600, s * dist / lastPinchDist.current!)))
      if (lastPinchAngle.current !== null) setRingRotation(r => r + angle - lastPinchAngle.current!)
      lastPinchDist.current = dist; lastPinchAngle.current = angle; return
    }
    if (!isDragging || !containerRef.current) return; e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const cx = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
    const cy = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
    setRingPos({ x: Math.max(5, Math.min(95, ((cx-rect.left)/rect.width)*100-dragOffset.x)), y: Math.max(5, Math.min(95, ((cy-rect.top)/rect.height)*100-dragOffset.y)) })
  }, [isDragging, dragOffset])

  const onPointerUp = useCallback(() => { setIsDragging(false); lastPinchDist.current = null; lastPinchAngle.current = null }, [])

  useEffect(() => {
    if (phase !== 'tryOn') return
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchmove', onPointerMove, { passive: false })
    window.addEventListener('touchend', onPointerUp)
    return () => { window.removeEventListener('mousemove', onPointerMove); window.removeEventListener('mouseup', onPointerUp); window.removeEventListener('touchmove', onPointerMove); window.removeEventListener('touchend', onPointerUp) }
  }, [phase, onPointerMove, onPointerUp])

  // ── Save photo ─────────────────────────────────────────────────────────────
  const savePhoto = useCallback(() => {
    if (!photo) return
    // Composite: draw hand photo + ring on canvas
    const composite = document.createElement('canvas')
    const handImg = new window.Image()
    handImg.onload = () => {
      composite.width = handImg.width; composite.height = handImg.height
      const ctx = composite.getContext('2d')!
      ctx.drawImage(handImg, 0, 0)
      // Draw ring at its current position
      const ringImg = new window.Image(); ringImg.crossOrigin = 'anonymous'
      ringImg.onload = () => {
        const px = (ringPos.x / 100) * handImg.width
        const py = (ringPos.y / 100) * handImg.height
        const sw = ringSize / containerRef.current!.clientWidth * handImg.width
        ctx.save()
        ctx.translate(px, py)
        ctx.rotate(ringRotation * Math.PI / 180)
        ctx.drawImage(ringImg, -sw/2, -sw/2 * (ringImg.height/ringImg.width), sw, sw * (ringImg.height/ringImg.width))
        ctx.restore()
        const url = composite.toDataURL('image/jpeg', 0.95)
        const link = document.createElement('a'); link.download = 'lumiere-ring.jpg'; link.href = url; link.click()
        setPhotoSaved(true); setTimeout(() => setPhotoSaved(false), 2500)
      }
      ringImg.src = selectedColor.image
    }
    handImg.src = photo
  }, [photo, ringPos, ringSize, ringRotation, selectedColor])

  // ── Cart ───────────────────────────────────────────────────────────────────
  const addToCart = useCallback(() => {
    setCart(prev => {
      const existing = prev.find(i => i.ring.id === selectedRing.id && i.color.id === selectedColor.id)
      if (existing) return prev.map(i => i === existing ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ring: selectedRing, color: selectedColor, qty: 1 }]
    })
    setAddedToCart(true)
    setTimeout(() => { setAddedToCart(false); setPhase('cart') }, 800)
  }, [selectedRing, selectedColor])

  const cartTotal = cart.reduce((sum, i) => sum + i.ring.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  // Testimonials data for intro cards
  const testimonials = [
    { name: 'Sophia M.', quote: '"I cried when I saw it on my hand. Ordered instantly."', ring: 'Solitaire Round · 18k Gold', swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', bg: 'radial-gradient(ellipse 80% 90% at 45% 40%, #3d2010 0%, #1a0c06 60%, #0a0704 100%)', person: '#c89068', glow: 'oklch(74% 0.12 78 / 0.6)' },
    { name: 'Aisha K.', quote: '"Never thought I\'d buy a ring online. This changed everything."', ring: 'Sapphire Halo · Platinum', swatch: 'linear-gradient(135deg,#e8e8e8,#a8a8a8)', bg: 'radial-gradient(ellipse 80% 90% at 50% 40%, #0f1428 0%, #080c18 60%, #050608 100%)', person: '#b8988c', glow: 'oklch(74% 0.12 78 / 0.6)' },
    { name: 'Priya & Leo', quote: '"He surprised me with this. We used the try-on together first!"', ring: 'Rose Gold Pavé · 14k', swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', bg: 'radial-gradient(ellipse 80% 90% at 52% 38%, #1e1008 0%, #100804 60%, #080604 100%)', person: '#d49868', glow: 'oklch(74% 0.12 78 / 0.5)' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #08070a; --gold: oklch(74% 0.12 78); --gold-lt: oklch(88% 0.08 78);
          --gold-dk: oklch(50% 0.11 70); --cream: oklch(95% 0.012 82);
          --muted: oklch(56% 0.014 270); --subtle: oklch(22% 0.01 270);
        }
        html, body { width:100%; background: var(--bg); color: var(--cream); font-family:'DM Sans',sans-serif; }
        body::after { content:''; position:fixed; inset:0; z-index:1000; pointer-events:none; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:160px; opacity:0.022; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes float { 0%,100%{transform:rotate(-8deg) translateY(0)} 50%{transform:rotate(-8deg) translateY(-8px)} }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes cardIn { from{opacity:0;transform:translate(20px,20px) scale(.95)} to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .serif { font-family:'Instrument Serif',serif; }
        .gold-text { background:linear-gradient(90deg,var(--gold),var(--gold-lt),#fff8dc,var(--gold-lt),var(--gold)); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s linear infinite; }
        .btn { display:inline-flex; align-items:center; gap:10px; padding:15px 30px; border-radius:100px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:400; letter-spacing:.04em; cursor:pointer; border:none; transition:all .22s ease; }
        .btn-fill { background:var(--cream); color:#08070a; }
        .btn-fill:hover { background:#fff; transform:translateY(-2px); box-shadow:0 12px 32px oklch(95% 0.012 82 / 0.18); }
        .btn-outline { background:oklch(95% 0.012 82 / 0.06); color:var(--cream); border:1px solid oklch(95% 0.012 82 / 0.15); backdrop-filter:blur(10px); }
        .btn-outline:hover { background:oklch(95% 0.012 82 / 0.11); transform:translateY(-2px); }
        input[type=range] { height:2px; -webkit-appearance:none; background:rgba(201,168,50,.2); border-radius:2px; outline:none; width:100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:linear-gradient(135deg,var(--gold),var(--gold-lt)); cursor:pointer; box-shadow:0 0 10px rgba(201,168,50,.5); border:2px solid rgba(0,0,0,.3); }
        select { background:oklch(18% 0.01 270); color:var(--cream); border:1px solid oklch(74% 0.12 78 / 0.25); border-radius:12px; padding:12px 16px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:400; cursor:pointer; outline:none; width:100%; appearance:none; -webkit-appearance:none; }
        select:focus { border-color:oklch(74% 0.12 78 / 0.6); }
        .swatch-btn { width:32px; height:32px; border-radius:50%; border:2px solid transparent; cursor:pointer; transition:all .2s; flex-shrink:0; }
        .swatch-btn.active { border-color:var(--gold-lt); transform:scale(1.15); box-shadow:0 0 12px rgba(201,168,50,.5); }
        .cart-badge { position:absolute; top:-6px; right:-6px; width:18px; height:18px; border-radius:50%; background:var(--gold); color:#08070a; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .intro-grid { grid-template-columns: 1fr !important; padding: 0 20px 80px !important; }
          .cards-stack { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight:'100svh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>

        {/* ── NAV ── */}
        <nav style={{ position:'relative', zIndex:50, padding:'24px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid oklch(74% 0.12 78 / 0.1)' }}>
          <div className="serif" style={{ fontSize:23, letterSpacing:'.08em', color:'var(--gold-lt)' }}>Lumière</div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            {phase === 'tryOn' && (
              <button onClick={() => { stopCamera(); setPhase('intro'); setPhoto(null) }}
                className="btn btn-outline" style={{ padding:'10px 20px', fontSize:13 }}>← Retake</button>
            )}
            {/* Cart button */}
            <button onClick={() => setPhase('cart')} style={{ position:'relative', background:'none', border:'1px solid oklch(74% 0.12 78 / 0.25)', borderRadius:100, padding:'10px 18px', color:'var(--cream)', cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontSize:13, fontFamily:'DM Sans' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </nav>

        {/* ══ INTRO ══════════════════════════════════════════════════════════ */}
        {phase === 'intro' && (
          <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
            {/* Ambient glow */}
            <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
              <div style={{ position:'absolute', top:'10%', left:'30%', width:600, height:600, background:'radial-gradient(ellipse, oklch(74% 0.12 78 / 0.07) 0%, transparent 70%)', borderRadius:'50%' }} />
              <div style={{ position:'absolute', bottom:'5%', right:'10%', width:400, height:400, background:'radial-gradient(ellipse, oklch(74% 0.12 78 / 0.04) 0%, transparent 70%)', borderRadius:'50%' }} />
            </div>

            <div className="intro-grid" style={{ position:'relative', zIndex:5, display:'grid', gridTemplateColumns:'1fr 1fr', alignItems:'center', padding:'0 56px 40px', gap:48, minHeight:'calc(100vh - 88px)' }}>
              {/* LEFT */}
              <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:12, fontSize:11, letterSpacing:'.38em', textTransform:'uppercase', color:'var(--gold)', animation:'fadeUp .8s .1s ease both' }}>
                  <div style={{ width:30, height:1, background:'var(--gold)' }} />
                  Virtual Try-On
                </div>
                <h1 className="serif" style={{ fontSize:'clamp(48px,5vw,76px)', lineHeight:1.06, letterSpacing:'-.02em', animation:'fadeUp 1s .22s ease both' }}>
                  Wear the ring<br /><em style={{ color:'var(--gold-lt)' }}>before you decide</em>
                </h1>
                <p style={{ fontSize:16, fontWeight:300, lineHeight:1.72, color:'var(--muted)', maxWidth:390, animation:'fadeUp 1s .38s ease both' }}>
                  Take a photo of your hand and see any ring on your finger — instantly and lifelike. Choose style, colour, and carat.
                </p>
                <div style={{ display:'flex', gap:14, flexWrap:'wrap', animation:'fadeUp 1s .52s ease both' }}>
                  <button onClick={startCamera} className="btn btn-fill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    Take Photo
                  </button>
                  <label className="btn btn-outline" style={{ cursor:'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 12V4M9 4L6.5 6.5M9 4l2.5 2.5"/><path d="M3 15h18"/></svg>
                    Upload a Photo
                    <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleUpload} />
                  </label>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16, animation:'fadeUp 1s .66s ease both' }}>
                  <div style={{ display:'flex' }}>
                    {['#c89068','#b8988c','#d49868','#e8c09c'].map((c,i) => (
                      <div key={i} style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${c},${c}88)`, border:'2px solid var(--bg)', marginLeft: i === 0 ? 0 : -7 }} />
                    ))}
                  </div>
                  <p style={{ fontSize:13, color:'var(--muted)', fontWeight:300 }}><strong style={{ color:'var(--cream)', fontWeight:400 }}>48,200+</strong> try-ons today</p>
                </div>
              </div>

              {/* RIGHT: stacked testimonial cards */}
              <div className="desktop-only" style={{ position:'relative', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', animation:'fadeIn 1.2s .3s ease both' }}>
                <div className="cards-stack" style={{ position:'relative', width:340, height:460 }}>
                  {testimonials.map((t, i) => {
                    const diff = (i - introCard + 3) % 3
                    const state = diff === 0 ? 'active' : diff === 1 ? 'behind1' : 'behind2'
                    return (
                      <div key={i} style={{
                        position:'absolute', inset:0, borderRadius:24, overflow:'hidden',
                        background:'oklch(13% 0.008 270)', border:'1px solid oklch(74% 0.12 78 / 0.12)',
                        boxShadow:'0 32px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.04)',
                        display:'flex', flexDirection:'column',
                        opacity: state==='active' ? 1 : state==='behind1' ? 0.55 : 0.25,
                        transform: state==='active' ? 'none' : state==='behind1' ? 'translate(14px,14px) scale(.96)' : 'translate(28px,28px) scale(.92)',
                        zIndex: state==='active' ? 3 : state==='behind1' ? 2 : 1,
                        transition:'opacity .7s ease, transform .7s ease',
                      }}>
        {/* Thumb */}
                        <div style={{ flex:1, position:'relative', overflow:'hidden', background:'#0a0a0a' }}>
                          {/* Video background */}
                          <video
                            autoPlay muted loop playsInline
                            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.85 }}
                            onError={e => { (e.target as HTMLVideoElement).style.display = 'none' }}
                          >
                            <source src={`/videos/ring${i + 1}.mp4`} type="video/mp4" />
                          </video>
                          {/* Fallback gradient shown until video loads */}
                          <div style={{ position:'absolute', inset:0, background:t.bg, zIndex:0 }} />
                          <div style={{ position:'absolute', inset:0, zIndex:1, background:`radial-gradient(ellipse 35% 55% at 45% 35%, ${t.person} 0%, transparent 70%)` }} />
                          {/* Ring image overlay on finger */}
                          <div style={{ position:'absolute', inset:0, zIndex:2, display:'flex', alignItems:'center', justifyContent:'center', paddingBottom:20 }}>
                            <img
                              src={RING_CATALOG[i % RING_CATALOG.length].colors[0].image}
                              alt="ring"
                              style={{ width:100, filter:'drop-shadow(0 4px 20px rgba(201,168,50,.7))', transform:'rotate(-8deg)', animation:'float 4s ease-in-out infinite' }}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          </div>
                          {/* Gradient overlay for readability */}
                          <div style={{ position:'absolute', inset:0, zIndex:3, background:'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)' }} />
                          {/* Live badge */}
                          <div style={{ position:'absolute', top:14, left:14, zIndex:4, background:'rgba(0,0,0,.55)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.12)', borderRadius:100, padding:'4px 10px', display:'flex', alignItems:'center', gap:6, fontSize:11 }}>
                            <div style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px #22c55e' }} />
                            Live try-on
                          </div>
                        </div>
                        {/* Info */}
                        <div style={{ padding:'16px 18px 20px', background:'oklch(13% 0.008 270)' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                            <div style={{ fontSize:14, fontWeight:500 }}>{t.name}</div>
                            <div style={{ color:'var(--gold)', fontSize:12 }}>★★★★★</div>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                            <div style={{ width:12, height:12, borderRadius:'50%', background:t.swatch, flexShrink:0 }} />
                            <span style={{ fontSize:12, color:'var(--muted)' }}>{t.ring}</span>
                          </div>
                          <p style={{ fontSize:13, color:'var(--cream)', fontStyle:'italic', lineHeight:1.5 }}>{t.quote}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* Dots */}
                <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6 }}>
                  {[0,1,2].map(i => (
                    <div key={i} onClick={() => setIntroCard(i)} style={{ width: i===introCard ? 20 : 6, height:6, borderRadius:3, background: i===introCard ? 'var(--gold)' : 'rgba(201,168,50,.25)', transition:'all .4s', cursor:'pointer' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ CAMERA ══════════════════════════════════════════════════════════ */}
        {phase === 'camera' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24, background:'var(--bg)' }}>
            <p style={{ fontSize:11, letterSpacing:'.3em', color:'var(--muted)', textTransform:'uppercase' }}>Hold hand flat · ring finger toward camera</p>
            <div style={{ position:'relative', width:'100%', maxWidth:640, borderRadius:16, overflow:'hidden', border:'1px solid oklch(74% 0.12 78 / 0.2)' }}>
              <video ref={videoRef} style={{ width:'100%', display:'block' }} playsInline muted />
              {/* Corner guides */}
              {['top:18%;left:18%','top:18%;right:18%','bottom:18%;left:18%','bottom:18%;right:18%'].map((pos, i) => {
                const s = Object.fromEntries(pos.split(';').map(p => p.trim().split(':')))
                const isR = pos.includes('right'), isB = pos.includes('bottom')
                return <div key={i} style={{ position:'absolute', ...s, width:20, height:20, borderTop: isB ? 'none' : '2px solid var(--gold)', borderBottom: isB ? '2px solid var(--gold)' : 'none', borderLeft: isR ? 'none' : '2px solid var(--gold)', borderRight: isR ? '2px solid var(--gold)' : 'none' }} />
              })}
              {!cameraReady && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(8,7,10,.7)' }}><div style={{ width:32, height:32, border:'2px solid rgba(201,168,50,.3)', borderTopColor:'var(--gold)', borderRadius:'50%', animation:'spin .8s linear infinite' }} /></div>}
            </div>
            <canvas ref={canvasRef} style={{ display:'none' }} />
            <button onClick={capturePhoto} disabled={!cameraReady}
              style={{ width:68, height:68, borderRadius:'50%', background: cameraReady ? 'linear-gradient(135deg,var(--gold),var(--gold-lt))' : '#2a2a2a', border:'3px solid rgba(0,0,0,.3)', cursor: cameraReady ? 'pointer' : 'not-allowed', fontSize:26, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}>
              📸
            </button>
            <label className="btn btn-outline" style={{ cursor:'pointer', fontSize:13 }}>
              or upload a photo
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleUpload} />
            </label>
          </div>
        )}

        {/* ══ TRY-ON ══════════════════════════════════════════════════════════ */}
        {phase === 'tryOn' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <style>{`
              .tryon-layout {
                display: grid;
                grid-template-columns: 1fr 420px;
                flex: 1;
                overflow: hidden;
                height: calc(100vh - 74px);
              }
              .tryon-left {
                position: relative;
                overflow: hidden;
                background: #000;
                display: flex;
                flex-direction: column;
              }
              .tryon-right {
                overflow-y: auto;
                background: oklch(8% 0.008 270);
                border-left: 1px solid oklch(74% 0.12 78 / 0.1);
                display: flex;
                flex-direction: column;
                padding: 28px 24px;
                gap: 22px;
              }
              .ctrl-label {
                font-size: 9px;
                color: var(--gold);
                letter-spacing: .32em;
                text-transform: uppercase;
                font-weight: 600;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .ctrl-label span {
                font-size: 12px;
                color: var(--cream);
                font-weight: 400;
                letter-spacing: .04em;
                text-transform: none;
              }
              .divider {
                height: 1px;
                background: linear-gradient(90deg,transparent,oklch(74% 0.12 78 / 0.12),transparent);
              }
              @media (max-width: 768px) {
                .tryon-layout {
                  grid-template-columns: 1fr !important;
                  grid-template-rows: auto 1fr;
                  height: auto !important;
                }
                .tryon-left {
                  height: clamp(300px, 75vw, 480px) !important;
                }
                .tryon-right {
                  border-left: none !important;
                  border-top: 1px solid oklch(74% 0.12 78 / 0.1);
                  padding: 20px 16px !important;
                  gap: 18px !important;
                  height: auto !important;
                  overflow-y: visible !important;
                }
              }
            `}</style>

            <div className="tryon-layout">

              {/* ── LEFT: Photo preview ── */}
              <div className="tryon-left" ref={containerRef}
                style={{ cursor: isDragging ? 'grabbing' : 'default', touchAction:'none', isolation:'isolate', willChange:'transform' }}>
                {photo && <img src={photo} alt="hand" draggable={false}
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', pointerEvents:'none', userSelect:'none' }} />}

                {/* Ring overlay */}
                <div onMouseDown={onPointerDown} onTouchStart={onPointerDown}
                  style={{
                    position:'absolute',
                    left:`${ringPos.x}%`, top:`${ringPos.y}%`,
                    transform:`translate(-50%,-50%) rotate(${ringRotation}deg)`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect:'none', touchAction:'none',
                    width: ringSize,
                    willChange:'transform',
                    filter:'drop-shadow(0 4px 20px rgba(0,0,0,.65))',
                  }}>
                  <img
                    src={selectedColor.image}
                    alt={selectedRing.name}
                    draggable={false}
                    style={{
                      width:'100%',
                      objectFit:'contain',
                      display:'block',
                      pointerEvents:'none',
                      // Scale up the diamond by changing transform-origin to center of gem
                      // (visual carat effect — PNG scales uniformly, gem appears larger)
                      transform: `scale(${0.7 + caratValue * 0.3})`,
                      transformOrigin: 'center center',
                      transition: isDragging ? 'none' : 'transform 0.2s',
                    }}
                  />
                </div>

                {!isDragging && (
                  <div style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)', background:'rgba(8,7,10,.75)', backdropFilter:'blur(12px)', border:'1px solid oklch(74% 0.12 78 / 0.2)', color:'rgba(240,237,232,.8)', padding:'7px 20px', borderRadius:100, fontSize:12, letterSpacing:'.07em', whiteSpace:'nowrap', pointerEvents:'none' }}>
                    Drag · Pinch to resize &amp; rotate
                  </div>
                )}

                {/* Size + Rotate sliders overlaid at bottom of left panel on mobile */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, display:'none' }} className="mobile-sliders">
                </div>
              </div>

              {/* ── RIGHT: Controls ── */}
              <div className="tryon-right">

                {/* Ring name + price */}
                <div>
                  <div style={{ fontSize:11, color:'var(--gold)', letterSpacing:'.25em', textTransform:'uppercase', marginBottom:6 }}>
                    Selected Ring
                  </div>
                  <h2 className="serif" style={{ fontSize:22, fontWeight:300, lineHeight:1.2, marginBottom:4 }}>
                    {selectedRing.name}
                  </h2>
                  <div style={{ fontSize:13, color:'var(--muted)', marginBottom:2 }}>{selectedRing.description}</div>
                  <div style={{ fontSize:20, color:'var(--gold)', fontWeight:500, marginTop:6 }}>
                    ${selectedRing.price.toLocaleString()}
                  </div>
                </div>

                <div className="divider" />

                {/* Ring style selector */}
                <div>
                  <div className="ctrl-label">Ring Style</div>
                  <div style={{ position:'relative' }}>
                    <select value={selectedRingId} onChange={e => selectRing(e.target.value)}>
                      {RING_CATALOG.map(r => (
                        <option key={r.id} value={r.id}>{r.name} — ${r.price.toLocaleString()}</option>
                      ))}
                    </select>
                    <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--gold)' }}>▾</div>
                  </div>
                </div>

                {/* Metal color */}
                <div>
                  <div className="ctrl-label">Metal <span>{selectedColor.label}</span></div>
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                    {selectedRing.colors.map(c => (
                      <button key={c.id} onClick={() => setSelectedColorId(c.id)}
                        className={`swatch-btn ${selectedColorId === c.id ? 'active' : ''}`}
                        style={{ background: c.swatch }} title={c.label} />
                    ))}
                  </div>
                </div>

                {/* Carat slider */}
                <div>
                  <div className="ctrl-label">
                    Carat Size
                    <span>
                      {caratValue < 0.2 ? '0.5 ct' :
                       caratValue < 0.4 ? '0.75 ct' :
                       caratValue < 0.55 ? '1.0 ct' :
                       caratValue < 0.7 ? '1.5 ct' :
                       caratValue < 0.85 ? '2.0 ct' : '3.0 ct'}
                    </span>
                  </div>
                  <input type="range" min={0} max={100} value={Math.round(caratValue * 100)}
                    onChange={e => setCaratValue(+e.target.value / 100)} />
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--muted)', marginTop:5 }}>
                    <span>0.5 ct</span><span>1.0 ct</span><span>1.5 ct</span><span>2.0 ct</span><span>3.0 ct</span>
                  </div>
                </div>

                <div className="divider" />

                {/* Size + Rotate */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div>
                    <div className="ctrl-label">Ring Size <span style={{ fontSize:11 }}>{Math.round(ringSize)}px</span></div>
                    <input type="range" min={20} max={600} value={ringSize} onChange={e => setRingSize(+e.target.value)} />
                  </div>
                  <div>
                    <div className="ctrl-label">Rotate <span style={{ fontSize:11 }}>{Math.round(ringRotation)}°</span></div>
                    <input type="range" min={-180} max={180} value={ringRotation} onChange={e => setRingRotation(+e.target.value)} />
                  </div>
                </div>

                <div className="divider" />

                {/* Action buttons */}
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <button onClick={addToCart}
                    style={{ width:'100%', padding:'16px', borderRadius:12, border:'none', background: addedToCart ? 'var(--gold-dk)' : 'linear-gradient(135deg,var(--gold),var(--gold-lt))', color:'#08070a', fontSize:13, letterSpacing:'.1em', fontWeight:700, cursor:'pointer', fontFamily:'DM Sans', display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all .3s' }}>
                    {addedToCart ? '✓ Added to Cart!' : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                        Add to Cart · ${selectedRing.price.toLocaleString()}
                      </>
                    )}
                  </button>
                  <button onClick={savePhoto}
                    style={{ width:'100%', padding:'15px', borderRadius:12, border:'1px solid oklch(74% 0.12 78 / 0.3)', background: photoSaved ? 'oklch(74% 0.12 78 / 0.1)' : 'transparent', color: photoSaved ? 'var(--gold)' : 'var(--cream)', fontSize:13, letterSpacing:'.1em', fontWeight:500, cursor:'pointer', fontFamily:'DM Sans', display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all .3s' }}>
                    {photoSaved ? '✓ Photo Saved!' : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        Save Photo
                      </>
                    )}
                  </button>
                  <button onClick={() => { stopCamera(); setPhase('intro'); setPhoto(null) }}
                    style={{ width:'100%', padding:'12px', borderRadius:12, border:'none', background:'transparent', color:'var(--muted)', fontSize:12, cursor:'pointer', fontFamily:'DM Sans', letterSpacing:'.06em' }}>
                    ← Try a different photo
                  </button>
                </div>

                {/* Bottom spacer for mobile */}
                <div style={{ height:20 }} />
              </div>
            </div>
          </div>
        )}

        {/* ══ CART ══════════════════════════════════════════════════════════ */}
        {phase === 'cart' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', maxWidth:600, margin:'0 auto', width:'100%', padding:'32px 20px' }}>
            <h2 className="serif" style={{ fontSize:32, fontWeight:300, marginBottom:24 }}>Your Cart</h2>
            {cart.length === 0 ? (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, color:'var(--muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                <p>Your cart is empty</p>
                <button onClick={() => setPhase('tryOn')} className="btn btn-outline" style={{ fontSize:13 }}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
                  {cart.map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:16, alignItems:'center', padding:'16px', borderRadius:16, background:'oklch(13% 0.008 270)', border:'1px solid oklch(74% 0.12 78 / 0.1)' }}>
                      <img src={item.color.image} alt={item.ring.name} style={{ width:80, height:50, objectFit:'contain', filter:'drop-shadow(0 4px 10px rgba(0,0,0,.5))' }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:500, marginBottom:3 }}>{item.ring.name}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                          <div style={{ width:12, height:12, borderRadius:'50%', background:item.color.swatch }} />
                          <span style={{ fontSize:12, color:'var(--muted)' }}>{item.color.label}</span>
                        </div>
                        <div style={{ fontSize:13, color:'var(--gold)' }}>${item.ring.price.toLocaleString()}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <button onClick={() => setCart(prev => prev.map((ci,ci_i) => ci_i===i && ci.qty>1 ? {...ci,qty:ci.qty-1} : ci).filter((ci,ci_i) => !(ci_i===i && ci.qty<=1)))} style={{ width:28, height:28, borderRadius:'50%', border:'1px solid rgba(255,255,255,.1)', background:'none', color:'var(--cream)', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                        <span style={{ minWidth:20, textAlign:'center', fontSize:14 }}>{item.qty}</span>
                        <button onClick={() => setCart(prev => prev.map((ci,ci_i) => ci_i===i ? {...ci,qty:ci.qty+1} : ci))} style={{ width:28, height:28, borderRadius:'50%', border:'1px solid rgba(255,255,255,.1)', background:'none', color:'var(--cream)', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:'1px solid oklch(74% 0.12 78 / 0.15)', paddingTop:20, marginBottom:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:18, fontWeight:500 }}>
                    <span>Total</span>
                    <span style={{ color:'var(--gold)' }}>${cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setPhase('checkout')} className="btn btn-fill" style={{ width:'100%', justifyContent:'center', fontSize:15, borderRadius:12 }}>
                  Proceed to Checkout →
                </button>
                <button onClick={() => setPhase('tryOn')} className="btn btn-outline" style={{ width:'100%', justifyContent:'center', fontSize:13, marginTop:10, borderRadius:12 }}>
                  Continue Shopping
                </button>
              </>
            )}
          </div>
        )}

        {/* ══ CHECKOUT ══════════════════════════════════════════════════════ */}
        {phase === 'checkout' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, gap:24 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),var(--gold-lt))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>
              💎
            </div>
            <h2 className="serif" style={{ fontSize:36, fontWeight:300, textAlign:'center' }}>
              Secure Checkout
            </h2>
            <p style={{ color:'var(--muted)', fontSize:15, textAlign:'center', maxWidth:380, lineHeight:1.7 }}>
              Our secure checkout is coming soon. In the meantime, contact us directly to complete your purchase.
            </p>
            <div style={{ width:'100%', maxWidth:440, background:'oklch(13% 0.008 270)', borderRadius:20, padding:28, border:'1px solid oklch(74% 0.12 78 / 0.15)' }}>
              <div style={{ fontSize:11, color:'var(--gold)', letterSpacing:'.25em', textTransform:'uppercase', marginBottom:16 }}>Order Summary</div>
              {cart.map((item, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,.06)', fontSize:14 }}>
                  <span style={{ color:'var(--muted)' }}>{item.ring.name} × {item.qty}</span>
                  <span>${(item.ring.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:16, fontSize:18, fontWeight:600 }}>
                <span>Total</span>
                <span style={{ color:'var(--gold)' }}>${cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:12, width:'100%', maxWidth:440 }}>
              <button onClick={() => setPhase('cart')} className="btn btn-outline" style={{ flex:1, justifyContent:'center', borderRadius:12 }}>← Back</button>
              <button className="btn btn-fill" style={{ flex:2, justifyContent:'center', borderRadius:12, opacity:.6, cursor:'not-allowed' }}>
                Complete Purchase (Soon)
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}