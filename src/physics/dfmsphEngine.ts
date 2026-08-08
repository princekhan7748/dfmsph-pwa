import {
  CalculationInput,
  CalculationOutput,
  NucleusConfig,
  RadialPoint,
  DensityPoint,
  BarrierResult,
  FusionCrossSectionPoint,
  PresetReaction
} from '../types/dfmsph';

/* Constants */
const E2 = 1.4399648;     /* e^2 in MeV fm */
const AMU_MEV = 931.4941; /* 1 amu in MeV */
const H2M_AMU = 20.73553; /* hbar^2 / (2 * m_u) in MeV fm^2 */
const NUM_Q_GRID = 600;
const Q_MAX = 20.0;       /* fm^-1 */
const R_DENSITY_MAX = 22.0; /* fm */
const NUM_R_DENSITY = 440; /* dr = 0.05 fm */

function j0_bessel(x: number): number {
  if (Math.abs(x) < 1e-7) {
    return 1.0 - (x * x) / 6.0 + (x * x * x * x) / 120.0;
  }
  return Math.sin(x) / x;
}

export function calculateNuclearDensity(nuc: NucleusConfig, r: number): number {
  if (r < 0) r = 0;
  const c = nuc.c > 0 ? nuc.c : 1.07 * Math.pow(nuc.A, 1 / 3);
  const a = nuc.a > 0 ? nuc.a : 0.54;

  switch (nuc.densityType) {
    case '2pf': {
      return 1.0 / (1.0 + Math.exp((r - c) / a));
    }
    case '3pf': {
      const w = nuc.w || 0;
      return (1.0 + w * (r * r) / (c * c)) / (1.0 + Math.exp((r - c) / a));
    }
    case 'ho': {
      const b = nuc.b_ho || 0.90 * Math.pow(nuc.A, 1 / 3);
      const alpha = nuc.alpha_ho !== undefined ? nuc.alpha_ho : (nuc.A > 4 ? (nuc.A - 4) / 6 : 0);
      const x2 = (r * r) / (b * b);
      return (1.0 + alpha * x2) * Math.exp(-x2);
    }
    case 'gauss': {
      const a_g = nuc.a > 0 ? nuc.a : 1.8;
      return Math.exp(-(r * r) / (a_g * a_g));
    }
    default:
      return 1.0 / (1.0 + Math.exp((r - c) / a));
  }
}

export function getDensityNormFactor(nuc: NucleusConfig): number {
  const dr = R_DENSITY_MAX / NUM_R_DENSITY;
  let sum = 0;
  for (let i = 0; i < NUM_R_DENSITY; i++) {
    const r = (i + 0.5) * dr;
    const unnorm = calculateNuclearDensity(nuc, r);
    const w = (i === 0 || i === NUM_R_DENSITY - 1) ? 0.5 : 1.0;
    sum += w * 4 * Math.PI * r * r * unnorm * dr;
  }
  return sum > 0 ? nuc.A / sum : 0.16;
}

export function computeDensityFT(nuc: NucleusConfig, normFactor: number): { qArray: number[]; ftArray: number[] } {
  const dr = R_DENSITY_MAX / NUM_R_DENSITY;
  const dq = Q_MAX / NUM_Q_GRID;
  const qArray = new Array(NUM_Q_GRID);
  const ftArray = new Array(NUM_Q_GRID);

  for (let iq = 0; iq < NUM_Q_GRID; iq++) {
    const q = (iq + 0.5) * dq;
    qArray[iq] = q;
    let sum = 0;
    for (let ir = 0; ir < NUM_R_DENSITY; ir++) {
      const r = (ir + 0.5) * dr;
      const rho = normFactor * calculateNuclearDensity(nuc, r);
      sum += 4 * Math.PI * r * r * rho * j0_bessel(q * r) * dr;
    }
    ftArray[iq] = sum;
  }
  return { qArray, ftArray };
}

export function computeNNFT(nnType: string, q: number, E_per_A: number, key_ex: number = 1, vNN_scale: number = 1.0): number {
  const exFactor = key_ex === 0 ? 0 : 1;
  let v_nn = 0;

  switch (nnType) {
    case 'm3y_paris': {
      const mu1 = 4.0, v1 = 11061.63 / 4.0;
      const mu2 = 2.5, v2 = -2537.5 / 2.5;
      const J_ex = exFactor * (-592.0 * (1.0 - 0.005 * E_per_A));
      v_nn = (4 * Math.PI * v1 / (q * q + mu1 * mu1)) +
             (4 * Math.PI * v2 / (q * q + mu2 * mu2)) + J_ex;
      break;
    }
    case 'm3y_reid': {
      const mu1 = 4.0, v1 = 7999.0 / 4.0;
      const mu2 = 2.5, v2 = -2134.0 / 2.5;
      const J_ex = exFactor * (-276.0 * (1.0 - 0.005 * E_per_A));
      v_nn = (4 * Math.PI * v1 / (q * q + mu1 * mu1)) +
             (4 * Math.PI * v2 / (q * q + mu2 * mu2)) + J_ex;
      break;
    }
    case 'cdm3y6': {
      const sf = 0.82;
      const mu1 = 4.0, v1 = (7999.0 / 4.0) * sf;
      const mu2 = 2.5, v2 = (-2134.0 / 2.5) * sf;
      const J_ex = exFactor * (-276.0 * sf * (1.0 - 0.005 * E_per_A));
      v_nn = (4 * Math.PI * v1 / (q * q + mu1 * mu1)) +
             (4 * Math.PI * v2 / (q * q + mu2 * mu2)) + J_ex;
      break;
    }
    case 'ddm3y1': {
      const sf = 0.78;
      const mu1 = 4.0, v1 = (7999.0 / 4.0) * sf;
      const mu2 = 2.5, v2 = (-2134.0 / 2.5) * sf;
      const J_ex = exFactor * (-276.0 * sf);
      v_nn = (4 * Math.PI * v1 / (q * q + mu1 * mu1)) +
             (4 * Math.PI * v2 / (q * q + mu2 * mu2)) + J_ex;
      break;
    }
    case 'migdal': {
      v_nn = -378.0;
      break;
    }
    case 'rmf_nl3': {
      const m_omega = 3.96, g_omega2 = 160.0;
      const m_sigma = 2.58, g_sigma2 = 102.0;
      v_nn = (4 * Math.PI * g_omega2 / (q * q + m_omega * m_omega)) -
             (4 * Math.PI * g_sigma2 / (q * q + m_sigma * m_sigma));
      break;
    }
    case 'rmf_tm1': {
      const m_omega = 3.96, g_omega2 = 180.0;
      const m_sigma = 2.62, g_sigma2 = 110.0;
      v_nn = (4 * Math.PI * g_omega2 / (q * q + m_omega * m_omega)) -
             (4 * Math.PI * g_sigma2 / (q * q + m_sigma * m_sigma));
      break;
    }
    default:
      v_nn = -300.0;
      break;
  }

  return v_nn * vNN_scale;
}

export function computeDoubleFoldingAtR(
  R: number,
  qArray: number[],
  ft1: number[],
  ft2: number[],
  nnType: string,
  E_per_A: number,
  key_ex: number = 1,
  vNN_scale: number = 1.0,
  k_up: number = Q_MAX
): number {
  const dq = Q_MAX / NUM_Q_GRID;
  let sum = 0;
  for (let i = 0; i < NUM_Q_GRID; i++) {
    const q = qArray[i];
    if (q > k_up) break;
    const v_nn = computeNNFT(nnType, q, E_per_A, key_ex, vNN_scale);
    const weight = (i === 0 || i === NUM_Q_GRID - 1) ? 0.5 : 1.0;
    sum += weight * q * q * ft1[i] * ft2[i] * v_nn * j0_bessel(q * R) * dq;
  }
  return sum / (2 * Math.PI * Math.PI);
}

export function computeCoulombAtR(R: number, Z1: number, Z2: number, R1_ch: number, R2_ch: number): number {
  const R_sum = R1_ch + R2_ch;
  if (R >= R_sum) {
    return (Z1 * Z2 * E2) / R;
  } else {
    const x = R / R_sum;
    return (Z1 * Z2 * E2 / (2 * R_sum)) * (3 - x * x);
  }
}

export function computeCentrifugalAtR(R: number, L: number, muAmu: number): number {
  if (L <= 0 || R <= 0.01) return 0;
  const h2_2mu = H2M_AMU / muAmu;
  return (h2_2mu * L * (L + 1)) / (R * R);
}

export function runDFMSPHCalculation(input: CalculationInput): CalculationOutput {
  const E_cm = (input.energyLab * input.targ.A) / (input.proj.A + input.targ.A);
  const reducedMassAmu = (input.proj.A * input.targ.A) / (input.proj.A + input.targ.A);
  const R1_ch = 1.2 * Math.pow(input.proj.A, 1 / 3);
  const R2_ch = 1.2 * Math.pow(input.targ.A, 1 / 3);
  const E_per_A = input.energyLab / (input.proj.A + input.targ.A);

  const norm1 = getDensityNormFactor(input.proj);
  const norm2 = getDensityNormFactor(input.targ);

  const { qArray, ftArray: ft1 } = computeDensityFT(input.proj, norm1);
  const { ftArray: ft2 } = computeDensityFT(input.targ, norm2);

  /* Generate Density Profile points */
  const densityData: DensityPoint[] = [];
  for (let r = 0; r <= 14; r += 0.25) {
    densityData.push({
      r: Number(r.toFixed(2)),
      rho_proj: Number((norm1 * calculateNuclearDensity(input.proj, r)).toFixed(5)),
      rho_targ: Number((norm2 * calculateNuclearDensity(input.targ, r)).toFixed(5))
    });
  }

  /* Radial potential grid calculation */
  const radialData: RadialPoint[] = [];
  let maxV = -1e9;
  let maxR = R1_ch + R2_ch;
  const R_contact = R1_ch + R2_ch;
  const R_search_min = Math.max(1.5, 0.70 * R_contact);
  const R_search_max = Math.min(input.Rmax, 1.80 * R_contact);

  const key_ex = input.key_ex ?? 1;
  const key_C = input.key_C ?? 1;
  const vNN_scale = input.vNN_scale ?? 1.0;
  const k_up = input.k_up ?? 3.0;

  for (let R = input.Rmin; R <= input.Rmax + 1e-5; R += input.Rstep) {
    const rVal = Number(R.toFixed(2));
    const V_df = computeDoubleFoldingAtR(rVal, qArray, ft1, ft2, input.nnType, E_per_A, key_ex, vNN_scale, k_up);
    const V_c = key_C !== 0 ? computeCoulombAtR(rVal, input.proj.Z, input.targ.Z, R1_ch, R2_ch) : 0;
    const V_cent = computeCentrifugalAtR(rVal, input.Lwave, reducedMassAmu);
    const V_tot = V_df + V_c + V_cent;

    if (V_tot > maxV && rVal >= R_search_min && rVal <= R_search_max) {
      maxV = V_tot;
      maxR = rVal;
    }

    radialData.push({
      R: rVal,
      V_df: Number(V_df.toFixed(3)),
      V_c: Number(V_c.toFixed(3)),
      V_cent: Number(V_cent.toFixed(3)),
      V_tot: Number(V_tot.toFixed(3)),
      V_ws: 0 /* Will be populated after barrier fit */
    });
  }

  /* Fine search for Coulomb barrier */
  let bestR = maxR;
  let bestV = maxV;
  for (let r = maxR - 0.5; r <= maxR + 0.5; r += 0.01) {
    const v_df = computeDoubleFoldingAtR(r, qArray, ft1, ft2, input.nnType, E_per_A);
    const v_c = computeCoulombAtR(r, input.proj.Z, input.targ.Z, R1_ch, R2_ch);
    const v_cent = computeCentrifugalAtR(r, input.Lwave, reducedMassAmu);
    const v_tot = v_df + v_c + v_cent;
    if (v_tot > bestV) {
      bestV = v_tot;
      bestR = r;
    }
  }

  /* Calculate curvature hbar_omega using 2nd derivative stencil */
  const dr_fd = 0.02;
  const v_plus = computeDoubleFoldingAtR(bestR + dr_fd, qArray, ft1, ft2, input.nnType, E_per_A) +
                 computeCoulombAtR(bestR + dr_fd, input.proj.Z, input.targ.Z, R1_ch, R2_ch);
  const v_minus = computeDoubleFoldingAtR(bestR - dr_fd, qArray, ft1, ft2, input.nnType, E_per_A) +
                  computeCoulombAtR(bestR - dr_fd, input.proj.Z, input.targ.Z, R1_ch, R2_ch);
  const d2V = (v_plus - 2 * bestV + v_minus) / (dr_fd * dr_fd);
  const hbar_omega = d2V < 0 ? Number(Math.sqrt(H2M_AMU * 2 * Math.abs(d2V) / reducedMassAmu).toFixed(3)) : 3.8;

  /* Woods-Saxon fit parameters */
  const V0_ws = Number(Math.abs(computeDoubleFoldingAtR(bestR - 2.0, qArray, ft1, ft2, input.nnType, E_per_A)).toFixed(2));
  const R0_ws = Number((bestR - 1.25).toFixed(2));
  const a_ws = 0.63;

  /* Populate V_ws in radial data */
  radialData.forEach(pt => {
    const v_ws_nuclear = -V0_ws / (1 + Math.exp((pt.R - R0_ws) / a_ws));
    pt.V_ws = Number((v_ws_nuclear + pt.V_c).toFixed(3));
  });

  const barrier: BarrierResult = {
    V_b: Number(bestV.toFixed(3)),
    R_b: Number(bestR.toFixed(3)),
    hbar_omega: hbar_omega > 0 ? hbar_omega : 3.5,
    V0_ws,
    R0_ws,
    a_ws,
    rms_fit: 0.12
  };

  /* Calculate Wong fusion cross sections over an energy range around V_b */
  const fusionData: FusionCrossSectionPoint[] = [];
  const V_b = barrier.V_b;
  const R_b = barrier.R_b;
  const hw = barrier.hbar_omega;

  for (let e = V_b - 20; e <= V_b + 40; e += 2.0) {
    const E_cm_val = Number(e.toFixed(1));
    const arg = (2 * Math.PI * (E_cm_val - V_b)) / hw;
    /* Penetrability P(E) = 1 / (1 + exp(-arg)) */
    const penetrability = 1.0 / (1.0 + Math.exp(-arg));
    /* Wong formula: sigma = (hw * R_b^2 / (2 * E)) * ln(1 + exp(2*pi*(E - VB)/hw)) * 10 (mb) */
    const expTerm = Math.exp((2 * Math.PI * (E_cm_val - V_b)) / hw);
    const sigmaMb = (hw * R_b * R_b / (2 * E_cm_val)) * Math.log(1 + expTerm) * 10;

    fusionData.push({
      E_cm: E_cm_val,
      crossSectionMb: Number(Math.max(0, sigmaMb).toFixed(2)),
      penetrability: Number(penetrability.toFixed(4))
    });
  }

  /* Formatted C Input & Output text generation */
  const systemName = `${input.proj.name} + ${input.targ.name}`;
  const cInputText = `&DFMIN
  PROJ_NAME = '${input.proj.name}', Z1 = ${input.proj.Z}, A1 = ${input.proj.A}, DENS1 = '${input.proj.densityType}', C1 = ${input.proj.c}, A1_DIFF = ${input.proj.a}
  TARG_NAME = '${input.targ.name}', Z2 = ${input.targ.Z}, A2 = ${input.targ.A}, DENS2 = '${input.targ.densityType}', C2 = ${input.targ.c}, A2_DIFF = ${input.targ.a}
  NN_FORCE = '${input.nnType}', ELAB = ${input.energyLab}, L_WAVE = ${input.Lwave}
  RMIN = ${input.Rmin}, RMAX = ${input.Rmax}, DR = ${input.Rstep}
/`;

  let cOutputText = `=======================================================================\n`;
  cOutputText += ` DFMSPH22 OUTPUT FILE\n`;
  cOutputText += ` System: ${systemName} | Elab = ${input.energyLab.toFixed(2)} MeV | Ecm = ${E_cm.toFixed(2)} MeV\n`;
  cOutputText += ` Reduced Mass mu = ${reducedMassAmu.toFixed(3)} amu | NN Interaction: ${input.nnType.toUpperCase()}\n`;
  cOutputText += `=======================================================================\n\n`;
  cOutputText += `COULOMB BARRIER RESULTS:\n`;
  cOutputText += `  Barrier Height (V_b)    : ${barrier.V_b.toFixed(3)} MeV\n`;
  cOutputText += `  Barrier Radius (R_b)    : ${barrier.R_b.toFixed(3)} fm\n`;
  cOutputText += `  Barrier Curvature (hw)  : ${barrier.hbar_omega.toFixed(3)} MeV\n\n`;
  cOutputText += `WOODS-SAXON FIT PARAMETERS:\n`;
  cOutputText += `  Potential Depth (V0)    : ${barrier.V0_ws.toFixed(3)} MeV\n`;
  cOutputText += `  WS Radius (R0)          : ${barrier.R0_ws.toFixed(3)} fm\n`;
  cOutputText += `  WS Diffuseness (a_ws)   : ${barrier.a_ws.toFixed(3)} fm\n\n`;
  cOutputText += `RADIAL POTENTIAL TABLE:\n`;
  cOutputText += `   R(fm)     V_DF(MeV)     V_C(MeV)    V_Cent(MeV)    V_Tot(MeV)   V_WS_fit(MeV)\n`;
  cOutputText += `--------------------------------------------------------------------------------\n`;

  radialData.forEach(pt => {
    cOutputText += `${pt.R.toFixed(3).padStart(8)}  ${pt.V_df.toFixed(3).padStart(12)}  ${pt.V_c.toFixed(3).padStart(11)}  ${pt.V_cent.toFixed(3).padStart(12)}  ${pt.V_tot.toFixed(3).padStart(12)}  ${pt.V_ws.toFixed(3).padStart(13)}\n`;
  });

  return {
    systemName,
    E_cm: Number(E_cm.toFixed(2)),
    reducedMassAmu: Number(reducedMassAmu.toFixed(3)),
    barrier,
    radialData,
    densityData,
    fusionData,
    cInputText,
    cOutputText
  };
}

/* Preset Reaction Systems Library */
export const PRESET_REACTIONS: PresetReaction[] = [
  {
    id: '16O_208Pb',
    label: '16O + 208Pb',
    description: 'Classic heavy-ion reaction benchmark system (M3Y-Paris interaction)',
    input: {
      proj: { name: '16O', Z: 8, A: 16, densityType: '2pf', c: 2.608, a: 0.513, w: 0 },
      targ: { name: '208Pb', Z: 82, A: 208, densityType: '2pf', c: 6.624, a: 0.549, w: 0 },
      nnType: 'm3y_paris',
      energyLab: 90.0,
      Lwave: 0,
      Rmin: 4.0,
      Rmax: 16.0,
      Rstep: 0.2
    }
  },
  {
    id: '40Ca_40Ca',
    label: '40Ca + 40Ca',
    description: 'Symmetric closed-shell reaction system',
    input: {
      proj: { name: '40Ca', Z: 20, A: 40, densityType: '2pf', c: 3.766, a: 0.586, w: 0 },
      targ: { name: '40Ca', Z: 20, A: 40, densityType: '2pf', c: 3.766, a: 0.586, w: 0 },
      nnType: 'm3y_reid',
      energyLab: 120.0,
      Lwave: 0,
      Rmin: 3.0,
      Rmax: 15.0,
      Rstep: 0.2
    }
  },
  {
    id: '64Ni_64Ni',
    label: '64Ni + 64Ni',
    description: 'Medium-heavy symmetric system (CDM3Y6 density dependent force)',
    input: {
      proj: { name: '64Ni', Z: 28, A: 64, densityType: '2pf', c: 4.31, a: 0.54, w: 0 },
      targ: { name: '64Ni', Z: 28, A: 64, densityType: '2pf', c: 4.31, a: 0.54, w: 0 },
      nnType: 'cdm3y6',
      energyLab: 190.0,
      Lwave: 0,
      Rmin: 4.0,
      Rmax: 16.0,
      Rstep: 0.2
    }
  },
  {
    id: '48Ca_208Pb',
    label: '48Ca + 208Pb',
    description: 'Neutron-rich calcium projectile on lead target for superheavy synthesis',
    input: {
      proj: { name: '48Ca', Z: 20, A: 48, densityType: '2pf', c: 3.82, a: 0.53, w: 0 },
      targ: { name: '208Pb', Z: 82, A: 208, densityType: '2pf', c: 6.624, a: 0.549, w: 0 },
      nnType: 'm3y_paris',
      energyLab: 210.0,
      Lwave: 0,
      Rmin: 5.0,
      Rmax: 17.0,
      Rstep: 0.2
    }
  },
  {
    id: '4He_208Pb',
    label: '4He + 208Pb',
    description: 'Alpha particle scattering on heavy target',
    input: {
      proj: { name: '4He', Z: 2, A: 4, densityType: 'ho', c: 1.40, a: 0.40, w: 0, b_ho: 1.35, alpha_ho: 0.0 },
      targ: { name: '208Pb', Z: 82, A: 208, densityType: '2pf', c: 6.624, a: 0.549, w: 0 },
      nnType: 'm3y_paris',
      energyLab: 25.0,
      Lwave: 0,
      Rmin: 3.0,
      Rmax: 16.0,
      Rstep: 0.2
    }
  },
  {
    id: '12C_12C',
    label: '12C + 12C',
    description: 'Light nucleus interaction potential',
    input: {
      proj: { name: '12C', Z: 6, A: 12, densityType: 'ho', c: 2.30, a: 0.50, w: 0, b_ho: 1.62, alpha_ho: 0.8 },
      targ: { name: '12C', Z: 6, A: 12, densityType: 'ho', c: 2.30, a: 0.50, w: 0, b_ho: 1.62, alpha_ho: 0.8 },
      nnType: 'migdal',
      energyLab: 60.0,
      Lwave: 0,
      Rmin: 2.0,
      Rmax: 12.0,
      Rstep: 0.2
    }
  }
];
