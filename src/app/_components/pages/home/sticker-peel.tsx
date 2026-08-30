'use client'

import { animate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  Bone,
  BoxGeometry,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  FrontSide,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  RepeatWrapping,
  RGBAFormat,
  Scene,
  ShadowMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Texture,
  Uint16BufferAttribute,
  Vector3,
  WebGLRenderer,
} from 'three'

import { cn } from '@/lib/utils'

// Adapted from the "Sticker Peel" Originkit Framer component: same bone-grid
// skinning + semicircle curl math, ported to a plain React client component.
// Framer-only concerns (property controls, RenderTarget, live prop reactivity
// for a component meant to stay mounted forever) are stripped since here each
// instance is mounted only for the lifetime of a single hover interaction.

const CAMERA_DISTANCE = 1200
const CAMERA_NEAR = 100
const CAMERA_FAR = 2000
const STICKER_DEPTH = 0.003
const CANVAS_SCALE = 4

const BONE_GRID_X = 30
const BONE_GRID_Y = 30
const SEGMENTS_W = 80
const SEGMENTS_H = 60

// Fixed curl tightness so the peeled flap always visibly curls, even at low
// peel percentages. Peel amount only controls how much of the sticker lifts.
const FIXED_CURL_RADIUS = 0.15
const FIXED_CURL_FACTOR = 0.6

const SHADOW_OPACITY = 0.28
const SHADOW_COLOR = '#000000'
const SHADOW_X = -60
const SHADOW_Y = 30

const PEEL_TRANSITION = {
  type: 'tween' as const,
  duration: 0.5,
  ease: 'easeInOut' as const,
}

const _scratchQuat = new Quaternion()
const _scratchRotAxis = new Vector3()

function calculateCameraFov(width: number, height: number, distance: number) {
  const aspect = width / height
  return 2 * Math.atan(width / aspect / (2 * distance)) * (180 / Math.PI)
}

function mapLinear(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  if (inMax === inMin) return outMin
  const t = (value - inMin) / (inMax - inMin)
  return outMin + t * (outMax - outMin)
}

function mapInternalRadiusToUIValue(ui: number) {
  const clamped = Math.max(0.1, Math.min(1, ui))
  return mapLinear(clamped, 0.1, 1, 0.05, 1 / Math.PI)
}

// Lets the canvas 2D parser normalize any valid CSS color (hex, rgb, oklch,
// already-resolved CSS vars...) into concrete 0-1 sRGB components.
function resolveColorToRgba(cssColor: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx) return { r: 0, g: 0, b: 0, a: 1 }
  ctx.fillStyle = cssColor
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 }
}

// The back of a thin peeled surface must mirror the front image so it looks
// correct to the viewer once it curls over.
function makeBackTextureViewConsistent(
  tex: Texture | null,
  frontTex: Texture | null
) {
  if (!tex) return null
  const out = tex === frontTex ? tex.clone() : tex
  out.wrapS = RepeatWrapping
  out.repeat.x = -1
  out.offset.x = 1
  out.needsUpdate = true
  return out
}

export interface StickerPeelHandle {
  /** Re-peels an already-mounted sticker, cancelling any pending exit. */
  requestEnter: () => void
  /** Animates the peel back to flat, then calls onDone (use it to unmount). */
  requestExit: (onDone: () => void) => void
}

interface StickerPeelProps {
  /** Image URL or data URI used as the sticker's front texture. */
  image: string
  size?: number
  hoverPeel?: number
  pressPeel?: number
  curlRotation?: number
  backColor?: string
  /** Peels in to hoverPeel as soon as the texture is ready — for instances mounted mid-hover. */
  autoPeel?: boolean
  /** Attaches this component's own pointer enter/leave/down/up handlers. */
  interactive?: boolean
  /** Fires once the mesh has its texture and is about to become visible. */
  onReady?: () => void
  className?: string
}

export const StickerPeel = forwardRef<StickerPeelHandle, StickerPeelProps>(
  function StickerPeel(
    {
      image,
      size = 200,
      hoverPeel = 45,
      pressPeel = 64,
      curlRotation = 240,
      backColor = '#09090b',
      autoPeel = false,
      interactive = true,
      onReady,
      className,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sceneRef = useRef<Scene | null>(null)
    const rendererRef = useRef<WebGLRenderer | null>(null)
    const cameraRef = useRef<PerspectiveCamera | null>(null)
    const meshRef = useRef<SkinnedMesh | null>(null)
    const groupRef = useRef<Group | null>(null)
    const bonesRef = useRef<Bone[]>([])
    const bonesInitialPositionsRef = useRef<Vector3[]>([])
    const loadedImageRef = useRef<HTMLImageElement | null>(null)
    const imageLoadAbortRef = useRef(false)
    const curlRotationRef = useRef(curlRotation)
    const pendingUpdateRef = useRef(false)
    const animationControlRef = useRef<ReturnType<typeof animate> | null>(null)
    const isHoveringRef = useRef(false)
    const isPressedRef = useRef(false)
    const exitRequestedRef = useRef(false)
    const isAnimatingRef = useRef(false)
    const renderLoopIdRef = useRef<number | null>(null)
    const animatedCurlRef = useRef({ amount: 0 })

    const [textureLoaded, setTextureLoaded] = useState(false)
    const [sceneReady, setSceneReady] = useState(false)

    const curlAmountMotion = useMotionValue(0)

    const createStickerGeometry = useCallback(
      (width: number, height: number, gridX: number, gridY: number) => {
        const geometry = new BoxGeometry(
          width,
          height,
          STICKER_DEPTH,
          SEGMENTS_W,
          SEGMENTS_H,
          1
        )

        const position = geometry.attributes.position
        const vertex = new Vector3()
        const skinIndexes: number[] = []
        const skinWeights: number[] = []

        for (let i = 0; i < position.count; i++) {
          vertex.fromBufferAttribute(position, i)

          const normalizedX = (vertex.x + width / 2) / width
          const normalizedY = (vertex.y + height / 2) / height
          const gridXPos = normalizedX * (gridX - 1)
          const gridYPos = normalizedY * (gridY - 1)
          const x0 = Math.floor(gridXPos)
          const y0 = Math.floor(gridYPos)
          const x1 = Math.min(x0 + 1, gridX - 1)
          const y1 = Math.min(y0 + 1, gridY - 1)
          const tx = gridXPos - x0
          const ty = gridYPos - y0

          skinIndexes.push(
            y0 * gridX + x0,
            y0 * gridX + x1,
            y1 * gridX + x0,
            y1 * gridX + x1
          )
          skinWeights.push(
            (1 - tx) * (1 - ty),
            tx * (1 - ty),
            (1 - tx) * ty,
            tx * ty
          )
        }

        geometry.setAttribute(
          'skinIndex',
          new Uint16BufferAttribute(skinIndexes, 4)
        )
        geometry.setAttribute(
          'skinWeight',
          new Float32BufferAttribute(skinWeights, 4)
        )
        geometry.computeVertexNormals()
        return geometry
      },
      []
    )

    const renderFrame = useCallback(() => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current)
        return
      const gl = rendererRef.current.getContext()
      if (!gl || gl.isContextLost()) return

      if (meshRef.current?.skeleton) {
        meshRef.current.updateMatrixWorld(true)
        meshRef.current.skeleton.bones.forEach((bone) =>
          bone.updateMatrixWorld(true)
        )
        meshRef.current.skeleton.update()
      }
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }, [])

    const startRenderLoop = useCallback(() => {
      if (isAnimatingRef.current) return
      isAnimatingRef.current = true
      const loop = () => {
        if (!isAnimatingRef.current) return
        renderFrame()
        renderLoopIdRef.current = requestAnimationFrame(loop)
      }
      renderLoopIdRef.current = requestAnimationFrame(loop)
    }, [renderFrame])

    const stopRenderLoop = useCallback(() => {
      isAnimatingRef.current = false
      if (renderLoopIdRef.current !== null) {
        cancelAnimationFrame(renderLoopIdRef.current)
        renderLoopIdRef.current = null
      }
      requestAnimationFrame(() => renderFrame())
    }, [renderFrame])

    const createBackTexture = useCallback(
      (img: HTMLImageElement, backColorValue: string) => {
        const backCanvas = document.createElement('canvas')
        backCanvas.width = img.width
        backCanvas.height = img.height
        const backCtx = backCanvas.getContext('2d')
        if (!backCtx) return null

        const { r, g, b, a: backA } = resolveColorToRgba(backColorValue)
        const backR = Math.round(r * 255)
        const backG = Math.round(g * 255)
        const backB = Math.round(b * 255)

        backCtx.drawImage(img, 0, 0)
        const imageData = backCtx.getImageData(0, 0, img.width, img.height)

        for (let i = 0; i < imageData.data.length; i += 4) {
          const imgR = imageData.data[i]
          const imgG = imageData.data[i + 1]
          const imgB = imageData.data[i + 2]

          if (backA >= 1) {
            imageData.data[i] = backR
            imageData.data[i + 1] = backG
            imageData.data[i + 2] = backB
          } else if (backA > 0) {
            imageData.data[i] = Math.round(backR * backA + imgR * (1 - backA))
            imageData.data[i + 1] = Math.round(
              backG * backA + imgG * (1 - backA)
            )
            imageData.data[i + 2] = Math.round(
              backB * backA + imgB * (1 - backA)
            )
          }
        }

        backCtx.putImageData(imageData, 0, 0)
        const tex = new Texture(backCanvas)
        tex.needsUpdate = true
        tex.minFilter = LinearMipmapLinearFilter
        tex.magFilter = LinearFilter
        tex.generateMipmaps = true
        tex.colorSpace = SRGBColorSpace
        tex.format = RGBAFormat
        return tex
      },
      []
    )

    const setupScene = useCallback(() => {
      if (!canvasRef.current) return null

      const meshW = size
      const meshH = size
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const canvasWidth = meshW * CANVAS_SCALE
      const canvasHeight = meshH * CANVAS_SCALE

      const scene = new Scene()
      sceneRef.current = scene

      const camera = new PerspectiveCamera(
        calculateCameraFov(canvasWidth, canvasHeight, CAMERA_DISTANCE),
        canvasWidth / canvasHeight,
        CAMERA_NEAR,
        CAMERA_FAR
      )
      camera.position.set(0, 0, CAMERA_DISTANCE)
      camera.lookAt(0, 0, 0)
      cameraRef.current = camera

      let renderer: WebGLRenderer
      try {
        renderer = new WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true,
        })
        const gl = renderer.getContext()
        if (!gl || gl.isContextLost()) {
          renderer.dispose()
          return null
        }
        renderer.setSize(
          Math.round(canvasWidth * dpr),
          Math.round(canvasHeight * dpr),
          false
        )
        renderer.setPixelRatio(1)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = PCFShadowMap
        rendererRef.current = renderer
      } catch {
        return null
      }

      canvasRef.current.style.width = `${canvasWidth}px`
      canvasRef.current.style.height = `${canvasHeight}px`

      const geometry = createStickerGeometry(
        meshW,
        meshH,
        BONE_GRID_X,
        BONE_GRID_Y
      )

      const bones: Bone[] = []
      const boneSpacingX = meshW / (BONE_GRID_X - 1)
      const boneSpacingY = meshH / (BONE_GRID_Y - 1)
      for (let y = 0; y < BONE_GRID_Y; y++) {
        for (let x = 0; x < BONE_GRID_X; x++) {
          const bone = new Bone()
          bone.position.x = -meshW / 2 + x * boneSpacingX
          bone.position.y = -meshH / 2 + y * boneSpacingY
          bone.position.z = 0
          bones.push(bone)
        }
      }
      bonesRef.current = bones
      bonesInitialPositionsRef.current = bones.map((b) => b.position.clone())

      const skeleton = new Skeleton(bones)

      // MeshBasicMaterial ignores scene lighting entirely — the sticker's
      // color comes only from its texture/color, so it renders identically
      // whether flat at rest or mid-peel under the directional light, instead
      // of shading darker/lighter as the mesh's curl angle changes.
      const frontMaterial = new MeshBasicMaterial({
        color: 0xffffff,
        side: FrontSide,
        transparent: true,
      })
      const backMaterial = new MeshBasicMaterial({
        color: 0xffffff,
        side: FrontSide,
        transparent: true,
      })
      const sideMaterial = new MeshBasicMaterial({
        color: new Color().setStyle(backColor),
        transparent: true,
        opacity: 1,
      })

      // BoxGeometry face order: +X, -X, +Y, -Y, +Z (front), -Z (back)
      const materials = [
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        frontMaterial,
        backMaterial,
      ]

      const mesh = new SkinnedMesh(geometry, materials)
      mesh.frustumCulled = false
      bones.forEach((bone) => {
        mesh.add(bone)
        bone.updateMatrixWorld(true)
      })
      mesh.bind(skeleton)
      mesh.updateMatrixWorld(true)
      skeleton.update()
      mesh.castShadow = true

      const group = new Group()
      groupRef.current = group
      mesh.position.set(0, 0, 0)
      group.add(mesh)
      meshRef.current = mesh
      scene.add(group)

      // Only used to cast the drop shadow onto the background plane below —
      // MeshBasicMaterial ignores it for the sticker's own surface color.
      const directionalLight = new DirectionalLight(0xffffff, 2)
      directionalLight.position.set(SHADOW_X, SHADOW_Y, 400)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 1024
      directionalLight.shadow.mapSize.height = 1024
      directionalLight.shadow.camera.near = 1
      directionalLight.shadow.camera.far = 2000
      directionalLight.shadow.bias = -0.00001
      directionalLight.shadow.radius = 8

      const baseShadowSize = Math.max(canvasWidth, canvasHeight)
      const shadowCameraSize = Math.max(
        baseShadowSize,
        baseShadowSize * (3.5 / CANVAS_SCALE)
      )
      const shadowOffsetX = SHADOW_X * 0.3
      const shadowOffsetY = SHADOW_Y * 0.3
      directionalLight.shadow.camera.left =
        -shadowCameraSize / 2 + shadowOffsetX
      directionalLight.shadow.camera.right =
        shadowCameraSize / 2 + shadowOffsetX
      directionalLight.shadow.camera.top = shadowCameraSize / 2 + shadowOffsetY
      directionalLight.shadow.camera.bottom =
        -shadowCameraSize / 2 + shadowOffsetY
      scene.add(directionalLight)

      const shadowMat = new ShadowMaterial({
        opacity: SHADOW_OPACITY,
        color: new Color().setStyle(SHADOW_COLOR),
      })
      const planeGeometry = new PlaneGeometry(
        shadowCameraSize,
        shadowCameraSize
      )
      const backgroundPlane = new Mesh(planeGeometry, shadowMat)
      backgroundPlane.receiveShadow = true
      backgroundPlane.position.set(0, 0, -1)
      scene.add(backgroundPlane)

      renderer.render(scene, camera)
      setSceneReady(true)
      return { scene, camera, renderer, mesh, bones }
    }, [createStickerGeometry, backColor, size])

    const loadTexture = useCallback(() => {
      if (!image || !meshRef.current) {
        setTextureLoaded(false)
        return
      }
      setTextureLoaded(false)
      imageLoadAbortRef.current = false

      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        if (imageLoadAbortRef.current || !meshRef.current?.material) return
        loadedImageRef.current = img

        const materials = meshRef.current.material as MeshBasicMaterial[]
        const texture = new Texture(img)
        texture.needsUpdate = true
        // The texture is authored much larger than the on-screen sticker, so
        // it's always minified. Without mipmaps + anisotropy that downscale
        // aliases the glyph and the icon visibly changes character the moment
        // the WebGL layer takes over from the crisp DOM one.
        texture.minFilter = LinearMipmapLinearFilter
        texture.magFilter = LinearFilter
        texture.generateMipmaps = true
        texture.anisotropy =
          rendererRef.current?.capabilities.getMaxAnisotropy() ?? 1
        texture.colorSpace = SRGBColorSpace
        texture.format = RGBAFormat

        const backColorRgba = resolveColorToRgba(backColor)
        const rawBackTexture =
          backColorRgba.a <= 0 ? texture : createBackTexture(img, backColor)
        const backTexture = makeBackTextureViewConsistent(
          rawBackTexture,
          texture
        )

        if (materials[4]) {
          materials[4].map = texture
          materials[4].transparent = true
          materials[4].alphaTest = 0.01
          materials[4].needsUpdate = true
        }
        if (materials[5] && backTexture) {
          materials[5].map = backTexture
          materials[5].transparent = true
          materials[5].alphaTest = 0.01
          materials[5].needsUpdate = true
        }
        for (let i = 0; i < 4; i++) {
          if (materials[i]) {
            materials[i].map = texture
            materials[i].transparent = true
            materials[i].alphaTest = 0.01
            materials[i].needsUpdate = true
          }
        }

        setTextureLoaded(true)

        requestAnimationFrame(() => {
          if (imageLoadAbortRef.current || !meshRef.current) return
          meshRef.current.updateMatrixWorld(true)
          meshRef.current.skeleton?.update()
          updateBones()
          renderFrame()
        })
      }

      img.onerror = () => {
        setTextureLoaded(false)
      }

      img.src = image
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image, backColor, createBackTexture, renderFrame])

    const updateBones = useCallback(() => {
      if (!bonesRef.current.length || !meshRef.current?.skeleton) return

      meshRef.current.updateMatrixWorld(true)
      meshRef.current.skeleton.bones.forEach((bone) =>
        bone.updateMatrixWorld(true)
      )
      meshRef.current.skeleton.update()

      const bones = bonesRef.current
      const initialPositions = bonesInitialPositionsRef.current
      const amount = Math.min(1, Math.max(0, animatedCurlRef.current.amount))
      const curlStart = 1 - amount
      const curlFactor = amount <= 0 ? 1e-4 : FIXED_CURL_FACTOR
      const r = mapInternalRadiusToUIValue(FIXED_CURL_RADIUS)

      const width = size
      const height = size

      const curlRotationRad = curlRotationRef.current * (Math.PI / 180)
      const dirX = Math.cos(curlRotationRad)
      const dirY = Math.sin(curlRotationRad)

      _scratchRotAxis.set(-dirY, dirX, 0).normalize()

      const halfWidth = width / 2
      const halfHeight = height / 2
      const maxDistAlongDir = Math.max(
        halfWidth * dirX + halfHeight * dirY,
        halfWidth * dirX - halfHeight * dirY,
        -halfWidth * dirX + halfHeight * dirY,
        -halfWidth * dirX - halfHeight * dirY
      )
      const diagonalLength = Math.sqrt(width * width + height * height)
      const maxDistFromCenter = diagonalLength / 2
      const foldOffset = -maxDistAlongDir + curlStart * 2 * maxDistAlongDir

      const radiusWorld = r * maxDistFromCenter
      const RPrime = radiusWorld / curlFactor
      const arcLimit = Math.PI * radiusWorld

      for (let i = 0; i < bones.length; i++) {
        const bone = bones[i]
        const initialPos = initialPositions[i]
        const distOnDir = initialPos.x * dirX + initialPos.y * dirY
        const signedDist = distOnDir - foldOffset

        if (signedDist > 0) {
          let xRel: number
          let zRel: number
          let finalAngle: number

          const angle_s = (signedDist * curlFactor) / radiusWorld
          if (signedDist <= arcLimit) {
            xRel = RPrime * Math.sin(angle_s)
            zRel = RPrime * (1 - Math.cos(angle_s))
            finalAngle = angle_s
          } else {
            const Phi = Math.PI * curlFactor
            const xArcEnd = RPrime * Math.sin(Phi)
            const zArcEnd = RPrime * (1 - Math.cos(Phi))
            const extra = signedDist - arcLimit
            xRel = xArcEnd + extra * Math.cos(Phi)
            zRel = zArcEnd + extra * Math.sin(Phi)
            finalAngle = Phi
          }

          const dx = xRel - signedDist
          bone.position.x = initialPos.x + dx * dirX
          bone.position.y = initialPos.y + dx * dirY
          bone.position.z = initialPos.z + zRel
          _scratchQuat.setFromAxisAngle(_scratchRotAxis, -finalAngle)
          bone.quaternion.copy(_scratchQuat)
        } else {
          bone.position.copy(initialPos)
          bone.quaternion.identity()
        }
      }

      meshRef.current.skeleton.update()
    }, [size])

    const scheduleBoneUpdate = useCallback(() => {
      if (pendingUpdateRef.current) return
      pendingUpdateRef.current = true
      requestAnimationFrame(() => {
        pendingUpdateRef.current = false
        updateBones()
      })
    }, [updateBones])

    useMotionValueEvent(curlAmountMotion, 'change', (latest) => {
      animatedCurlRef.current.amount = latest
      scheduleBoneUpdate()
    })

    const animateCurlTo = useCallback(
      (targetNormalized: number, onDone?: () => void) => {
        animationControlRef.current?.stop()
        startRenderLoop()
        animationControlRef.current = animate(
          curlAmountMotion,
          targetNormalized,
          {
            ...PEEL_TRANSITION,
            onComplete: () => {
              stopRenderLoop()
              onDone?.()
            },
          }
        )
      },
      [curlAmountMotion, startRenderLoop, stopRenderLoop]
    )

    useImperativeHandle(
      ref,
      () => ({
        requestEnter: () => {
          exitRequestedRef.current = false
          isHoveringRef.current = true
          // Before the texture lands the autoPeel effect below still owes us
          // the peel-in, so don't animate a blank mesh here.
          if (textureLoaded) animateCurlTo(hoverPeel / 100)
        },
        requestExit: (onDone: () => void) => {
          exitRequestedRef.current = true
          isHoveringRef.current = false
          isPressedRef.current = false
          animateCurlTo(0, onDone)
        },
      }),
      [animateCurlTo, hoverPeel, textureLoaded]
    )

    const handlePointerEnter = useCallback(() => {
      if (isHoveringRef.current) return
      isHoveringRef.current = true
      if (!isPressedRef.current) animateCurlTo(hoverPeel / 100)
    }, [hoverPeel, animateCurlTo])

    const handlePointerLeave = useCallback(() => {
      isHoveringRef.current = false
      isPressedRef.current = false
      animateCurlTo(0)
    }, [animateCurlTo])

    const handlePointerDown = useCallback(() => {
      isPressedRef.current = true
      animateCurlTo(pressPeel / 100)
    }, [pressPeel, animateCurlTo])

    const handlePointerUp = useCallback(() => {
      if (!isPressedRef.current) return
      isPressedRef.current = false
      animateCurlTo(isHoveringRef.current ? hoverPeel / 100 : 0)
    }, [hoverPeel, animateCurlTo])

    // Peel in automatically once the texture is ready — instances mount mid-hover
    // (the pointer is already inside the element) so no real pointerenter fires.
    // Skipped when an exit was already requested, otherwise a quick in-and-out
    // flick peels the sticker open right as it's being dismissed.
    useEffect(() => {
      if (!autoPeel || !textureLoaded || exitRequestedRef.current) return
      isHoveringRef.current = true
      animateCurlTo(hoverPeel / 100)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoPeel, textureLoaded])

    useEffect(() => {
      if (sceneReady && textureLoaded) onReady?.()
    }, [sceneReady, textureLoaded, onReady])

    useEffect(() => {
      curlRotationRef.current = curlRotation
    }, [curlRotation])

    useEffect(() => {
      imageLoadAbortRef.current = false
      const sceneSetup = setupScene()
      if (sceneSetup?.mesh) {
        sceneSetup.mesh.skeleton?.update()
        updateBones()
        renderFrame()
        loadTexture()
      }

      return () => {
        imageLoadAbortRef.current = true
        stopRenderLoop()
        animationControlRef.current?.stop()

        const mesh = meshRef.current
        if (mesh) {
          groupRef.current?.remove(mesh)
          sceneRef.current?.remove(mesh)
          mesh.geometry?.dispose()
          const materials = (
            Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          ) as MeshBasicMaterial[]
          materials.forEach((mat) => {
            mat.map?.dispose()
            mat.dispose()
          })
          mesh.skeleton?.bones.forEach((bone) => bone.parent?.remove(bone))
        }
        bonesRef.current = []
        bonesInitialPositionsRef.current = []
        groupRef.current = null
        meshRef.current = null
        loadedImageRef.current = null

        rendererRef.current?.dispose()
        rendererRef.current = null
        sceneRef.current?.clear()
        sceneRef.current = null
        cameraRef.current = null
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const offsetPercent = ((CANVAS_SCALE - 1) / 2) * 100

    return (
      <div
        ref={containerRef}
        onPointerEnter={interactive ? handlePointerEnter : undefined}
        onPointerLeave={interactive ? handlePointerLeave : undefined}
        onPointerDown={interactive ? handlePointerDown : undefined}
        onPointerUp={interactive ? handlePointerUp : undefined}
        className={cn('relative', className)}
        style={{
          width: size,
          height: size,
          overflow: 'visible',
        }}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: `-${offsetPercent}%`,
            left: `-${offsetPercent}%`,
            display: 'block',
            pointerEvents: 'none',
            // Gate on the texture too — the scene renders once (blank white
            // materials) before the image loads, and revealing that frame
            // shows a flash of the wrong color right as the hover starts.
            opacity: sceneReady && textureLoaded ? 1 : 0,
          }}
        />
      </div>
    )
  }
)
