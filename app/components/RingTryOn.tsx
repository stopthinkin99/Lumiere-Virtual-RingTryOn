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

// Pukka Berlin option sets
const STONE_SIZES = ['0.05 ct.','0.10 ct.','0.15 ct.','0.20 ct.','0.25 ct.']
const FINENESS = ['375/- gold','585/- gold','750/- gold']
const COLOR_STONES = ['diamond fc','lab grown diamond']
const CUSTOMIZATIONS = ['No','Yes']
const BRILLIANTS = ['H/si','G/vvs','G/if']
const RING_SIZES_EU = Array.from({length:16}, (_,i) => String(45+i)) // 45–60

type PlacedRing = { id: string; ringId: string; colorId: string; x: number; y: number; size: number; rotation: number }
type CartItem = {
  ring: typeof RING_CATALOG[0]; color: typeof RING_CATALOG[0]['colors'][0]; qty: number
  stoneSize?: string; fineness?: string; colorStone?: string; customization?: string; brilliant?: string; ringSize?: string
}
type Phase = 'intro' | 'camera' | 'tryOn' | 'cart' | 'checkout'

// Hand crop box — narrow to just the hand area (no face/background)
const CROP = { x: 0.28, y: 0.02, w: 0.44, h: 0.96 }

export default function RingTryOn() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [photo, setPhoto] = useState<string | null>(null)
  const [croppedPhoto, setCroppedPhoto] = useState<string | null>(null)
  const [selectedRingId, setSelectedRingId] = useState(RING_CATALOG[0].id)
  const [selectedColorId, setSelectedColorId] = useState(RING_CATALOG[0].colors[0].id)
  const [cart, setCart] = useState<CartItem[]>([])
  const [introCard, setIntroCard] = useState(0)

  // Ring placement
  const [ringPos, setRingPos] = useState({ x: 50, y: 60 })
  const [ringSize, setRingSize] = useState(160)
  const [ringRotation, setRingRotation] = useState(0)

  // Multi-ring
  const [multiMode, setMultiMode] = useState(false)
  const [placedRings, setPlacedRings] = useState<PlacedRing[]>([])
  const [activePlacedId, setActivePlacedId] = useState<string | null>(null)

  // Pukka Berlin selections
  const [stoneSize, setStoneSize] = useState(STONE_SIZES[3])
  const [fineness, setFineness] = useState(FINENESS[1])
  const [colorStone, setColorStone] = useState(COLOR_STONES[0])
  const [customization, setCustomization] = useState(CUSTOMIZATIONS[0])
  const [brilliant, setBrilliant] = useState(BRILLIANTS[0])
  const [manualRingSize, setManualRingSize] = useState<string>('')

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
  const activePlacedRing = placedRings.find(p => p.id === activePlacedId)

  // ── Approximate ring size from scale ──────────────────────────────────────
  // When ring size slider is ~160px at container width ~600px → about size 52
  // Linear mapping: ringSize 60→size45, ringSize 280→size60
  const approxRingSize = useMemo_ringSize(ringSize, activePlacedRing)

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

  // ── Crop photo to hand-box area ───────────────────────────────────────────
  const cropPhoto = useCallback((dataUrl: string): Promise<string> => {
    return new Promise(resolve => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const cw = Math.round(img.width * CROP.w)
        const ch = Math.round(img.height * CROP.h)
        canvas.width = cw; canvas.height = ch
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, Math.round(img.width * CROP.x), Math.round(img.height * CROP.y), cw, ch, 0, 0, cw, ch)
        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      img.src = dataUrl
    })
  }, [])

  const selectRing = useCallback((id: string) => {
    const ring = RING_CATALOG.find(r => r.id === id)!
    if (multiMode) {
      const newRing: PlacedRing = { id:`${id}-${Date.now()}`, ringId:id, colorId:ring.colors[0].id, x:30+Math.random()*40, y:30+Math.random()*30, size:130, rotation:0 }
      setPlacedRings(prev => [...prev, newRing])
      setActivePlacedId(newRing.id)
      setSelectedRingId(id); setSelectedColorId(ring.colors[0].id)
    } else {
      setSelectedRingId(id); setSelectedColorId(ring.colors[0].id)
    }
  }, [multiMode])

  const startCamera = useCallback(async () => {
    setPhase('camera'); setCameraReady(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width:{ideal:1920}, height:{ideal:1080} }, audio:false })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); videoRef.current.onloadeddata = () => setCameraReady(true) }
    } catch { alert('Camera denied — upload a photo instead.'); setPhase('intro') }
  }, [])

  const stopCamera = useCallback(() => { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null }, [])

  const capturePhoto = useCallback(async () => {
    const video = videoRef.current; const canvas = canvasRef.current; if (!video || !canvas) return
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    const full = canvas.toDataURL('image/jpeg', 0.95)
    stopCamera()
    const cropped = await cropPhoto(full)
    setPhoto(full); setCroppedPhoto(cropped)
    setPhase('tryOn'); setRingPos({ x:50, y:60 })
  }, [stopCamera, cropPhoto])

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async ev => {
      const full = ev.target?.result as string
      const cropped = await cropPhoto(full)
      setPhoto(full); setCroppedPhoto(cropped)
      setPhase('tryOn'); setRingPos({ x:50, y:60 })
    }
    reader.readAsDataURL(file)
  }, [cropPhoto])

  const onPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent, target: 'single' | string = 'single') => {
    if ('touches' in e && e.touches.length === 2) return
    e.preventDefault(); e.stopPropagation()
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
    const cy = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragTargetRef.current = target
    if (target === 'single') {
      setDragOffset({ x:((cx-rect.left)/rect.width)*100-ringPos.x, y:((cy-rect.top)/rect.height)*100-ringPos.y })
    } else {
      const placed = placedRings.find(p => p.id === target)!
      setDragOffset({ x:((cx-rect.left)/rect.width)*100-placed.x, y:((cy-rect.top)/rect.height)*100-placed.y })
      setActivePlacedId(target)
    }
    setIsDragging(true)
  }, [ringPos, placedRings])

  const onPointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if ('touches' in e && (e as TouchEvent).touches.length === 2) {
      const t = (e as TouchEvent).touches
      const dx = t[0].clientX-t[1].clientX, dy = t[0].clientY-t[1].clientY
      const dist = Math.sqrt(dx*dx+dy*dy), angle = Math.atan2(dy,dx)*(180/Math.PI)
      if (dragTargetRef.current === 'single') {
        if (lastPinchDist.current !== null) setRingSize(s => Math.max(30,Math.min(400,s*dist/lastPinchDist.current!)))
        if (lastPinchAngle.current !== null) setRingRotation(r => r+angle-lastPinchAngle.current!)
      } else {
        const tid = dragTargetRef.current
        if (lastPinchDist.current !== null) setPlacedRings(prev => prev.map(p => p.id===tid?{...p,size:Math.max(30,Math.min(400,p.size*dist/lastPinchDist.current!))}:p))
        if (lastPinchAngle.current !== null) setPlacedRings(prev => prev.map(p => p.id===tid?{...p,rotation:p.rotation+angle-lastPinchAngle.current!}:p))
      }
      lastPinchDist.current = dist; lastPinchAngle.current = angle; return
    }
    if (!isDragging||!containerRef.current) return; e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const cx = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
    const cy = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
    const nx = Math.max(5,Math.min(95,((cx-rect.left)/rect.width)*100-dragOffset.x))
    const ny = Math.max(5,Math.min(95,((cy-rect.top)/rect.height)*100-dragOffset.y))
    if (dragTargetRef.current==='single') setRingPos({x:nx,y:ny})
    else { const tid = dragTargetRef.current; setPlacedRings(prev => prev.map(p => p.id===tid?{...p,x:nx,y:ny}:p)) }
  }, [isDragging, dragOffset])

  const onPointerUp = useCallback(() => { setIsDragging(false); lastPinchDist.current=null; lastPinchAngle.current=null }, [])

  useEffect(() => {
    if (phase !== 'tryOn') return
    window.addEventListener('mousemove',onPointerMove); window.addEventListener('mouseup',onPointerUp)
    window.addEventListener('touchmove',onPointerMove,{passive:false}); window.addEventListener('touchend',onPointerUp)
    return () => { window.removeEventListener('mousemove',onPointerMove); window.removeEventListener('mouseup',onPointerUp); window.removeEventListener('touchmove',onPointerMove); window.removeEventListener('touchend',onPointerUp) }
  }, [phase, onPointerMove, onPointerUp])

  const savePhoto = useCallback(() => {
    if (!croppedPhoto) return
    const composite = document.createElement('canvas'); const handImg = new window.Image()
    handImg.onload = () => {
      composite.width = handImg.width; composite.height = handImg.height
      const ctx = composite.getContext('2d')!; ctx.drawImage(handImg,0,0)
      const drawRing = (img: HTMLImageElement, px: number, py: number, sw: number, rot: number) => {
        ctx.save(); ctx.translate(px,py); ctx.rotate(rot*Math.PI/180)
        ctx.drawImage(img,-sw/2,-sw/2*(img.height/img.width),sw,sw*(img.height/img.width)); ctx.restore()
      }
      const doSave = () => {
        const url = composite.toDataURL('image/jpeg',0.95); const link = document.createElement('a'); link.download='lumiere-ring.jpg'; link.href=url; link.click()
        setPhotoSaved(true); setTimeout(()=>setPhotoSaved(false),2500)
      }
      if (!multiMode) {
        const ringImg = new window.Image(); ringImg.crossOrigin='anonymous'
        ringImg.onload = () => { drawRing(ringImg,(ringPos.x/100)*handImg.width,(ringPos.y/100)*handImg.height,(ringSize/containerRef.current!.clientWidth)*handImg.width,ringRotation); doSave() }
        ringImg.src = selectedColor.image
      } else {
        let done = 0
        if (placedRings.length === 0) { doSave(); return }
        placedRings.forEach(p => {
          const ring = RING_CATALOG.find(r=>r.id===p.ringId)!; const color = ring.colors.find(c=>c.id===p.colorId)??ring.colors[0]
          const img = new window.Image(); img.crossOrigin='anonymous'
          img.onload = () => { drawRing(img,(p.x/100)*handImg.width,(p.y/100)*handImg.height,(p.size/containerRef.current!.clientWidth)*handImg.width,p.rotation); done++; if(done===placedRings.length) doSave() }
          img.src = color.image
        })
      }
    }; handImg.src = croppedPhoto
  }, [croppedPhoto, ringPos, ringSize, ringRotation, selectedColor, multiMode, placedRings])

  const addToCart = useCallback(() => {
    setCart(prev => {
      const existing = prev.find(i=>i.ring.id===selectedRing.id&&i.color.id===selectedColor.id)
      const extra = { stoneSize, fineness, colorStone, customization, brilliant, ringSize: manualRingSize || `~${useMemo_ringSize(ringSize, activePlacedRing)}` }
      if (existing) return prev.map(i=>i===existing?{...i,qty:i.qty+1,...extra}:i)
      return [...prev,{ring:selectedRing,color:selectedColor,qty:1,...extra}]
    })
    setAddedToCart(true); setTimeout(()=>{setAddedToCart(false);setPhase('cart')},800)
  }, [selectedRing, selectedColor, stoneSize, fineness, colorStone, customization, brilliant, manualRingSize, ringSize, activePlacedRing])

  const deleteLastRing = useCallback(() => {
    if (!multiMode||placedRings.length===0) return
    const targetId = activePlacedId??placedRings[placedRings.length-1].id
    const next = placedRings.filter(p=>p.id!==targetId)
    const nextActive = next.length?next[next.length-1]:null
    setPlacedRings(next); setActivePlacedId(nextActive?.id??null)
    if (nextActive) { setSelectedRingId(nextActive.ringId); setSelectedColorId(nextActive.colorId) }
  }, [multiMode, placedRings, activePlacedId])

  const cartTotal = cart.reduce((sum,i)=>sum+i.ring.price*i.qty,0)
  const approxSize = useMemo_ringSize(ringSize, activePlacedRing)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#ffffff;
          --bg2:#f7f6f4;
          --bg3:#f0ede8;
          --gold:oklch(58% 0.14 72);
          --gold-lt:oklch(50% 0.13 68);
          --gold-dk:oklch(42% 0.12 66);
          --cream:#1a1612;
          --muted:#6b6560;
          --border:rgba(180,155,100,0.25);
        }
        html,body{width:100%;max-width:100%;overflow-x:hidden;background:var(--bg);color:var(--cream);font-family:'DM Sans',sans-serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes driftRing{0%{transform:translate3d(0,0,0)}25%{transform:translate3d(12px,-16px,0)}50%{transform:translate3d(-10px,-28px,0)}75%{transform:translate3d(16px,-12px,0)}100%{transform:translate3d(0,0,0)}}
        @keyframes glowPulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.18)}}
        .serif{font-family:'Instrument Serif',serif;}

        /* Buttons */
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 30px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;letter-spacing:.04em;cursor:pointer;border:none;transition:all .22s ease;}
        .btn-fill{background:var(--cream);color:#fff;}
        .btn-fill:hover{background:#2a2420;transform:translateY(-2px);}
        .btn-outline{background:rgba(26,22,18,0.06);color:var(--cream);border:1px solid rgba(26,22,18,0.2);}
        .btn-outline:hover{background:rgba(26,22,18,0.1);transform:translateY(-2px);}

        /* Range inputs */
        input[type=range]{height:3px;-webkit-appearance:none;background:rgba(180,155,100,0.25);border-radius:2px;outline:none;width:100%;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-lt));cursor:pointer;box-shadow:0 0 8px rgba(160,120,50,.4);border:2px solid #fff;}

        /* Swatches */
        .swatch-btn{width:30px;height:30px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .2s;flex-shrink:0;}
        .swatch-btn.active{border-color:var(--gold);transform:scale(1.15);box-shadow:0 0 10px rgba(160,120,50,.4);}
        .mobile-video-showcase{display:none;}

        /* Chips */
        .chip-group{display:flex;flex-wrap:wrap;gap:5px;}
        .chip{padding:4px 10px;border-radius:5px;border:1px solid var(--border);background:#fff;color:var(--muted);font-size:11px;cursor:pointer;transition:all .18s;font-family:'DM Sans',sans-serif;}
        .chip.active{border-color:var(--gold);background:rgba(180,145,60,0.08);color:var(--gold-lt);font-weight:600;}
        .chip:hover:not(.active){border-color:rgba(180,145,60,0.5);color:var(--cream);}

        /* Section labels */
        .sec-label{font-size:9px;color:var(--gold);letter-spacing:.2em;text-transform:uppercase;font-weight:700;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;}
        .sec-label span{font-size:11px;color:var(--cream);font-weight:600;letter-spacing:.02em;text-transform:none;}
        .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(180,145,60,0.2),transparent);flex-shrink:0;}

        /* Brand */
        .brand-right{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;text-align:center;min-width:132px;}
        .brand-logo{width:86px;height:86px;object-fit:cover;border-radius:50%;border:2px solid rgba(180,145,60,0.3);box-shadow:0 8px 24px rgba(0,0,0,.1);}
        .brand-caption{font-size:11px;line-height:1.2;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);white-space:nowrap;}

        /* Camera */
        .camera-screen{flex:1;height:calc(100svh - 112px);min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px 20px;background:var(--bg);overflow:hidden;}
        .camera-frame{position:relative;border-radius:16px;overflow:hidden;border:1px solid var(--border);background:#000;flex-shrink:1;}
        .camera-frame video{width:100%;height:auto;display:block;object-fit:cover;background:#000;}
        .hand-box{position:absolute;border:2px solid var(--gold);border-radius:8px;pointer-events:none;box-shadow:0 0 0 9999px rgba(0,0,0,0.5);}
        .camera-shot-button{width:64px;height:64px;border-radius:50%;border:3px solid rgba(255,255,255,.3);font-size:26px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;}

        /* TRY-ON layout: right side uses a compact 2-column control board, NO scroll */
        .tryon-layout{display:grid;grid-template-columns:minmax(420px,38vw) minmax(0,1fr);overflow:hidden;height:calc(100svh - 112px);min-height:0;}
        .tryon-left{position:relative;overflow:hidden;background:#f5f3f0;display:flex;align-items:center;justify-content:center;min-height:0;}
        .tryon-photo{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;user-select:none;}
        .tryon-right{overflow:hidden;background:var(--bg2);border-left:1px solid var(--border);display:grid;grid-template-rows:auto minmax(0,1fr);padding:12px 18px;gap:10px;min-height:0;}
        .tryon-summary{background:#fff;border:1px solid var(--border);border-radius:14px;padding:11px 14px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:14px;min-height:0;box-shadow:0 4px 14px rgba(0,0,0,.025);}
        .tryon-summary-kicker{font-size:10px;color:var(--gold);letter-spacing:.25em;text-transform:uppercase;margin-bottom:3px;font-weight:700;}
        .tryon-summary-title{font-size:24px;font-weight:400;line-height:1.08;margin-bottom:2px;color:var(--cream);}
        .tryon-summary-desc{font-size:12px;color:var(--muted);}
        .tryon-summary-side{display:flex;align-items:center;gap:14px;justify-content:flex-end;flex-wrap:wrap;}
        .tryon-price{font-size:22px;color:var(--gold);font-weight:800;white-space:nowrap;}
        .tryon-control-grid{min-height:0;display:grid;grid-template-columns:minmax(360px,.95fr) minmax(380px,1.05fr);gap:12px;overflow:hidden;}
        .control-card{min-height:0;overflow:hidden;background:#fff;border:1px solid var(--border);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:10px;box-shadow:0 4px 14px rgba(0,0,0,.025);}
        .control-card.compact{gap:8px;}
        .control-section{flex-shrink:0;min-width:0;}
        .ring-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;}
        .ring-style-btn{background:rgba(26,22,18,0.025);border:1.5px solid rgba(180,155,100,0.18);border-radius:10px;padding:6px 3px 5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;transition:all .18s;min-width:0;}
        .ring-style-btn.active{background:rgba(201,168,50,0.12);border-color:rgba(201,168,50,0.65);}
        .ring-grid-thumb{width:54px;height:30px;display:flex;align-items:center;justify-content:center;overflow:hidden;}
        .ring-grid-label{font-size:9px;color:var(--muted);text-align:center;line-height:1.2;font-weight:500;}
        .ring-style-btn.active .ring-grid-label{color:var(--gold);font-weight:700;}
        .option-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px 12px;align-items:start;}
        .option-span-2{grid-column:1 / -1;}
        .metal-row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}

        /* Multi-ring */
        .multi-check-wrap{display:flex;align-items:center;gap:7px;cursor:pointer;user-select:none;}
        .multi-check-wrap input[type=checkbox]{width:15px;height:15px;accent-color:var(--gold);cursor:pointer;}
        .multi-check-label{font-size:13px;font-weight:700;color:var(--gold);letter-spacing:.05em;}
        .delete-ring-btn{padding:7px 14px;border-radius:999px;border:1px solid var(--border);background:#fff;color:var(--cream);font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans';transition:all .2s;}
        .delete-ring-btn:hover:not(:disabled){background:rgba(180,145,60,0.1);color:var(--gold-lt);}
        .delete-ring-btn:disabled{opacity:.3;cursor:not-allowed;}

        /* Ring size */
        .size-estimate{background:rgba(180,145,60,0.07);border:1px solid rgba(180,145,60,0.25);border-radius:10px;padding:9px 13px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
        .size-est-label{font-size:11px;color:var(--muted);letter-spacing:.05em;text-transform:uppercase;font-weight:700;}
        .size-est-sub{font-size:10px;color:rgba(180,145,60,0.7);margin-top:2px;}
        .size-est-value{font-size:28px;font-weight:700;color:var(--gold);font-family:'Instrument Serif',serif;flex-shrink:0;}
        .size-manual-label{font-size:11px;color:var(--muted);margin-bottom:5px;letter-spacing:.03em;font-weight:600;}
        .size-manual-select{background:#fff;color:var(--cream);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:12px;font-family:'DM Sans';cursor:pointer;outline:none;width:100%;}
        .size-manual-select:focus{border-color:var(--gold);}

        /* Slider rows — full width and stacked */
        .slider-stack{display:flex;flex-direction:column;gap:13px;width:100%;}
        .slider-row{display:flex;flex-direction:column;gap:8px;width:100%;}

        /* Action buttons */
        .actions-stack{display:flex;flex-direction:column;gap:9px;width:100%;}
        .action-add{width:100%;min-height:48px;padding:13px 16px;border-radius:12px;border:none;color:#fff;font-size:15px;letter-spacing:.07em;font-weight:900;cursor:pointer;font-family:'DM Sans';display:flex;align-items:center;justify-content:center;gap:10px;transition:all .3s;}
        .action-save{width:100%;min-height:42px;padding:11px 16px;border-radius:12px;font-size:13px;letter-spacing:.07em;font-weight:700;cursor:pointer;font-family:'DM Sans';display:flex;align-items:center;justify-content:center;gap:10px;transition:all .3s;border:1.5px solid var(--border);}
        .try-photo-btn{width:100%;padding:8px;border-radius:10px;border:none;background:transparent;color:var(--muted);font-size:12px;cursor:pointer;font-family:'DM Sans';letter-spacing:.05em;font-weight:600;}

        /* Mobile */
        @media (max-width:768px){
          .desktop-only{display:none !important;}
          .cards-stack{display:none !important;}
          .intro-grid{grid-template-columns:1fr !important;padding:38px 20px 96px !important;align-items:start !important;gap:28px !important;}
          .intro-copy h1{font-size:clamp(36px,10vw,54px) !important;line-height:1.04 !important;}
          nav{padding:12px 16px !important;min-height:80px !important;}
          .brand-right{min-width:90px !important;max-width:110px !important;gap:4px !important;}
          .brand-logo{width:54px !important;height:54px !important;}
          .brand-caption{font-size:8px !important;white-space:normal !important;}
          .mobile-actions{width:100% !important;display:grid !important;grid-template-columns:1fr !important;gap:12px !important;}
          .mobile-actions .btn{width:100% !important;}
          .mobile-video-showcase{display:flex !important;width:100%;overflow-x:auto;padding:8px 0 28px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;}
          .mobile-video-showcase::-webkit-scrollbar{display:none;}
          .mobile-video-card{flex:0 0 100%;width:100%;height:430px;scroll-snap-align:start;scroll-snap-stop:always;}
          .camera-screen{height:calc(100svh - 80px) !important;padding:10px 14px !important;gap:10px !important;justify-content:flex-start !important;}
          .camera-shot-button{width:52px !important;height:52px !important;font-size:20px !important;}
          /* Mobile tryon: still no scroll, but much more compact */
          .tryon-layout{grid-template-columns:38% 1fr !important;height:calc(100svh - 80px) !important;overflow:hidden !important;gap:0 !important;}
          .tryon-left{background:#f5f3f0 !important;}
          .tryon-right{border-left:1px solid var(--border) !important;padding:6px 7px !important;gap:5px !important;background:var(--bg2) !important;overflow:hidden !important;}
          .tryon-summary{padding:6px 7px !important;border-radius:8px !important;grid-template-columns:1fr !important;gap:3px !important;}
          .tryon-summary-kicker{font-size:7px !important;letter-spacing:.16em !important;margin-bottom:1px !important;}
          .tryon-summary-title{font-size:12px !important;line-height:1.05 !important;margin-bottom:0 !important;}
          .tryon-summary-desc{font-size:8px !important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
          .tryon-summary-side{gap:5px !important;justify-content:space-between !important;}
          .tryon-price{font-size:12px !important;}
          .tryon-control-grid{grid-template-columns:1fr 1fr !important;gap:5px !important;}
          .control-card{padding:6px !important;gap:5px !important;border-radius:8px !important;}
          .option-grid{grid-template-columns:1fr !important;gap:5px !important;}
          .option-span-2{grid-column:auto !important;}
          .tryon-right .sec-label{font-size:7px !important;letter-spacing:.1em !important;margin-bottom:3px !important;}
          .tryon-right .sec-label span{font-size:8px !important;}
          .tryon-right .chip{font-size:8px !important;padding:3px 5px !important;border-radius:4px !important;}
          .tryon-right .chip-group{gap:3px !important;}
          .tryon-right .swatch-btn{width:18px !important;height:18px !important;}
          .metal-row{gap:7px !important;}
          .tryon-right .ring-grid{grid-template-columns:repeat(2,1fr) !important;gap:3px !important;}
          .tryon-right .ring-style-btn{padding:3px 2px !important;border-radius:5px !important;gap:2px !important;}
          .tryon-right .ring-grid-thumb{width:28px !important;height:17px !important;}
          .tryon-right .ring-grid-label{font-size:6px !important;}
          .tryon-right .slider-stack{gap:5px !important;}
          .tryon-right .slider-row{gap:3px !important;}
          .tryon-right .size-estimate{padding:5px 6px !important;border-radius:6px !important;}
          .tryon-right .size-est-label{font-size:7px !important;}
          .tryon-right .size-est-sub{display:none !important;}
          .tryon-right .size-est-value{font-size:14px !important;}
          .tryon-right .size-manual-label{font-size:7px !important;margin-bottom:2px !important;}
          .tryon-right .size-manual-select{font-size:8px !important;padding:4px 5px !important;border-radius:5px !important;}
          .tryon-right .multi-check-label{font-size:8px !important;}
          .tryon-right .multi-check-wrap input[type=checkbox]{width:10px !important;height:10px !important;}
          .tryon-right .delete-ring-btn{font-size:7px !important;padding:3px 6px !important;}
          .tryon-right .actions-stack{gap:5px !important;}
          .tryon-right .action-add{min-height:30px !important;padding:6px 4px !important;font-size:8px !important;border-radius:6px !important;gap:4px !important;}
          .tryon-right .action-save{min-height:28px !important;padding:5px 4px !important;font-size:8px !important;border-radius:6px !important;gap:4px !important;}
          .tryon-right .try-photo-btn{font-size:7px !important;padding:3px !important;}
          input[type=range]{height:2px !important;}
          input[type=range]::-webkit-slider-thumb{width:12px !important;height:12px !important;}
        }
        @media (min-width:769px){.mobile-only{display:none !important;}}
        @media (min-width:769px) and (max-height:800px){
          .tryon-layout{height:calc(100svh - 100px);}
          .tryon-right{padding:10px 18px;gap:8px;}
          .brand-logo{width:72px;height:72px;}
        }
      `}</style>

      <div style={{minHeight:'100svh',background:'var(--bg)',display:'flex',flexDirection:'column',overflowX:'hidden'}}>

        {/* NAV */}
        <nav style={{position:'relative',zIndex:50,minHeight:112,padding:'12px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--border)',flexShrink:0,background:'#fff'}}>
          <div className="serif" style={{fontSize:50,letterSpacing:'.08em',color:'var(--gold)',lineHeight:1}}>Lumière</div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            {phase==='tryOn' && <button onClick={()=>{stopCamera();setPhase('intro');setPhoto(null);setCroppedPhoto(null)}} className="btn btn-outline" style={{padding:'10px 20px',fontSize:13}}>← Retake</button>}
            <div className="brand-right">
              <img src={NEXTGENIQ_LOGO} alt="NextGenIQ.AI" className="brand-logo"/>
              <div className="brand-caption" style={{color:'var(--muted)'}}>A NextGenIQ.AI Product</div>
            </div>
          </div>
        </nav>

        {/* INTRO */}
        {phase==='intro' && (
          <div style={{flex:1,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:1}}>
              {floatingRings.map((ring,i) => (
                <div key={i} style={{position:'absolute',top:ring.top,left:ring.left,width:ring.size,height:ring.size,opacity:ring.opacity,mixBlendMode:'screen',animation:`driftRing ${ring.duration} ease-in-out ${ring.delay} infinite`}}>
                  <div style={{position:'absolute',inset:-26,borderRadius:'50%',background:'radial-gradient(circle, rgba(255,220,160,0.55) 0%, rgba(255,220,160,0.22) 32%, transparent 78%)',filter:'blur(16px)',animation:`glowPulse 4.5s ease-in-out ${ring.delay} infinite`}}/>
                  <img src={ring.image} alt="" aria-hidden="true" style={{position:'relative',width:'100%',height:'100%',objectFit:'contain',transform:`rotate(${ring.rotate}deg)`,filter:'brightness(1.2) saturate(1.15) drop-shadow(0 0 10px rgba(255,220,160,0.38))'}}/>
                </div>
              ))}
            </div>
            <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0}}>
              <div style={{position:'absolute',top:'10%',left:'30%',width:600,height:600,background:'radial-gradient(ellipse, rgba(180,145,60,0.05) 0%, transparent 70%)',borderRadius:'50%'}}/>
            </div>
            <div className="intro-grid" style={{position:'relative',zIndex:5,display:'grid',gridTemplateColumns:'0.85fr 1.15fr',alignItems:'center',padding:'0 56px 40px',gap:48,minHeight:'calc(100vh - 88px)'}}>
              <div className="intro-copy" style={{display:'flex',flexDirection:'column',gap:28,minWidth:0,width:'100%'}}>
                <div style={{fontSize:14,color:'var(--gold)',letterSpacing:'.06em',fontWeight:400,animation:'fadeUp .6s ease both'}}>
                  Designed and Developed for Pukka Berlin
                </div>
                <div style={{display:'inline-flex',alignItems:'center',gap:14,animation:'fadeUp .8s .1s ease both'}}>
                  <div style={{width:36,height:1.5,background:'var(--gold)',flexShrink:0}}/>
                  <div style={{fontSize:13,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--gold)',fontWeight:600,whiteSpace:'nowrap'}}>Virtual Try Before You Buy</div>
                  <div style={{width:36,height:1.5,background:'var(--gold)',flexShrink:0}}/>
                </div>
                <h1 className="serif" style={{fontSize:'clamp(42px,4.5vw,68px)',lineHeight:1.06,letterSpacing:'-.02em',animation:'fadeUp 1s .22s ease both',whiteSpace:'nowrap',color:'var(--cream)'}}>
                  Virtual Wear <em style={{color:'var(--gold)'}}>the Ring</em>
                </h1>
                <div className="mobile-actions" style={{display:'flex',gap:14,flexWrap:'wrap',animation:'fadeUp 1s .52s ease both'}}>
                  <button onClick={startCamera} className="btn btn-fill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    Take Photo of your Hand
                  </button>
                  <label className="btn btn-outline" style={{cursor:'pointer'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 12V4M9 4L6.5 6.5M9 4l2.5 2.5"/><path d="M3 15h18"/></svg>
                    Upload a Photo of your Hand
                    <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleUpload}/>
                  </label>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:16,animation:'fadeUp 1s .66s ease both'}}>
                  <div style={{display:'flex'}}>
                    {['#c89068','#b8988c','#d49868','#e8c09c'].map((c,i) => <div key={i} style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${c},${c}88)`,border:'2px solid #fff',marginLeft:i===0?0:-7}}/>)}
                  </div>
                  <p style={{fontSize:13,color:'var(--muted)',fontWeight:300}}><strong style={{color:'var(--cream)',fontWeight:500}}>48,200+</strong> try-ons today</p>
                </div>
                <div ref={mobileShowcaseRef} className="mobile-video-showcase">
                  {testimonials.map((t,i) => (
                    <div key={i} className="mobile-video-card" style={{position:'relative',borderRadius:28,overflow:'hidden',background:'oklch(13% 0.008 270)',border:'1px solid oklch(74% 0.12 78 / 0.16)',display:'flex',flexDirection:'column'}}>
                      <div style={{flex:1,position:'relative',overflow:'hidden',background:t.bg}}>
                        <video autoPlay muted loop playsInline preload="metadata" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:1}}><source src={t.video} type="video/mp4"/></video>
                        <div style={{position:'absolute',inset:0,zIndex:2,background:'linear-gradient(to bottom, rgba(0,0,0,.08) 0%, rgba(0,0,0,.35) 100%)'}}/>
                        <div style={{position:'absolute',top:16,left:16,zIndex:4,background:'rgba(0,0,0,.55)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,.12)',borderRadius:100,padding:'6px 13px',display:'flex',alignItems:'center',gap:8,fontSize:13}}>
                          <div style={{width:8,height:8,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 8px #22c55e'}}/>Live try-on
                        </div>
                      </div>
                      <div style={{padding:'20px 22px 24px',background:'oklch(13% 0.008 270)'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:10}}><div style={{fontSize:18,fontWeight:500}}>{t.name}</div><div style={{color:'var(--gold)',fontSize:15}}>★★★★★</div></div>
                        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}><div style={{width:14,height:14,borderRadius:'50%',background:t.swatch,flexShrink:0}}/><span style={{fontSize:14,color:'var(--muted)'}}>{t.ring}</span></div>
                        <p style={{fontSize:15,color:'var(--cream)',fontStyle:'italic',lineHeight:1.5}}>{t.quote}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="desktop-only" style={{position:'relative',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',animation:'fadeIn 1.2s .3s ease both',paddingRight:20}}>
                <div className="cards-stack" style={{position:'relative',width:'min(560px, 42vw)',height:620}}>
                  {testimonials.map((t,i) => {
                    const diff=(i-introCard+3)%3; const state=diff===0?'active':diff===1?'behind1':'behind2'
                    return (
                      <div key={i} style={{position:'absolute',inset:0,borderRadius:28,overflow:'hidden',background:'oklch(13% 0.008 270)',border:'1px solid oklch(74% 0.12 78 / 0.12)',boxShadow:'0 32px 80px rgba(0,0,0,.55)',display:'flex',flexDirection:'column',opacity:state==='active'?1:state==='behind1'?0.55:0.25,transform:state==='active'?'none':state==='behind1'?'translate(16px,16px) scale(.96)':'translate(32px,32px) scale(.92)',zIndex:state==='active'?3:state==='behind1'?2:1,transition:'opacity .7s ease, transform .7s ease'}}>
                        <div style={{flex:1,position:'relative',overflow:'hidden',background:t.bg}}>
                          <video key={t.video} autoPlay muted loop playsInline preload="auto" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:1,opacity:0.96}}><source src={t.video} type="video/mp4"/></video>
                          <div style={{position:'absolute',inset:0,zIndex:2,background:'linear-gradient(to bottom, rgba(0,0,0,.08) 0%, rgba(0,0,0,.38) 100%)'}}/>
                          <div style={{position:'absolute',top:18,left:18,zIndex:4,background:'rgba(0,0,0,.55)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,.12)',borderRadius:100,padding:'6px 13px',display:'flex',alignItems:'center',gap:8,fontSize:13}}>
                            <div style={{width:8,height:8,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 8px #22c55e'}}/>Live try-on
                          </div>
                        </div>
                        <div style={{padding:'24px 28px 28px',background:'oklch(13% 0.008 270)'}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}><div style={{fontSize:20,fontWeight:500}}>{t.name}</div><div style={{color:'var(--gold)',fontSize:18}}>★★★★★</div></div>
                          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><div style={{width:16,height:16,borderRadius:'50%',background:t.swatch,flexShrink:0}}/><span style={{fontSize:15,color:'var(--muted)'}}>{t.ring}</span></div>
                          <p style={{fontSize:18,color:'var(--cream)',fontStyle:'italic',lineHeight:1.55}}>{t.quote}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={{position:'absolute',bottom:16,left:'50%',transform:'translateX(-50%)',display:'flex',gap:6}}>
                  {[0,1,2].map(i => <div key={i} onClick={()=>setIntroCard(i)} style={{width:i===introCard?28:8,height:8,borderRadius:4,background:i===introCard?'var(--gold)':'rgba(201,168,50,.25)',transition:'all .4s',cursor:'pointer'}}/>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAMERA — with hand guide box */}
        {phase==='camera' && (
          <div className="camera-screen">
            <p style={{fontSize:13,letterSpacing:'.2em',color:'var(--gold)',textTransform:'uppercase',flexShrink:0}}>Place your hand inside the box</p>
            <div className="camera-frame" style={{width:'100%',maxWidth:580,maxHeight:'calc(100svh - 260px)'}}>
              <video ref={videoRef} style={{width:'100%',height:'auto',maxHeight:'calc(100svh - 260px)',objectFit:'cover',background:'#000'}} playsInline muted/>
              {/* Hand guide box — matches the CROP area */}
              <div className="hand-box" style={{
                left:`${CROP.x*100}%`,
                top:`${CROP.y*100}%`,
                width:`${CROP.w*100}%`,
                height:`${CROP.h*100}%`,
              }}>
                {/* Corner ticks */}
                {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h],ci) => (
                  <div key={ci} style={{position:'absolute',[v]:-2,[h]:-2,width:18,height:18,borderTop:v==='top'?'3px solid var(--gold)':'none',borderBottom:v==='bottom'?'3px solid var(--gold)':'none',borderLeft:h==='left'?'3px solid var(--gold)':'none',borderRight:h==='right'?'3px solid var(--gold)':'none'}}/>
                ))}
              </div>
              {!cameraReady && <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(8,7,10,.7)'}}><div style={{width:32,height:32,border:'2px solid rgba(201,168,50,.3)',borderTopColor:'var(--gold)',borderRadius:'50%',animation:'spin .8s linear infinite'}}/></div>}
            </div>
            <canvas ref={canvasRef} style={{display:'none'}}/>
            <button className="camera-shot-button" onClick={capturePhoto} disabled={!cameraReady} style={{background:cameraReady?'linear-gradient(135deg,var(--gold),var(--gold-lt))':'#2a2a2a',cursor:cameraReady?'pointer':'not-allowed'}}>📸</button>
            <label className="btn btn-outline" style={{cursor:'pointer',fontSize:13}}>
              or upload a photo<input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleUpload}/>
            </label>
          </div>
        )}

        {/* TRY-ON */}
        {phase==='tryOn' && (
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div className="tryon-layout">

              {/* LEFT: cropped hand photo — contained, not covering full panel */}
              <div className="tryon-left" ref={containerRef} style={{cursor:isDragging?'grabbing':'default',touchAction:'none',isolation:'isolate',willChange:'transform'}}>
                {croppedPhoto && <img src={croppedPhoto} className="tryon-photo" alt="hand" draggable={false}/>}

                {/* Single ring */}
                {!multiMode && (
                  <div onMouseDown={e=>onPointerDown(e,'single')} onTouchStart={e=>onPointerDown(e,'single')}
                    style={{position:'absolute',left:`${ringPos.x}%`,top:`${ringPos.y}%`,transform:`translate(-50%,-50%) rotate(${ringRotation+(selectedRing.rotation??0)}deg)`,cursor:isDragging?'grabbing':'grab',userSelect:'none',touchAction:'none',width:ringSize,willChange:'transform'}}>
                    <img src={selectedColor.image} alt={selectedRing.name} draggable={false} style={{width:'100%',objectFit:'contain',display:'block',pointerEvents:'none',filter:'drop-shadow(0 4px 20px rgba(0,0,0,.65))'}}/>
                  </div>
                )}

                {/* Multi rings */}
                {multiMode && placedRings.map(p => {
                  const ring=RING_CATALOG.find(r=>r.id===p.ringId)!; const color=ring.colors.find(c=>c.id===p.colorId)??ring.colors[0]
                  const isActive=p.id===activePlacedId
                  return (
                    <div key={p.id} onMouseDown={e=>onPointerDown(e,p.id)} onTouchStart={e=>onPointerDown(e,p.id)}
                      style={{position:'absolute',left:`${p.x}%`,top:`${p.y}%`,transform:`translate(-50%,-50%) rotate(${p.rotation+(ring.rotation??0)}deg)`,cursor:isDragging&&activePlacedId===p.id?'grabbing':'grab',userSelect:'none',touchAction:'none',width:p.size,willChange:'transform',outline:isActive?'2px solid rgba(201,168,50,0.6)':'none',outlineOffset:4,borderRadius:4}}>
                      <img src={color.image} alt={ring.name} draggable={false} style={{width:'100%',objectFit:'contain',display:'block',pointerEvents:'none',filter:'drop-shadow(0 4px 20px rgba(0,0,0,.65))'}}/>
                    </div>
                  )
                })}

                {!isDragging && (
                  <div style={{position:'absolute',bottom:14,left:'50%',transform:'translateX(-50%)',background:'rgba(8,7,10,.75)',backdropFilter:'blur(12px)',border:'1px solid oklch(74% 0.12 78 / 0.2)',color:'rgba(240,237,232,.8)',padding:'7px 20px',borderRadius:100,fontSize:12,letterSpacing:'.07em',whiteSpace:'nowrap',pointerEvents:'none'}}>
                    {multiMode?'Tap ring style to place · Drag to move':'Drag · Pinch to resize & rotate'}
                  </div>
                )}
              </div>

              {/* RIGHT: controls — compact, full-page, no scroll */}
              <div className="tryon-right">

                {/* Header stays short so the full configuration fits underneath */}
                <div className="tryon-summary">
                  <div style={{minWidth:0}}>
                    <div className="tryon-summary-kicker">Selected Ring</div>
                    <h2 className="serif tryon-summary-title">{selectedRing.name}</h2>
                    <div className="tryon-summary-desc">{selectedRing.description}</div>
                  </div>

                  <div className="tryon-summary-side">
                    <div className="tryon-price">${selectedRing.price.toLocaleString()}</div>
                    <label className="multi-check-wrap">
                      <input type="checkbox" checked={multiMode} onChange={e=>{setMultiMode(e.target.checked);if(!e.target.checked){setPlacedRings([]);setActivePlacedId(null)}}}/>
                      <span className="multi-check-label">Multi-Ring Mode</span>
                    </label>
                    {multiMode && <button type="button" className="delete-ring-btn" onClick={deleteLastRing} disabled={placedRings.length===0}>Delete Ring</button>}
                  </div>
                </div>

                <div className="tryon-control-grid">
                  {/* LEFT CONTROL CARD */}
                  <div className="control-card">
                    {/* Ring style grid */}
                    <div className="control-section">
                      <div className="sec-label">Ring Style</div>
                      <div className="ring-grid">
                        {RING_CATALOG.map(r => (
                          <button key={r.id} onClick={()=>selectRing(r.id)} className={`ring-style-btn ${selectedRingId===r.id?'active':''}`}>
                            <div className="ring-grid-thumb">
                              <img src={r.colors[0].image} alt={r.name} style={{width:r.rotation===90?'52%':'100%',height:'100%',objectFit:'contain',filter:'drop-shadow(0 2px 5px rgba(0,0,0,.5))',transform:`rotate(${r.rotation??0}deg)`}}/>
                            </div>
                            <div className="ring-grid-label">
                              {r.name.split(' ').slice(0,2).join(' ')}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="divider"/>

                    {/* Metal */}
                    <div className="control-section">
                      <div className="sec-label">Metal <span>{selectedColor.label}</span></div>
                      <div className="metal-row">
                        {selectedRing.colors.map(c => (
                          <button key={c.id} onClick={()=>{setSelectedColorId(c.id);if(multiMode&&activePlacedId)setPlacedRings(prev=>prev.map(p=>p.id===activePlacedId?{...p,colorId:c.id}:p))}}
                            className={`swatch-btn ${selectedColorId===c.id?'active':''}`} style={{background:c.swatch}} title={c.label}/>
                        ))}
                      </div>
                    </div>

                    <div className="divider"/>

                    {/* Pukka Berlin options, arranged horizontally to avoid vertical scrolling */}
                    <div className="option-grid">
                      <div className="control-section option-span-2">
                        <div className="sec-label">Stone Size</div>
                        <div className="chip-group">
                          {STONE_SIZES.map(s => <button key={s} onClick={()=>setStoneSize(s)} className={`chip ${stoneSize===s?'active':''}`}>{s}</button>)}
                        </div>
                      </div>

                      <div className="control-section">
                        <div className="sec-label">Fineness</div>
                        <div className="chip-group">
                          {FINENESS.map(f => <button key={f} onClick={()=>setFineness(f)} className={`chip ${fineness===f?'active':''}`}>{f}</button>)}
                        </div>
                      </div>

                      <div className="control-section">
                        <div className="sec-label">Customization</div>
                        <div className="chip-group">
                          {CUSTOMIZATIONS.map(c => <button key={c} onClick={()=>setCustomization(c)} className={`chip ${customization===c?'active':''}`}>{c}</button>)}
                        </div>
                      </div>

                      <div className="control-section option-span-2">
                        <div className="sec-label">Color Stone / Pearl / Brilliant</div>
                        <div className="chip-group">
                          {COLOR_STONES.map(c => <button key={c} onClick={()=>setColorStone(c)} className={`chip ${colorStone===c?'active':''}`}>{c}</button>)}
                        </div>
                      </div>

                      <div className="control-section option-span-2">
                        <div className="sec-label">Brilliant Quality</div>
                        <div className="chip-group">
                          {BRILLIANTS.map(b => <button key={b} onClick={()=>setBrilliant(b)} className={`chip ${brilliant===b?'active':''}`}>{b}</button>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT CONTROL CARD */}
                  <div className="control-card compact">
                    {/* Scale + Rotate — each has its own full-width row */}
                    <div className="slider-stack">
                      <div className="slider-row">
                        <div className="sec-label">Scale the Ring <span>{Math.round(multiMode&&activePlacedRing?activePlacedRing.size:ringSize)}px</span></div>
                        <input type="range" min={20} max={400} value={multiMode&&activePlacedRing?activePlacedRing.size:ringSize}
                          onChange={e=>{if(multiMode&&activePlacedId)setPlacedRings(prev=>prev.map(p=>p.id===activePlacedId?{...p,size:+e.target.value}:p));else setRingSize(+e.target.value)}}/>
                      </div>
                      <div className="slider-row">
                        <div className="sec-label">Rotate the Ring <span>{Math.round(multiMode&&activePlacedRing?activePlacedRing.rotation:ringRotation)}°</span></div>
                        <input type="range" min={-180} max={180} value={multiMode&&activePlacedRing?activePlacedRing.rotation:ringRotation}
                          onChange={e=>{if(multiMode&&activePlacedId)setPlacedRings(prev=>prev.map(p=>p.id===activePlacedId?{...p,rotation:+e.target.value}:p));else setRingRotation(+e.target.value)}}/>
                      </div>
                    </div>

                    <div className="divider"/>

                    {/* Ring Size Estimator */}
                    <div className="control-section">
                      <div className="sec-label">Ring Size</div>
                      <div className="size-estimate" style={{marginBottom:8}}>
                        <div>
                          <div className="size-est-label">Your approx. ring size</div>
                          <div className="size-est-sub">Based on placement and scale</div>
                        </div>
                        <div className="size-est-value">{approxSize}</div>
                      </div>
                      <div className="size-manual-label">or choose ring size manually:</div>
                      <select className="size-manual-select" value={manualRingSize} onChange={e=>setManualRingSize(e.target.value)}>
                        <option value="">— select size (EU) —</option>
                        {RING_SIZES_EU.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="divider"/>

                    {/* Action buttons */}
                    <div className="actions-stack">
                      <button className="action-add" onClick={addToCart} style={{background:addedToCart?'var(--gold-dk)':'linear-gradient(135deg,var(--gold-dk),var(--gold))'}}>
                        {addedToCart?'✓ Added to Cart!':(<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>Add to Cart · ${selectedRing.price.toLocaleString()}</>)}
                      </button>
                      <button className="action-save" onClick={savePhoto} style={{background:photoSaved?'rgba(180,145,60,0.08)':'#fff',color:photoSaved?'var(--gold)':'var(--cream)'}}>
                        {photoSaved?'✓ Photo Saved!':(<><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Save Photo</>)}
                      </button>
                      <button className="try-photo-btn" onClick={()=>{stopCamera();setPhase('intro');setPhoto(null);setCroppedPhoto(null)}}>← Try a different photo</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CART */}
        {phase==='cart' && (
          <div style={{flex:1,overflow:'auto',display:'flex',flexDirection:'column',background:'var(--bg)'}}>
            <div style={{maxWidth:640,margin:'0 auto',width:'100%',padding:'28px 20px'}}>
              <h2 className="serif" style={{fontSize:32,fontWeight:400,marginBottom:24,color:'var(--cream)'}}>Your Cart</h2>
              {cart.length===0?(
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16,color:'var(--muted)',paddingTop:60}}>
                  <p>Your cart is empty</p>
                  <button onClick={()=>setPhase(photo?'tryOn':'intro')} className="btn btn-outline" style={{fontSize:13}}>Continue Shopping</button>
                </div>
              ):(
                <>
                  <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:24}}>
                    {cart.map((item,i) => (
                      <div key={i} style={{padding:'18px',borderRadius:16,background:'#fff',border:'1px solid var(--border)',boxShadow:'0 2px 8px rgba(0,0,0,.04)'}}>
                        <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:12}}>
                          <img src={item.color.image} alt={item.ring.name} style={{width:80,height:50,objectFit:'contain',filter:'drop-shadow(0 2px 8px rgba(0,0,0,.15))'}}/>
                          <div style={{flex:1}}>
                            <div style={{fontSize:14,fontWeight:500,marginBottom:3}}>{item.ring.name}</div>
                            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}><div style={{width:11,height:11,borderRadius:'50%',background:item.color.swatch}}/><span style={{fontSize:12,color:'var(--muted)'}}>{item.color.label}</span></div>
                            <div style={{fontSize:13,color:'var(--gold)'}}>${item.ring.price.toLocaleString()}</div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <button onClick={()=>setCart(prev=>prev.map((ci,ci_i)=>ci_i===i&&ci.qty>1?{...ci,qty:ci.qty-1}:ci).filter((ci,ci_i)=>!(ci_i===i&&ci.qty<=1)))} style={{width:26,height:26,borderRadius:'50%',border:'1px solid rgba(255,255,255,.1)',background:'none',color:'var(--cream)',cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                            <span style={{minWidth:18,textAlign:'center',fontSize:13}}>{item.qty}</span>
                            <button onClick={()=>setCart(prev=>prev.map((ci,ci_i)=>ci_i===i?{...ci,qty:ci.qty+1}:ci))} style={{width:26,height:26,borderRadius:'50%',border:'1px solid rgba(255,255,255,.1)',background:'none',color:'var(--cream)',cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                          </div>
                        </div>
                        {/* Pukka Berlin selections summary */}
                        <div style={{display:'flex',flexWrap:'wrap',gap:6,borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:10}}>
                          {item.stoneSize&&<span style={{fontSize:10,color:'var(--muted)',background:'rgba(255,255,255,.04)',padding:'3px 8px',borderRadius:4}}>Stone: {item.stoneSize}</span>}
                          {item.fineness&&<span style={{fontSize:10,color:'var(--muted)',background:'rgba(255,255,255,.04)',padding:'3px 8px',borderRadius:4}}>{item.fineness}</span>}
                          {item.colorStone&&<span style={{fontSize:10,color:'var(--muted)',background:'rgba(255,255,255,.04)',padding:'3px 8px',borderRadius:4}}>{item.colorStone}</span>}
                          {item.brilliant&&<span style={{fontSize:10,color:'var(--muted)',background:'rgba(255,255,255,.04)',padding:'3px 8px',borderRadius:4}}>{item.brilliant}</span>}
                          {item.customization&&<span style={{fontSize:10,color:'var(--muted)',background:'rgba(255,255,255,.04)',padding:'3px 8px',borderRadius:4}}>Custom: {item.customization}</span>}
                          {item.ringSize&&<span style={{fontSize:10,color:'var(--gold)',background:'rgba(201,168,50,.08)',padding:'3px 8px',borderRadius:4,fontWeight:600}}>Size: {item.ringSize}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{borderTop:'1px solid oklch(74% 0.12 78 / 0.15)',paddingTop:18,marginBottom:18}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:18,fontWeight:500}}>
                      <span>Total</span><span style={{color:'var(--gold)'}}>${cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={()=>setPhase('checkout')} className="btn btn-fill" style={{width:'100%',justifyContent:'center',fontSize:15,borderRadius:12}}>Proceed to Checkout →</button>
                  <button onClick={()=>setPhase(photo?'tryOn':'intro')} className="btn btn-outline" style={{width:'100%',justifyContent:'center',fontSize:13,marginTop:10,borderRadius:12}}>Continue Shopping</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* CHECKOUT */}
        {phase==='checkout' && (
          <div style={{flex:1,overflow:'auto',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32,gap:24,background:'var(--bg)'}}>
            <div style={{width:72,height:72,borderRadius:'50%',background:'linear-gradient(135deg,var(--gold-dk),var(--gold))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>💎</div>
            <h2 className="serif" style={{fontSize:36,fontWeight:400,textAlign:'center',color:'var(--cream)'}}>Secure Checkout</h2>
            <p style={{color:'var(--muted)',fontSize:15,textAlign:'center',maxWidth:380,lineHeight:1.7}}>Our secure checkout is coming soon. In the meantime, contact us directly to complete your purchase.</p>
            <div style={{width:'100%',maxWidth:480,background:'#fff',borderRadius:20,padding:28,border:'1px solid var(--border)',boxShadow:'0 4px 20px rgba(0,0,0,.06)'}}>
              <div style={{fontSize:11,color:'var(--gold)',letterSpacing:'.25em',textTransform:'uppercase',marginBottom:16}}>Order Summary</div>
              {cart.map((item,i) => (
                <div key={i} style={{paddingBottom:14,marginBottom:14,borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:14,marginBottom:6}}>
                    <span>{item.ring.name} × {item.qty}</span>
                    <span>${(item.ring.price*item.qty).toLocaleString()}</span>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                    {item.stoneSize&&<span style={{fontSize:10,color:'var(--muted)'}}>Stone: {item.stoneSize}</span>}
                    {item.fineness&&<span style={{fontSize:10,color:'var(--muted)'}}>· {item.fineness}</span>}
                    {item.colorStone&&<span style={{fontSize:10,color:'var(--muted)'}}>· {item.colorStone}</span>}
                    {item.brilliant&&<span style={{fontSize:10,color:'var(--muted)'}}>· {item.brilliant}</span>}
                    {item.ringSize&&<span style={{fontSize:10,color:'var(--gold)',fontWeight:600}}>· Size {item.ringSize}</span>}
                  </div>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',fontSize:18,fontWeight:600}}>
                <span>Total</span><span style={{color:'var(--gold)'}}>${cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <div style={{display:'flex',gap:12,width:'100%',maxWidth:480}}>
              <button onClick={()=>setPhase('cart')} className="btn btn-outline" style={{flex:1,justifyContent:'center',borderRadius:12}}>← Back</button>
              <button className="btn btn-fill" style={{flex:2,justifyContent:'center',borderRadius:12,opacity:.6,cursor:'not-allowed'}}>Complete Purchase Soon</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ── Ring size estimator — separate function to avoid hook-in-callback issues ──
function useMemo_ringSize(ringSize: number, activePlacedRing?: { size: number } | null): string {
  const sz = activePlacedRing ? activePlacedRing.size : ringSize
  // Map 40px → size 45, 300px → size 60 (linear)
  const mapped = Math.round(45 + ((sz - 40) / (300 - 40)) * (60 - 45))
  return String(Math.max(45, Math.min(60, mapped)))
}