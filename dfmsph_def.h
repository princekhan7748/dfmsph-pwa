#ifndef DFMSPH_DEF_H
#define DFMSPH_DEF_H

#include <stdio.h>
#include <math.h>
#include <time.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include <ctype.h>

#define  ver 22
#define  irhoup  1000
#define  pi   	acos(-1.)	/* 3.141592654 */
#define  ikGup  49  /*(ikGup-1)*2=number of knots for integration must be 11 or 21 or 49 */
 
#define sq4pi	sqrt(4.*pi)
#define hbarc	197.327			 		/* MeV fm */
#define BH0   ((hbarc*g_om*g_om)/pi)    //10395.
#define bh0   (m_om/hbarc)              //3.97
#define BH1   ((hbarc*g_ro*g_ro)/pi)  	//1257.
#define bh1   (m_ro/hbarc)              //3.87
#define BH2   (-(hbarc*g_si*g_si)/pi)   //(-6554.)
#define bh2   (m_si/hbarc)              //2.58
#define BH3   ((hbarc*g_2*g_2)/pi)     	//6830.
#define bh3   (2.*m_si/hbarc)          	//5.15
#define BH4  ((hbarc*g_3*g_3)/pi)      	//52384.
#define bh4   (3.*m_si/hbarc)          	//7.73
#define BH5  (-(hbarc*ksi*ksi)/pi)     	//-22.61
#define bh5  (3.*m_om/hbarc)           	//(3.97*3.)

#define  a_coul		1.44 		/* MeV e^2*k_el */
#define  m_nucleon	0.01044		/* 1e-42*MeV*sec**2/fm**2 */
#define  hbar       0.658       /* 1e-21*MeV*sec */
#define  CS         0.027800278 /* coefficient for Fermi momentum */
#define  irmax      10000      	/* dimension of the U(R) array */
#define  outUR    	"OUT_U_R.c"

#define  input22		"INP_DFMSPH22.c"	/* input file */
#define  inputNN		"INP_NN_forces.c"	/* input file */
#define  alittle    	1e-10
#define end_of_data  	123456789

extern int	NUM;

extern long	code_end,
	    Entry,
        deliR,
		i_bar,irho,idif,irhofinP,irhofinT,iC2b,
		i1chi2,iR,i1,ii,it,iter,
		iAP,iAT,iNUC,iZP,iZT,jj,jRMF,
		irup,ir,is,iterdim[irmax],
		key_DD,key_exc,key_UC,key_vNN,dens_typ,
		typ,
		priz;

extern double	absGRADrho,
		alDD,a0WS,
		aWS,aWSmin,aWSmax,aWSstep,aWSmem,
		AdelCorr,
		A40,A25,Adel,a40,a25,
		Aex1,Aex2,Aex3,aex1,aex2,aex3,
		AP1,AT1,AP,AT,APT,AP13,AT13,APT13,
        aGKmin,aGKmax,aGKstep,aGKmem,
		A0GKpot, A1GKpot, A2GKpot,aGKpot,
		Aex1Re,Aex2Re,Aex3Re,aex1Re,aex2Re,aex3Re,
		A40Re, A25Re, AdelRe,CElRe, a40Re, a25Re, 
		Aex1Pa,Aex2Pa,Aex3Pa,aex1Pa,aex2Pa,aex3Pa,
		A40Pa, A25Pa, AdelPa,CElPa, a40Pa, a25Pa, AdelBh,
		
        beDD,
		BfusDFPsph,BZ,

		C2b,C3b,chi2WS,chi2GK,chi2WSmin,chi2GKmin,CDD,CEl,Crup,
		
		delta,distP,distT,
		dR,
		DxDr,D2xDr2,DrhoDr,D2rhoDr2,

		eps_iter,epsVN,epsRav_up,
		Elab,ECM,

		fRBstart, fRBfin,	//the part of RB for R_ini in approximation: RCCstart=fRB_ini*r_bar

		gDD,g_om,g_ro,g_si,g_2,g_3,
		Hom,

		iter_up,

		k,k_up,ksi,
		key_C,key_D,key_vN,key_ex,

		LAPLACErho,

		Mig_fex,Mig_fexprime,Mig_fin,Mig_finprime,Mig_C_MF,
		m_red,m_om,m_ro,m_si,

		Nrho_centCP,Nrho_centCT,NT,NP,NP1,NT1,
		
		rStepP,rStepT,r,r0,r0WS,r_bar,ratiter,rho,rup,
		rWS,rWSmin,rWSmax,rWSstep,rWSmem,
        r0GK,rGKmin,rGKmax,rGKstep,rGKmem,
		R,RCM,
		RCCstart,RCCfin,RCCstep,
		r0GKpot,RP0WS,RTav,RTavch,RT0WS,
		RPT0,

		sig,sup,

		tup,

		UC, UCD, UCex,
		Umem,
		Uex, 	/* nuclear exchange DF potential */
		UNCD,	/* nuclear direct+Coulomb DF potential */
		UND, 	/* nuclear direct DF potential */
		UN,Utot,UDFP,
		U00P,U00M,
		UC00P,UC00M,

		V0WS,
		VWS,VWSmin,VWSmax,VWSstep,VWSmem,

		ZP,ZT,ZP1,ZT1;

extern double	Amemdim[5],	
		Amindim[3],Amaxdim[3],Astepdim[3],
		alDDdim[10],
		avdim[2][19],
		AGden[2][19],
		AprimeP[2][3][ikGup+1],AprimeM[2][3][ikGup+1],
		BprimeP[2][3][ikGup+1],BprimeM[2][3][ikGup+1],

		beDDdim[10],

		CDDdim[10],

		diffusPmem[3],diffusTmem[3],
		diffusCP,diffusCT,diffusDP[3],diffusDT[3],

		GCexMdim[ikGup+1],GCexPdim[ikGup+1],
		GexMdim[ikGup+1],GexPdim[ikGup+1],gDDdim[10],


		hCdim[ikGup+1][ikGup+1][2],
		hCdimMM[ikGup+1][ikGup+1][2],hCdimPM[ikGup+1][ikGup+1][2],
        hCdimMP[ikGup+1][ikGup+1][2],hCdimPP[ikGup+1][ikGup+1][2],
		hdim[ikGup+1][ikGup+1][2],
		hdimMM[ikGup+1][ikGup+1][2],hdimPM[ikGup+1][ikGup+1][2],
        hdimMP[ikGup+1][ikGup+1][2],hdimPP[ikGup+1][ikGup+1][2],
		hdirdimP[2][7][ikGup+1],hdirdimM[2][7][ikGup+1],

		IntMh[ikGup+1],IntPh[ikGup+1],

		j[9][4001],

		kFBdim[100][19],key_difP[4],key_difT[4],
		kMdim[ikGup+1],kPdim[ikGup+1],

		Nrho_centDP[2],Nrho_centDT[2],

		QGdendim[100][19],

		RCMdim[irmax],RMFpar_dim[10][10],
		RGdendim[100][19],RGden[2][19],
		R0[2],RP0,RT0,r00,
		rhoMh[ikGup+1],rhoPh[ikGup+1],
        rP_dim[irhoup+1],rhoP_c_dim[irhoup+1],rhoP_p_dim[irhoup+1],
                         rhoP_n_dim[irhoup+1],rhoP_m_dim[irhoup+1],
        rT_dim[irhoup+1],rhoT_c_dim[irhoup+1],rhoT_p_dim[irhoup+1],
                         rhoT_n_dim[irhoup+1],rhoT_m_dim[irhoup+1],
        rhoP_dim[irhoup+1],rhoT_dim[irhoup+1],
		sssM[ikGup+1],sssP[ikGup+1],

		tttM[ikGup+1],tttP[ikGup+1],

		UNdim[irmax],Utotdim[irmax],UCdim[irmax],Uexdim[irmax],UNDdim[irmax],UCexdim[irmax],UCDdim[irmax],

		WW[ikGup+1],WW20[10+1],WW40[20+1],WW96[48+1],

		XX[ikGup+1],XX20[10+1],XX40[20+1],XX96[48+1],

        ydim  [ikGup+1][ikGup+1][2],
        ydimMM[ikGup+1][ikGup+1][2],ydimPM[ikGup+1][ikGup+1][2],
        ydimMP[ikGup+1][ikGup+1][2],ydimPP[ikGup+1][ikGup+1][2],

		zdim  [ikGup+1][ikGup+1][2][2],
		zdirdimP[2][7][ikGup+1],zdirdimM[2][7][ikGup+1],
		zdimMM[ikGup+1][ikGup+1][2][2],zdimPM[ikGup+1][ikGup+1][2][2],
        zdimMP[ikGup+1][ikGup+1][2][2],zdimPP[ikGup+1][ikGup+1][2][2];

extern char	Title[110],Title1[110],
        Title_RBHF_rho_P[200],Title_RBHF_rho_T[200];

extern FILE 	*f_ex1,*f_ex2,*f_in, *Out;


/****************************<dfmsph_mai.c>****************************/
void FUN_WS_DFP();	/* approx the DFP potential near the barrier by a WS profile */
void FUN_GK_DFP();	/* approx the DFP potential near the barrier by a GK profile */

/****************************<dfmsph_fun.c>****************************/
double FUN_CubeInterpD2gDx2(double x, double *ydim, double *gdim);
double FUN_CubeInterpDgDx(double x, double *ydim, double *gdim);
double FUN_CubeInterp(double x, double *ydim, double *gdim);
long FUN_CheckIndex(long down, long index, long up);
double FUN_j0BRay(double x);
double FUN_Dj0BRayDx(double x);
double FUN_D2j0BRayDx2(double x);
void FUN_GAUSS();
int FUN_Number();

/****************************<dfmsph_inp.c>****************************/
void FUN_Read_rho();
double FUN_RHOtable(double r,long iNUC, long dens_typ);
void FUN_INP();
void FUN_DFP_INI();
void FUN_DFP_NNforce_INI();

/****************************<dfmsph_pot.c>****************************/
//******** Functions which are common for the M3Y, RMF and Migdal ****************
double FUN_Hom();
double FUN_UC00(double a, double b);
double FUN_WSPOT(double rCC, double A12, double V0, double r0, double a0);
double FUN_GKPOT(double rCC, double A12, double A0GKpot, double A1GKpot, double A2GKpot, double r0GKpot, double aGKpot);

//******** Functions for the M3Y and RMF potentials****************
double FUN_VNNDIR(double k);
double VNN_dir_r(double rr);
double FUN_A12NEW_M3Y(double k, double a, double b);
void   FUN_APM_M3Y();
double FUN_VNNEXCDEL(double k);
double FUN_HDIR(double k, double a, double b);
double FUN_ZDIR(double k, double a, double b);
double FUN_UNDIR(double a, double b);
double FUN_UNEXCDEL(double a, double b);
double FUN_DFPFIN(double rCC);
double FUN_DFPDEL(double rCC);

//******** Functions for the Migdal potential****************
double FUN_A12NEW_MIG(double k, double a, double b, long dens_typ);
void   FUN_APM_MIG();
double FUN_UNMF(double a, double b);
double FUN_B12NEW(double k, double a, double b, long dens_typ);

/****************************dfmsph14_exc.c******************************/
double FUN_KFERMI(double r, long iNUC);
double FUN_HEX(double t, double s, long iNUC);
double FUN_YEX(double t, double s, long iNUC);
double FUN_ZEX(double t, double s, long iNUC, long m);
void   FUN_HYEX();
void   FUN_HCYEX();
double FUN_VEX(double s);
double FUN_VCEX(double s);
double FUN_GEX(double R, double s);
double FUN_GCEX(double R, double s);
double FUN_UEX(double El, double R);
double FUN_UCEX(double El, double R);

/****************************dfmsph_out.c******************************/
void FUN_DFPOUT();
void FUN_SEAL(FILE *f_exn);
void FUN_key_vNN(FILE *Out);

#endif
