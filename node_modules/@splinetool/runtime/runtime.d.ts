declare module '@splinetool/runtime' {
	export type RGB = { r: number; g: number; b: number };
	export type SplineEvent = {
		target: {
			name: string;
			id: string;
		};
	};

	export enum Easing {
		LINEAR = 0,
		EASE = 1,
		EASE_IN = 2,
		EASE_OUT = 3,
		EASE_IN_OUT = 4,
		CUBIC = 5,
		SPRING = 6,
	}

	export type SplineEventName =
		| 'mouseDown'
		| 'mouseUp'
		| 'mouseHover'
		| 'keyDown'
		| 'keyUp'
		| 'start'
		| 'lookAt'
		| 'follow'
		| 'scroll'
		| 'collision'
		| 'rendered';

	export type TransitionChainParams = {
		/**
		 * When set, the transition will start from this state. If undefined (or not set) it will start from current state in the timeline.
		 * When null it will start from the Base State / default state.
		 */
		from?: string | null;
		to: string | null;
		duration?: number;
		delay?: number;
	} & EasingData;

	export type TransitionParams = TransitionChainParams & {
		autoPlay?: boolean;
	};

	export type TransitionFactory = {
		transition: (params: TransitionChainParams) => TransitionFactory;
		/**
		 * Starts the transition.
		 */
		play: () => TransitionFactory;
		/**
		 * Pauses the transition.
		 */
		pause: () => TransitionFactory;
		/**
		 * Resets the transition.
		 */
		reset: () => TransitionFactory;
		/**
		 * Seeks the transition to a specific time.
		 * @param ms The time in milliseconds.
		 */
		seek: (ms: number) => TransitionFactory;
	};

	/**
	 * Structural stand-in for THREE.Material — pass an instance from YOUR
	 * three install (this package never re-exports three, and the copy it
	 * bundles is a different module instance from yours), or one built by
	 * `createCustomMaterial` against the runtime's bundled three.
	 */
	export interface ThreeMaterialLike {
		readonly isMaterial: true;
	}

	/**
	 * The curated namespace `createCustomMaterial` hands its factory: the runtime's
	 * BUNDLED three instance — the only one TSL node graphs can compile in.
	 * Members: `tsl` (the full three/tsl function object — Fn, uniform, vec3,
	 * texture, wgslFn, positionLocal, …), the NodeMaterial classes
	 * (NodeMaterial, MeshBasicNodeMaterial, MeshStandardNodeMaterial,
	 * MeshPhysicalNodeMaterial, MeshPhongNodeMaterial, MeshLambertNodeMaterial,
	 * MeshToonNodeMaterial, MeshMatcapNodeMaterial, MeshNormalNodeMaterial,
	 * SpriteNodeMaterial, PointsNodeMaterial, LineBasicNodeMaterial,
	 * LineDashedNodeMaterial), and core essentials (Color, Vector2/3/4,
	 * Matrix3/4, Texture, CanvasTexture, DataTexture, VideoTexture, side +
	 * blending + wrapping + filter + color-space constants).
	 *
	 * Typed opaquely to keep this file self-contained. With @types/three
	 * installed you can cast for full types — the values really do come from
	 * a separate module instance, matching this runtime's three minor (0.185):
	 * ```ts
	 * const t = three as unknown as typeof import('three/webgpu') & {
	 *   tsl: typeof import('three/tsl');
	 * };
	 * ```
	 */
	export interface SplineThreeNamespace {
		readonly tsl: Record<string, any>;
		readonly NodeMaterial: new (...args: any[]) => ThreeMaterialLike;
		readonly MeshBasicNodeMaterial: new (...args: any[]) => ThreeMaterialLike;
		readonly MeshStandardNodeMaterial: new (
			...args: any[]
		) => ThreeMaterialLike;
		readonly MeshPhysicalNodeMaterial: new (
			...args: any[]
		) => ThreeMaterialLike;
		readonly Color: new (...args: any[]) => any;
		readonly [key: string]: any;
	}

	export type SPEObject = {
		name: string;
		uuid: string;
		visible: boolean;
		intensity: number;
		position: { x: number; y: number; z: number };
		rotation: { x: number; y: number; z: number };
		scale: { x: number; y: number; z: number };
		/**
		 * For objects created with a three.js material instance
		 * (createObject's `material`), this is that instance (behind a
		 * transparent change-tracking proxy, so edits through it re-render
		 * automatically); otherwise a snapshot of the Spline layered material.
		 */
		material?: Material | ThreeMaterialLike;

		/**
		 * Sets the color of the object's material if it is a mesh and if it has a color layer.
		 * If it has no color layer, it adds one with the specified color at the top of the layer stack.
		 * If object is a light, it sets the color of the light.
		 * @param color The color in CSS format (e.g., "rgb(255, 0, 0)" or "#ff0000").
		 */
		color: string;

		/**
		 * Gets or sets the object's current state from a given state name or id. Default state value is undefined.
		 */
		state: string | number | undefined;
		/**
		 * Triggers a Spline event.
		 * Starts from firt state to last state.
		 * @param {string} eventName String that matches Spline event's name
		 * @param {string}	uuid String to match to the object's uuid
		 */
		emitEvent: (eventName: SplineEventName) => void;
		/**
		 * Triggers a Spline event in reverse order.
		 * Starts from last state to first state.
		 * @param {string} eventName String that matches Spline event's name
		 */
		emitEventReverse: (eventName: SplineEventName) => void;
		/**
		 * Hides the object.
		 * Equivalent to object.visible = false
		 */
		hide: () => void;
		/**
		 * Hides the object.
		 * Equivalent to object.visible = true
		 */
		show: () => void;

		transition: (params: TransitionParams) => TransitionFactory;
	};

	export type Vec3Like =
		| [number, number, number]
		| { x?: number; y?: number; z?: number };

	export type CreateMaterialOptions = {
		/** A css color for the material's color layer. */
		color?: string;
		roughness?: number;
		metalness?: number;
		reflectivity?: number;
		/** Opacity of the color layer (0–1). */
		alpha?: number;
	};

	export type CreateObjectOptions = {
		/** Defaults to the type's friendly name, deduped with a numeric suffix. */
		name?: string;
		/** Name or uuid of the parent object (or its SPEObject). Defaults to the active page. */
		parent?: string | SPEObject;
		/** World units. Defaults to [0, 0, 0]. */
		position?: Vec3Like;
		/**
		 * Degrees (Spline convention). Note that the returned proxy's
		 * `.rotation` is a three.js Euler in radians.
		 */
		rotation?: Vec3Like;
		/** A number applies uniformly. Defaults to [1, 1, 1]. */
		scale?: Vec3Like | number;
		visible?: boolean;
		castShadow?: boolean;
		receiveShadow?: boolean;
		/** Shorthand for material: { color } — a css color string. */
		color?: string;
		/**
		 * Either a shared material name/id from the document (the material is
		 * then genuinely shared — editing it restyles every object using it),
		 * a css color string, inline material properties, a **three.js
		 * material instance** from your own three install, or a
		 * `(three) => material` **factory** receiving the bundled namespace
		 * (the inline form of {@link Application.createCustomMaterial}, same
		 * as setMaterial accepts).
		 *
		 * Three.js material instances are supported on the `webgpu` backend
		 * only (the default wherever WebGPU is available; the call throws on
		 * the classic WebGL pipeline). Accepted: **built-in materials** from
		 * your own three install (MeshStandardMaterial, MeshPhysicalMaterial,
		 * MeshBasicMaterial, MeshNormalMaterial, … — converted by three's node
		 * library) and **TSL shader materials built with
		 * {@link Application.createCustomMaterial}**. GLSL ShaderMaterials
		 * throw, and so do TSL NodeMaterials built from your own three/webgpu
		 * import (the runtime bundles its own copy of three, and a node graph
		 * from a separate module instance cannot compile in it — build it via
		 * createCustomMaterial instead). Scene lights and shadows apply; Spline's
		 * environment IBL does not (set your own `envMap`). Property edits are
		 * live; structural changes (new maps, flag flips) need
		 * `material.needsUpdate = true`. The runtime never disposes your
		 * material — you own its lifecycle.
		 */
		material?:
			| string
			| CreateMaterialOptions
			| ThreeMaterialLike
			| ((three: SplineThreeNamespace) => ThreeMaterialLike);
	} & {
		/**
		 * Any other key is a type-specific parameter: geometry inputs for
		 * shapes (width, height, depth, cornerRadius, spikes, …), text
		 * properties for Text (text, fontSize, font, …), light properties for
		 * lights (intensity, distance, …).
		 */
		[parameter: string]: unknown;
	};

	export type CloneObjectOptions = {
		/** Defaults to '<source name> Copy', deduped with a numeric suffix. */
		name?: string;
		/** Name or uuid of the new parent (or its SPEObject). Defaults to the source's parent. */
		parent?: string | SPEObject;
		/** World units. */
		position?: Vec3Like;
		/** Degrees (Spline convention). */
		rotation?: Vec3Like;
		/** A number applies uniformly. */
		scale?: Vec3Like | number;
		visible?: boolean;
	};

	export class Application {
		_controls: any;
		renderOnDemand: boolean;

		canvas: HTMLCanvasElement;
		constructor(
			canvas: HTMLCanvasElement,
			{
				renderOnDemand,
			}?: {
				/**
				 * @deprecated use options.renderMode instead
				 */
				renderOnDemand?: boolean;

				/**
				 * Can either be:
				 * - `auto` runtime tries to only render when necessary (default).
				 * - `manual` only renders when spline.requestRender() is called.
				 * - `continuous` continuously render, once per frame.
				 */
				renderMode?: 'auto' | 'manual' | 'continuous';

				/**
				 * Path to the various WASM files used by the runtime.
				 * If not set the runtime will load the WASM files from the CDN.
				 */
				wasmPath?: string;

				/**
				 * Rendering backend. When not set, the runtime auto-selects:
				 * `webgpu` (the node-material pipeline on three's
				 * WebGPURenderer, loaded as a separate chunk, with the
				 * render-bundle scene pass on) wherever the browser grants a
				 * WebGPU adapter, `webgl` everywhere else — and any WebGPU init
				 * failure still falls back to `webgl`. Pass `webgl` to force
				 * the classic pipeline, or `webgpu` to force the node pipeline.
				 * When the option is not set, the `?renderer=webgpu|webgl2|webgl`
				 * URL param overrides the auto-selection (diagnostics); an
				 * explicit option always wins over the URL. The server-side CJS
				 * build compiles the WebGPU branch out and always uses `webgl`;
				 * the single-file standalones ship per export setting —
				 * `runtime.standalone.js` carries both pipelines,
				 * `runtime.standalone.webgpu.js` / `.webgl.js` carry one and
				 * show a clear notice when asked for the other. All Spline
				 * instances on a page must use the same backend.
				 */
				renderer?: 'webgl' | 'webgpu';

				/**
				 * How the scene's HTML content (authored in the editor's HTML
				 * frame, shipped inside the .splinecode) is presented over
				 * the canvas.
				 * - `sandbox` (default): a sandboxed iframe with an opaque
				 *   origin — the content's scripts cannot touch the host
				 *   page. The safe default for pages that embed scenes they
				 *   didn't author.
				 * - `inline`: the content is grafted into the host document
				 *   and its scripts run as ordinary page scripts with
				 *   `window.spline` bound directly to this Application — no
				 *   postMessage frame of latency. Only for pages whose
				 *   author IS the scene author (Spline's own exports pass
				 *   this).
				 * - `none`: don't present the HTML content at all.
				 */
				htmlContentMode?: 'sandbox' | 'inline' | 'none';
			}
		);
		/**
		 * Loads an exported Spline scene
		 *
		 * If the scene carries HTML content (authored in the editor's HTML
		 * frame), the runtime automatically layers it over the canvas in a
		 * sandboxed iframe wired to this Application through the injected
		 * `spline` bridge — the same HTML + 3D composition as the editor
		 * preview. It is removed on dispose().
		 * @param path the url pointing toward a .splinecode file
		 * @param variables a key:value object describing initial values of the variables in the file
		 */
		load(
			path: string,
			variables?: Record<string, string | number | boolean>,
			fetchOptions?: RequestInit
		): Promise<void>;
		/**
		 * Initializes the application starting from a binary encoded .splinecode file
		 * @param array the binary ArrayBuffer of the .splinecode
		 */
		start(
			array: ArrayBuffer,
			{
				interactive = true,
				variables,
			}?: {
				interactive?: boolean;
				variables?: Record<string, string | number | boolean>;
			}
		): void;
		/**
		 *  Searches through scene's children and returns the object with that uuid
		 * @param uuid	String to match to the object's uuid
		 * @returns SPEObject
		 */
		findObjectById(uuid: string): SPEObject | undefined;
		/**
		 * Searches through scene's children and returns the first object with that name
		 * @param  {string}	name
		 * @returns {Object} SPEObject
		 */
		findObjectByName(name: string): SPEObject | undefined;
		/**
		 * A flat list of all scene objects
		 * @returns {Array.<SPEObject>}
		 */
		getAllObjects(): SPEObject[];
		/**
		 * Returns an array of Spline events
		 * @returns {Array.<Object>}
		 */
		getSplineEvents(): {
			[key: string]: {
				[key: string]: CustomEvent<any>;
			};
		};
		/**
		 * Triggers a Spline event associated to an object with provided name or uuid.
		 * Starts from first state to last state.
		 * @param {string} eventName String that matches Spline event's name
		 * @param {string} nameOrUuid The name or uuid of the object
		 */
		emitEvent(eventName: SplineEventName, nameOrUuid: string): void;
		/**
		 * Triggers a Spline event associated to an object with provided name or uuid in reverse order.
		 * Starts from last state to first state.
		 * @param {string} eventName String that matches Spline event's name
		 * @param {string}	nameOrUuid The name or uuid of the object
		 */
		emitEventReverse(eventName: SplineEventName, nameOrUuid: string): void;
		/**
		 * Add an event listener for Spline events
		 * @param {string} eventName String that matches Spline event's name
		 * @param {function} cb	A callback function with Spline event as parameter
		 */
		addEventListener(
			eventName: SplineEventName,
			cb: (e: SplineEvent) => void
		): void;
		/**
		 * Removes the event listener for a Spline event with the same name and callback
		 * @param {string} eventName String that matches Spline event's name
		 * @param {function} cb	A callback function with Spline event as parameter
		 */
		removeEventListener(
			eventName: SplineEventName,
			cb: (e: SplineEvent) => void
		): void;
		/**
		 * Deactivates runtime
		 */
		dispose(): void;

		setZoom(zoomValue: number): void;

		/**
		 * Manually sets the scene/canvas background color with a css color value.
		 * @param color css color style
		 */
		setBackgroundColor(color: string): void;

		/**
		 * Change the event type to global when passing true and local when passing false
		 * @param global
		 */
		setGlobalEvents(global: boolean): void;

		/**
		 * Manually sets the canvas size to a specific value.
		 * When this is called, the canvas will no longer be
		 * automatically resized on window resize for full-screen mode.
		 * @param {number} width
		 * @param {number} height
		 */
		setSize(width: number, height: number): void;

		get data(): any;
		get eventManager(): any;
		get controls(): any;

		/**
		 * Returns true if spline.stop() was previously called
		 */
		get isStopped(): boolean;

		/**
		 * Stop/Pause all rendering controls and events
		 */
		stop(): void;

		/**
		 * Play/Resume rendering, controls and events
		 */
		play(): void;

		/**
		 * To be used concurrently with spline.renderMode = 'manual
		 * When called this function will flag the render to dirty which means that
		 * the scene will be rendered on next animation frame. Calling this more than once per frame will not trigger multiple render.
		 */
		requestRender(): void;

		/**
		 * Change value for multiple variables
		 * @param variables a key:value object describing values by name of the variables to update
		 */
		setVariables(variables: Record<string, number | boolean | string>): void;

		/**
		 * Change value for a specific variable
		 * @param name name of the variable to update
		 * @param value new value for this variable
		 */
		setVariable(name: string, value: number | boolean | string): void;

		/**
		 * Returns a record mapping variable names to their respective current values.
		 */
		getVariables(): Record<string, number | boolean | string>;

		/**
		 * Get current value for a specific variable from its name
		 * @param name name of the variable
		 */
		getVariable(name: string): number | boolean | string;

		/**
		 * Overrides the location of the wasm file for the UI library.
		 * @param url
		 */
		setUIWasmUrl(url: string): void;

		pauseGameControls(): void {}
		resumeGameControls(): void {}

		/**
		 * Swaps the geometry of an object with a new one from a URL
		 * @param objectNameOrId The name or uuid of the object to swap geometry
		 * @param url The URL of the new geometry (.splinegeometry file)
		 */
		swapGeometry(
			objectNameOrId: string,
			urlOrBuffer: string | Uint8Array
		): void {}

		/**
		 * Creates a new object in the loaded scene and returns its SPEObject
		 * proxy. The object lives only in this runtime session — it is never
		 * persisted back to the Spline file.
		 *
		 * ```js
		 * const cube = await spline.createObject('Cube', {
		 *   position: [0, 100, 0],
		 *   width: 150,
		 *   material: { color: '#ff3b30', roughness: 0.4 },
		 * });
		 * ```
		 * @param type A shape name ('Cube', 'Sphere', 'Torus', …, 'Text' — the
		 * 'Geometry' suffix is optional), 'CustomMesh' (raw vertex geometry —
		 * pass `vertices` as a flat [x,y,z, …] number[] or Float32Array, plus
		 * optional `indices`/`normals`/`uvs`; winding slips are safety-netted:
		 * inverted closed solids are flipped, open surfaces render
		 * double-sided), 'Group', or a light type ('PointLight', 'SpotLight',
		 * 'DirectionalLight').
		 * @param options Placement, material, and type-specific parameters.
		 */
		createObject(
			type: string,
			options?: CreateObjectOptions
		): Promise<SPEObject>;

		/**
		 * Builds a custom three.js material — including TSL shader materials —
		 * against the runtime's BUNDLED three instance (the only one TSL node
		 * graphs can compile in; materials built from your own three/webgpu
		 * import cannot work — see {@link SplineThreeNamespace}).
		 *
		 * ```js
		 * const glow = await spline.createCustomMaterial((three) => {
		 *   const m = new three.MeshStandardNodeMaterial();
		 *   m.colorNode = three.tsl.vec3(1, 0, 1);
		 *   return m;
		 * });
		 * await spline.createObject('Sphere', { material: glow });
		 * ```
		 *
		 * The returned material is a plain reusable instance: share it across
		 * any number of createObject calls, tweak its properties/uniforms live,
		 * and dispose it yourself (the runtime never disposes it). WebGPU
		 * backend only — throws on the classic WebGL pipeline.
		 */
		createCustomMaterial(
			factory: (three: SplineThreeNamespace) => ThreeMaterialLike
		): Promise<ThreeMaterialLike>;

		/**
		 * Replaces an EXISTING mesh's material with a custom three.js
		 * material — a built-in instance from your own three install, a
		 * material from {@link Application.createCustomMaterial}, or a
		 * factory receiving the bundled namespace. WebGPU backend only.
		 *
		 * The replacement is pinned (document-driven material updates no
		 * longer touch the mesh) and consumer-owned (never disposed by the
		 * runtime; no unset). Runtime-only, never persisted. Resolves to the
		 * applied material.
		 */
		setMaterial(
			target: string | SPEObject,
			materialOrFactory:
				| ThreeMaterialLike
				| ((three: SplineThreeNamespace) => ThreeMaterialLike)
		): Promise<ThreeMaterialLike>;

		/**
		 * Deep-clones an existing object (any type, including its subtree)
		 * with fresh ids and returns the clone's SPEObject proxy. This also
		 * covers types createObject can't build (imported models, vectors,
		 * booleans, …). By default the clone lands next to its source under
		 * the same parent, named '<source> Copy'.
		 * @param source The name or uuid of the object to clone, or its SPEObject.
		 * @param options Placement overrides and name.
		 */
		cloneObject(
			source: string | SPEObject,
			options?: CloneObjectOptions
		): SPEObject;

		/**
		 * Removes an object (and its whole subtree) from the scene.
		 * @param target The name or uuid of the object, or its SPEObject.
		 * @returns true when an object was removed, false when none matched.
		 */
		removeObject(target: string | SPEObject): boolean;
	}

	/* ================== MATERIALS ================== */
	/* ============================================== */

	/* ---------- COLOR LAYER ---------- */
	export type ColorLayer = {
		readonly type: 'color';
		alpha: number;
		color: string;
	};

	/* ---------- VERTEX COLOR LAYER ---------- */
	export type VertexColorLayer = {
		readonly type: 'vertexColor';
		alpha: number;
	};

	/* ---------- CAVITY LAYER ---------- */
export type CavityLayer = {
	readonly type: 'cavity';
	alpha: number;
	ridge: number;
	valley: number;
};

/* ---------- FRESNEL LAYER ---------- */
	export type FresnelLayer = {
		readonly type: 'fresnel';
		alpha: number;
		color: string;
		bias: number;
		intensity: number;
		factor: number;
	};

	/* ---------- DUST LAYER ---------- */
	export type DustLayer = {
		readonly type: 'dust';
		alpha: number;
		color: string;
		coverage: number;
		softness: number;
		noiseStrength: number;
		noiseScale: number;
	};

	/* ---------- RAINBOW LAYER ---------- */
	export type RainbowLayer = {
		readonly type: 'rainbow';
		alpha: number;
		filmThickness: number;
		movement: number;
		wavelengths: [number, number, number];
		noiseStrength: number;
		noiseScale: number;
		offset: [number, number, number];
	};

	/* ---------- NORMAL LAYER ---------- */
	export type NormalLayer = {
		readonly type: 'normal';
		alpha: number;
		cnormal: [number, number, number];
	};

	/* ---------- GRADIENT LAYER ---------- */
	export enum GradientType {
		Linear,
		Radial,
		Polar,
	}

	export type GradientLayer = {
		readonly type: 'gradient';
		alpha: number;
		gradientType: GradientType;
		smooth: boolean;
		colors: string[];
		steps: number[];
		angle: number;
		offset: [number, number];
		morph: [number, number];
	};

	/* ---------- DEPTH LAYER ---------- */
	export type DepthLayer = {
		readonly type: 'depth';
		alpha: number;
		gradientType: GradientType;
		smooth: boolean;
		isVector: boolean;
		isWorldSpace: boolean;
		origin: [number, number, number];
		direction: [number, number, number];
		colors: string[];
		steps: number[];
		near: number;
		far: number;
	};

	/* ---------- TEXTURE LAYER ---------- */
	export enum Wrapping {
		RepeatWrapping = 1000,
		ClampToEdgeWrapping = 1001,
		MirroredRepeatWrapping = 1002,
	}

	export enum TextureFilter {
		NearestFilter = 1003,
		LinearFilter = 1006,
		LinearMipmapLinearFilter = 1008,
	}

	export enum ProjectionType {
		UV,
		Planar,
		Spherical,
		Cylindrical,
		Triplanar,
	}

	export enum Axis {
		x = 'x',
		y = 'y',
		z = 'z',
	}

	export enum Side {
		Front,
		Back,
		Double,
	}

	export type Image = {
		data: string | Uint8Array;
		readonly name: string;
	};

	export type Texture = {
		image: Image;
		wrapping: Wrapping;
		repeat: [number, number];
		offset: [number, number];
		rotation?: number;
		minFilter: TextureFilter;
		magFilter: TextureFilter;
	};

	export type TextureLayer = {
		readonly type: 'texture';
		alpha: number;
		projection: ProjectionType;
		size: [number, number];
		blending: number;
		axis: Axis;
		side: Side;
		crop: boolean;
		texture: Texture;
		updateTexture(src: string | Uint8Array): Promise<void>;
	};

	/* ---------- VIDEO LAYER ---------- */
	export type Video = {
		readonly type: 'video';
		data: string | Uint8Array;
		thumb: string | Uint8Array;
		name: string;
	};

	export type VideoTexture = Omit<Texture, 'image'> & {
		video: Video;
	};

	export type VideoLayer = {
		readonly type: 'video';
		alpha: number;
		projection: ProjectionType;
		size: [number, number];
		blending: number;
		axis: Axis;
		side: Side;
		crop: boolean;
		texture: Texture;
		updateTexture(src: string | Uint8Array): Promise<void>;
	};

	/* ---------- NOISE LAYER ---------- */
	export enum NoiseType {
		Simplex,
		SimplexFractal,
		Ashima,
		Fbm,
		Perlin,
		Voronoi,
	}

	export enum VoronoiStyle {
		F1,
		F2,
		F2MinusF1,
		SmoothBlend,
		Edge,
		Power,
		Lines,
		Cells,
	}

	export type NoiseLayer = {
		readonly type: 'noise';
		alpha: number;
		noiseType: NoiseType;
		scale: number;
		size: [number, number, number];
		move: number;
		colorA: string;
		colorB: string;
		colorC: string;
		colorD: string;
		distortion: [number, number];
		fA: [number, number];
		fB: [number, number];
		voronoiStyle: VoronoiStyle;
		highCut: number;
		lowCut: number;
		smoothness: number;
		seed: number;
		quality: number;
	};

	/* ---------- TOON LAYER ---------- */
	export enum ToonType {
		Lights,
		Static,
		Camera,
	}

	export type ToonLayer = {
		readonly type: 'toon';
		alpha: number;
		positioning: ToonType;
		colors: string[];
		steps: number[];
		source: [number, number, number];
		isWorldSpace: boolean;
		noiseStrength: number;
		noiseScale: number;
		shadowColor: string;
		offset: [number, number, number];
	};

	/* ---------- OUTLINE LAYER ---------- */
	export type OutlineLayer = {
		readonly type: 'outline';
		alpha: number;
		outlineColor: string;
		contourColor: string;
		outlineWidth: number;
		contourWidth: number;
		outlineThreshold: number;
		contourThreshold: number;
		outlineSmoothing: number;
		contourFrequency: number;
		contourDirection: [number, number, number];
		positionalLines: boolean;
		compensation: boolean;
	};

	/* ---------- TRANSMISSION LAYER ---------- */
	export type TransmissionLayer = {
		readonly type: 'transmission';
		alpha: number;
		thickness: number;
		ior: number;
		roughness: number;
	};

	/* ---------- MATCAP LAYER ---------- */
	export type MatcapLayer = {
		readonly type: 'matcap';
		texture: Texture;
		updateTexture(src: string | Uint8Array): Promise<void>;
	};

	/* ---------- PATTERN LAYER ---------- */
	export enum PatternStyle {
		Circle,
		Ring,
		Polygon,
		Cross,
		Diamond,
		Checkerboard,
		Line,
		Wave,
	}

	export type PatternLayer = {
		readonly type: 'transmission';
		alpha: number;
		style: PatternStyle;
		projection: ProjectionType;
		axis: Axis;
		blending: number;
		offset: [number, number];
		colorA: string;
		colorB: string;
		frequency: [number, number];
		size: number;
		variation: number;
		smoothness: number;
		zigzag: number;
		rotation: number;
		vertical: [number, number];
		horizontal: [number, number];
		sides: number;
	};

	/* ---------- DISPLACE LAYER ---------- */
	export type AbstractDisplaceLayer<T extends string> =
		AbstractVertexLayer<'displace'> & {
			readonly displacementType: T;
		};

	export type MapDisplaceLayer = {
		readonly type: 'displace';
		readonly displacementType: 'map';
		intensity: number;
		crop: boolean;
	};
	export type NoiseDisplaceLayer = {
		readonly type: 'displace';
		readonly displacementType: 'noise';
		intensity: number;
		noiseType: NoiseType;
		scale: number;
		movement: number;
		offset: [number, number, number];
		voronoiStyle: VoronoiStyle;
		smoothness: number;
		seed: number;
		highCut: number;
		lowCut: number;
		quality: number;
	};
	export type DisplaceLayer = MapDisplaceLayer | NoiseDisplaceLayer;

	/* ---------- LIGHT LAYERS ---------- */
	export type BasicLightLayer = {
		readonly type: 'light';
		readonly category: 'basic';
		bumpMapIntensity: number;
	};
	export type PhongLightLayer = {
		readonly type: 'light';
		readonly category: 'phong';
		specular: Sharable<RGB>;
		shininess: number;
		bumpMapIntensity: number;
	};

	export type ToonLightLayer = {
		readonly type: 'light';
		readonly category: 'toon';
		specular: Sharable<RGB>;
		shininess: number;
		bumpMapIntensity: number;
	};
	export type LambertLightLayer = {
		readonly type: 'light';
		readonly category: 'lambert';
		emissive: Sharable<RGB>;
		bumpMapIntensity: number;
	};
	export type StandardLightLayer = {
		readonly type: 'light';
		readonly category: 'physical';
		roughness: number;
		metalness: number;
		reflectivity: number;
		bumpMapIntensity: number;
	};

	/* ------------------------------------ */

	export type Layer =
		| ColorLayer
		| VertexColorLayer
		| FresnelLayer
		| DustLayer
		| RainbowLayer
		| NormalLayer
		| GradientLayer
		| DepthLayer
		| TextureLayer
		| VideoLayer
		| NoiseLayer
		| ToonLayer
		| OutlineLayer
		| TransmissionLayer
		| MatcapLayer
		| PatternLayer
		| DisplaceLayer
		| BasicLightLayer
		| PhongLightLayer
		| LambertLightLayer
		| StandardLightLayer
		| ToonLightLayer
		| StandardLightLayer;

	export type Material = {
		layers: Layer[];
		alpha: number;
	};
}
