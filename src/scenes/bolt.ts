/**
 * The hero's part: a hex bolt with a washer under its head and a nut on the
 * thread. Scrolling the page screws the nut up the thread toward the washer;
 * on desktop the part leans a little toward the pointer. It renders only when
 * something changed, and only while visible — core/fx.tsx starts and stops it.
 * three.js lives in this lazy chunk alone.
 */
import {
  CylinderGeometry,
  Curve,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Path,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Shape,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { SceneFactory } from '@/core';

const STEEL = { bolt: '#B9C1C9', nut: '#9DA6AF', washer: '#CDD3D8' };

// The bolt stands on the Y axis: head on top, thread below.
const SHANK_RADIUS = 0.46;
const SHANK_TOP = 1.95;
const SHANK_BOTTOM = -2.2;
const THREAD_TOP = 1.05;
const PITCH = 0.3;
const NUT_HEIGHT = 0.55;
const NUT_FROM = SHANK_BOTTOM + NUT_HEIGHT / 2 + 0.05;
const NUT_TO = THREAD_TOP + 0.2;

/** A helix around the shank: the thread's crest. */
class Helix extends Curve<Vector3> {
  constructor(
    private readonly radius: number,
    private readonly from: number,
    private readonly to: number,
    private readonly pitch: number,
  ) {
    super();
  }

  getPoint(t: number, target = new Vector3()): Vector3 {
    const y = this.from + (this.to - this.from) * t;
    const angle = ((y - this.from) / this.pitch) * Math.PI * 2;
    return target.set(Math.cos(angle) * this.radius, y, Math.sin(angle) * this.radius);
  }
}

/** A hexagonal prism with a round hole, standing on the Y axis. */
function hexWithHole(radius: number, hole: number, height: number): ExtrudeGeometry {
  const shape = new Shape();
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const bore = new Path();
  bore.absarc(0, 0, hole, 0, Math.PI * 2, true);
  shape.holes.push(bore);
  const geometry = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 2, curveSegments: 32 });
  geometry.translate(0, 0, -height / 2);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

/** A flat ring standing on the Y axis. */
function ring(outer: number, inner: number, height: number): ExtrudeGeometry {
  const shape = new Shape();
  shape.absarc(0, 0, outer, 0, Math.PI * 2, false);
  const hole = new Path();
  hole.absarc(0, 0, inner, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geometry = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 48 });
  geometry.translate(0, 0, -height / 2);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const createBolt: SceneFactory = (canvas, { dpr, tier, pointer, fail }) => {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: tier !== 'low', powerPreference: 'low-power' });
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  // Steel needs something to reflect: a neutral studio, prefiltered once.
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04).texture;
  scene.environment = environment;

  const camera = new PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 0.2, 11.5);
  camera.lookAt(0, 0, 0);

  const key = new DirectionalLight(0xffffff, 1.2);
  key.position.set(4, 6, 5);
  scene.add(key);

  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const track = <G extends BufferGeometry>(g: G) => (geometries.push(g), g);
  const steel = (color: string, roughness: number) => {
    const m = new MeshStandardMaterial({ color, metalness: 0.92, roughness });
    materials.push(m);
    return m;
  };

  const part = new Group();
  scene.add(part);

  const head = new Mesh(track(new CylinderGeometry(1.0, 1.0, 0.62, 6)), steel(STEEL.bolt, 0.3));
  head.position.y = SHANK_TOP + 0.31;
  part.add(head);

  const shank = new Mesh(track(new CylinderGeometry(SHANK_RADIUS, SHANK_RADIUS, SHANK_TOP - SHANK_BOTTOM, 48)), steel(STEEL.bolt, 0.34));
  shank.position.y = (SHANK_TOP + SHANK_BOTTOM) / 2;
  part.add(shank);

  const turns = (THREAD_TOP - SHANK_BOTTOM) / PITCH;
  const thread = new Mesh(
    track(new TubeGeometry(new Helix(SHANK_RADIUS, SHANK_BOTTOM + 0.04, THREAD_TOP, PITCH), Math.round(turns * 18), 0.052, 6, false)),
    steel(STEEL.bolt, 0.3),
  );
  part.add(thread);

  const washer = new Mesh(track(ring(0.92, SHANK_RADIUS + 0.03, 0.1)), steel(STEEL.washer, 0.42));
  washer.position.y = SHANK_TOP - 0.06;
  part.add(washer);

  const nut = new Mesh(track(hexWithHole(0.82, SHANK_RADIUS + 0.04, NUT_HEIGHT)), steel(STEEL.nut, 0.26));
  part.add(nut);

  part.rotation.set(0.32, 0.5, -0.62);

  // Scroll screws the nut; the pointer leans the part (eased).
  let progress = -1;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let dirty = true;

  const placeNut = (p: number) => {
    const y = NUT_FROM + (NUT_TO - NUT_FROM) * p;
    nut.position.y = y;
    nut.rotation.y = -((y - NUT_FROM) / PITCH) * Math.PI * 2;
  };

  const readScroll = () => {
    const rect = canvas.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const next = clamp01(window.scrollY / Math.max(1, top + rect.height * 0.9));
    if (Math.abs(next - progress) > 0.0005) {
      progress = next;
      placeNut(progress);
      dirty = true;
    }
  };
  const onScroll = () => readScroll();
  const onPointer = (event: PointerEvent) => {
    target.x = (event.clientX / window.innerWidth) * 2 - 1;
    target.y = (event.clientY / window.innerHeight) * 2 - 1;
  };

  let raf = 0;
  let running = false;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      current.x += dx * 0.1;
      current.y += dy * 0.1;
      part.rotation.y = 0.5 + current.x * 0.18;
      part.rotation.x = 0.32 + current.y * 0.08;
      dirty = true;
    }
    if (!dirty) return;
    renderer.render(scene, camera);
    dirty = false;
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(raf);
    fail();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  readScroll();

  return {
    start() {
      if (running) return;
      running = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      if (pointer === 'fine') window.addEventListener('pointermove', onPointer, { passive: true });
      readScroll();
      dirty = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
    },
    resize(width, height, nextDpr) {
      renderer.setPixelRatio(nextDpr);
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = Math.max(1, width) / Math.max(1, height);
      camera.updateProjectionMatrix();
      dirty = true;
      renderer.render(scene, camera);
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onLost);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      environment.dispose();
      room.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
};

export default createBolt;
