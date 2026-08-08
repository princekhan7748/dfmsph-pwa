#include "dfmsph_def.h"

void FUN_INP()
{
	if( (f_in=fopen(inputNN,"r"))==NULL){printf("== unable to open file INP_NN_forces.c=====\n");
		code_end=-1;return;}
	else printf("\n=== file INP_NN_forces.c is opened successfully ==== \n");
	fgets(Title,100,f_in);
	fgets(Title,100,f_in);
    fscanf(f_in,"%lf %lf %lf %lf %lf %lf\n",&Aex1Re,&Aex2Re,&Aex3Re,&aex1Re,&aex2Re,&aex3Re);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf %lf %lf %lf %lf %lf\n",&A40Re,&A25Re,&AdelRe,&CElRe,&a40Re,&a25Re );
	fgets(Title1,sizeof(Title1),f_in);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf %lf %lf %lf %lf %lf\n",&Aex1Pa,&Aex2Pa,&Aex3Pa,&aex1Pa,&aex2Pa,&aex3Pa);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf %lf %lf %lf %lf %lf\n",&A40Pa,&A25Pa,&AdelPa,&CElPa,&a40Pa,&a25Pa );
	fgets(Title1,sizeof(Title1),f_in);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf %lf %lf %lf %lf \n",
	&Mig_fex,&Mig_fexprime,&Mig_fin,&Mig_finprime,&Mig_C_MF);
	fgets(Title1,sizeof(Title1),f_in);
	fgets(Title1,sizeof(Title1),f_in);
	for(jj=0;jj<6;jj++){fscanf(f_in,"%ld ",&jRMF);
	for(ii=0;ii<9;ii++)fscanf(f_in,"%lf ",&RMFpar_dim[jj][ii]);
	fscanf(f_in,"%lf \n",&RMFpar_dim[jj][9]);}
	fgets(Title1,sizeof(Title1),f_in);
	fclose(f_in);

	if( (f_in=fopen(input22,"r"))==NULL)
	{
		printf("== unable to open file inp_dfmsph22.c=====\n");
		code_end=-1;return;
	}
	else printf("\n=== file inp_dfmsph22.c is opened successfully ==== \n");
	fgets(Title,100,f_in);
	fgets(Title,100,f_in);
    fscanf(f_in,"%lf %lf %ld\n",&ECM,&r00,&iC2b);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf%lf%lf%lf\n", &ZP,&AP,&ZT,&AT);
	fgets(Title1,sizeof(Title1),f_in);
    fscanf(f_in,"%lf%lf%lf%lf%lf%lf\n",	&iter_up,&key_ex,&key_vN,&key_D,&key_C,&AdelCorr);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf%lf%lf%lf%lf%lf\n",&k_up,&Crup,&eps_iter,&RCCstart,&RCCfin,&RCCstep);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf%lf%lf%lf%lf%lf%lf%lf%lf%lf\n",
		   &rWSmin,&rWSmax,&rWSstep,&VWSmin,&VWSmax,&VWSstep,&aWSmin,&aWSmax,&aWSstep,&chi2WS);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf%lf%ld\n",&fRBstart,&fRBfin,&deliR);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf%lf%lf%lf%lf%lf\n",
			&rGKmin,&rGKmax,&rGKstep,&aGKmin,&aGKmax,&aGKstep);
	fgets(Title1,sizeof(Title1),f_in);
	fscanf(f_in,"%lf%lf%lf%lf%lf%lf%lf%lf%lf%lf\n",
			&Amindim[0],&Amaxdim[0],&Astepdim[0],&Amindim[1],&Amaxdim[1],&Astepdim[1],
			&Amindim[2],&Amaxdim[2],&Astepdim[2],&chi2GK);
	fgets(Title1,sizeof(Title1),f_in);
	fclose(f_in);

	printf("\n=== file inp_dfmsph.inp is closed successfully == \n");
	if(ZT>AT){printf("\n inp-63 ZT=%4.0f > AT=%4.0f===== \n",ZT,AT);code_end=-10;return;}
	if(ZP>AP){printf("\n inp-64 ZP=%4.0f > AP=%4.0f===== \n",ZP,AP);code_end=-10;return;}
	if(AP<1 || AT<1){printf("\n ==== Mass numbers must be positive: AP=%f AT=%f  ==== \n",AP,AT);code_end=-10;return;}
	if(AP<2 && key_vN==2){printf("\n inp-66 ==== MIG calculations with proton/neutron are not possible: AP=%f ZP=%f  ==== \n",AP,ZP);
	code_end=-10;return;}
	if(AP<2 && key_D>0){printf("\n inp-68 = Density dependent calcs with proton/neutron are not possible: key_DD=%2.0f AP=%f ZP=%f   ==== \n",
	key_D,AP,ZP);
	code_end=-10;return;}
    
    if(key_ex!=0 && key_ex!=1)
	{printf("\n ======= Bad parameter key_exc=%lf. It must be 0 or 1 ==== \n",key_ex);code_end=-110;return;}
	key_exc=key_ex/1;
	if(RCCstart<RCCfin)
	{
		printf("\n ======= Bad: RCCstart=%lf <RCCfin=%lf. It must be other way around ==== \n",RCCstart,RCCfin);
		code_end=-110;return;
	}

	if(iter_up<1)
	{
		printf("\n ======= Bad parameter iter_up=%lf. It must be positive! Recommended value 30 ==== \n",iter_up);
		code_end=-110;return;
	}
	if(key_vN!=0 && key_vN!=1 && key_vN!=2 && key_vN!=11 && key_vN!=12 && key_vN!=13 && key_vN!=14 && key_vN!=21 && key_vN!=23)
	{printf("\n ======= Bad parameter key_vNN=%lf. It must be 0, 1, 2; 11, 12, 13, 14, 21, 23==== \n",key_vN);code_end=-115;return;}
	key_vNN=key_vN/1;
	key_DD=key_D/1;
	if(key_C!=0 && key_C!=1)
	{printf("\n ======= Bad parameter key_UC=%lf. It must be 0 or 1 ==== \n",key_C);code_end=-116;return;}
	key_UC=key_C/1;
	NP=AP-ZP;NT=AT-ZT;
	CDDdim[0]=1.;    alDDdim[0]=       beDDdim[0]=       gDDdim[0]=0.;    
	CDDdim[1]=0.2963;alDDdim[1]=3.7231;beDDdim[1]=3.7384;gDDdim[1]=0.;    
	CDDdim[2]=0.3429;alDDdim[2]=3.0232;beDDdim[2]=3.5512;gDDdim[2]=0.5;   
	CDDdim[3]=0.3346;alDDdim[3]=3.0357;beDDdim[3]=3.0685;gDDdim[3]=1.0;   
	CDDdim[4]=0.2985;alDDdim[4]=3.4528;beDDdim[4]=2.6388;gDDdim[4]=1.5;   
	CDDdim[5]=0.3052;alDDdim[5]=3.2998;beDDdim[5]=2.3180;gDDdim[5]=2.0;   
	CDDdim[6]=0.2728;alDDdim[6]=3.7367;beDDdim[6]=1.8294;gDDdim[6]=3.0;   
	CDDdim[7]=0.2658;alDDdim[7]=3.8033;beDDdim[7]=1.4099;gDDdim[7]=4.0;   
	CDDdim[8]=1.2521;alDDdim[8]=       beDDdim[8]=0.;    gDDdim[8]=1.7452;

	printf("\nrWSmin rWSmax rWSstep VWSmin VWSmax VWSstep aWSmin aWSmax aWSstep");
	printf("\n  %4.2f  %4.2f  %4.2f  %9.2e %9.2e %9.2e %9.2e  %9.2e %9.2e\n\n",
		      rWSmin,rWSmax,rWSstep,VWSmin,VWSmax,VWSstep,aWSmin,aWSmax,aWSstep);
	FUN_GAUSS();
    FUN_DFP_INI();
	RP0=r00*AP13;RT0=r00*AT13;
	RPT0=r00*(AP13+AT13); 
	FUN_Read_rho();
	FUN_DFP_NNforce_INI();
	printf("\n =====DOUBLE Folding nucleus-nucleus potential===== \n");
  	printf("\n ..ZP ..AP ....RP0  ....RT0 ...RPT0");
  	printf("\n %4.0f %4.0f %7.4f %7.4f %7.4f ",ZP,AP,RP0,RT0,RPT0);
	printf("\n .......WAIT, PLEASE........");
	return;
}

void FUN_Read_rho()
{
	irhofinP=irhofinT=0;
	if( (f_in=fopen("inp_rhoP.c","r")) == NULL ){	return;}
	fgets(Title_RBHF_rho_P,118, f_in);
	fgets(Title_RBHF_rho_P,118, f_in);
	fscanf(f_in,"%lf %lf %lf\n",   &ZP1,&AP1,&rStepP);
		
	if (ZP!=ZP1){ printf("\n inp-14 >>>>>>>> ZP=%3.0f != ZP1=%3.0f <<<<<<<<\n",ZP,ZP1 ); return; }
	if (AP!=AP1){ printf("\n inp-15 >>>>>>>> AP=%3.0f != AP1=%3.0f <<<<<<<<\n",AP,AP1 ); return; }
	fgets(Title_RBHF_rho_P,118, f_in);
	for (irho=0; irho<irhoup+1; irho++)
	{
		fscanf(f_in,"%lf %lf %lf   %lf %lf %lf\n",
		   &rP_dim[irho],&rP_dim[irho],&rhoP_c_dim[irho],&rhoP_p_dim[irho],&rhoP_n_dim[irho],&rhoP_m_dim[irho]);
		if (rP_dim[irho]==end_of_data) {	irhofinP=irho; fclose(f_in); break;}	
	}
	printf("\n  iphofinP=%ld, rhoP_c_dim[0]=%12.5e rhoP_c_dim[irhofinP]=%12.5e",
			   irhofinP,rhoP_c_dim[0],rhoP_c_dim[irhofinP]);
	
	if( (f_in=fopen("inp_rhoT.c","r")) == NULL ){ return;}
	fgets(Title_RBHF_rho_T,118, f_in);
	fgets(Title_RBHF_rho_T,118, f_in);
	fscanf(f_in,"%lf %lf %lf\n",   &ZT1,&AT1,&rStepT);
		
	if (ZT!=ZT1){ printf("\n inp-32 >>>>>>>> ZT=%3.0f != ZT1=%3.0f <<<<<<<<\n",ZT,ZT1 ); return; }
	if (AT!=AT1){ printf("\n inp-33 >>>>>>>> AT=%3.0f != AT1=%3.0f <<<<<<<<\n",AT,AT1 ); return; }
	fgets(Title_RBHF_rho_T,118, f_in);
	for (irho=0; irho<irhoup+1; irho++)
	{
		fscanf(f_in,"%lf %lf %lf   %lf %lf %lf\n",
				   &rT_dim[irho],&rT_dim[irho],&rhoT_c_dim[irho],&rhoT_p_dim[irho],&rhoT_n_dim[irho],&rhoT_m_dim[irho]);
		if (rT_dim[irho]==end_of_data) {	irhofinT=irho; fclose(f_in); break;}	
	}
	printf("\n  inp-134 iphofinT=%ld, rhoT_c_dim[0]=%12.5e rhoT_c_dim[irhofinT]=%12.5e",
			   irhofinT,rhoT_c_dim[0],rhoT_c_dim[irhofinT]);
	return;
}

double FUN_RHOtable(double r, long iNUC, long dens_typ)
{
	long i,iq_0,iq_1,iq_2,iq_3,irhofin;
	double gIntdim[4],yIntdim[4],rhoInt,rStep,AZ;
	
	rStep  =rStepP*  (-iNUC+1)+rStepT*  iNUC+alittle;
	irhofin=irhofinP*(-iNUC+1)+irhofinT*iNUC;
	iq_0=iq_1=iq_2=iq_3=0;
	iq_1=r/rStep;
	FUN_CheckIndex(0, iq_1, irhoup);
	iq_0=iq_1-1;if(iq_0<0){iq_0=0;iq_1=1;}iq_2=iq_0+2;iq_3=iq_0+3;
	
	rho=alittle;DrhoDr=0.;D2rhoDr2=0.;
	if(key_vNN==2 || key_vNN==3)key_exc=key_DD=0;
	if(iq_3<irhofin)
	{
		if(key_vNN==2)
	    {
			for(i=iq_0;i<iq_3+1;i++)
			{
				if(dens_typ==0)	{ rhoP_dim[i]=rhoP_c_dim[i];rhoT_dim[i]=rhoT_c_dim[i];}
				if(dens_typ==1)	{ rhoP_dim[i]=rhoP_p_dim[i];rhoT_dim[i]=rhoT_p_dim[i];}
				if(dens_typ==2)	{ rhoP_dim[i]=rhoP_n_dim[i];rhoT_dim[i]=rhoT_n_dim[i];}
			    rhoInt=rhoP_dim[i]*(-iNUC+1)+rhoT_dim[i]*iNUC;
			    gIntdim[i-iq_0]=rhoInt ;yIntdim[i-iq_0]= rP_dim[i]*(-iNUC+1)+rT_dim[i]*iNUC;
			}
			rho =FUN_CubeInterp(r,yIntdim,gIntdim);
		}
		else
		{	
			if(typ==0)
			{ 
				for(i=iq_0;i<iq_3+1;i++)
				{
					rhoInt=rhoP_c_dim[i]*(-iNUC+1)+rhoT_c_dim[i]*iNUC;
					gIntdim[i-iq_0]=rhoInt ;yIntdim[i-iq_0]= rP_dim[i]*(-iNUC+1)+rT_dim[i]*iNUC;
				}
				AZ=AP/ZP*(-iNUC+1)+AT/ZT*iNUC;
				rho =AZ*FUN_CubeInterp(r,yIntdim,gIntdim);
			}
			else 
			{
				for(i=iq_0;i<iq_3+1;i++)
				{
					rhoInt=(rhoP_n_dim[i]+rhoP_p_dim[i])*(-iNUC+1)+(rhoT_n_dim[i]+rhoT_p_dim[i])*iNUC;
					gIntdim[i-iq_0]=rhoInt; yIntdim[i-iq_0]= rP_dim[i]*(-iNUC+1)+rT_dim[i]*iNUC;
				}
				rho =FUN_CubeInterp(r,yIntdim,gIntdim);
			}
		}
	}
	return(rho);
}

void FUN_DFP_INI()
{
	static long iik,i;
	for(is=0;is<ikGup;is++)for(it=0;it<ikGup;it++)for(iNUC=0;iNUC<2;iNUC++)
	{
		hdimMP[is][it][iNUC]=0;ydimMP[is][it][iNUC]=0;zdimMP[is][it][iNUC][0]=0;zdimMP[is][it][iNUC][1]=0;
		hCdimMP[is][it][iNUC]=0;
   		hdimPP[is][it][iNUC]=0;ydimPP[is][it][iNUC]=0;zdimPP[is][it][iNUC][0]=0;zdimPP[is][it][iNUC][1]=0;
		hCdimPP[is][it][iNUC]=0;
		hdimPM[is][it][iNUC]=0;ydimPM[is][it][iNUC]=0;zdimPM[is][it][iNUC][0]=0;zdimPM[is][it][iNUC][1]=0;
		hCdimPM[is][it][iNUC]=0;
		hdimMM[is][it][iNUC]=0;ydimMM[is][it][iNUC]=0;zdimMM[is][it][iNUC][0]=0;zdimMM[is][it][iNUC][1]=0;
		hCdimMM[is][it][iNUC]=0;
		hdim[is][it][iNUC]=0;ydim[is][it][iNUC]=0;zdim[is][it][iNUC][0]=0;zdim[is][it][iNUC][1]=0;
		hCdim[is][it][iNUC]=0;
	}
	for(is=0;is<ikGup;is++){IntMh[is]=0;IntPh[is]=0;}
	if(ikGup!=11 && ikGup!=21 && ikGup!=49)
	{printf("\n<<<<<<<<< wrong ikGup=%d>>>>>>>>>>\n\n",ikGup);code_end=-50;return;}
	for(iik=1;iik<ikGup;iik++)
  	{
		if(ikGup==11){XX[iik]=XX20[iik];WW[iik]=WW20[iik];}
	 	if(ikGup==21){XX[iik]=XX40[iik];WW[iik]=WW40[iik];}
	 	if(ikGup==49){XX[iik]=XX96[iik];WW[iik]=WW96[iik];}
	 	kPdim[iik]=( XX[iik]*(k_up-0.)+k_up+0.)/2.;
	 	kMdim[iik]=(-XX[iik]*(k_up-0.)+k_up+0.)/2.;
	}
	iZP=ZP;iAP=AP;
	iZT=ZT;iAT=AT;
	m_red=m_nucleon*AP*AT/(AP+AT);
	APT=AP+AT;
	AP13=pow(AP,0.3333333);AT13=pow(AT,0.3333333);APT13=AP13+AT13;
	BZ=ZP*ZT/(AP13+AT13);
	if(ECM<=0)ECM=BZ;
	BfusDFPsph=-100;
	code_end=10;
	
	distP=(0.76-0.11*(AP-ZP)/ZP)*5./pi/pi/7.;
	distT=(0.76-0.11*(AT-ZT)/ZT)*5./pi/pi/7.;
	
	return;
}

void FUN_DFP_NNforce_INI()
{
	key_DD=key_D/1;
	if(key_DD<9 && key_DD>-1){CDD=CDDdim[key_DD];alDD=alDDdim[key_DD];beDD=beDDdim[key_DD];gDD=gDDdim[key_DD];}
	else {printf("\n<<<<<<<<< Wrong key_DD=%ld. It must be integer from 0 to 8 >>>>>>>>>>\n\n",key_DD);code_end=-55;return;}
	
	if(key_vNN==0)
	{
		Aex1=Aex1Re; Aex2=Aex2Re; Aex3=Aex3Re; aex1=aex1Re; 
		aex2=aex2Re; aex3=aex3Re; A40 =A40Re; A25 =A25Re;
		Adel=AdelRe+AdelCorr; CEl =CElRe; a40 =a40Re; a25 =a25Re;
	}
	if(key_vNN==1)
	{
		Aex1=Aex1Pa; Aex2=Aex2Pa; Aex3=Aex3Pa; aex1=aex1Pa;
		aex2=aex2Pa; aex3=aex3Pa; A40 =A40Pa; A25 =A25Pa;
		Adel=AdelPa+AdelCorr; CEl =CElPa; a40 =a40Pa; a25 =a25Pa;
	}
	
	iNUC=1;jRMF=6;
	if(key_vNN==11)jRMF=0;if(key_vNN==12)jRMF=1;if(key_vNN==13)jRMF=2;if(key_vNN==14)jRMF=3;
	if(key_vNN==21)jRMF=4;if(key_vNN==23)jRMF=5;
	if(jRMF<6){m_om=RMFpar_dim[jRMF][0]; m_ro=RMFpar_dim[jRMF][1]; m_si=RMFpar_dim[jRMF][2];
		g_om=RMFpar_dim[jRMF][3]; g_ro=RMFpar_dim[jRMF][4]; g_si=RMFpar_dim[jRMF][5];
		g_2=RMFpar_dim[jRMF][6];  g_3 =RMFpar_dim[jRMF][7]; ksi =RMFpar_dim[jRMF][8];
		Adel=RMFpar_dim[jRMF][9];}

	if(key_vNN==2)FUN_APM_MIG(); else FUN_APM_M3Y();
	
   	return;
}
