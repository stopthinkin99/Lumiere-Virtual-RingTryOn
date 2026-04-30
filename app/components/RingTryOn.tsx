'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

const RING_CATALOG = [
  { id: 'Marquise', name: 'Marquise Round Brilliant', description: 'Six-prong classic solitaire', price: 2490, rotation: 0,
    colors: [{ id: 'gold', label: '18K Gold', swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold.png' }, { id: 'rose', label: 'Rose Gold', swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Gold.png' }, { id: 'silver', label: 'Silver', swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/Silver.png' }] },
  { id: 'Emerald', name: 'Round Diamond Emerald', description: 'Pavé halo with center stone', price: 3290, rotation: 90,
    colors: [{ id: 'gold', label: '18K Gold', swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Emerald.png' }, { id: 'rose', label: 'Rose Gold', swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Gold_Emerald.png' }, { id: 'platinum', label: 'Platinum', swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/Platinum_Emerald.png' }] },
  { id: 'Square-stone', name: 'Square Stone', description: 'Past, present & future', price: 4190, rotation: 0,
    colors: [{ id: 'gold', label: '18K Gold', swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Square.png' }, { id: 'rose', label: 'Rose Gold', swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Square.png' }, { id: 'platinum', label: 'Platinum', swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/Platinum_Square.png' }] },
  { id: 'Oval Love', name: 'Oval Love', description: 'Continuous diamond band', price: 1890, rotation: 0,
    colors: [{ id: 'gold', label: '18K Gold', swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Oval.png' }, { id: 'rose', label: 'Rose Gold', swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Oval.png' }, { id: 'platinum', label: 'Platinum', swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/Platinum_Oval.png' }] },
  { id: 'Pear Beauty', name: 'Pear Beauty', description: 'Step-cut architectural beauty', price: 3890, rotation: 0,
    colors: [{ id: 'white', label: 'White Gold', swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/White_Pear.png' }, { id: 'gold', label: '18K Gold', swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Pear.png' }, { id: 'rose', label: 'Rose Gold', swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Pear.png' }] },
  { id: 'vintage', name: 'Vintage Filigree', description: 'Art deco hand-engraved band', price: 2890, rotation: 0,
    colors: [{ id: 'rose', label: 'Rose Gold', swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Vintage.png' }, { id: 'gold', label: '18K Gold', swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Vintage.png' }, { id: 'white', label: 'White Gold', swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/White_Vintage.png' }] },
  { id: 'Heart Triumph', name: 'Heart Triumph', description: 'Hand-made heart shape band', price: 5600, rotation: 0,
    colors: [{ id: 'rose', label: 'Rose Gold', swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', image: '/rings/Rose_Heart.png' }, { id: 'gold', label: '18K Gold', swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', image: '/rings/Gold_Heart.png' }, { id: 'white', label: 'White Gold', swatch: 'linear-gradient(135deg,#e8e8f0,#a0a0b8)', image: '/rings/White_Heart.png' }] },
]

const NEXTGENIQ_LOGO = '/nextgeniq-logo.jpeg'

// ── Multi-ring: each placed ring has its own position, size, rotation, ring+color
type PlacedRing = { id: string; ringId: string; colorId: string; x: number; y: number; size: number; rotation: number }
type CartItem = { ring: typeof RING_CATALOG[0]; color: typeof RING_CATALOG[0]['colors'][0]; qty: number }
type Phase = 'intro' | 'camera' | 'tryOn' | 'cart' | 'checkout'

export default function RingTryOn() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [photo, setPhoto] = useState<string | null>(null)
  const [selectedRingId, setSelectedRingId] = useState(RING_CATALOG[0].id)
  const [selectedColorId, setSelectedColorId] = useState(RING_CATALOG[0].colors[0].id)
  const [cart, setCart] = useState<CartItem[]>([])
  const [introCard, setIntroCard] = useState(0)

  // Single-ring mode state
  const [ringPos, setRingPos] = useState({ x: 50, y: 42 })
  const [ringSize, setRingSize] = useState(200)
  const [ringRotation, setRingRotation] = useState(0)

  // Multi-ring mode state
  const [multiMode, setMultiMode] = useState(false)
  const [placedRings, setPlacedRings] = useState<PlacedRing[]>([])
  const [activePlacedId, setActivePlacedId] = useState<string | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [cameraReady, setCameraReady] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [photoSaved, setPhotoSaved] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mobileShowcaseRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastPinchDist = useRef<number | null>(null)
  const lastPinchAngle = useRef<number | null>(null)
  const dragTargetRef = useRef<'single' | string>('single')

  const selectedRing = RING_CATALOG.find(r => r.id === selectedRingId)!
  const selectedColor = selectedRing.colors.find(c => c.id === selectedColorId) ?? selectedRing.colors[0]
  const activePlaced = placedRings.find(p => p.id === activePlacedId)

  const testimonials = [
    { name: 'Sophia M.', quote: '"I cried when I saw it on my hand. Ordered instantly."', ring: 'Solitaire Round · 18k Gold', swatch: 'linear-gradient(135deg,#f0d898,#c9973a)', video: '/videos/ring1.mp4', bg: 'radial-gradient(ellipse 80% 90% at 45% 40%, #3d2010 0%, #1a0c06 60%, #0a0704 100%)' },
    { name: 'Aisha K.', quote: '"Never thought I\'d buy a ring online. This changed everything."', ring: 'Sapphire Halo · Platinum', swatch: 'linear-gradient(135deg,#e8e8e8,#a8a8a8)', video: '/videos/ring2.mp4', bg: 'radial-gradient(ellipse 80% 90% at 50% 40%, #0f1428 0%, #080c18 60%, #050608 100%)' },
    { name: 'Priya & Leo', quote: '"He surprised me with this. We used the try-on together first!"', ring: 'Rose Gold Pavé · 14k', swatch: 'linear-gradient(135deg,#f4c0b4,#d47060)', video: '/videos/ring3.mp4', bg: 'radial-gradient(ellipse 80% 90% at 52% 38%, #1e1008 0%, #100804 60%, #080604 100%)' },
  ]
  const floatingRings = [
    { image: RING_CATALOG[0].colors[0].image, top:'7%', left:'8%', size:72, opacity:0.42, duration:'16s', delay:'0s', rotate:-18 },
    { image: RING_CATALOG[1].colors[1].image, top:'16%', left:'34%', size:62, opacity:0.34, duration:'18s', delay:'2s', rotate:12 },
    { image: RING_CATALOG[2].colors[0].image, top:'12%', left:'82%', size:78, opacity:0.4, duration:'20s', delay:'1s', rotate:-10 },
    { image: RING_CATALOG[3].colors[2].image, top:'36%', left:'76%', size:68, opacity:0.36, duration:'17s', delay:'3s', rotate:20 },
    { image: RING_CATALOG[4].colors[1].image, top:'63%', left:'10%', size:74, opacity:0.32, duration:'19s', delay:'4s', rotate:-24 },
    { image: RING_CATALOG[5].colors[0].image, top:'78%', left:'26%', size:64, opacity:0.34, duration:'15s', delay:'2.5s', rotate:16 },
    { image: RING_CATALOG[6].colors[1].image, top:'72%', left:'84%', size:82, opacity:0.4, duration:'21s', delay:'1.5s', rotate:-14 },
    { image: RING_CATALOG[0].colors[2].image, top:'52%', left:'90%', size:56, opacity:0.28, duration:'14s', delay:'0.5s', rotate:10 },
  ]

  useEffect(() => {
    if (phase !== 'intro') return
    const t = setInterval(() => setIntroCard(i => (i + 1) % 3), 3800)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'intro') return
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (!isMobile) return
    const el = mobileShowcaseRef.current; if (!el) return
    let index = 0
    const t = setInterval(() => { index = (index + 1) % testimonials.length; el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' }) }, 4500)
    return () => clearInterval(t)
  }, [phase, testimonials.length])

  const selectRing = useCallback((id: string) => {
    const ring = RING_CATALOG.find(r => r.id === id)!
    if (multiMode) {
      // In multi-mode: place a new ring on the photo at a slightly offset position
      const newRing: PlacedRing = {
        id: `${id}-${Date.now()}`,
        ringId: id,
        colorId: ring.colors[0].id,
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 30,
        size: 160,
        rotation: 0,
      }
      setPlacedRings(prev => [...prev, newRing])
      setActivePlacedId(newRing.id)
      setSelectedRingId(id)
      setSelectedColorId(ring.colors[0].id)
    } else {
      setSelectedRingId(id)
      setSelectedColorId(ring.colors[0].id)
    }
  }, [multiMode])

  const startCamera = useCallback(async () => {
    setPhase('camera'); setCameraReady(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); videoRef.current.onloadeddata = () => setCameraReady(true) }
    } catch { alert('Camera denied — upload a photo instead.'); setPhase('intro') }
  }, [])

  const stopCamera = useCallback(() => { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null }, [])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current; const canvas = canvasRef.current; if (!video || !canvas) return
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    stopCamera(); setPhoto(canvas.toDataURL('image/jpeg', 0.95)); setPhase('tryOn'); setRingPos({ x: 50, y: 42 })
  }, [stopCamera])

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setPhoto(ev.target?.result as string); setPhase('tryOn'); setRingPos({ x: 50, y: 42 }) }
    reader.readAsDataURL(file)
  }, [])

  // ── Pointer handlers — work for both single and multi mode ──
  const onPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent, target: 'single' | string = 'single') => {
    if ('touches' in e && e.touches.length === 2) return
    e.preventDefault(); e.stopPropagation()
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
    const cy = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragTargetRef.current = target
    if (target === 'single') {
      setDragOffset({ x: ((cx - rect.left) / rect.width) * 100 - ringPos.x, y: ((cy - rect.top) / rect.height) * 100 - ringPos.y })
    } else {
      const placed = placedRings.find(p => p.id === target)!
      setDragOffset({ x: ((cx - rect.left) / rect.width) * 100 - placed.x, y: ((cy - rect.top) / rect.height) * 100 - placed.y })
      setActivePlacedId(target)
    }
    setIsDragging(true)
  }, [ringPos, placedRings])

  const onPointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if ('touches' in e && (e as TouchEvent).touches.length === 2) {
      const t = (e as TouchEvent).touches
      const dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY
      const dist = Math.sqrt(dx*dx + dy*dy), angle = Math.atan2(dy, dx) * (180 / Math.PI)
      if (dragTargetRef.current === 'single') {
        if (lastPinchDist.current !== null) setRingSize(s => Math.max(30, Math.min(600, s * dist / lastPinchDist.current!)))
        if (lastPinchAngle.current !== null) setRingRotation(r => r + angle - lastPinchAngle.current!)
      } else {
        const tid = dragTargetRef.current
        if (lastPinchDist.current !== null) setPlacedRings(prev => prev.map(p => p.id === tid ? { ...p, size: Math.max(30, Math.min(600, p.size * dist / lastPinchDist.current!)) } : p))
        if (lastPinchAngle.current !== null) setPlacedRings(prev => prev.map(p => p.id === tid ? { ...p, rotation: p.rotation + angle - lastPinchAngle.current! } : p))
      }
      lastPinchDist.current = dist; lastPinchAngle.current = angle; return
    }
    if (!isDragging || !containerRef.current) return; e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const cx = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
    const cy = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
    const nx = Math.max(5, Math.min(95, ((cx - rect.left) / rect.width) * 100 - dragOffset.x))
    const ny = Math.max(5, Math.min(95, ((cy - rect.top) / rect.height) * 100 - dragOffset.y))
    if (dragTargetRef.current === 'single') {
      setRingPos({ x: nx, y: ny })
    } else {
      const tid = dragTargetRef.current
      setPlacedRings(prev => prev.map(p => p.id === tid ? { ...p, x: nx, y: ny } : p))
    }
  }, [isDragging, dragOffset])

  const onPointerUp = useCallback(() => { setIsDragging(false); lastPinchDist.current = null; lastPinchAngle.current = null }, [])

  useEffect(() => {
    if (phase !== 'tryOn') return
    window.addEventListener('mousemove', onPointerMove); window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchmove', onPointerMove, { passive: false }); window.addEventListener('touchend', onPointerUp)
    return () => { window.removeEventListener('mousemove', onPointerMove); window.removeEventListener('mouseup', onPointerUp); window.removeEventListener('touchmove', onPointerMove); window.removeEventListener('touchend', onPointerUp) }
  }, [phase, onPointerMove, onPointerUp])

  const savePhoto = useCallback(() => {
    if (!photo) return
    const composite = document.createElement('canvas'); const handImg = new window.Image()
    handImg.onload = () => {
      composite.width = handImg.width; composite.height = handImg.height
      const ctx = composite.getContext('2d')!; ctx.drawImage(handImg, 0, 0)
      const drawRing = (img: HTMLImageElement, px: number, py: number, sw: number, rot: number) => {
        ctx.save(); ctx.translate(px, py); ctx.rotate(rot * Math.PI / 180)
        ctx.drawImage(img, -sw/2, -sw/2*(img.height/img.width), sw, sw*(img.height/img.width)); ctx.restore()
      }
      if (!multiMode) {
        const ringImg = new window.Image(); ringImg.crossOrigin = 'anonymous'
        ringImg.onload = () => {
          drawRing(ringImg, (ringPos.x/100)*handImg.width, (ringPos.y/100)*handImg.height, (ringSize/containerRef.current!.clientWidth)*handImg.width, ringRotation)
          const url = composite.toDataURL('image/jpeg', 0.95); const link = document.createElement('a'); link.download = 'lumiere-ring.jpg'; link.href = url; link.click()
          setPhotoSaved(true); setTimeout(() => setPhotoSaved(false), 2500)
        }; ringImg.src = selectedColor.image
      } else {
        let done = 0
        placedRings.forEach(p => {
          const ring = RING_CATALOG.find(r => r.id === p.ringId)!
          const color = ring.colors.find(c => c.id === p.colorId) ?? ring.colors[0]
          const img = new window.Image(); img.crossOrigin = 'anonymous'
          img.onload = () => {
            drawRing(img, (p.x/100)*handImg.width, (p.y/100)*handImg.height, (p.size/containerRef.current!.clientWidth)*handImg.width, p.rotation)
            done++
            if (done === placedRings.length) {
              const url = composite.toDataURL('image/jpeg', 0.95); const link = document.createElement('a'); link.download = 'lumiere-ring.jpg'; link.href = url; link.click()
              setPhotoSaved(true); setTimeout(() => setPhotoSaved(false), 2500)
            }
          }; img.src = color.image
        })
      }
    }; handImg.src = photo
  }, [photo, ringPos, ringSize, ringRotation, selectedColor, multiMode, placedRings])

  const addToCart = useCallback(() => {
    setCart(prev => {
      const existing = prev.find(i => i.ring.id === selectedRing.id && i.color.id === selectedColor.id)
      if (existing) return prev.map(i => i === existing ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ring: selectedRing, color: selectedColor, qty: 1 }]
    })
    setAddedToCart(true); setTimeout(() => { setAddedToCart(false); setPhase('cart') }, 800)
  }, [selectedRing, selectedColor])

  const deleteLastSelectedRing = useCallback(() => {
    if (!multiMode || placedRings.length === 0) return

    const targetId = activePlacedId ?? placedRings[placedRings.length - 1].id
    const nextPlacedRings = placedRings.filter(p => p.id !== targetId)
    const nextActiveRing = nextPlacedRings.length ? nextPlacedRings[nextPlacedRings.length - 1] : null

    setPlacedRings(nextPlacedRings)
    setActivePlacedId(nextActiveRing?.id ?? null)

    if (nextActiveRing) {
      const nextRing = RING_CATALOG.find(r => r.id === nextActiveRing.ringId)!
      setSelectedRingId(nextActiveRing.ringId)
      setSelectedColorId(nextActiveRing.colorId ?? nextRing.colors[0].id)
    }
  }, [multiMode, placedRings, activePlacedId])

  const cartTotal = cart.reduce((sum, i) => sum + i.ring.price * i.qty, 0)

  // Active placed ring for sliders
  const activePlacedRing = placedRings.find(p => p.id === activePlacedId)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg:#08070a; --gold:oklch(74% 0.12 78); --gold-lt:oklch(88% 0.08 78); --gold-dk:oklch(50% 0.11 70); --cream:oklch(95% 0.012 82); --muted:oklch(56% 0.014 270); }
        html,body { width:100%; max-width:100%; overflow-x:hidden; background:var(--bg); color:var(--cream); font-family:'DM Sans',sans-serif; }
        body::after { content:''; position:fixed; inset:0; z-index:1000; pointer-events:none; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:160px; opacity:0.022; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes driftRing { 0%{transform:translate3d(0,0,0)} 25%{transform:translate3d(12px,-16px,0)} 50%{transform:translate3d(-10px,-28px,0)} 75%{transform:translate3d(16px,-12px,0)} 100%{transform:translate3d(0,0,0)} }
        @keyframes glowPulse { 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.18)} }
        .serif { font-family:'Instrument Serif',serif; }
        .btn { display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:15px 30px; border-radius:100px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:400; letter-spacing:.04em; cursor:pointer; border:none; transition:all .22s ease; }
        .btn-fill { background:var(--cream); color:#08070a; }
        .btn-fill:hover { background:#fff; transform:translateY(-2px); }
        .btn-outline { background:oklch(95% 0.012 82 / 0.06); color:var(--cream); border:1px solid oklch(95% 0.012 82 / 0.15); backdrop-filter:blur(10px); }
        .btn-outline:hover { background:oklch(95% 0.012 82 / 0.11); transform:translateY(-2px); }
        input[type=range] { height:2px; -webkit-appearance:none; background:rgba(201,168,50,.2); border-radius:2px; outline:none; width:100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:linear-gradient(135deg,var(--gold),var(--gold-lt)); cursor:pointer; box-shadow:0 0 10px rgba(201,168,50,.5); border:2px solid rgba(0,0,0,.3); }
        .swatch-btn { width:32px; height:32px; border-radius:50%; border:2px solid transparent; cursor:pointer; transition:all .2s; flex-shrink:0; }
        .swatch-btn.active { border-color:var(--gold-lt); transform:scale(1.15); box-shadow:0 0 12px rgba(201,168,50,.5); }
        .mobile-video-showcase { display:none; }
        .brand-right { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:7px; text-align:center; min-width:132px; }
        .brand-logo { width:86px; height:86px; object-fit:cover; border-radius:50%; background:#f3f3f3; border:1px solid rgba(255,255,255,.18); box-shadow:0 12px 34px rgba(0,0,0,.34),0 0 24px rgba(201,168,50,.08); }
        .brand-caption { font-size:12px; line-height:1.15; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); white-space:nowrap; }
        .camera-screen { flex:1; height:calc(100svh - 112px); min-height:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:16px 20px; background:var(--bg); overflow:hidden; }
        .camera-frame { position:relative; width:100%; max-width:640px; max-height:calc(100svh - 290px); border-radius:16px; overflow:hidden; border:1px solid oklch(74% 0.12 78 / 0.2); background:#000; flex-shrink:1; }
        .camera-frame video { width:100%; height:auto; max-height:calc(100svh - 290px); display:block; object-fit:contain; background:#000; }
        .camera-shot-button { width:64px; height:64px; border-radius:50%; border:3px solid rgba(0,0,0,.3); font-size:26px; display:flex; align-items:center; justify-content:center; transition:all .2s; flex-shrink:0; }

        /* TryOn — desktop: full side-by-side, no scroll */
        .tryon-layout { display:grid; grid-template-columns:minmax(0,1fr) 420px; flex:1; overflow:hidden; height:calc(100svh - 112px); min-height:0; }
        .tryon-left { position:relative; overflow:hidden; background:#000; display:flex; flex-direction:column; min-height:0; }
        .tryon-right { overflow:hidden; background:oklch(8% 0.008 270); border-left:1px solid oklch(74% 0.12 78 / 0.1); display:flex; flex-direction:column; padding:18px 22px; gap:14px; min-height:0; }
        .ctrl-label { font-size:9px; color:var(--gold); letter-spacing:.32em; text-transform:uppercase; font-weight:600; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; }
        .ctrl-label span { font-size:12px; color:var(--cream); font-weight:400; letter-spacing:.04em; text-transform:none; }
        .range-stack { display:flex; flex-direction:column; gap:16px; width:100%; }
        .range-control { width:100%; }
        .range-control .ctrl-label { font-size:11px; letter-spacing:.22em; margin-bottom:11px; }
        .range-control .ctrl-label span { font-size:14px; letter-spacing:.03em; }
        .range-control input[type=range] { height:4px; width:100%; }
        .range-control input[type=range]::-webkit-slider-thumb { width:22px; height:22px; box-shadow:0 0 12px rgba(201,168,50,.62), 0 0 22px rgba(201,168,50,.25); }
        .range-control input[type=range]::-moz-range-thumb { width:22px; height:22px; border-radius:50%; background:linear-gradient(135deg,var(--gold),var(--gold-lt)); border:2px solid rgba(0,0,0,.3); box-shadow:0 0 12px rgba(201,168,50,.62), 0 0 22px rgba(201,168,50,.25); }
        .action-stack { display:flex; flex-direction:column; gap:12px; width:100%; }
        .action-add, .action-save { width:100%; min-height:54px; font-size:15px !important; letter-spacing:.12em !important; }
        .action-add svg, .action-save svg { width:20px; height:20px; flex-shrink:0; }
        .divider { height:1px; background:linear-gradient(90deg,transparent,oklch(74% 0.12 78 / 0.12),transparent); flex-shrink:0; }

        /* Multi-ring checkbox */
        .multi-ring-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .multi-check-wrap { display:flex; align-items:center; gap:8px; cursor:pointer; user-select:none; }
        .multi-check-wrap input[type=checkbox] { width:14px; height:14px; accent-color:var(--gold); cursor:pointer; }
        .multi-check-label { font-size:11px; font-weight:600; color:var(--gold); letter-spacing:.08em; }
        .delete-ring-btn { width:100%; min-height:40px; display:flex; align-items:center; justify-content:center; border:1px solid oklch(74% 0.12 78 / 0.28); background:rgba(255,255,255,0.035); color:var(--cream); border-radius:999px; padding:10px 14px; font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s ease; }
        .delete-ring-btn:hover:not(:disabled) { background:rgba(201,168,50,0.12); border-color:rgba(201,168,50,0.55); color:var(--gold-lt); transform:translateY(-1px); }
        .delete-ring-btn:disabled { opacity:.35; cursor:not-allowed; }

        /* Mobile: side-by-side windowed, no scroll */
        @media (max-width:768px) {
          .desktop-only { display:none !important; }
          .cards-stack { display:none !important; }
          .intro-grid { grid-template-columns:1fr !important; padding:38px 20px 96px !important; align-items:start !important; gap:28px !important; width:100% !important; }
          .intro-copy { width:100% !important; max-width:100% !important; min-width:0 !important; padding-right:0 !important; }
          .intro-copy h1 { font-size:clamp(36px,10vw,54px) !important; line-height:1.04 !important; }
          .intro-copy p { max-width:100% !important; font-size:14px !important; overflow-wrap:anywhere; }
          nav { padding:12px 16px !important; min-height:80px !important; }
          .brand-right { min-width:90px !important; max-width:110px !important; gap:4px !important; }
          .brand-logo { width:54px !important; height:54px !important; }
          .brand-caption { font-size:8px !important; white-space:normal !important; }
          .mobile-actions { width:100% !important; display:grid !important; grid-template-columns:1fr !important; gap:12px !important; }
          .mobile-actions .btn { width:100% !important; }
          .mobile-video-showcase { display:flex !important; width:100%; overflow-x:auto; padding:8px 0 28px; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; }
          .mobile-video-showcase::-webkit-scrollbar { display:none; }
          .mobile-video-card { flex:0 0 100%; width:100%; height:430px; scroll-snap-align:start; scroll-snap-stop:always; }
          .camera-screen { height:calc(100svh - 80px) !important; padding:10px 14px !important; gap:10px !important; justify-content:flex-start !important; }
          .camera-frame { max-height:calc(100svh - 230px) !important; }
          .camera-frame video { max-height:calc(100svh - 230px) !important; }
          .camera-shot-button { width:52px !important; height:52px !important; font-size:20px !important; }

          /* ── Mobile tryOn: side-by-side windowed ── */
          .tryon-layout {
            grid-template-columns: minmax(0, 1fr) minmax(0, 47%) !important;
            height: calc(100svh - 80px) !important;
            overflow: hidden !important;
            gap: 6px !important;
            padding: 8px 14px 8px 8px !important;
          }
          .tryon-left {
            /* windowed: inset handled by parent padding */
            margin: 0 !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            min-width: 0 !important;
            max-width: 100% !important;
          }
          .tryon-right {
            /* no external margin so the right side never gets clipped */
            margin: 0 !important;
            border-radius: 12px !important;
            border: 1px solid oklch(74% 0.12 78 / 0.14) !important;
            border-left: 1px solid oklch(74% 0.12 78 / 0.14) !important;
            padding: 10px 10px 8px !important;
            gap: 7px !important;
            overflow: hidden !important;
            background: oklch(10% 0.008 270) !important;
            min-width: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            font-size: 11px !important;
          }
          /* Scale down controls on mobile right panel */
          .tryon-right .ctrl-label { font-size:6.5px !important; letter-spacing:.2em !important; margin-bottom:4px !important; }
          .tryon-right .ctrl-label span { font-size:9px !important; }
          .tryon-right .swatch-btn { width:20px !important; height:20px !important; }
          .tryon-right .divider { margin:0 !important; }
          .tryon-right .serif { font-size:13px !important; line-height:1.1 !important; }
          /* ring grid on mobile */
          .tryon-right .ring-grid { grid-template-columns:repeat(4, minmax(0, 1fr)) !important; gap:4px !important; width:100% !important; max-width:100% !important; overflow:visible !important; }
          .tryon-right .ring-grid button { min-width:0 !important; width:100% !important; padding:4px 2px 3px !important; border-radius:7px !important; }
          .tryon-right .ring-grid img { width:100% !important; }
          .tryon-right .ring-grid-thumb { width:30px !important; max-width:100% !important; height:22px !important; }
          .tryon-right .ring-grid-label { font-size:6.2px !important; word-break:break-word !important; }
          /* stacked full-width scale and rotate controls */
          .tryon-right .range-stack { gap:9px !important; }
          .tryon-right .range-control .ctrl-label { font-size:8px !important; letter-spacing:.12em !important; margin-bottom:7px !important; }
          .tryon-right .range-control .ctrl-label span { font-size:10px !important; }
          .tryon-right .range-control input[type=range] { height:3px !important; }
          .tryon-right .range-control input[type=range]::-webkit-slider-thumb { width:18px !important; height:18px !important; }
          /* action buttons */
          .tryon-right .action-stack { gap:8px !important; width:100% !important; }
          .tryon-right .action-add { width:100% !important; min-height:42px !important; padding:11px 6px !important; font-size:10.5px !important; border-radius:9px !important; gap:6px !important; }
          .tryon-right .action-save { width:100% !important; min-height:40px !important; padding:10px 6px !important; font-size:10.5px !important; border-radius:9px !important; gap:6px !important; }
          .tryon-right .action-add svg, .tryon-right .action-save svg { width:17px !important; height:17px !important; }
          .tryon-right .action-retake { font-size:8px !important; padding:4px !important; }
          .tryon-right .multi-ring-row { gap:6px !important; }
          .tryon-right .multi-check-label { font-size:9px !important; }
          .tryon-right .delete-ring-btn { width:100% !important; min-height:28px !important; padding:6px 8px !important; font-size:8px !important; letter-spacing:.06em !important; }
        }

        @media (max-width:390px) {
          .tryon-layout {
            grid-template-columns: minmax(0, 1fr) minmax(0, 49%) !important;
            padding-right: 12px !important;
            gap: 5px !important;
          }
          .tryon-right { padding-left: 8px !important; padding-right: 8px !important; }
          .tryon-right .range-control .ctrl-label { font-size:7.2px !important; }
          .tryon-right .range-control .ctrl-label span { font-size:9px !important; }
          .tryon-right .ring-grid { gap:3px !important; }
          .tryon-right .ring-grid-thumb { width:28px !important; height:20px !important; }
          .tryon-right .ring-grid-label { font-size:5.9px !important; }
        }
        @media (min-width:769px) { .mobile-only { display:none !important; } }
        @media (min-width:769px) and (max-height:780px) {
          .brand-logo { width:72px; height:72px; }
          .brand-caption { font-size:10px; }
          .tryon-layout { height:calc(100svh - 100px); }
          .tryon-right { padding:14px 20px; gap:11px; }
          .ctrl-label { margin-bottom:6px; }
        }
      `}</style>

      <div style={{ minHeight:'100svh', background:'var(--bg)', display:'flex', flexDirection:'column', overflowX:'hidden' }}>

        {/* NAV */}
        <nav style={{ position:'relative', zIndex:50, minHeight:112, padding:'12px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid oklch(74% 0.12 78 / 0.1)', flexShrink:0 }}>
          <div>
            <div className="serif" style={{ fontSize:40, letterSpacing:'.08em', color:'var(--gold-lt)', lineHeight:1 }}>Lumière 9</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {phase === 'tryOn' && (
              <button onClick={() => { stopCamera(); setPhase('intro'); setPhoto(null) }} className="btn btn-outline" style={{ padding:'10px 20px', fontSize:13 }}>← Retake</button>
            )}
            <div className="brand-right">
              <img src={NEXTGENIQ_LOGO} alt="NextGenIQ.AI" className="brand-logo" />
              <div className="brand-caption" style={{ fontSize:12, color:'var(--gold-lt)' }}>A NextGenIQ.AI Product</div>
            </div>
          </div>
        </nav>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:1 }}>
              {floatingRings.map((ring, i) => (
                <div key={i} style={{ position:'absolute', top:ring.top, left:ring.left, width:ring.size, height:ring.size, opacity:ring.opacity, mixBlendMode:'screen', animation:`driftRing ${ring.duration} ease-in-out ${ring.delay} infinite` }}>
                  <div style={{ position:'absolute', inset:-26, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,220,160,0.55) 0%, rgba(255,220,160,0.22) 32%, rgba(255,220,160,0.08) 55%, transparent 78%)', filter:'blur(16px)', animation:`glowPulse 4.5s ease-in-out ${ring.delay} infinite` }} />
                  <img src={ring.image} alt="" aria-hidden="true" style={{ position:'relative', width:'100%', height:'100%', objectFit:'contain', transform:`rotate(${ring.rotate}deg)`, filter:'brightness(1.2) saturate(1.15) drop-shadow(0 0 10px rgba(255,220,160,0.38)) drop-shadow(0 0 24px rgba(255,220,160,0.28)) drop-shadow(0 0 42px rgba(255,220,160,0.16))' }} />
                </div>
              ))}
            </div>
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
              <div style={{ position:'absolute', top:'10%', left:'30%', width:600, height:600, background:'radial-gradient(ellipse, oklch(74% 0.12 78 / 0.07) 0%, transparent 70%)', borderRadius:'50%' }} />
              <div style={{ position:'absolute', bottom:'5%', right:'10%', width:400, height:400, background:'radial-gradient(ellipse, oklch(74% 0.12 78 / 0.04) 0%, transparent 70%)', borderRadius:'50%' }} />
            </div>

            <div className="intro-grid" style={{ position:'relative', zIndex:5, display:'grid', gridTemplateColumns:'0.85fr 1.15fr', alignItems:'center', padding:'0 56px 40px', gap:48, minHeight:'calc(100vh - 88px)' }}>
              <div className="intro-copy" style={{ display:'flex', flexDirection:'column', gap:28, minWidth:0, width:'100%' }}>
                {/* Designed and Developed — sits just below nav border, above gold line */}
                <div style={{ fontSize:14, color:'var(--gold-lt)', letterSpacing:'.06em', fontWeight:300, animation:'fadeUp .6s ease both' }}>
                  Designed and Developed for Pukka Berlin
                </div>

                {/* Gold line · VIRTUAL TRY BEFORE YOU BUY · Gold line */}
                <div style={{ display:'inline-flex', alignItems:'center', gap:14, animation:'fadeUp .8s .1s ease both' }}>
                  <div style={{ width:36, height:1.5, background:'var(--gold)', flexShrink:0 }} />
                  <div style={{ fontSize:14, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', fontWeight:500, whiteSpace:'nowrap' }}>Virtual Try Before You Buy</div>
                  <div style={{ width:36, height:1.5, background:'var(--gold)', flexShrink:0 }} />
                </div>

                {/* Main headline — all on one line */}
                <h1 className="serif" style={{ fontSize:'clamp(48px,5vw,76px)', lineHeight:1.06, letterSpacing:'-.02em', animation:'fadeUp 1s .22s ease both', whiteSpace:'nowrap' }}>
                  Virtual Wear <em style={{ color:'var(--gold-lt)' }}>the Ring</em>
                </h1>

                <div className="mobile-actions" style={{ display:'flex', gap:14, flexWrap:'wrap', animation:'fadeUp 1s .52s ease both' }}>
                  <button onClick={startCamera} className="btn btn-fill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    Take Photo of your Hand
                  </button>
                  <label className="btn btn-outline" style={{ cursor:'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 12V4M9 4L6.5 6.5M9 4l2.5 2.5"/><path d="M3 15h18"/></svg>
                    Upload a Photo of your Hand
                    <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleUpload} />
                  </label>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:16, animation:'fadeUp 1s .66s ease both' }}>
                  <div style={{ display:'flex' }}>
                    {['#c89068','#b8988c','#d49868','#e8c09c'].map((c,i) => (
                      <div key={i} style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${c},${c}88)`, border:'2px solid var(--bg)', marginLeft:i===0?0:-7 }} />
                    ))}
                  </div>
                  <p style={{ fontSize:13, color:'var(--muted)', fontWeight:300 }}><strong style={{ color:'var(--cream)', fontWeight:400 }}>48,200+</strong> try-ons today</p>
                </div>

                <div ref={mobileShowcaseRef} className="mobile-video-showcase">
                  {testimonials.map((t, i) => (
                    <div key={i} className="mobile-video-card" style={{ position:'relative', borderRadius:28, overflow:'hidden', background:'oklch(13% 0.008 270)', border:'1px solid oklch(74% 0.12 78 / 0.16)', boxShadow:'0 24px 70px rgba(0,0,0,.55)', display:'flex', flexDirection:'column' }}>
                      <div style={{ flex:1, position:'relative', overflow:'hidden', background:t.bg }}>
                        <video autoPlay muted loop playsInline preload="metadata" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:1 }}><source src={t.video} type="video/mp4" /></video>
                        <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to bottom, rgba(0,0,0,.08) 0%, rgba(0,0,0,.35) 100%)' }} />
                        <div style={{ position:'absolute', top:16, left:16, zIndex:4, background:'rgba(0,0,0,.55)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.12)', borderRadius:100, padding:'6px 13px', display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
                          <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px #22c55e' }} />Live try-on
                        </div>
                      </div>
                      <div style={{ padding:'20px 22px 24px', background:'oklch(13% 0.008 270)' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:10 }}>
                          <div style={{ fontSize:18, fontWeight:500 }}>{t.name}</div>
                          <div style={{ color:'var(--gold)', fontSize:15 }}>★★★★★</div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                          <div style={{ width:14, height:14, borderRadius:'50%', background:t.swatch, flexShrink:0 }} />
                          <span style={{ fontSize:14, color:'var(--muted)' }}>{t.ring}</span>
                        </div>
                        <p style={{ fontSize:15, color:'var(--cream)', fontStyle:'italic', lineHeight:1.5 }}>{t.quote}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop video cards */}
              <div className="desktop-only" style={{ position:'relative', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', animation:'fadeIn 1.2s .3s ease both', paddingRight:20 }}>
                <div className="cards-stack" style={{ position:'relative', width:'min(560px, 42vw)', height:620 }}>
                  {testimonials.map((t, i) => {
                    const diff = (i - introCard + 3) % 3
                    const state = diff===0 ? 'active' : diff===1 ? 'behind1' : 'behind2'
                    return (
                      <div key={i} style={{ position:'absolute', inset:0, borderRadius:28, overflow:'hidden', background:'oklch(13% 0.008 270)', border:'1px solid oklch(74% 0.12 78 / 0.12)', boxShadow:'0 32px 80px rgba(0,0,0,.55)', display:'flex', flexDirection:'column', opacity:state==='active'?1:state==='behind1'?0.55:0.25, transform:state==='active'?'none':state==='behind1'?'translate(16px,16px) scale(.96)':'translate(32px,32px) scale(.92)', zIndex:state==='active'?3:state==='behind1'?2:1, transition:'opacity .7s ease, transform .7s ease' }}>
                        <div style={{ flex:1, position:'relative', overflow:'hidden', background:t.bg }}>
                          <div style={{ position:'absolute', inset:0, background:t.bg, zIndex:0 }} />
                          <video key={t.video} autoPlay muted loop playsInline preload="auto" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:1, opacity:0.96 }}><source src={t.video} type="video/mp4" /></video>
                          <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to bottom, rgba(0,0,0,.08) 0%, rgba(0,0,0,.38) 100%)' }} />
                          <div style={{ position:'absolute', top:18, left:18, zIndex:4, background:'rgba(0,0,0,.55)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.12)', borderRadius:100, padding:'6px 13px', display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
                            <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px #22c55e' }} />Live try-on
                          </div>
                        </div>
                        <div style={{ padding:'24px 28px 28px', background:'oklch(13% 0.008 270)' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                            <div style={{ fontSize:20, fontWeight:500 }}>{t.name}</div>
                            <div style={{ color:'var(--gold)', fontSize:18 }}>★★★★★</div>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                            <div style={{ width:16, height:16, borderRadius:'50%', background:t.swatch, flexShrink:0 }} />
                            <span style={{ fontSize:15, color:'var(--muted)' }}>{t.ring}</span>
                          </div>
                          <p style={{ fontSize:18, color:'var(--cream)', fontStyle:'italic', lineHeight:1.55 }}>{t.quote}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6 }}>
                  {[0,1,2].map(i => <div key={i} onClick={() => setIntroCard(i)} style={{ width:i===introCard?28:8, height:8, borderRadius:4, background:i===introCard?'var(--gold)':'rgba(201,168,50,.25)', transition:'all .4s', cursor:'pointer' }} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAMERA */}
        {phase === 'camera' && (
          <div className="camera-screen">
            <p className="camera-hint" style={{ fontSize:15, letterSpacing:'.3em', color:'var(--gold-lt)', textTransform:'uppercase', flexShrink:0 }}>Hold hand flat · ring finger toward camera</p>
            <div className="camera-frame">
              <video ref={videoRef} playsInline muted />
              {!cameraReady && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(8,7,10,.7)' }}><div style={{ width:32, height:32, border:'2px solid rgba(201,168,50,.3)', borderTopColor:'var(--gold)', borderRadius:'50%', animation:'spin .8s linear infinite' }} /></div>}
            </div>
            <canvas ref={canvasRef} style={{ display:'none' }} />
            <button className="camera-shot-button" onClick={capturePhoto} disabled={!cameraReady} style={{ background:cameraReady?'linear-gradient(135deg,var(--gold),var(--gold-lt))':'#2a2a2a', cursor:cameraReady?'pointer':'not-allowed' }}>📸</button>
            <label className="btn btn-outline" style={{ cursor:'pointer', fontSize:13 }}>
              or upload a photo<input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleUpload} />
            </label>
          </div>
        )}

        {/* TRY-ON */}
        {phase === 'tryOn' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div className="tryon-layout">

              {/* LEFT: photo */}
              <div className="tryon-left" ref={containerRef} style={{ cursor:isDragging?'grabbing':'default', touchAction:'none', isolation:'isolate', willChange:'transform' }}>
                {photo && <img src={photo} alt="hand" draggable={false} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', pointerEvents:'none', userSelect:'none' }} />}

                {/* Single-ring mode overlay */}
                {!multiMode && (
                  <div onMouseDown={e => onPointerDown(e, 'single')} onTouchStart={e => onPointerDown(e, 'single')}
                    style={{ position:'absolute', left:`${ringPos.x}%`, top:`${ringPos.y}%`, transform:`translate(-50%,-50%) rotate(${ringRotation + (selectedRing.rotation ?? 0)}deg)`, cursor:isDragging?'grabbing':'grab', userSelect:'none', touchAction:'none', width:ringSize, willChange:'transform' }}>
                    <img src={selectedColor.image} alt={selectedRing.name} draggable={false} style={{ width:'100%', objectFit:'contain', display:'block', pointerEvents:'none', filter:'drop-shadow(0 4px 20px rgba(0,0,0,.65))' }} />
                  </div>
                )}

                {/* Multi-ring mode overlays */}
                {multiMode && placedRings.map(p => {
                  const ring = RING_CATALOG.find(r => r.id === p.ringId)!
                  const color = ring.colors.find(c => c.id === p.colorId) ?? ring.colors[0]
                  const isActive = p.id === activePlacedId
                  return (
                    <div key={p.id} onMouseDown={e => onPointerDown(e, p.id)} onTouchStart={e => onPointerDown(e, p.id)}
                      style={{ position:'absolute', left:`${p.x}%`, top:`${p.y}%`, transform:`translate(-50%,-50%) rotate(${p.rotation + (ring.rotation ?? 0)}deg)`, cursor:isDragging&&activePlacedId===p.id?'grabbing':'grab', userSelect:'none', touchAction:'none', width:p.size, willChange:'transform', outline:isActive?'2px solid rgba(201,168,50,0.6)':'none', outlineOffset:4, borderRadius:4 }}>
                      <img src={color.image} alt={ring.name} draggable={false} style={{ width:'100%', objectFit:'contain', display:'block', pointerEvents:'none', filter:'drop-shadow(0 4px 20px rgba(0,0,0,.65))' }} />
                    </div>
                  )
                })}

                {!isDragging && (
                  <div style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)', background:'rgba(8,7,10,.75)', backdropFilter:'blur(12px)', border:'1px solid oklch(74% 0.12 78 / 0.2)', color:'rgba(240,237,232,.8)', padding:'7px 20px', borderRadius:100, fontSize:12, letterSpacing:'.07em', whiteSpace:'nowrap', pointerEvents:'none' }}>
                    {multiMode ? 'Tap a ring style to place · Drag to move' : 'Drag · Pinch to resize & rotate'}
                  </div>
                )}
              </div>

              {/* RIGHT: controls */}
              <div className="tryon-right">
                <div>
                  <div style={{ fontSize:11, color:'var(--gold)', letterSpacing:'.25em', textTransform:'uppercase', marginBottom:4 }}>Selected Ring</div>
                  <h2 className="serif" style={{ fontSize:20, fontWeight:300, lineHeight:1.16, marginBottom:3 }}>{selectedRing.name}</h2>
                  <div style={{ fontSize:12, color:'var(--muted)', marginBottom:1 }}>{selectedRing.description}</div>
                  <div style={{ fontSize:18, color:'var(--gold)', fontWeight:500, marginTop:4 }}>${selectedRing.price.toLocaleString()}</div>
                </div>

                <div className="divider" />

                {/* Multi-ring toggle */}
                <div className="multi-ring-row">
                  <label className="multi-check-wrap">
                    <input type="checkbox" checked={multiMode} onChange={e => {
                      setMultiMode(e.target.checked)
                      if (!e.target.checked) { setPlacedRings([]); setActivePlacedId(null) }
                    }} />
                    <span className="multi-check-label">Multi-Ring Mode</span>
                    {multiMode && <span style={{ fontSize:9, color:'var(--muted)', letterSpacing:'.06em' }}>— tap styles to place</span>}
                  </label>

                  {multiMode && (
                    <button
                      type="button"
                      className="delete-ring-btn"
                      onClick={deleteLastSelectedRing}
                      disabled={placedRings.length === 0}
                    >
                      Delete Ring
                    </button>
                  )}
                </div>

                {/* Ring grid */}
                <div>
                  <div className="ctrl-label">Ring Style</div>
                  <div className="ring-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:7 }}>
                    {RING_CATALOG.map(r => (
                      <button key={r.id} onClick={() => selectRing(r.id)}
                        style={{ background:selectedRingId===r.id?'rgba(201,168,50,0.12)':'rgba(255,255,255,0.03)', border:selectedRingId===r.id?'1.5px solid rgba(201,168,50,0.6)':'1.5px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'6px 4px 5px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:5, transition:'all 0.18s' }}>
                        <div className="ring-grid-thumb" style={{ width:48, height:30, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                          <img src={r.colors[0].image} alt={r.name} style={{ width:r.rotation===90?'55%':'100%', height:'100%', objectFit:'contain', filter:'drop-shadow(0 2px 6px rgba(0,0,0,.5))', transform:`rotate(${r.rotation??0}deg)` }} />
                        </div>
                        <div className="ring-grid-label" style={{ fontSize:8.5, color:selectedRingId===r.id?'var(--gold)':'var(--muted)', textAlign:'center', lineHeight:1.3, fontWeight:selectedRingId===r.id?600:400 }}>
                          {r.name.split(' ').slice(0,2).join(' ')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metal — in multi mode show for active placed ring, else for single */}
                <div>
                  <div className="ctrl-label">Metal <span>{selectedColor.label}</span></div>
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                    {selectedRing.colors.map(c => (
                      <button key={c.id} onClick={() => {
                        setSelectedColorId(c.id)
                        if (multiMode && activePlacedId) {
                          setPlacedRings(prev => prev.map(p => p.id === activePlacedId ? { ...p, colorId: c.id } : p))
                        }
                      }} className={`swatch-btn ${selectedColorId===c.id?'active':''}`} style={{ background:c.swatch }} title={c.label} />
                    ))}
                  </div>
                </div>

                <div className="divider" />

                {/* Scale + Rotate — full-width stacked controls */}
                <div className="range-stack">
                  <div className="range-control">
                    <div className="ctrl-label">Scale the Ring <span>{Math.round(multiMode && activePlacedRing ? activePlacedRing.size : ringSize)}px</span></div>
                    <input type="range" min={20} max={600}
                      value={multiMode && activePlacedRing ? activePlacedRing.size : ringSize}
                      onChange={e => {
                        if (multiMode && activePlacedId) setPlacedRings(prev => prev.map(p => p.id === activePlacedId ? { ...p, size: +e.target.value } : p))
                        else setRingSize(+e.target.value)
                      }} />
                  </div>
                  <div className="range-control">
                    <div className="ctrl-label">Rotate the Ring <span>{Math.round(multiMode && activePlacedRing ? activePlacedRing.rotation : ringRotation)}°</span></div>
                    <input type="range" min={-180} max={180}
                      value={multiMode && activePlacedRing ? activePlacedRing.rotation : ringRotation}
                      onChange={e => {
                        if (multiMode && activePlacedId) setPlacedRings(prev => prev.map(p => p.id === activePlacedId ? { ...p, rotation: +e.target.value } : p))
                        else setRingRotation(+e.target.value)
                      }} />
                  </div>
                </div>

                <div className="divider" />

                <div className="action-stack">
                  <button className="action-add" onClick={addToCart} style={{ width:'100%', padding:'16px', borderRadius:12, border:'none', background:addedToCart?'var(--gold-dk)':'linear-gradient(135deg,var(--gold),var(--gold-lt))', color:'#08070a', fontSize:15, letterSpacing:'.12em', fontWeight:800, cursor:'pointer', fontFamily:'DM Sans', display:'flex', alignItems:'center', justifyContent:'center', gap:12, transition:'all .3s' }}>
                    {addedToCart ? '✓ Added to Cart!' : (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>Add to Cart · ${selectedRing.price.toLocaleString()}</>)}
                  </button>
                  <button className="action-save" onClick={savePhoto} style={{ width:'100%', padding:'15px', borderRadius:12, border:'1px solid oklch(74% 0.12 78 / 0.3)', background:photoSaved?'oklch(74% 0.12 78 / 0.1)':'transparent', color:photoSaved?'var(--gold)':'var(--cream)', fontSize:15, letterSpacing:'.12em', fontWeight:700, cursor:'pointer', fontFamily:'DM Sans', display:'flex', alignItems:'center', justifyContent:'center', gap:12, transition:'all .3s' }}>
                    {photoSaved ? '✓ Photo Saved!' : (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Save Photo</>)}
                  </button>
                  <button className="action-retake" onClick={() => { stopCamera(); setPhase('intro'); setPhoto(null) }} style={{ width:'100%', padding:'8px', borderRadius:12, border:'none', background:'transparent', color:'var(--muted)', fontSize:12, cursor:'pointer', fontFamily:'DM Sans', letterSpacing:'.06em' }}>← Try a different photo</button>
                </div>
                <div style={{ height:8 }} />
              </div>
            </div>
          </div>
        )}

        {/* CART */}
        {phase === 'cart' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', maxWidth:600, margin:'0 auto', width:'100%', padding:'32px 20px' }}>
            <h2 className="serif" style={{ fontSize:32, fontWeight:300, marginBottom:24 }}>Your Cart</h2>
            {cart.length === 0 ? (
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, color:'var(--muted)' }}>
                <p>Your cart is empty</p>
                <button onClick={() => setPhase(photo?'tryOn':'intro')} className="btn btn-outline" style={{ fontSize:13 }}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
                  {cart.map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:16, alignItems:'center', padding:'16px', borderRadius:16, background:'oklch(13% 0.008 270)', border:'1px solid oklch(74% 0.12 78 / 0.1)' }}>
                      <img src={item.color.image} alt={item.ring.name} style={{ width:80, height:50, objectFit:'contain', filter:'drop-shadow(0 4px 10px rgba(0,0,0,.5))' }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:500, marginBottom:3 }}>{item.ring.name}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}><div style={{ width:12, height:12, borderRadius:'50%', background:item.color.swatch }} /><span style={{ fontSize:12, color:'var(--muted)' }}>{item.color.label}</span></div>
                        <div style={{ fontSize:13, color:'var(--gold)' }}>${item.ring.price.toLocaleString()}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <button onClick={() => setCart(prev => prev.map((ci,ci_i) => ci_i===i&&ci.qty>1?{...ci,qty:ci.qty-1}:ci).filter((ci,ci_i) => !(ci_i===i&&ci.qty<=1)))} style={{ width:28, height:28, borderRadius:'50%', border:'1px solid rgba(255,255,255,.1)', background:'none', color:'var(--cream)', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                        <span style={{ minWidth:20, textAlign:'center', fontSize:14 }}>{item.qty}</span>
                        <button onClick={() => setCart(prev => prev.map((ci,ci_i) => ci_i===i?{...ci,qty:ci.qty+1}:ci))} style={{ width:28, height:28, borderRadius:'50%', border:'1px solid rgba(255,255,255,.1)', background:'none', color:'var(--cream)', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:'1px solid oklch(74% 0.12 78 / 0.15)', paddingTop:20, marginBottom:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:18, fontWeight:500 }}>
                    <span>Total</span><span style={{ color:'var(--gold)' }}>${cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setPhase('checkout')} className="btn btn-fill" style={{ width:'100%', justifyContent:'center', fontSize:15, borderRadius:12 }}>Proceed to Checkout →</button>
                <button onClick={() => setPhase(photo?'tryOn':'intro')} className="btn btn-outline" style={{ width:'100%', justifyContent:'center', fontSize:13, marginTop:10, borderRadius:12 }}>Continue Shopping</button>
              </>
            )}
          </div>
        )}

        {/* CHECKOUT */}
        {phase === 'checkout' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, gap:24 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),var(--gold-lt))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>💎</div>
            <h2 className="serif" style={{ fontSize:36, fontWeight:300, textAlign:'center' }}>Secure Checkout</h2>
            <p style={{ color:'var(--muted)', fontSize:15, textAlign:'center', maxWidth:380, lineHeight:1.7 }}>Our secure checkout is coming soon. In the meantime, contact us directly to complete your purchase.</p>
            <div style={{ width:'100%', maxWidth:440, background:'oklch(13% 0.008 270)', borderRadius:20, padding:28, border:'1px solid oklch(74% 0.12 78 / 0.15)' }}>
              <div style={{ fontSize:11, color:'var(--gold)', letterSpacing:'.25em', textTransform:'uppercase', marginBottom:16 }}>Order Summary</div>
              {cart.map((item, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,.06)', fontSize:14 }}>
                  <span style={{ color:'var(--muted)' }}>{item.ring.name} × {item.qty}</span>
                  <span>${(item.ring.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:16, fontSize:18, fontWeight:600 }}>
                <span>Total</span><span style={{ color:'var(--gold)' }}>${cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:12, width:'100%', maxWidth:440 }}>
              <button onClick={() => setPhase('cart')} className="btn btn-outline" style={{ flex:1, justifyContent:'center', borderRadius:12 }}>← Back</button>
              <button className="btn btn-fill" style={{ flex:2, justifyContent:'center', borderRadius:12, opacity:.6, cursor:'not-allowed' }}>Complete Purchase Soon</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}