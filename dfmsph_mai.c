#include "dfmsph_def.h"

int	NUM;

long	code_end,
	    Entry,
        deliR,
		i_bar,irho,idif,irhofinP,irhofinT,iC2b,
		i1chi2,iR,i1,ii,it,iter,
		iAP,iAT,iNUC,iZP,iZT,jj,jRMF,
		irup,ir,is,iterdim[irmax],
		key_DD,key_exc,key_UC,key_vNN,dens_typ,
		typ,
		priz;

double	absGRADrho,
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

		fRBstart, fRBfin,

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
		Uex,
		UNCD,
		UND,
		UN,Utot,UDFP,
		U00P,U00M,
		UC00P,UC00M,

		V0WS,
		VWS,VWSmin,VWSmax,VWSstep,VWSmem,

		ZP,ZT,ZP1,ZT1;

double	Amemdim[5],	
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

char	Title[110],Title1[110],
        Title_RBHF_rho_P[200],Title_RBHF_rho_T[200];

FILE 	*f_ex1,*f_ex2,*f_in, *Out;

int main()
{
	code_end=10;
	NUM = FUN_Number();
    FUN_INP();
	AP13=pow(AP,0.3333333);AT13=pow(AT,0.3333333);APT13=AP13+AT13;
	Hom= C2b=C3b=BZ=-10;BZ=ZT*ZP/APT13;
	if(code_end<0)return(1);
	Elab=ECM*APT/AT;
	for(is=1;is<ikGup;is++){rhoMh[is]=-200;rhoPh[is]=-200;}
	if(key_vNN<2)
	{
		if(key_exc==1)FUN_HYEX();
		if(key_UC>0) FUN_HCYEX();
	}
	Uex=0.;
	UCex=0.;

	printf("\n\n <<BARR <<<<<<<< RPT0=%6.2f >>>>>>>>>>>\n\n",RPT0);
	
	printf("\n <<mai-63 BARR>>>  RCCstart=%7.3f RCCfin=%7.3f RCCstep=%7.3f",RCCstart,RCCfin,RCCstep);
    printf("\n     rat   RCCstart    RCM   iter     UN        UC        Utot");
	for(RCM=RCCstart,ii=0;RCM>RCCfin;RCM-=RCCstep,ii++)
	{
		Entry=-6;FUN_CheckIndex(0,ii,irmax-1);
		if(key_vNN==2)
	    {
			UN=FUN_UNMF(0.,k_up);UC=FUN_UC00(0.,k_up);UNCD=UC+UN;
    	}
		if(key_vNN>2)UNCD=FUN_DFPDEL(RCM);
		
		if(key_vNN<2)	
		{
			for(iter=0;iter<iter_up/1;iter++)
			{
				iterdim[ii]=iter;
				if(key_exc==1)
					{UNCD=FUN_DFPFIN(RCM);ratiter=fabs((Umem-UDFP)/(Umem+UDFP-alittle));}
				if(key_exc==0){UNCD=FUN_DFPDEL(RCM);ratiter=alittle;}
				if(ratiter<eps_iter && iter>0)break;
			}
		}
		irup=ii;
		UCdim[ii]=UC;UCDdim[ii]=UCD;
		UNdim[ii]=UN;
		Utotdim[ii]=UNCD;
		RCMdim[ii]=RCM;
			
		if(ii==(ii/50)*50)printf("\n%9.2e %7.3f %7.3f %3ld  %12.4e %10.2e %12.4e ",ratiter,RCCstart,RCM,iter,UN,UC,UNCD);
	}
	
	for(RCM=RCCstart,ii=2;RCM>RCCfin;RCM-=RCCstep,ii++)
	{
		if(Utotdim[ii]>Utotdim[ii-1] && Utotdim[ii]>Utotdim[ii+1])
		{BfusDFPsph=Utotdim[ii];r_bar=RCM;i_bar=ii;break;}  
	}
	
	if(ZP>0)Hom=FUN_Hom();
	if(irup>irmax)irup=irmax;

	if(chi2WS>0){printf("\n........ Calculating chi2WSmin WS-approximation ..fast ................ \n");
		FUN_WS_DFP();}
	if(chi2GK>0){printf("\n..Wait calculating chi2GKmin GK-approximation .this lasts about a minute.... \n");
		FUN_GK_DFP();}
	
	printf("\n\n <<mai-39 <<<<<<<< r_bar=%7.3f >>>q_bar=%7.3f>> Ub=%7.2f >>>>>>\n\n",
	r_bar,r_bar/RPT0,BfusDFPsph);

	if((r_bar>(RCCfin-RCCstep) && r_bar<(RCCfin+RCCstep)) || r_bar==RCCstart)
		{printf("\n<<<<< Interval (%4.2lf, %4.2lf) doesn't contain the barrier! >>>>>",RCCstart,RCCfin);code_end=-44;}

	if(code_end<0){printf("\n<<<<<<<<<<<<<<<<<<<<<<<\n<<<<<  ABNORMAL TERMINATION  >>>>> code_end=%3ld\n\n",code_end);
		}
	else
	{ 
		printf("\n<< NUM=%5d <<<<<<<<<<  SUCCESSFUL TERMINATION  >>>>>>>>>>>>>>>\n",NUM);
		printf("\n<<<<<<<<<<<<<<<<<<<< See output files >>>>>>>>>>>>>>>>>>>>");
		printf("	\n <out_vNN_.c>  <OUT_U_R.c>  <out_dfmsph22.c> <out_inp_dfm22.c> \n");
	}
	FUN_DFPOUT();
	return(0);
}

void FUN_WS_DFP()
{
	chi2WSmin=100;rWSmem=10;VWSmem=-10000;aWSmem=1;
	for(rWS=rWSmin;rWS<rWSmax;rWS+=rWSstep)
 	{
		RP0WS=rWS*AP13;RT0WS=rWS*AT13;
 		for(VWS=VWSmin;VWS<VWSmax;VWS+=VWSstep)
   		{
	  		for(aWS=aWSmin;aWS<aWSmax;aWS+=aWSstep)
			{
		   		i1=0;
				for(ii=0;ii<irup;ii+=deliR)
				{
					if(RCMdim[ii]>fRBfin*r_bar && RCMdim[ii]<fRBstart*r_bar)
					{
				    	UN=VWS/(1.+exp((RCMdim[ii]-rWS*AP13-rWS*AT13)/aWS));
				     	epsVN=(UNdim[ii]-UN)/(UNdim[ii]+UN);
				     	chi2WS+=epsVN*epsVN;i1+=1;
					}
			  	}
		  		chi2WS/=i1;
		   		if(chi2WS<chi2WSmin){chi2WSmin=chi2WS;rWSmem=rWS;VWSmem=VWS;aWSmem=aWS;}
			}
		}
	}
	i1chi2=i1;
	return;
}

void FUN_GK_DFP()
{
	double r0appr,Rappr,aappr,epsVNappr,VN,Aappr[3];

	for(ii=0;ii<5;ii++)Amemdim[ii]=90.;chi2GKmin=90;

	for(r0appr=rGKmin;r0appr<rGKmax;r0appr+=rGKstep)
 	{
		Rappr=r0appr*APT13;
		for(Aappr[0]=Amindim[0];Aappr[0]<Amaxdim[0];Aappr[0]+=Astepdim[0])
   		{
			for(aappr=aGKmin;aappr<aGKmax;aappr+=aGKstep)
			{
				for(Aappr[1]=Amindim[1];Aappr[1]<Amaxdim[1];Aappr[1]+=Astepdim[1])
				{
					for(Aappr[2]=Amindim[2];Aappr[2]<Amaxdim[2];Aappr[2]+=Astepdim[2])
					{
						i1=0;
						for(ii=0;ii<irup;ii+=deliR)
						{
							if(RCMdim[ii]>fRBfin*r_bar && RCMdim[ii]<fRBstart*r_bar)
							{
								dR=	RCMdim[ii]-Rappr;
								VN=-Aappr[0]-Aappr[1]*dR-Aappr[2]*pow(dR,2.);
								VN*=log(1.+exp(-1.*dR/aappr));
								epsVNappr=(UNdim[ii]-VN)/(UNdim[ii]+VN);
								chi2GK+=epsVNappr*epsVNappr;i1+=1;
							}
						}
						chi2GK/=i1;
						if(chi2GK<chi2GKmin){chi2GKmin=chi2GK;Amemdim[3]=r0appr;
							for(ii=0;ii<3;ii++)Amemdim[ii]=Aappr[ii];
							Amemdim[4]=aappr;}
					}
				}
			}
		}
	}

	printf("\n i1chi2 r0appr   aapr   A1appr   A2appr    A3appr      chi2GKmin");
	printf("\n %3ld   %6.3f   %6.3f  %6.3f  %6.3f    %6.3f       %9.2e",
		   i1chi2, Amemdim[3],Amemdim[4],Amemdim[0],Amemdim[1],Amemdim[2],chi2GKmin);
	i1chi2=i1; 
	return;
}
