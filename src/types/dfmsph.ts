export type DensityType = '2pf' | '3pf' | 'ho' | 'gauss' | 'custom';

export type NNInteractionType = 
  | 'm3y_paris'
  | 'm3y_reid'
  | 'cdm3y6'
  | 'ddm3y1'
  | 'migdal'
  | 'rmf_nl3';

export interface NucleusConfig {
  name: string;
  Z: number;
  A: number;
  massMeV?: number;
  densityType: DensityType;
  c: number;        /* Half-density radius in fm */
  a: number;        /* Diffuseness parameter in fm */
  w: number;        /* 3pF parameter */
  b_ho?: number;    /* HO oscillator parameter in fm */
  alpha_ho?: number;/* HO alpha parameter */
}

export interface CalculationInput {
  proj: NucleusConfig;
  targ: NucleusConfig;
  nnType: NNInteractionType;
  energyLab: number;   /* Lab beam energy in MeV */
  Lwave: number;       /* Angular momentum quantum number L */
  Rmin: number;        /* Minimum R in fm */
  Rmax: number;        /* Maximum R in fm */
  Rstep: number;       /* Radial step dR in fm */
}

export interface RadialPoint {
  R: number;           /* Inter-nuclear distance in fm */
  V_df: number;        /* Double folding nuclear potential in MeV */
  V_c: number;         /* Coulomb potential in MeV */
  V_cent: number;      /* Centrifugal potential in MeV */
  V_tot: number;       /* Total potential V_df + V_c + V_cent in MeV */
  V_ws: number;        /* Woods-Saxon fit potential in MeV */
}

export interface DensityPoint {
  r: number;           /* Radius in fm */
  rho_proj: number;    /* Projectile density in fm^-3 */
  rho_targ: number;    /* Target density in fm^-3 */
}

export interface BarrierResult {
  V_b: number;         /* Coulomb barrier height in MeV */
  R_b: number;         /* Barrier radius in fm */
  hbar_omega: number;  /* Barrier curvature hbar*omega in MeV */
  V0_ws: number;       /* Fitted Woods-Saxon depth V0 in MeV */
  R0_ws: number;       /* Fitted Woods-Saxon radius R0 in fm */
  a_ws: number;        /* Fitted Woods-Saxon diffuseness a in fm */
  rms_fit: number;     /* RMS fit error in MeV */
}

export interface FusionCrossSectionPoint {
  E_cm: number;        /* Center-of-mass energy in MeV */
  crossSectionMb: number; /* Cross section in millibarns (mb) */
  penetrability: number;  /* Penetrability P(E) [0..1] */
}

export interface CalculationOutput {
  systemName: string;
  E_cm: number;
  reducedMassAmu: number;
  barrier: BarrierResult;
  radialData: RadialPoint[];
  densityData: DensityPoint[];
  fusionData: FusionCrossSectionPoint[];
  cInputText: string;
  cOutputText: string;
  cLogText?: string;
  isNativeExecution?: boolean;
}

export interface PresetReaction {
  id: string;
  label: string;
  description: string;
  input: CalculationInput;
}
