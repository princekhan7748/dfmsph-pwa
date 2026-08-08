#include "dfmsph_def.h"

double FUN_Hom()
{
	int i;double M_red,KK20,KK21,KK24,KK25,KK30,KK31, KK35,KK36,xx;
	KK20=KK21=KK24=KK25=KK30=KK31=KK35=KK36=xx=0;
	for(i=i_bar-iC2b;i<i_bar+iC2b;i++)
	{
		KK21+=pow(RCMdim[i]-r_bar, 2.)*Utotdim[i];
	    KK20+=pow(RCMdim[i]-r_bar, 2.)*BfusDFPsph;
		KK25+=pow(RCMdim[i]-r_bar, 5.);
	    KK24+=pow(RCMdim[i]-r_bar, 4.);
		
		KK31+=pow(RCMdim[i]-r_bar, 3.)*Utotdim[i];
	    KK30+=pow(RCMdim[i]-r_bar, 3.)*BfusDFPsph;
	    KK35+=pow(RCMdim[i]-r_bar, 5.);
	    KK36+=pow(RCMdim[i]-r_bar, 6.);
	}
	   
	C2b=xx=((KK21-KK20)*KK36-(KK31-KK30)*KK25)/(KK24*KK36-KK35*KK25);
	C3b=((KK21-KK20)*KK35-(KK31-KK30)*KK24)/(KK25*KK35-KK36*KK24);
	M_red=m_nucleon*AP*AT/(AP+AT);
	xx=hbar*sqrt(fabs(xx)/M_red);
	return (xx);
}

double FUN_UC00(double a, double b)
{
	static long ikk;
	static double integ,k,jB0_r_k;
	integ=0;r=RCM;
	for(ikk=1;ikk<ikGup;ikk++)
	{
   		k=kPdim[ikk];
   		jB0_r_k=1.;if(fabs(r*k)>alittle)jB0_r_k=sin(r*k)/(r*k);
   		UC00P=jB0_r_k*AprimeP[0][0][ikk]*AprimeP[1][0][ikk];
   		k=kMdim[ikk];
   		jB0_r_k=1.;if(fabs(r*k)>alittle)jB0_r_k=sin(r*k)/(r*k);
   		UC00M=jB0_r_k*AprimeM[0][0][ikk]*AprimeM[1][0][ikk];
   		integ+=WW[ikk]*(UC00P+UC00M);
	}
	integ*=(b-a)/2.*4.*pi*a_coul*(2./pi);
	if(key_vNN != 2)integ*=ZP*ZT/AP/AT;
	return(integ);
}

double FUN_WSPOT(double rCC, double A12, double V0, double r0, double a0)
{
	UN=V0/(1.+exp((rCC-r0*A12)/a0));
	return(UN);
}

double FUN_GKPOT(double rCC, double A12, double A0GKpot, double A1GKpot, double A2GKpot, double r0GKpot, double aGKpot)
{
	double RGK,VN;
	RGK=r0GKpot*A12;
	dR=	rCC-RGK;
	VN=-A0GKpot-A1GKpot*dR-A2GKpot*pow(dR,2.);
	VN*=log(1.+exp(-1.*dR/aGKpot));
	return(VN);
}

double FUN_VNNDIR(double k)
{
	double VNNdir = 0.;
	if(key_vNN==0 || key_vNN==1)VNNdir=4.*pi*(A40/a40/(k*k+a40*a40)+A25/a25/(k*k+a25*a25));
	if(key_vNN>2)
	{
		VNNdir=BH0/(k*k+bh0*bh0);
		VNNdir+=BH1/(k*k+bh1*bh1);
		VNNdir+=BH2/(k*k+bh2*bh2);
		VNNdir+=BH4/(k*k+bh4*bh4);
		VNNdir+=BH3*2.*(-k*k+3.*bh3*bh3)/pow((k*k+bh3*bh3),3.);
		VNNdir+=BH5/(k*k+bh5*bh5);
		VNNdir*=4.*pi/4.;
	}
	return(VNNdir);
}

double VNN_dir_r(double rr)
{
	double xx = 0.;
	rr+=alittle;
	if(key_vNN<2){
		xx=A40/(rr*a40)*exp(-rr*a40)+A25/(rr*a25)*exp(-rr*a25);}
	if(key_vNN>2){
		xx=BH0*exp(-rr*bh0)/rr+BH1*exp(-rr*bh1)/rr+BH2*exp(-rr*bh2)/rr
		+BH3*exp(-rr*bh3)*rr+BH4*exp(-rr*bh4)/rr+BH5*exp(-rr*bh5)/rr;xx=xx/4.;}
	return xx;
}

double FUN_A12NEW_M3Y(double k, double a, double b)
{
	static double argP,argM,integ,ANUC,Z,rhoP,rhoM,integ0;
	integ=0.;
	integ0=0;ANUC=AP*(-iNUC+1)+AT*iNUC;Z=ZP*(-iNUC+1)+ZT*iNUC;
	if(iNUC!=0 && iNUC!=1){printf("\n <<<<<< Unable to calculate APRIME: iNUC=%4ld >>>>>>>>>>>\n",iNUC);code_end=-20;return(-100);}
	for(ir=1;ir<ikGup;ir++)
	{
		argP=( XX[ir]*(b-a)+b+a)/2.;
		argM=(-XX[ir]*(b-a)+b+a)/2.;
	    rhoP=FUN_RHOtable(argP,iNUC,0);rhoM=FUN_RHOtable(argM,iNUC,0);
		integ+=WW[ir]*(argP*argP*rhoP*FUN_j0BRay(argP*k)+argM*argM*rhoM*FUN_j0BRay(argM*k));
   }
	integ*=(b-a)/2.*sqrt(4.*pi);
	return(integ);
}

void FUN_APM_M3Y()
{
	static long ikG;
	static double R0[2],rdo,rup;
	for(iNUC=0;iNUC<2;iNUC++)
	{
		R0[1]=RP0*(-iNUC+1)+RT0*iNUC;
   		rdo=0;
	 	rup=Crup*R0[1];
		typ=0;
		for(ikG=ikGup-1;ikG>0;ikG--)
		{AprimeM[iNUC][0][ikG]=FUN_A12NEW_M3Y(kMdim[ikG],rdo,rup);
		if(AP==1. && ZP==1. && iNUC==0)AprimeM[iNUC][0][ikG]=1./sq4pi;
		if(AP==1. && ZP==0  && iNUC==0)AprimeM[iNUC][0][ikG]=0.;
		}
      	for(ikG=1;ikG<ikGup;ikG++)
		{AprimeP[iNUC][0][ikG]=FUN_A12NEW_M3Y(kPdim[ikG],rdo,rup);
		if(AP==1. && ZP==1. && iNUC==0)AprimeP[iNUC][0][ikG]=1./sq4pi;
		if(AP==1. && ZP==0  && iNUC==0)AprimeP[iNUC][0][ikG]=0.;
		}
		typ=1;
		for(ikG=ikGup-1;ikG>0;ikG--)
		{
			AprimeM[iNUC][1][ikG]=FUN_A12NEW_M3Y(kMdim[ikG],rdo,rup);
			if(AP==1. && ZP==1. && iNUC==0)AprimeM[iNUC][1][ikG]=1./sq4pi;
			if(AP==1. && ZP==0  && iNUC==0)AprimeM[iNUC][1][ikG]=1./sq4pi;
			if(key_DD>0)hdirdimM[iNUC][1][ikG]=FUN_HDIR(kMdim[ikG],rdo,rup);
			if(key_DD>0)zdirdimM[iNUC][1][ikG]=FUN_ZDIR(kMdim[ikG],rdo,rup);
		}
      	for(ikG=1;ikG<ikGup;ikG++)
		{
			AprimeP[iNUC][1][ikG]=FUN_A12NEW_M3Y(kPdim[ikG],rdo,rup);
			if(AP==1. && ZP==1. && iNUC==0)AprimeP[iNUC][1][ikG]=1./sq4pi;
			if(AP==1. && ZP==0  && iNUC==0)AprimeP[iNUC][1][ikG]=1./sq4pi;
			if(key_DD>0)hdirdimP[iNUC][1][ikG]=FUN_HDIR(kPdim[ikG],rdo,rup);
			if(key_DD>0)zdirdimP[iNUC][1][ikG]=FUN_ZDIR(kPdim[ikG],rdo,rup);
	   	}
  	}
	return;
}

double FUN_VNNEXCDEL(double k)
{
	double VNNexcdel;
	VNNexcdel=Adel;
	return(VNNexcdel);
}

double FUN_HDIR(double k, double a, double b)
{
	static long ir;
	static double argP,argM,integ,ANUC,Z,rhoP,rhoM;
	integ=0.;
	ANUC=AP*(-iNUC+1)+AT*iNUC;Z=ZP*(-iNUC+1)+ZT*iNUC;
	if(iNUC!=0 && iNUC!=1){printf("\n <<<<<< unable to calculate HDIR: iNUC=%4ld >>>>>>>>>>>\n",iNUC);code_end=-20;return(-100);}
	for(ir=1;ir<ikGup;ir++)
	{
		argP=( XX[ir]*(b-a)+b+a)/2.;
		argM=(-XX[ir]*(b-a)+b+a)/2.;
		rhoP=FUN_RHOtable(argP,iNUC,0);rhoM=FUN_RHOtable(argM,iNUC,0);
        integ+=WW[ir]*(argP*argP*rhoP*FUN_j0BRay(argP*k)*exp(-beDD*rhoP)
		              +argM*argM*rhoM*FUN_j0BRay(argM*k)*exp(-beDD*rhoM));
   	}
	integ*=(b-a)/2.*sqrt(4.*pi);
	return(integ);
}

double FUN_ZDIR(double k, double a, double b)
{
	static long ir;
	static double argP,argM,integ,ANUC,Z,rhoP,rhoM;
	integ=0.;
	ANUC=AP*(-iNUC+1)+AT*iNUC;Z=ZP*(-iNUC+1)+ZT*iNUC;
	if(iNUC!=0 && iNUC!=1){printf("\n <<<<<< unable to calculate ZDIR: iNUC=%4ld >>>>>>>>>>>\n",iNUC);code_end=-20;return(-100);}
	for(ir=1;ir<ikGup;ir++)
	{
		argP=( XX[ir]*(b-a)+b+a)/2.;
		argM=(-XX[ir]*(b-a)+b+a)/2.;
		rhoP=FUN_RHOtable(argP,iNUC,0);rhoM=FUN_RHOtable(argM,iNUC,0);

		integ+=WW[ir]*(argP*argP*rhoP*FUN_j0BRay(argP*k)*rhoP
		              +argM*argM*rhoM*FUN_j0BRay(argM*k)*rhoM);
   }
	integ*=(b-a)/2.*sqrt(4.*pi);
	return(integ);
}

double FUN_UNDIR(double a, double b)
{
	static long ik;
	static double r,k,integ,jB0_r_k,UH00M,UH00P,UZ00M,UZ00P;
	integ=0;r=RCM;
	for(ik=1;ik<ikGup;ik++)
	{
		k=kPdim[ik];
		jB0_r_k=1.;if(fabs(r*k)>alittle)jB0_r_k=sin(r*k)/(r*k);
		U00P=FUN_VNNDIR(k)*k*k*AprimeP[0][1][ik]*AprimeP[1][1][ik]*jB0_r_k;
		UH00P=FUN_VNNDIR(k)*k*k*hdirdimP[0][1][ik]*hdirdimP[1][1][ik]*jB0_r_k;
 		UZ00P=FUN_VNNDIR(k)*k*k*jB0_r_k*	
       		(zdirdimP[0][1][ik]*AprimeP[1][1][ik]+
        	zdirdimP[1][1][ik]*AprimeP[0][1][ik]);

		k=kMdim[ik];
		jB0_r_k=1.;if(fabs(r*k)>alittle)jB0_r_k=sin(r*k)/(r*k);
		U00M=FUN_VNNDIR(k)*k*k*AprimeM[0][1][ik]*AprimeM[1][1][ik]*jB0_r_k;
		UH00M=FUN_VNNDIR(k)*k*k*hdirdimM[0][1][ik]*hdirdimM[1][1][ik]*jB0_r_k;
		UZ00M=FUN_VNNDIR(k)*k*k*jB0_r_k*
       		(zdirdimM[0][1][ik]*AprimeM[1][1][ik]+
        	zdirdimM[1][1][ik]*AprimeM[0][1][ik]);

		U00P*=(2./pi);U00M*=(2./pi);UH00P*=(2./pi);UH00M*=(2./pi);UZ00P*=(2./pi);UZ00M*=(2./pi);
 		integ+=CDD*WW[ik]*(U00P+U00M+alDD*(UH00P+UH00M)-gDD*(UZ00P+UZ00M));
	}
	integ*=(b-a)/2.*(1.-CEl*Elab/(AP+alittle));
	
	return(integ);
}

double FUN_UNEXCDEL(double a, double b)
{
	static long ik;
	static double k,integ,jB0_r_k;
	integ=0;r=RCM;
	for(ik=1;ik<ikGup;ik++)
	{
		k=kPdim[ik];
 		jB0_r_k=1.;if(fabs(r*k)>alittle)jB0_r_k=sin(r*k)/(r*k);
  		U00P=FUN_VNNEXCDEL(k)*k*k*AprimeP[0][1][ik]*AprimeP[1][1][ik]*jB0_r_k;
 		k=kMdim[ik];
 		jB0_r_k=1.;if(fabs(r*k)>alittle)jB0_r_k=sin(r*k)/(r*k);
  		U00M=FUN_VNNEXCDEL(k)*k*k*AprimeM[0][1][ik]*AprimeM[1][1][ik]*jB0_r_k;
 		U00P*=(2./pi);U00M*=(2./pi);
 		integ+=WW[ik]*(U00P+U00M);
	}
	integ*=(b-a)/2.*(1.-CEl*Elab/(AP+alittle));
	return(integ);
}

double FUN_DFPFIN(double rCC)
{
	UCD=0;
	Umem=UDFP;
	UND=FUN_UNDIR(0.,k_up);
	if(ZP>0)UCD=FUN_UC00(0.,k_up);
	if(iter==0)
	{
		Uex=FUN_UNEXCDEL(0.,k_up);
		UCex=0.;
	}
	UN=UND+Uex;
	if(ZP>0)UC=UCD+UCex;else UC=UCD;
	UDFP=UN+UC;
	Uex=FUN_UEX(Elab,rCC);
	UCex=FUN_UCEX(Elab,rCC);
	return(UDFP);
}

double FUN_DFPDEL(double rCC)
{
	if(fabs(rCC)<alittle)rCC=alittle;
	UND=FUN_UNDIR(0.,k_up);
	UC=0;if(ZP>0)UC=FUN_UC00(0.,k_up);
	Uex=FUN_UNEXCDEL(0.,k_up);
	UN=UND+Uex;
	UDFP=UN+UC;
	return(UDFP);
}

double FUN_UNMF(double niz, double verh)
{
	static long ik;
	static double r,k,integ,jB0_r_k;
	
	double FexPlus, FexMinus,FinPlus, FinMinus,a,g,alp,gam,
	       rhoP1T1,rhoP2T2,rhoP2T1,rhoP1T2;
	double A02_A12,B02_A12,A02_B12,A02_A11,B02_A11,A02_B11,A01_A11,
	       B01_A11,A01_B11,B01_A12,A01_A12,A01_B12;
	
	A02_A12=B02_A12=A02_B12=A02_A11=B02_A11=0;
	A02_B11=A01_A11=B01_A11=A01_B11=B01_A12=0;
	A01_A12=A01_B12=0;
	a=FexPlus=Mig_fex+Mig_fexprime;alp=FexMinus=Mig_fex-Mig_fexprime;
	g=FinPlus=Mig_fin+Mig_finprime;gam=FinMinus=Mig_fin-Mig_finprime;

	integ=0;r=RCM;
	rhoP1T1=(rhoP_p_dim[0]+rhoT_p_dim[0])/2.;
	rhoP2T2=(rhoP_n_dim[0]+rhoT_n_dim[0])/2.;
	rhoP2T1=(rhoP_n_dim[0]+rhoT_p_dim[0])/2.;
	rhoP1T2=(rhoP_p_dim[0]+rhoT_n_dim[0])/2.;
	for(ik=1;ik<ikGup;ik++)
	{
		k=kPdim[ik];
		jB0_r_k=1.;if(fabs(r*k)>alittle)jB0_r_k=sin(r*k)/(r*k);
		A02_A12+=WW[ik]*k*k*AprimeP[0][2][ik]*AprimeP[1][2][ik]*jB0_r_k;
		B02_A12+=WW[ik]*k*k*BprimeP[0][2][ik]*AprimeP[1][2][ik]*jB0_r_k;
        A02_B12+=WW[ik]*k*k*AprimeP[0][2][ik]*BprimeP[1][2][ik]*jB0_r_k;

		A02_A11+=WW[ik]*k*k*AprimeP[0][2][ik]*AprimeP[1][1][ik]*jB0_r_k;
		B02_A11+=WW[ik]*k*k*BprimeP[0][2][ik]*AprimeP[1][1][ik]*jB0_r_k; 
		A02_B11+=WW[ik]*k*k*AprimeP[0][2][ik]*BprimeP[1][1][ik]*jB0_r_k;

		A01_A11+=WW[ik]*k*k*AprimeP[0][1][ik]*AprimeP[1][1][ik]*jB0_r_k;
		B01_A11+=WW[ik]*k*k*BprimeP[0][1][ik]*AprimeP[1][1][ik]*jB0_r_k;
		A01_B11+=WW[ik]*k*k*AprimeP[0][1][ik]*BprimeP[1][1][ik]*jB0_r_k;

		B01_A12+=WW[ik]*k*k*BprimeP[0][1][ik]*AprimeP[1][2][ik]*jB0_r_k;
		A01_A12+=WW[ik]*k*k*AprimeP[0][1][ik]*AprimeP[1][2][ik]*jB0_r_k;
		A01_B12+=WW[ik]*k*k*AprimeP[0][1][ik]*BprimeP[1][2][ik]*jB0_r_k;

		
		k=kMdim[ik];
		jB0_r_k=1.;if(fabs(r*k)>alittle)jB0_r_k=sin(r*k)/(r*k);
		A02_A12+=WW[ik]*k*k*AprimeM[0][2][ik]*AprimeM[1][2][ik]*jB0_r_k;
		B02_A12+=WW[ik]*k*k*BprimeM[0][2][ik]*AprimeM[1][2][ik]*jB0_r_k;
        A02_B12+=WW[ik]*k*k*AprimeM[0][2][ik]*BprimeM[1][2][ik]*jB0_r_k;
		
		A02_A11+=WW[ik]*k*k*AprimeM[0][2][ik]*AprimeM[1][1][ik]*jB0_r_k;
		B02_A11+=WW[ik]*k*k*BprimeM[0][2][ik]*AprimeM[1][1][ik]*jB0_r_k; 
		A02_B11+=WW[ik]*k*k*AprimeM[0][2][ik]*BprimeM[1][1][ik]*jB0_r_k;
		
		A01_A11+=WW[ik]*k*k*AprimeM[0][1][ik]*AprimeM[1][1][ik]*jB0_r_k;
		B01_A11+=WW[ik]*k*k*BprimeM[0][1][ik]*AprimeM[1][1][ik]*jB0_r_k;
		A01_B11+=WW[ik]*k*k*AprimeM[0][1][ik]*BprimeM[1][1][ik]*jB0_r_k;
		
		B01_A12+=WW[ik]*k*k*BprimeM[0][1][ik]*AprimeM[1][2][ik]*jB0_r_k;
		A01_A12+=WW[ik]*k*k*AprimeM[0][1][ik]*AprimeM[1][2][ik]*jB0_r_k;
		A01_B12+=WW[ik]*k*k*AprimeM[0][1][ik]*BprimeM[1][2][ik]*jB0_r_k;
	}
	integ=(A02_A12+A01_A11)*a+(A02_A11+A01_A12)*alp+
	      (B02_A12+A02_B12)*(g-a)/(rhoP2T2 + alittle)+ 
          (B01_A11+A01_B11)*(g-a)/(rhoP1T1 + alittle)+	
	      (B01_A12+A01_B12)*(gam-alp)/(rhoP1T2 + alittle)+	
		  (B02_A11+A02_B11)*(gam-alp)/(rhoP2T1 + alittle);
	
	integ*=(verh-niz)*Mig_C_MF/2.;
	return(integ);
}

double FUN_A12NEW_MIG(double k, double a, double b, long dens_typ)
{
	static double argP,argM,integ,ANUC,Z,rhoP,rhoM,integ0;
	integ=0.;
	integ0=0;ANUC=AP*(-iNUC+1)+AT*iNUC;Z=ZP*(-iNUC+1)+ZT*iNUC;
	if(iNUC!=0 && iNUC!=1){printf("\n <<<<<< Unable to calculate APRIME: iNUC=%4ld >>>>>>>>>>>\n",iNUC);code_end=-20;return(-100);}
	if(dens_typ!=0 && dens_typ!=1 && dens_typ!=2)
	{printf("\n <<<<<< Unable to calculate APRIME: dens_typ=%4ld >>>>>>>>>>>\n",dens_typ);code_end=-20;return(-100);}
	for(ir=1;ir<ikGup;ir++)
	{
		argP=( XX[ir]*(b-a)+b+a)/2.;
		argM=(-XX[ir]*(b-a)+b+a)/2.;
	    rhoP=FUN_RHOtable(argP,iNUC,dens_typ);rhoM=FUN_RHOtable(argM,iNUC,dens_typ);
		integ+=WW[ir]*(argP*argP*rhoP*FUN_j0BRay(argP*k)+argM*argM*rhoM*FUN_j0BRay(argM*k));
	}
	integ*=(b-a)/2.*sqrt(4.*pi);
	return(integ);
}

double FUN_B12NEW(double k, double a, double b, long dens_typ)
{
	static double argP,argM,integ,ANUC,Z,rhoP,rhoM,integ0;
	integ=0.;
	integ0=0;ANUC=AP*(-iNUC+1)+AT*iNUC;Z=ZP*(-iNUC+1)+ZT*iNUC;
	if(iNUC!=0 && iNUC!=1){printf("\n <<<<<< Unable to calculate BPRIME: iNUC=%4ld >>>>>>>>>>>\n",iNUC);code_end=-20;return(-100);}
	if(dens_typ!=0 && dens_typ!=1 && dens_typ!=2){printf("\n <<<<<< Unable to calculate BPRIME: dens_typ=%4ld >>>>>>>>>>>\n",
	 									  dens_typ);code_end=-20;return(-100);}
    
	if(dens_typ==0)return(0);
	for(ir=1;ir<ikGup;ir++)
	{
		argP=( XX[ir]*(b-a)+b+a)/2.;
		argM=(-XX[ir]*(b-a)+b+a)/2.;
	    rhoP=FUN_RHOtable(argP,iNUC,dens_typ);rhoM=FUN_RHOtable(argM,iNUC,dens_typ);
		integ+=WW[ir]*(argP*argP*rhoP*rhoP*FUN_j0BRay(argP*k)+argM*argM*rhoM*rhoM*FUN_j0BRay(argM*k));
	}
	integ*=(b-a)/2.*sqrt(4.*pi);
	return(integ);
}

void FUN_APM_MIG()
{
	static long id,ikG;
	static double R0[2],rdo,rup;
	for(iNUC=0;iNUC<2;iNUC++)
	{
		R0[1]=RP0*(-iNUC+1)+RT0*iNUC;
   		rdo=0;
	 	rup=Crup*R0[1];
		for (id=0;id<3;id++)
		{	
			for(ikG=ikGup-1;ikG>0;ikG--)
			{
				AprimeM[iNUC][id][ikG]=FUN_A12NEW_MIG(kMdim[ikG],rdo,rup,id);
				BprimeM[iNUC][id][ikG]=    FUN_B12NEW(kMdim[ikG],rdo,rup,id);
			}
			for(ikG=1;ikG<ikGup;ikG++)
			{
				AprimeP[iNUC][id][ikG]=FUN_A12NEW_MIG(kPdim[ikG],rdo,rup,id);
				BprimeP[iNUC][id][ikG]=FUN_B12NEW(kPdim[ikG],rdo,rup,id);
			}
		}
  	}
	return;
}
