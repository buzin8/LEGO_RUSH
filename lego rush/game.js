/**
 * 3D Subway Surfers Runner Engine
 * Features:
 * - Authentic 3D Jake character with Royal Blue cap turned sideways (facing right) & brown hair
 * - Particle trails removed from Jake's back as requested
 * - Subway trains with illuminated side passenger windows, windshields, headlights & tail lights
 * - 3-lane subway track system with responsive jumping and lane-shifting physics
 * - Dynamic sky-blue horizon with atmospheric fog & procedural drifting clouds
 */

(function () {
  if (!window.THREE) {
    const title = document.getElementById('overlay-title');
    const copy = document.getElementById('overlay-copy');
    const button = document.getElementById('btn-start');
    if (title) title.textContent = 'Could not load the 3D game';
    if (copy) copy.textContent = 'Three.js did not load. Check your internet connection, then reload this page.';
    if (button) button.style.display = 'none';
    return;
  }
  const container = document.getElementById('game-canvas-container') || document.body;
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Scene setup
  const scene = new THREE.Scene();
  const skyBlue = 0x38bdf8;
  const horizonBlue = 0x7dd3fc;
  scene.background = null;
  const horizonFog = 0x8ec8f6;
  scene.fog = new THREE.Fog(horizonFog, 90, 240);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
  camera.position.set(0, 3.8, 6.8);
  camera.lookAt(0, 1.3, -8);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffaed, 1.6);
  sunLight.position.set(15, 30, 15);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  scene.add(sunLight);

  const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.7);
  scene.add(hemiLight);

  // Clouds
  const cloudsGroup = new THREE.Group();
  const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  for (let i = 0; i < 24; i++) {
    const cloud = new THREE.Group();
    const numPuffs = 3 + Math.floor(Math.random() * 3);
    for (let p = 0; p < numPuffs; p++) {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(2 + Math.random() * 2, 8, 8),
        cloudMat
      );
      puff.position.set(p * 2.2 - 2, Math.random() * 0.8, (Math.random() - 0.5) * 2);
      cloud.add(puff);
    }
    cloud.position.set(
      (Math.random() - 0.5) * 80,
      18 + Math.random() * 14,
      -20 - Math.random() * 120
    );
    cloudsGroup.add(cloud);
  }
  scene.add(cloudsGroup);

  // World & Track Group
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // Ballast Ground
  const groundGeo = new THREE.PlaneGeometry(35, 240);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x1e2433 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -60;
  ground.receiveShadow = true;
  worldGroup.add(ground);

  // 3 Subway Track Lanes
  const trackSleepers = [];
  const trackXPositions = [-2.6, 0, 2.6];
  const railMat = new THREE.MeshPhongMaterial({ color: 0x94a3b8, shininess: 90 });
  const sleeperMat = new THREE.MeshLambertMaterial({ color: 0x3d2b1f });

  trackXPositions.forEach((laneX) => {
    // Steel Rails
    [-0.6, 0.6].forEach((railOffset) => {
      const railGeo = new THREE.BoxGeometry(0.12, 0.15, 240);
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(laneX + railOffset, 0.1, -60);
      worldGroup.add(rail);
    });

    // Wooden Sleepers
    for (let z = 10; z > -190; z -= 1.8) {
      const sleeperGeo = new THREE.BoxGeometry(1.65, 0.1, 0.45);
      const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper.position.set(laneX, 0.04, z);
      worldGroup.add(sleeper);
      trackSleepers.push(sleeper);
    }
  });

  // Traditional Japanese Castle & Townhouse Environment (matching reference photo)
  // Replaces modern buildings and Japanese signboards with authentic feudal Japanese castle architecture,
  // traditional Machiya townhouses with glowing shoji & lanterns, stone ramparts, bamboo groves, and Tokyo Tower.
  const castlePlasterMat = new THREE.MeshLambertMaterial({ color: 0xf3f1e8 });
  const castleGreenRoofMat = new THREE.MeshLambertMaterial({ color: 0x1d5546 });
  const castleGreenRoofDarkMat = new THREE.MeshLambertMaterial({ color: 0x154034 });
  const castleRidgeMat = new THREE.MeshLambertMaterial({ color: 0xf5f3ea });
  const castleGoldMat = new THREE.MeshLambertMaterial({ color: 0xdfad36 });
  const stoneRampartMat = new THREE.MeshLambertMaterial({ color: 0x5a685e });
  const stoneAccentMat = new THREE.MeshLambertMaterial({ color: 0x445148 });
  const stonePromenadeMat = new THREE.MeshLambertMaterial({ color: 0x526057 });
  const timberDarkMat = new THREE.MeshLambertMaterial({ color: 0x2e1f14 });
  const timberWarmMat = new THREE.MeshLambertMaterial({ color: 0x483422 });
  const roofCharcoalMat = new THREE.MeshLambertMaterial({ color: 0x293338 });
  const shojiGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff6dd });
  const lanternRedMat = new THREE.MeshBasicMaterial({ color: 0xd32f2f });
  const lanternGoldMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const bambooStalkMat = new THREE.MeshLambertMaterial({ color: 0x65432f });
  const bambooJointMat = new THREE.MeshLambertMaterial({ color: 0x483422 });
  const bambooLeafMat = new THREE.MeshLambertMaterial({ color: 0x54912d });
  const pineNeedleMat = new THREE.MeshLambertMaterial({ color: 0x2b5b30 });
  const pineTrunkMat = new THREE.MeshLambertMaterial({ color: 0x543b25 });
  const blossomPinkMat = new THREE.MeshLambertMaterial({ color: 0xf49ac2 });
  const blossomLightMat = new THREE.MeshLambertMaterial({ color: 0xffc5dc });
  const blossomTrunkMat = new THREE.MeshLambertMaterial({ color: 0x65432f });
  const blossomCanopyGeo = new THREE.SphereGeometry(1, 8, 6);
  const waterMat = new THREE.MeshPhongMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.18,
    specular: 0xffffff,
    shininess: 90,
    transparent: true,
    opacity: 0.88
  });

  function createJapaneseRoofMesh(width, depth, height, roofMat, ridgeMat, hasGold) {
    const roofGroup = new THREE.Group();
    const eaveGeo = new THREE.BoxGeometry(width + 0.9, 0.28, depth + 0.9);
    const eave = new THREE.Mesh(eaveGeo, roofMat);
    eave.position.y = 0.14;
    roofGroup.add(eave);

    const mid1Geo = new THREE.BoxGeometry(width + 0.3, height * 0.42, depth + 0.3);
    const mid1 = new THREE.Mesh(mid1Geo, roofMat);
    mid1.position.y = 0.28 + height * 0.21;
    roofGroup.add(mid1);

    const mid2Geo = new THREE.BoxGeometry(width * 0.76, height * 0.52, depth * 0.76);
    const mid2 = new THREE.Mesh(mid2Geo, roofMat);
    mid2.position.y = 0.28 + height * 0.42 + height * 0.26;
    roofGroup.add(mid2);

    const ridgeGeo = new THREE.BoxGeometry(width * 0.82, 0.22, 0.4);
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat || castleRidgeMat);
    const peakY = 0.28 + height * 0.42 + height * 0.52 + 0.11;
    ridge.position.y = peakY;
    roofGroup.add(ridge);

    [-width * 0.41, width * 0.41].forEach((rx) => {
      const tipGeo = new THREE.BoxGeometry(0.35, 0.35, 0.42);
      const tip = new THREE.Mesh(tipGeo, hasGold ? castleGoldMat : (ridgeMat || castleRidgeMat));
      tip.position.set(rx, peakY + 0.12, 0);
      roofGroup.add(tip);
    });

    return roofGroup;
  }

  function addBambooGrove(group, baseX, baseZ, count) {
    for (let i = 0; i < count; i++) {
      const bx = baseX + (Math.sin(i * 2.3) * 1.3) + ((i % 3) * 0.5 - 0.5);
      const bz = baseZ + (Math.cos(i * 1.9) * 1.6) + ((i % 2) * 0.6 - 0.3);
      const h = 5.2 + (i % 5) * 0.8;
      
      const stalk = new THREE.Mesh(new THREE.BoxGeometry(0.18, h, 0.18), bambooStalkMat);
      stalk.position.set(bx, h / 2, bz);
      group.add(stalk);

      for (let jy = 1.2; jy < h - 0.6; jy += 1.3) {
        const joint = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.24), bambooJointMat);
        joint.position.set(bx, jy, bz);
        group.add(joint);
      }

      const leaf1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.1), bambooLeafMat);
      leaf1.position.set(bx, h + 0.3, bz);
      group.add(leaf1);
      const leaf2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.7), bambooLeafMat);
      leaf2.position.set(bx + 0.3, h + 0.8, bz - 0.2);
      group.add(leaf2);
    }
  }

  function addPineTree(group, x, y, z, scale) {
    const s = scale || 1.0;
    const pine = new THREE.Group();
    pine.position.set(x, y, z);

    const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.45 * s, 2.2 * s, 0.45 * s), pineTrunkMat);
    t1.position.set(0, 1.1 * s, 0);
    pine.add(t1);

    const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.38 * s, 1.8 * s, 0.38 * s), pineTrunkMat);
    t2.position.set(0.25 * s, 2.6 * s, 0);
    t2.rotation.z = -0.18;
    pine.add(t2);

    const pads = [
      [0.6 * s, 2.4 * s, 0, 1.8 * s, 1.4 * s],
      [-0.5 * s, 3.1 * s, 0.2 * s, 2.0 * s, 1.6 * s],
      [0.3 * s, 3.8 * s, -0.2 * s, 2.3 * s, 1.9 * s],
      [0, 4.5 * s, 0, 1.6 * s, 1.4 * s]
    ];
    pads.forEach(([px, py, pz, pw, pd]) => {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(pw, 0.35 * s, pd), pineNeedleMat);
      pad.position.set(px, py, pz);
      pine.add(pad);
    });

    group.add(pine);
  }

  function addCherryBlossomTree(group, x, y, z, scale) {
    const s = scale || 1;
    const tree = new THREE.Group();
    tree.position.set(x, y, z);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * s, 0.24 * s, 3.1 * s, 6), blossomTrunkMat);
    trunk.position.y = 1.55 * s;
    tree.add(trunk);
    [
      [-0.75, 3.25, 0, 1.15, blossomPinkMat],
      [0.2, 3.65, 0.15, 1.3, blossomLightMat],
      [0.95, 3.15, -0.05, 1.05, blossomPinkMat],
      [-0.15, 4.35, -0.1, 0.95, blossomLightMat],
      [0.75, 4.05, 0.3, 0.85, blossomPinkMat]
    ].forEach(([cx, cy, cz, size, material]) => {
      const bloom = new THREE.Mesh(blossomCanopyGeo, material);
      bloom.position.set(cx * s, cy * s, cz * s);
      bloom.scale.set(size * s, size * 0.68 * s, size * 0.85 * s);
      tree.add(bloom);
    });
    group.add(tree);
  }

  function addStoneLantern(group, x, y, z) {
    const toro = new THREE.Group();
    toro.position.set(x, y, z);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.18, 0.65), stoneAccentMat);
    base.position.y = 0.09; toro.add(base);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.8, 0.28), stoneRampartMat);
    post.position.y = 0.58; toro.add(post);
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.42, 0.45), lanternGoldMat);
    light.position.y = 1.15; toro.add(light);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.16, 0.85), stoneRampartMat);
    cap.position.y = 1.42; toro.add(cap);
    const jewel = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.2), stoneAccentMat);
    jewel.position.y = 1.58; toro.add(jewel);
    group.add(toro);
  }

  function createMachiyaTownhouse(width, depth, height, roofMat, hasUpper) {
    const house = new THREE.Group();
    
    const fnd = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.25, depth + 0.2), stoneRampartMat);
    fnd.position.y = 0.125; house.add(fnd);

    const groundH = hasUpper ? height * 0.52 : height * 0.85;
    const gBody = new THREE.Mesh(new THREE.BoxGeometry(width, groundH, depth), timberDarkMat);
    gBody.position.y = 0.25 + groundH / 2;
    house.add(gBody);

    const shojiW = width * 0.72;
    const shojiH = groundH * 0.68;
    const shoji = new THREE.Mesh(new THREE.BoxGeometry(shojiW, shojiH, 0.08), shojiGlowMat);
    shoji.position.set(0, 0.25 + shojiH / 2 + 0.2, depth / 2 + 0.05);
    house.add(shoji);

    for (let m = -1; m <= 1; m++) {
      const mulV = new THREE.Mesh(new THREE.BoxGeometry(0.06, shojiH, 0.1), timberDarkMat);
      mulV.position.set(m * (shojiW * 0.3), 0.25 + shojiH / 2 + 0.2, depth / 2 + 0.06);
      house.add(mulV);
    }
    for (let mh = -1; mh <= 1; mh++) {
      const mulH = new THREE.Mesh(new THREE.BoxGeometry(shojiW, 0.06, 0.1), timberDarkMat);
      mulH.position.set(0, 0.25 + shojiH / 2 + 0.2 + mh * (shojiH * 0.28), depth / 2 + 0.06);
      house.add(mulH);
    }

    const engawa = new THREE.Mesh(new THREE.BoxGeometry(width * 0.88, 0.18, 0.9), timberWarmMat);
    engawa.position.set(0, 0.25, depth / 2 + 0.45);
    house.add(engawa);

    const awning = new THREE.Mesh(new THREE.BoxGeometry(width + 0.4, 0.2, 1.2), roofMat);
    awning.position.set(0, 0.25 + groundH + 0.1, depth / 2 + 0.55);
    house.add(awning);

    [-width * 0.32, width * 0.32].forEach((lx, idx) => {
      const lanternMat = idx % 2 === 0 ? lanternRedMat : lanternGoldMat;
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.48, 8), lanternMat);
      lantern.position.set(lx, 0.25 + groundH - 0.22, depth / 2 + 0.65);
      house.add(lantern);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 8), timberDarkMat);
      cap.position.set(lx, 0.25 + groundH + 0.02, depth / 2 + 0.65);
      house.add(cap);
    });

    if (hasUpper) {
      const upperH = height * 0.46;
      const uWidth = width * 0.88;
      const uDepth = depth * 0.88;
      const uBody = new THREE.Mesh(new THREE.BoxGeometry(uWidth, upperH, uDepth), timberWarmMat);
      const uY = 0.25 + groundH + upperH / 2;
      uBody.position.y = uY;
      house.add(uBody);

      const uShoji = new THREE.Mesh(new THREE.BoxGeometry(uWidth * 0.6, upperH * 0.55, 0.08), shojiGlowMat);
      uShoji.position.set(0, uY, uDepth / 2 + 0.05);
      house.add(uShoji);

      const uRoof = createJapaneseRoofMesh(uWidth, uDepth, 1.2, roofMat, castleRidgeMat, false);
      uRoof.position.y = 0.25 + groundH + upperH;
      house.add(uRoof);
    } else {
      const mRoof = createJapaneseRoofMesh(width, depth, 1.4, roofMat, castleRidgeMat, false);
      mRoof.position.y = 0.25 + groundH;
      house.add(mRoof);
    }

    return house;
  }

  const tokyoFacadeMats = [
    new THREE.MeshLambertMaterial({ color: 0xf0b36b }),
    new THREE.MeshLambertMaterial({ color: 0x77b8c9 }),
    new THREE.MeshLambertMaterial({ color: 0xd98ca8 }),
    new THREE.MeshLambertMaterial({ color: 0x9ebc86 }),
    new THREE.MeshLambertMaterial({ color: 0xddd3b9 })
  ];
  const tokyoGlassMat = new THREE.MeshPhongMaterial({ color: 0x9be2f5, emissive: 0x164e63, shininess: 70 });
  const tokyoWindowTrimMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
  const schoolAccentMat = new THREE.MeshLambertMaterial({ color: 0x2c5f91 });
  const hospitalAccentMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
  const hospitalRedMat = new THREE.MeshBasicMaterial({ color: 0xe3343f });
  const restaurantAccentMat = new THREE.MeshLambertMaterial({ color: 0xd94335 });
  const templeWoodMat = new THREE.MeshLambertMaterial({ color: 0x75472b });
  const templeRoofMat = new THREE.MeshLambertMaterial({ color: 0x9e3d31 });

  function createTokyoBuilding(style, width, depth, floors, facadeMat) {
    const building = new THREE.Group();
    const floorHeight = 2.15;
    const totalHeight = floors * floorHeight;
    const isTemple = style === 'temple';
    const bodyMat = isTemple ? castlePlasterMat : facadeMat;
    const trimMat = style === 'school' ? schoolAccentMat
      : style === 'restaurant' ? restaurantAccentMat
        : style === 'temple' ? templeRoofMat : tokyoWindowTrimMat;

    const body = new THREE.Mesh(new THREE.BoxGeometry(width, totalHeight, depth), bodyMat);
    body.position.y = totalHeight / 2;
    building.add(body);

    const base = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.35, depth + 0.3), stoneAccentMat);
    base.position.y = 0.18;
    building.add(base);

    if (isTemple) {
      const timberBand = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.25, depth + 0.2), templeWoodMat);
      timberBand.position.y = totalHeight * 0.48;
      building.add(timberBand);
      const roof = createJapaneseRoofMesh(width + 1.8, depth + 1.8, 1.9, templeRoofMat, castleGoldMat, true);
      roof.position.y = totalHeight;
      building.add(roof);
      const lowerRoof = createJapaneseRoofMesh(width + 0.8, depth + 0.8, 1.25, templeRoofMat, castleGoldMat, false);
      lowerRoof.position.y = totalHeight * 0.52;
      building.add(lowerRoof);
      const doorway = new THREE.Mesh(new THREE.BoxGeometry(width * 0.24, totalHeight * 0.56, 0.16), templeWoodMat);
      doorway.position.set(0, totalHeight * 0.28, depth / 2 + 0.09);
      building.add(doorway);
      const gateTop = new THREE.Mesh(new THREE.BoxGeometry(width * 0.65, 0.24, 0.3), restaurantAccentMat);
      gateTop.position.set(0, 2.4, depth / 2 + 0.3);
      building.add(gateTop);
      return building;
    }

    const windowW = Math.min(0.8, width * 0.2);
    const windowH = 0.72;
    const columns = Math.max(2, Math.floor(width / 1.45));
    for (let floor = 0; floor < floors; floor++) {
      const floorY = floor * floorHeight + 1.2;
      const windowMat = floor === 0 && style === 'restaurant' ? shojiGlowMat : tokyoGlassMat;
      for (let col = 0; col < columns; col++) {
        const windowX = (col - (columns - 1) / 2) * (width / (columns + 0.3));
        const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(windowW, windowH, 0.08), windowMat);
        windowMesh.position.set(windowX, floorY, depth / 2 + 0.05);
        building.add(windowMesh);
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.07, windowH + 0.12, 0.1), tokyoWindowTrimMat);
        mullion.position.set(windowX, floorY, depth / 2 + 0.1);
        building.add(mullion);
      }
      if (floor < floors - 1) {
        const ledge = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.12, depth + 0.12), trimMat);
        ledge.position.y = (floor + 1) * floorHeight;
        building.add(ledge);
      }
    }

    const roofCap = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.35, depth + 0.3), trimMat);
    roofCap.position.y = totalHeight + 0.16;
    building.add(roofCap);

    if (style === 'school') {
      const clockBase = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.8, 0.12), hospitalAccentMat);
      clockBase.position.set(0, totalHeight + 0.75, depth / 2 + 0.12);
      building.add(clockBase);
      const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.27, 12), schoolAccentMat);
      clockFace.position.set(0, totalHeight + 0.75, depth / 2 + 0.2);
      building.add(clockFace);
      const entry = new THREE.Mesh(new THREE.BoxGeometry(width * 0.56, 0.95, 0.12), schoolAccentMat);
      entry.position.set(0, 0.62, depth / 2 + 0.1);
      building.add(entry);
    } else if (style === 'hospital') {
      const sign = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.25, 0.14), hospitalAccentMat);
      sign.position.set(0, totalHeight - 0.9, depth / 2 + 0.12);
      building.add(sign);
      const crossVertical = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.86, 0.08), hospitalRedMat);
      crossVertical.position.set(0, totalHeight - 0.9, depth / 2 + 0.22);
      building.add(crossVertical);
      const crossHorizontal = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.24, 0.08), hospitalRedMat);
      crossHorizontal.position.set(0, totalHeight - 0.9, depth / 2 + 0.22);
      building.add(crossHorizontal);
      const entrance = new THREE.Mesh(new THREE.BoxGeometry(width * 0.55, 0.9, 0.12), hospitalAccentMat);
      entrance.position.set(0, 0.58, depth / 2 + 0.11);
      building.add(entrance);
    } else if (style === 'restaurant') {
      const awning = new THREE.Mesh(new THREE.BoxGeometry(width + 0.5, 0.28, 1.1), restaurantAccentMat);
      awning.position.set(0, 2.15, depth / 2 + 0.5);
      building.add(awning);
      const sign = new THREE.Mesh(new THREE.BoxGeometry(width * 0.62, 0.55, 0.14), lanternGoldMat);
      sign.position.set(0, totalHeight - 0.65, depth / 2 + 0.13);
      building.add(sign);
      const signStripe = new THREE.Mesh(new THREE.BoxGeometry(width * 0.44, 0.1, 0.06), restaurantAccentMat);
      signStripe.position.set(0, totalHeight - 0.65, depth / 2 + 0.22);
      building.add(signStripe);
    } else {
      const antenna = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.3, 0.16), tokyoWindowTrimMat);
      antenna.position.set(width * 0.28, totalHeight + 0.95, 0);
      building.add(antenna);
      const rooftopSign = new THREE.Mesh(new THREE.BoxGeometry(width * 0.46, 0.48, 0.12), restaurantAccentMat);
      rooftopSign.position.set(-width * 0.15, totalHeight + 0.72, depth / 2 + 0.08);
      building.add(rooftopSign);
    }
    return building;
  }

  const cityBlocks = [];
  for (let z = 12, blockIndex = 0; z > -190; z -= 32, blockIndex++) {
    // LEFT SIDE: Downtown buildings, with the traditional monastery landmarks retained.
    {
      const leftBlock = new THREE.Group();
      leftBlock.position.z = z;

      // Scenic canal and promenade alongside the left-side buildings.
      const water = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.1, 32), waterMat);
      water.position.set(-6.5, 0.02, 0);
      leftBlock.add(water);

      const terrace = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.32, 32), stonePromenadeMat);
      terrace.position.set(-4.0, 0.16, 0);
      leftBlock.add(terrace);

      const variant = blockIndex % 3;
      if (variant === 0) {
        // Keep the green-and-white monastery/watchtower as a distinct landmark.
        const towerBase = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.2, 6.0), castlePlasterMat);
        towerBase.position.set(-13.0, 1.6, 0);
        leftBlock.add(towerBase);

        const twTimber1 = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.16, 6.2), timberDarkMat);
        twTimber1.position.set(-13.0, 3.05, 0);
        leftBlock.add(twTimber1);

        const twRoof1 = createJapaneseRoofMesh(6.6, 6.8, 1.2, castleGreenRoofMat, castleRidgeMat, false);
        twRoof1.position.set(-13.0, 3.2, 0);
        leftBlock.add(twRoof1);

        const towerUpper = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.6, 4.4), castlePlasterMat);
        towerUpper.position.set(-13.0, 5.4, 0);
        leftBlock.add(towerUpper);

        const twShoji = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 0.08), shojiGlowMat);
        twShoji.position.set(-13.0, 5.5, 2.22);
        leftBlock.add(twShoji);

        const twRoof2 = createJapaneseRoofMesh(4.8, 5.0, 1.4, castleGreenRoofMat, castleRidgeMat, true);
        twRoof2.position.set(-13.0, 6.7, 0);
        leftBlock.add(twRoof2);
      } else if (variant === 1) {
        // Lush Bamboo Grove along the water and castle wall
        addBambooGrove(leftBlock, -9.6, -6, 8);
        addBambooGrove(leftBlock, -9.8, 6, 8);
        addStoneLantern(leftBlock, -8.8, 0.3, 0);
      } else {
        // Japanese Sculpted Pine & Stone Bastion
        addPineTree(leftBlock, -9.5, 0, -7, 1.1);
        addPineTree(leftBlock, -9.8, 0, 7, 1.0);
        addStoneLantern(leftBlock, -8.8, 0.3, -2);
        addStoneLantern(leftBlock, -8.8, 0.3, 2);
      }
      if (blockIndex % 2 === 1) addCherryBlossomTree(leftBlock, -7.5, 0, 8, 1.05);

      const leftStyles = ['apartment', 'restaurant', 'hospital', 'school', 'apartment', 'temple', 'restaurant'];
      const leftStyleA = leftStyles[(blockIndex + 2) % leftStyles.length];
      const leftStyleB = leftStyles[(blockIndex + 5) % leftStyles.length];
      const leftFloorsA = leftStyleA === 'temple' ? 1 : [4, 2, 6, 3, 5, 7, 3][blockIndex % 7];
      const leftFloorsB = leftStyleB === 'temple' ? 1 : [3, 6, 2, 5, 4, 3, 7][blockIndex % 7];
      const leftBuildingA = createTokyoBuilding(
        leftStyleA,
        5.8 + (blockIndex % 2) * 0.5,
        6,
        leftFloorsA,
        tokyoFacadeMats[(blockIndex + 1) % tokyoFacadeMats.length]
      );
      leftBuildingA.position.set(-12.5, 0, 0.15);
      leftBuildingA.rotation.y = -Math.PI / 2;
      if (variant !== 0) leftBlock.add(leftBuildingA);

      const leftBuildingB = createTokyoBuilding(
        leftStyleB,
        4.7,
        6,
        leftFloorsB,
        tokyoFacadeMats[(blockIndex + 3) % tokyoFacadeMats.length]
      );
      leftBuildingB.position.set(-12.5, 0, -15.85);
      leftBuildingB.rotation.y = -Math.PI / 2;
      leftBlock.add(leftBuildingB);

      worldGroup.add(leftBlock);
      cityBlocks.push(leftBlock);
    }

    // RIGHT SIDE: Colorful downtown Tokyo buildings and neighborhood landmarks.
    {
      const rightBlock = new THREE.Group();
      rightBlock.position.z = z;

      // Stone promenade walkway
      const promenade = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.16, 32), stonePromenadeMat);
      promenade.position.set(6.0, 0.08, 0);
      rightBlock.add(promenade);

      // Decorative trackside stone boundary curb
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 32), stoneAccentMat);
      curb.position.set(4.0, 0.14, 0);
      rightBlock.add(curb);

      const downtownStyles = ['restaurant', 'school', 'apartment', 'hospital', 'temple', 'apartment', 'restaurant'];
      const styleA = downtownStyles[blockIndex % downtownStyles.length];
      const styleB = downtownStyles[(blockIndex + 3) % downtownStyles.length];
      const floorsA = styleA === 'temple' ? 1 : [3, 5, 4, 6, 2, 7, 3][blockIndex % 7];
      const floorsB = styleB === 'temple' ? 1 : [4, 3, 6, 2, 5, 3, 4][blockIndex % 7];
      const buildingA = createTokyoBuilding(styleA, 6.2, 10.5, floorsA, tokyoFacadeMats[blockIndex % tokyoFacadeMats.length]);
      buildingA.position.set(11.3, 0, -8.2);
      rightBlock.add(buildingA);
      const buildingB = createTokyoBuilding(styleB, 5.7 + (blockIndex % 2) * 0.8, 9.8, floorsB, tokyoFacadeMats[(blockIndex + 2) % tokyoFacadeMats.length]);
      buildingB.position.set(12.0, 0, 8.5);
      rightBlock.add(buildingB);

      addStoneLantern(rightBlock, 8.2, 0.16, 0);
      if (blockIndex % 2 === 0) addCherryBlossomTree(rightBlock, 7.8, 0, -9, 1.1);

      worldGroup.add(rightBlock);
      cityBlocks.push(rightBlock);
    }
  }

  // Distant Panoramic Skyline matching reference photo
  const skyline = new THREE.Group();
  skyline.position.z = -105;

  // 1. GRAND TENSHU (Castle Keep) on Left Skyline
  const castle = new THREE.Group();
  castle.position.set(-34, 0, 0);
  skyline.add(castle);

  // Massive stone foundation (Ishigaki)
  const castleBase = new THREE.Mesh(new THREE.BoxGeometry(26, 7.5, 22), stoneRampartMat);
  castleBase.position.y = 3.75;
  castle.add(castleBase);

  let curTenshuY = 7.5;
  const tenshuTiers = [
    { w: 20, d: 17, h: 5.2, rH: 1.6, gold: false },
    { w: 15.5, d: 13, h: 4.4, rH: 1.5, gold: false },
    { w: 11.5, d: 9.8, h: 3.8, rH: 1.4, gold: false },
    { w: 8.2, d: 7.2, h: 3.2, rH: 1.3, gold: false },
    { w: 5.4, d: 4.8, h: 2.6, rH: 1.6, gold: true }
  ];

  tenshuTiers.forEach((tier) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(tier.w, tier.h, tier.d), castlePlasterMat);
    wall.position.y = curTenshuY + tier.h / 2;
    castle.add(wall);

    const timberBand = new THREE.Mesh(new THREE.BoxGeometry(tier.w + 0.2, 0.2, tier.d + 0.2), timberDarkMat);
    timberBand.position.y = curTenshuY + 0.1;
    castle.add(timberBand);

    const roof = createJapaneseRoofMesh(tier.w + 1.2, tier.d + 1.2, tier.rH, castleGreenRoofMat, castleRidgeMat, tier.gold);
    roof.position.y = curTenshuY + tier.h;
    castle.add(roof);

    curTenshuY += tier.h + tier.rH * 0.72;
  });

  // Pine trees and bamboo around castle keep
  [-16, 16].forEach((tx) => {
    addPineTree(castle, tx, 0, 8, 1.4);
    addPineTree(castle, tx * 0.8, 0, -8, 1.2);
    addBambooGrove(castle, tx * 0.9, 0, 10);
  });

  // 2. TOKYO TOWER on Right Skyline
  const tower = new THREE.Group();
  tower.position.set(30, 0, 0);
  skyline.add(tower);

  const towerRed = new THREE.MeshLambertMaterial({ color: 0xd3382c });
  const towerWhite = new THREE.MeshLambertMaterial({ color: 0xf8fafc });

  // 4 Angled Lattice Legs meeting at base arch
  [-1, 1].forEach((lx) => {
    [-1, 1].forEach((lz) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.75, 14, 8), towerRed);
      leg.position.set(lx * 4.2, 6.8, lz * 4.2);
      leg.rotation.z = -lx * 0.26;
      leg.rotation.x = lz * 0.26;
      tower.add(leg);
    });
  });

  // Lower lattice pyramid truss
  const pyramid = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 4.8, 10, 8), towerRed);
  pyramid.position.y = 15;
  tower.add(pyramid);

  // Main Observation Deck (Two-tier white observatory)
  const mainDeckLow = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.6, 7.2), towerWhite);
  mainDeckLow.position.y = 20.8;
  tower.add(mainDeckLow);

  const mainDeckWin = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.65, 7.3), timberDarkMat);
  mainDeckWin.position.y = 20.8;
  tower.add(mainDeckWin);

  const mainDeckUp = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.4, 5.8), towerWhite);
  mainDeckUp.position.y = 22.3;
  tower.add(mainDeckUp);

  // Middle lattice tower with alternating red & white sections
  const towerBands = [
    { h: 6, rT: 1.8, rB: 2.2, y: 26.0, mat: towerRed },
    { h: 6, rT: 1.4, rB: 1.8, y: 32.0, mat: towerWhite },
    { h: 6, rT: 1.0, rB: 1.4, y: 38.0, mat: towerRed },
    { h: 5, rT: 0.65, rB: 1.0, y: 43.5, mat: towerWhite }
  ];
  towerBands.forEach((band) => {
    const section = new THREE.Mesh(new THREE.CylinderGeometry(band.rT, band.rB, band.h, 8), band.mat);
    section.position.y = band.y;
    tower.add(section);
  });

  // Special Observatory Deck
  const specialDeck = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.2, 8), towerWhite);
  specialDeck.position.y = 47.0;
  tower.add(specialDeck);

  // Antenna Spire
  const antenna1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.45, 8, 8), towerRed);
  antenna1.position.y = 51.5;
  tower.add(antenna1);

  const antenna2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.2, 7, 8), towerWhite);
  antenna2.position.y = 59.0;
  tower.add(antenna2);

  // Red obstruction beacon light
  const beacon = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), lanternRedMat);
  beacon.position.y = 62.6;
  tower.add(beacon);

  // 3. Midground Bridge & Distant Pagoda Skyline
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(0, 0.5, 15);
  const bridgeSpan = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 3.2), timberWarmMat);
  bridgeGroup.add(bridgeSpan);
  const bridgeArch = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 3.4, 16, 1, false, 0, Math.PI), stoneRampartMat);
  bridgeArch.rotation.z = Math.PI / 2;
  bridgeArch.position.y = -6.5;
  bridgeGroup.add(bridgeArch);
  skyline.add(bridgeGroup);

  worldGroup.add(skyline);

  // TRAINS WITH PASSENGER WINDOWS
  // -----------------------------------------------------------------
  const trains = [];
  const windowGlassMat = new THREE.MeshPhongMaterial({
    color: 0xbae6fd,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.6,
    shininess: 100,
    transparent: true,
    opacity: 0.85
  });
  const windowFrameMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
  const trainRoofMat = new THREE.MeshLambertMaterial({ color: 0x334155 });

  function createTrainWithWindows(xPos, zPos, trainColor, accentColor, length = 15) {
    const trainGroup = new THREE.Group();
    trainGroup.position.set(xPos, 0, zPos);
    trainGroup.userData.length = length;

    // Car Body
    const bodyGeo = new THREE.BoxGeometry(2.15, 2.9, length);
    const bodyMat = new THREE.MeshLambertMaterial({ color: trainColor });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.6;
    body.castShadow = true;
    trainGroup.add(body);

    // Accent Stripe
    const stripeGeo = new THREE.BoxGeometry(2.18, 0.35, length - 0.2);
    const stripeMat = new THREE.MeshLambertMaterial({ color: accentColor });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.y = 1.0;
    trainGroup.add(stripe);

    // Roof
    const roofGeo = new THREE.BoxGeometry(1.95, 0.35, length - 0.2);
    const roof = new THREE.Mesh(roofGeo, trainRoofMat);
    roof.position.y = 3.15;
    trainGroup.add(roof);

    // Roof Vents
    for (let vZ = -length / 2 + 3.5; vZ <= length / 2 - 3.5; vZ += 7) {
      const vent = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.25, 1.8),
        new THREE.MeshLambertMaterial({ color: 0x64748b })
      );
      vent.position.set(0, 3.4, vZ);
      trainGroup.add(vent);
    }

    // Windshields
    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.95, 0.2), windowGlassMat);
    frontWindshield.position.set(0, 2.2, length / 2 + 0.02);
    trainGroup.add(frontWindshield);

    const backWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.95, 0.2), windowGlassMat);
    backWindshield.position.set(0, 2.2, -length / 2 - 0.02);
    trainGroup.add(backWindshield);

    // Side Passenger Windows
    const sideWindowZOffsets = [];
    for (let wZ = -length / 2 + 2.5; wZ <= length / 2 - 2.5; wZ += 3.2) {
      sideWindowZOffsets.push(wZ);
    }
    sideWindowZOffsets.forEach((wZ) => {
      [-1.09, 1.09].forEach((wX) => {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.88, 1.25), windowFrameMat);
        frame.position.set(wX, 2.15, wZ);
        trainGroup.add(frame);

        const glass = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.76, 1.15), windowGlassMat);
        glass.position.set(wX, 2.15, wZ);
        trainGroup.add(glass);
      });
    });

    // Doors
    const doorOffsets = [];
    for (let dZ = -length / 2 + 4; dZ <= length / 2 - 4; dZ += 8) {
      doorOffsets.push(dZ);
    }
    doorOffsets.forEach((dZ) => {
      [-1.09, 1.09].forEach((dX) => {
        const doorFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 1.9, 1.3),
          new THREE.MeshLambertMaterial({ color: 0x1e293b })
        );
        doorFrame.position.set(dX, 1.5, dZ);
        trainGroup.add(doorFrame);

        const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.65, 0.45), windowGlassMat);
        doorGlass.position.set(dX, 1.85, dZ);
        trainGroup.add(doorGlass);
      });
    });

    // Headlights & Tail lights
    [-0.65, 0.65].forEach((hX) => {
      const light = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      light.rotation.x = Math.PI / 2;
      light.position.set(hX, 0.85, length / 2 + 0.02);
      trainGroup.add(light);

      const tailLight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.12, 12),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      tailLight.rotation.x = Math.PI / 2;
      tailLight.position.set(hX, 0.85, -length / 2 - 0.02);
      trainGroup.add(tailLight);
    });

    worldGroup.add(trainGroup);
    trains.push(trainGroup);
  }

  createTrainWithWindows(2.6, -55, 0x0284c7, 0xfacc15, 28);
  createTrainWithWindows(-2.6, -100, 0xe11d48, 0xffffff);
  createTrainWithWindows(0, -145, 0xf59e0b, 0x0f172a, 28);

  // Coins
  const coins = [];
  const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.12, 16);
  const coinMat = new THREE.MeshPhongMaterial({ color: 0xffd700, emissive: 0xca8a04, shininess: 100 });

  for (let i = 0; i < 45; i++) {
    const cMesh = new THREE.Mesh(coinGeo, coinMat);
    cMesh.rotation.x = Math.PI / 2;
    const laneIndex = (i % 3) - 1;
    cMesh.position.set(laneIndex * 2.6, 1.2, -10 - i * 3.5);
    worldGroup.add(cMesh);
    coins.push(cMesh);
  }

  // -----------------------------------------------------------------
  // JAKE CHARACTER (With Royal Blue Sideways Cap, Brown Hair, NO Trails)
  // -----------------------------------------------------------------
  const jake = new THREE.Group();
  jake.position.set(0, 0, 0);
  jake.rotation.y = Math.PI; // Face towards oncoming trains (-Z)

  // Character materials
  const skinMat = new THREE.MeshLambertMaterial({ color: 0xfcd34d });
  const royalBlueCapMat = new THREE.MeshLambertMaterial({ color: 0x2563eb });
  const royalBlueBrimMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
  const jacketWhiteMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
  const jacketRedMat = new THREE.MeshLambertMaterial({ color: 0xef4444 });
  const jeansBlueMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
  const sneakerWhiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const sneakerRedMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
  const hairMat = new THREE.MeshLambertMaterial({ color: 0x542c16 });

  // Hoverboard
  const boardGroup = new THREE.Group();
  boardGroup.position.y = -0.06;
  const boardGeo = new THREE.BoxGeometry(0.92, 0.12, 1.9);
  const boardMat = new THREE.MeshPhongMaterial({ color: 0x06b6d4, emissive: 0x0891b2 });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.y = 0.08;
  boardGroup.add(board);

  const boardStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.14, 1.7),
    new THREE.MeshLambertMaterial({ color: 0xfacc15 })
  );
  boardStripe.position.y = 0.08;
  boardGroup.add(boardStripe);

  const boardGlow = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.05, 1.6),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee })
  );
  boardGlow.position.y = 0.01;
  boardGroup.add(boardGlow);

  boardGroup.visible = false;
  jake.add(boardGroup);

  // Legs & Sneakers
  const runnerLegs = [];
  const runnerShoes = [];
  [-0.22, 0.22].forEach((sX) => {
    const legGeo = new THREE.BoxGeometry(0.24, 0.65, 0.26);
    const leg = new THREE.Mesh(legGeo, jeansBlueMat);
    leg.position.set(sX, 0.45, 0);
    leg.castShadow = true;
    jake.add(leg);
    runnerLegs.push(leg);

    const sneaker = new THREE.Group();
    sneaker.position.set(sX, 0.16, 0.05);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.45), sneakerWhiteMat);
    sneaker.add(sole);

    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.38), sneakerRedMat);
    upper.position.set(0, 0.1, -0.02);
    sneaker.add(upper);

    const toeCap = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.14, 0.15), sneakerWhiteMat);
    toeCap.position.set(0, 0.09, 0.14);
    sneaker.add(toeCap);

    jake.add(sneaker);
    runnerShoes.push(sneaker);
  });

  // Torso
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 1.1, 0);

  const vest = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.75, 0.48), jacketWhiteMat);
  vest.castShadow = true;
  torsoGroup.add(vest);

  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.42), jacketRedMat);
  collar.position.y = 0.42;
  torsoGroup.add(collar);

  const logoTag = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.28, 0.04),
    new THREE.MeshLambertMaterial({ color: 0xef4444 })
  );
  logoTag.position.set(0, 0.05, 0.25);
  torsoGroup.add(logoTag);

  // Arms
  const runnerArms = [];
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 0.2), jacketRedMat);
  leftArm.position.set(-0.48, 0.02, 0);
  leftArm.rotation.x = 0.2;
  torsoGroup.add(leftArm);
  runnerArms.push(leftArm);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 0.2), jacketRedMat);
  rightArm.position.set(0.48, 0.02, 0);
  rightArm.rotation.x = -0.2;
  torsoGroup.add(rightArm);
  runnerArms.push(rightArm);

  [-0.48, 0.48].forEach((hX) => {
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), skinMat);
    hand.position.set(hX, -0.38, hX > 0 ? -0.08 : 0.08);
    torsoGroup.add(hand);
  });

  const coinMagnet = new THREE.Group();
  const magnetRedMat = new THREE.MeshLambertMaterial({ color: 0xdc2626, emissive: 0x7f1d1d });
  const magnetCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.16, 0.1, 0),
    new THREE.Vector3(-0.19, -0.02, 0),
    new THREE.Vector3(-0.14, -0.15, 0),
    new THREE.Vector3(0, -0.21, 0),
    new THREE.Vector3(0.14, -0.15, 0),
    new THREE.Vector3(0.19, -0.02, 0),
    new THREE.Vector3(0.16, 0.1, 0)
  ]);
  coinMagnet.add(new THREE.Mesh(new THREE.TubeGeometry(magnetCurve, 20, 0.055, 8, false), magnetRedMat));
  const magnetPoleMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
  [-0.16, 0.16].forEach((x) => {
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, 0.1), magnetPoleMat);
    pole.position.set(x, 0.1, 0);
    coinMagnet.add(pole);
  });
  coinMagnet.position.set(0.48, -0.38, 0.16);
  coinMagnet.visible = false;
  torsoGroup.add(coinMagnet);

  jake.add(torsoGroup);

  // Head & Hair
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.82, 0);

  const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.54, 0.52), skinMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Eyes & Mouth
  [-0.14, 0.14].forEach((eX) => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, 0.04), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    eye.position.set(eX, 0.04, 0.27);
    headGroup.add(eye);

    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    pupil.position.set(eX - 0.02, 0.06, 0.28);
    headGroup.add(pupil);
  });

  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x991b1b }));
  mouth.position.set(0.04, -0.12, 0.27);
  headGroup.add(mouth);

  // Brown Hair
  const rearHair = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 0.16), hairMat);
  rearHair.position.set(0, 0.06, -0.27);
  headGroup.add(rearHair);

  [-0.16, 0, 0.16].forEach((hX) => {
    const tuft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.12), hairMat);
    tuft.position.set(hX, -0.06, -0.26);
    tuft.rotation.x = 0.15;
    headGroup.add(tuft);
  });

  const leftSideHair = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.38), hairMat);
  leftSideHair.position.set(-0.29, 0.08, 0.02);
  headGroup.add(leftSideHair);

  const frontBangs = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.14, 0.16), hairMat);
  frontBangs.position.set(0, 0.22, 0.24);
  headGroup.add(frontBangs);

  // Sideways Royal Blue Cap
  const capGroup = new THREE.Group();
  capGroup.position.set(0, 0.28, 0);

  const capDome = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.26, 0.62), royalBlueCapMat);
  capGroup.add(capDome);

  const capButton = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12), royalBlueBrimMat);
  capButton.position.set(0, 0.15, 0);
  capGroup.add(capButton);

  const capBrimGroup = new THREE.Group();
  capBrimGroup.position.set(-0.35, -0.06, 0);
  capBrimGroup.rotation.z = -0.12;
  capBrimGroup.rotation.y = 0.08;

  const brimMesh = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.46), royalBlueBrimMat);
  capBrimGroup.add(brimMesh);

  const brimLip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.44), royalBlueBrimMat);
  brimLip.position.set(-0.24, -0.02, 0);
  capBrimGroup.add(brimLip);

  capGroup.add(capBrimGroup);
  headGroup.add(capGroup);
  jake.add(headGroup);

  scene.add(jake);

  // -----------------------------------------------------------------
  // CONTROLS & ANIMATION
  // -----------------------------------------------------------------
  let currentLane = 1;
  const laneXValues = [-2.6, 0, 2.6];
  let targetX = 0;
  let isJumping = false;
  let boardingTrain = null, rideTrain = null;
  let hoverboardActive = false;
  const hoverboardGroundY = 0.24;
  const trainRideY = 3.245;
  let coinMagnetTime = 0;
  let jumpVelocity = 0;
  let jakeY = 0;

  let gameState = 'ready';
  let distance = 0, score = 0, coinCount = 0, keysCount = 0, elapsed = 0;
  let hitCooldown = 0;
  const overlay = document.getElementById('run-overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayCopy = document.getElementById('overlay-copy');
  const startButton = document.getElementById('btn-start');
  let audioContext = null, musicGain = null, musicTimer = null, musicStep = 0;
  function ensureAudio() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return false;
    if (!audioContext) { audioContext = new AudioCtor(); musicGain = audioContext.createGain(); musicGain.gain.value = 0; musicGain.connect(audioContext.destination); }
    if (audioContext.state === 'suspended') audioContext.resume();
    return true;
  }
  function playCoinSound() {
    if (!ensureAudio()) return;
    const now = audioContext.currentTime;
    [880, 1320].forEach((hz, i) => {
      const osc = audioContext.createOscillator(), gain = audioContext.createGain(), at = now + i * 0.075;
      osc.type = 'sine'; osc.frequency.setValueAtTime(hz, at); gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.18, at + 0.012); gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
      osc.connect(gain); gain.connect(audioContext.destination); osc.start(at); osc.stop(at + 0.17);
    });
  }
  function startMusic() {
    if (!ensureAudio()) return;
    if (musicTimer) clearInterval(musicTimer);
    musicGain.gain.setTargetAtTime(0.22, audioContext.currentTime, 0.3);
    const melody = [659, 784, 988, 784, 587, 698, 880, 698, 523, 659, 784, 659, 587, 698, 880, 1047];
    musicTimer = setInterval(() => {
      if (!audioContext || audioContext.state !== 'running' || gameState !== 'running') return;
      const now = audioContext.currentTime, osc = audioContext.createOscillator(), env = audioContext.createGain();
      osc.type = 'triangle'; osc.frequency.value = melody[musicStep % melody.length];
      env.gain.setValueAtTime(0.0001, now); env.gain.exponentialRampToValueAtTime(0.11, now + 0.025); env.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);
      osc.connect(env); env.connect(musicGain); osc.start(now); osc.stop(now + 0.24);
      if (musicStep % 4 === 0) {
        const bass = audioContext.createOscillator(), bassEnv = audioContext.createGain();
        bass.type = 'sine'; bass.frequency.value = [110, 130.81, 98, 146.83][Math.floor(musicStep / 4) % 4];
        bassEnv.gain.setValueAtTime(0.0001, now); bassEnv.gain.exponentialRampToValueAtTime(0.12, now + 0.02); bassEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        bass.connect(bassEnv); bassEnv.connect(musicGain); bass.start(now); bass.stop(now + 0.31);
      }
      musicStep++;
    }, 260);
  }
  function stopMusic() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    if (musicGain && audioContext) musicGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.15);
  }
  function startRun() {
    if (gameState === 'running') return;
    if (gameState === 'over') {
      distance = score = coinCount = keysCount = elapsed = 0;
      currentLane = 1; targetX = 0; jake.position.x = 0; jake.position.y = 0; jake.position.z = 0;
      jakeY = 0;
      boardingTrain = rideTrain = null; isJumping = false; jumpVelocity = 0;
      hoverboardActive = false; boardGroup.visible = false; updateHoverboardUI();
      coinMagnetTime = 0; coinMagnet.visible = false; updateCoinMagnetUI();
      trains.forEach((tr, i) => { tr.position.z = -55 - i * 45; tr.position.x = laneXValues[(i + 1) % 3]; });
      coins.forEach((c, i) => { c.visible = true; c.position.z = -12 - i * 4; c.position.x = laneXValues[(i % 3)]; });
    }
    gameState = 'running'; overlay.classList.add('hidden');
    startMusic();
    if (startButton) startButton.textContent = 'RESUME';
  }
  function finishRun() {
    if (gameState !== 'running') return;
    gameState = 'over'; stopMusic(); overlayTitle.textContent = 'Run over!';
    coinMagnetTime = 0; coinMagnet.visible = false; updateCoinMagnetUI();
    overlayCopy.textContent = `Distance: ${Math.floor(distance)} m · Score: ${score.toLocaleString()} · Coins: ${coinCount}`;
    startButton.textContent = 'RUN AGAIN'; overlay.classList.remove('hidden');
  }
  function togglePause() {
    if (gameState === 'running') { gameState = 'paused'; stopMusic(); overlayTitle.textContent = 'Paused'; overlayCopy.textContent = 'Take a breather. Your run is waiting.'; startButton.textContent = 'RESUME'; overlay.classList.remove('hidden'); }
    else if (gameState === 'paused' || gameState === 'ready') startRun();
  }
  startButton.addEventListener('click', startRun);
  document.getElementById('btn-pause').addEventListener('click', togglePause);
  function updateHud() {
    document.getElementById('hud-distance').textContent = Math.floor(distance).toLocaleString();
    document.getElementById('hud-score').textContent = Math.floor(score).toLocaleString();
    document.getElementById('hud-coins').textContent = coinCount.toLocaleString();
    document.getElementById('hud-keys').textContent = keysCount.toLocaleString();
    document.getElementById('hud-mult').textContent = `x${Math.min(30, 1 + Math.floor(distance / 500))}`;
    updateCoinMagnetUI();
  }
  function updateCoinMagnetUI() {
    const button = document.getElementById('btn-coin-magnet');
    const status = document.getElementById('hud-magnet-status');
    const meter = document.getElementById('hud-magnet-meter');
    const active = coinMagnetTime > 0;
    if (status) status.textContent = active ? `${coinMagnetTime.toFixed(1)}s` : 'OFF';
    if (meter) meter.style.width = `${Math.max(0, coinMagnetTime / 4.5) * 100}%`;
    if (button) {
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('bg-red-900/80', active);
    }
  }
  function activateCoinMagnet() {
    if (gameState !== 'running') return;
    coinMagnetTime = 4.5;
    coinMagnet.visible = true;
    updateCoinMagnetUI();
  }
  function updateHoverboardUI() {
    const button = document.getElementById('btn-hoverboard');
    const label = button && button.querySelector('[data-hoverboard-label]');
    const status = document.getElementById('hud-hoverboard-status');
    if (label) label.textContent = `HOVERBOARD ${hoverboardActive ? 'ON' : 'OFF'}`;
    if (status) {
      status.textContent = hoverboardActive ? 'ON' : 'OFF';
      status.classList.toggle('text-cyan-400', hoverboardActive);
      status.classList.toggle('text-slate-400', !hoverboardActive);
    }
    if (button) {
      button.setAttribute('aria-pressed', String(hoverboardActive));
      button.classList.toggle('bg-cyan-900/80', hoverboardActive);
    }
  }
  function toggleHoverboard() {
    hoverboardActive = !hoverboardActive;
    boardGroup.visible = hoverboardActive;
    if (!hoverboardActive) {
      boardingTrain = null;
      if (rideTrain) {
        rideTrain = null;
        jake.position.z = 0;
        jakeY = 0;
        isJumping = false;
        jumpVelocity = 0;
      }
    }
    updateHoverboardUI();
  }
  function findBoardingTrain(lane) {
    const laneX = laneXValues[lane];
    return trains.find((tr) => tr.position.z > -(tr.userData.length / 2 + 20)
      && tr.position.z < -2
      && Math.abs(tr.position.x - laneX) < 1.25) || null;
  }
  function moveLeft() {
    if (gameState !== 'running' || rideTrain) return;
    if (currentLane > 0) currentLane--;
    targetX = laneXValues[currentLane];
    if (isJumping && hoverboardActive) boardingTrain = findBoardingTrain(currentLane);
  }

  function moveRight() {
    if (gameState !== 'running' || rideTrain) return;
    if (currentLane < 2) currentLane++;
    targetX = laneXValues[currentLane];
    if (isJumping && hoverboardActive) boardingTrain = findBoardingTrain(currentLane);
  }

  function jump() {
    if (gameState !== 'running' || rideTrain) return;
    if (!isJumping) {
      boardingTrain = hoverboardActive ? findBoardingTrain(currentLane) : null;
      if (boardingTrain) {
        currentLane = laneXValues.indexOf(boardingTrain.position.x);
        targetX = boardingTrain.position.x;
      }
      isJumping = true;
      jumpVelocity = 0.36;
    }
  }

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') { togglePause(); return; }
    if (gameState === 'ready' || gameState === 'over') { if (e.key === 'Enter') startRun(); return; }
    if (gameState !== 'running') return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft();
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight();
    else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') jump();
    else if (e.key === 'b' || e.key === 'B') toggleHoverboard();
    else if (e.key === 'm' || e.key === 'M') activateCoinMagnet();
  });

  // Buttons in UI
  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnJump = document.getElementById('btn-jump');
  const btnHoverboard = document.getElementById('btn-hoverboard');
  const btnCoinMagnet = document.getElementById('btn-coin-magnet');
  if (btnLeft) btnLeft.addEventListener('click', moveLeft);
  if (btnRight) btnRight.addEventListener('click', moveRight);
  if (btnJump) btnJump.addEventListener('click', jump);
  if (btnHoverboard) btnHoverboard.addEventListener('click', toggleHoverboard);
  if (btnCoinMagnet) btnCoinMagnet.addEventListener('click', activateCoinMagnet);
  updateHoverboardUI();
  updateCoinMagnetUI();

  // Swipe / Pointer
  let touchStartX = 0;
  container.addEventListener('pointerdown', (e) => { touchStartX = e.clientX; });
  container.addEventListener('pointerup', (e) => {
    const diffX = e.clientX - touchStartX;
    if (diffX > 40) moveRight();
    else if (diffX < -40) moveLeft();
    else if (Math.abs(diffX) < 15) jump();
  });

  // Animation Loop
  let clock = new THREE.Clock();
  const speed = 33.0;
  const trainSpeed = speed * 1.2;

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    const shiftZ = speed * delta;
    if (gameState === 'running') {
      elapsed += delta; distance += delta * 18; score += delta * 18;
      hitCooldown = Math.max(0, hitCooldown - delta);
      coinMagnetTime = Math.max(0, coinMagnetTime - delta);
      coinMagnet.visible = coinMagnetTime > 0;
    }

    // Drifting clouds
    cloudsGroup.children.forEach((c) => {
      c.position.x += 0.8 * delta;
      if (c.position.x > 50) c.position.x = -50;
    });

    // Scroll the sleepers and storefronts toward Jake to create forward movement.
    if (gameState === 'running') {
      trackSleepers.forEach((sleeper) => { sleeper.position.z += shiftZ; if (sleeper.position.z > 12) sleeper.position.z -= 200; });
      cityBlocks.forEach((block) => { block.position.z += shiftZ; if (block.position.z > 20) block.position.z -= 224; });
    }

    // Scroll trains towards player
    trains.forEach((tr) => {
      if (gameState === 'running') tr.position.z += trainSpeed * delta;
      if (tr.position.z > 22) {
        if (gameState === 'running') score += 100;
        tr.position.z = -140 - Math.random() * 45;
        tr.position.x = laneXValues[Math.floor(Math.random() * 3)];
      }
    });

    // Scroll & spin coins
    coins.forEach((c) => {
      if (gameState === 'running') c.position.z += shiftZ;
      c.rotation.z += 3.2 * delta;
      let dx = jake.position.x - c.position.x;
      let dz = jake.position.z - c.position.z;
      if (c.visible && gameState === 'running' && coinMagnetTime > 0 && Math.abs(dx) < 6.5 && Math.abs(dz) < 18) {
        const distanceToJake = Math.hypot(dx, dz);
        if (distanceToJake > 0) {
          const pull = Math.min(distanceToJake, 18 * delta);
          c.position.x += dx / distanceToJake * pull;
          c.position.z += dz / distanceToJake * pull;
          dx = jake.position.x - c.position.x;
          dz = jake.position.z - c.position.z;
        }
      }
      const inMagnetRange = c.visible && coinMagnetTime > 0 && Math.hypot(dx, dz) < 1.1;
      const collectedNormally = c.visible && Math.abs(c.position.z) < 1.15 && Math.abs(c.position.x - jake.position.x) < 1.15;
      if (gameState === 'running' && (inMagnetRange || collectedNormally)) { c.visible = false; coinCount++; score += 50; playCoinSound(); }
      if (c.position.z > 14) {
        c.visible = true;
        c.position.z = -95 - Math.random() * 30;
        c.position.x = laneXValues[Math.floor(Math.random() * 3)];
      }
    });

    if (gameState === 'running') {
      for (const tr of trains) {
        if (tr !== rideTrain && tr !== boardingTrain && hitCooldown === 0 && (!hoverboardActive || jakeY < 2.0) && Math.abs(tr.position.z) < tr.userData.length / 2 + 1.1 && Math.abs(tr.position.x - jake.position.x) < 1.1) { finishRun(); break; }
      }
      updateHud();
    }

    // Jake movement & tilt
    jake.position.x += (targetX - jake.position.x) * 12.0 * delta;
    const tilt = (targetX - jake.position.x) * 0.26;
    jake.rotation.z = THREE.MathUtils.lerp(jake.rotation.z, tilt, 0.22);

    // Jump physics
    if (isJumping) {
      jakeY += jumpVelocity;
      jumpVelocity -= 0.021;
      const groundY = hoverboardActive ? hoverboardGroundY : 0;
      if (jakeY <= groundY) {
        jakeY = groundY;
        isJumping = false;
        jumpVelocity = 0;
      }
    } else if (boardingTrain && hoverboardActive) {
      jakeY = trainRideY;
    } else {
      const groundY = hoverboardActive ? hoverboardGroundY : 0;
      jakeY = groundY + (hoverboardActive ? Math.sin(time * 5) * 0.035 : 0);
    }
    if (boardingTrain && hoverboardActive && isJumping && jakeY >= trainRideY) {
      jakeY = trainRideY;
      jumpVelocity = 0;
      isJumping = false;
    }
    if (boardingTrain && Math.abs(boardingTrain.position.z) < boardingTrain.userData.length / 2 && jakeY > 2.5) {
      rideTrain = boardingTrain;
      currentLane = laneXValues.indexOf(rideTrain.position.x);
      targetX = rideTrain.position.x;
      boardingTrain = null; isJumping = false; jumpVelocity = 0; jakeY = trainRideY;
    }
    if (boardingTrain && boardingTrain.position.z > boardingTrain.userData.length / 2 + 0.2) boardingTrain = null;
    if (rideTrain) {
      jakeY = trainRideY;
      jake.position.z = 0;
      if (rideTrain.position.z > rideTrain.userData.length / 2 + 0.2) {
        rideTrain = null; jake.position.z = 0; isJumping = true; jumpVelocity = -0.16;
      }
    } else {
      jake.position.z = 0;
    }
    jake.position.y = jakeY;

    // Jake runs in place while the track, sleepers and shops stream toward him.
    const gliding = hoverboardActive && (boardingTrain || rideTrain);
    const stride = gameState === 'running' && !isJumping && !gliding ? Math.sin(time * 17) : 0;
    runnerLegs[0].rotation.x = stride * 0.62;
    runnerLegs[1].rotation.x = -stride * 0.62;
    runnerShoes[0].position.y = 0.16 + Math.max(0, stride) * 0.16;
    runnerShoes[1].position.y = 0.16 + Math.max(0, -stride) * 0.16;
    runnerShoes[0].rotation.x = stride * 0.35;
    runnerShoes[1].rotation.x = -stride * 0.35;
    runnerArms[0].rotation.x = 0.2 - stride * 0.42;
    runnerArms[1].rotation.x = -0.2 + stride * 0.42;

    // Body sway & hoverboard tilt
    boardGroup.rotation.x = Math.sin(time * (gliding ? 5 : 14)) * 0.06;
    if (coinMagnet.visible) coinMagnet.rotation.z = Math.sin(time * 7) * 0.12;
    torsoGroup.rotation.y = Math.sin(time * 8) * 0.08;
    torsoGroup.rotation.x = -0.14;

    // Camera follow
    const cameraFollow = 1 - Math.exp(-8 * delta);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, jake.position.x * 0.42, cameraFollow);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, jakeY + 3.2, cameraFollow);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, jake.position.z + 7.2, cameraFollow);
    camera.lookAt(jake.position.x * 0.35, jakeY + 0.9, jake.position.z - 2.5);

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
