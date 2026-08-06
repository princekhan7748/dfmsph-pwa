#include "dfmsph_def.h"

void FUN_DFPOUT()
{
	FILE *Out;
	double yy;

    f_ex2=fopen("out_vNN_.c","w");
   	fprintf(f_ex2,"  rr          UNN%d ",key_vNN);
   	for(ii=0;ii<irup;ii++)
	{yy=0.02*ii; fprintf(f_ex2,"\n%6.2f %12.4e",yy,VNN_dir_r(yy));if(yy>3)break;}
	FUN_SEAL(f_ex2);
   	fclose(f_ex2);

	Out=fopen("out_dfmsph22.c","a");
	FUN_key_vNN(Out);
	fprintf(Out," %3.0f %3.0f %6.3f %3.0f %3.0f %6.3f ",ZP,AP,RP0,ZT,AT,RT0);
	fprintf(Out,"%6.2f %8.2f %6.2f %6.2f %6.3f %6.3f ",
		   		  r_bar,BfusDFPsph,Hom,BZ,r_bar/(RP0+RT0),BfusDFPsph/BZ);
	
	fprintf(Out,"%8.2f %8.2f", C2b,C3b);
	fprintf(Out," %3ld    %6.0f %6.3f %6.3f %8.1e",i1chi2,VWSmem,rWSmem,aWSmem,chi2WSmin);
	
	fprintf(Out,"  %4.1f %4.1f %4.1f %5.3f %4.3f  %8.1e",
				Amemdim[0],Amemdim[1],Amemdim[2],Amemdim[3],Amemdim[4],chi2GKmin);

	fprintf(Out," %6.2f   %2ld    %2ld   %2ld   %2ld",ECM,key_exc,key_vNN,key_DD,key_UC);
	fprintf(Out," %5.0f %5.0f %6.3f %6.3f\n ",Adel,AdelCorr,RCCstart,RCCfin);
	fclose(Out);
	
	Out=fopen("out_inp_dfm22.c","a");
	FUN_key_vNN(Out);
	fprintf(Out," %3.0f %3.0f %3.0f %3.0f ",ZP,AP,ZT,AT);
	fprintf(Out," %6.2f   %2ld    %2ld   %2ld   %2ld",ECM,key_exc,key_vNN,key_DD,key_UC);
	fprintf(Out," %6.4f %6.4f %6.4f %6.4f %5.0f ",
				CDDdim[key_DD],alDDdim[key_DD],beDDdim[key_DD],gDDdim[key_DD],AdelCorr);
	fprintf(Out," %7.3f %7.3f   %7.3f   %7.3f   %7.3f ",
				Mig_fex,Mig_fexprime,Mig_fin,Mig_finprime,Mig_C_MF);

	fprintf(Out," %9.3f %9.3f %9.3f %9.3f %9.3f %9.3f ",
				Aex1,Aex2,Aex3,aex1,aex2,aex3);

	fprintf(Out," %9.3f %9.3f %9.3f %9.3f %9.3f %9.3f ",
				A40,A25,Adel,CEl,a40,a25);

	fprintf(Out,"  %6.3f %6.3f %7.3f  %3ld %6.3f  %6.3f ",
		   		RCCstart,RCCfin,RCCstep,deliR,fRBstart,fRBfin);
		
	fprintf(Out," %3ld %3ld  %4.2f",irhofinP,irhofinT,r00+alittle);
	fprintf(Out,"%5.2f %5.2f  %2d  %3d ",Crup,k_up,ikGup,iC2b);
	fprintf(Out," %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f  %8.3f %8.3f",
				m_om,m_ro,m_si,g_om,g_ro,g_si,g_2,g_3,ksi,Adel);
	fprintf(Out," %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f  %8.3f %8.3f",
				rGKmin,rGKmax,rGKstep,aGKmin,aGKmax,aGKstep,Amindim[0],Amaxdim[0],Astepdim[0],Amindim[1]);
	fprintf(Out," %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f ",
				Amaxdim[1],Astepdim[1],	Amindim[2],Amaxdim[2],Astepdim[2],chi2GK);
	fprintf(Out," %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f %8.3f  %8.3f %8.3f\n",
				rWSmin,rWSmax,rWSstep,VWSmin,VWSmax,VWSstep,aWSmin,aWSmax,aWSstep,chi2WS);

	fclose(Out);

    f_ex2=fopen(outUR,"w");
   	fprintf(f_ex2,"  RCM          UN%d          UC   Utot%d     UNWSfit     UNGKfit",key_vNN,NUM);
   	for(ii=0;ii<irup;ii+=10){
		fprintf(f_ex2,"\n%6.2f %12.4e %12.4e %12.4e %12.4e %12.4e ",
				RCMdim[ii],UNdim[ii],UCdim[ii],Utotdim[ii],
				FUN_WSPOT(RCMdim[ii],AP13+AT13,VWSmem,rWSmem,aWSmem),
				FUN_GKPOT(RCMdim[ii],AP13+AT13,Amemdim[0],Amemdim[1],Amemdim[2],Amemdim[3],Amemdim[4]));
	}
	FUN_SEAL(f_ex2);
   	fclose(f_ex2);

	return;
}

void FUN_SEAL(FILE *f_exn)
{
	static long i1;
	fprintf(f_exn,"\n");
	fprintf(f_exn,"%4d ",NUM);
	for(i1=0;i1<80;i1++)fprintf(f_exn,"%c",Title[i1]);
	fprintf(f_exn,"\n<<<<<<<<<<<<<<< R_bar=%6.3f U_bar=%6.3f >>>>>>>>>>>>>>>",
					r_bar,BfusDFPsph);

	fprintf(f_exn,"\n DFMSPH ver%4.0f",ver+alittle);
	fprintf(f_exn,"\n  ZP  AP    RP0   ZT  AT    RT0  Crup   k_up  ikGup ");
	fprintf(f_exn,"\n %3.0f %3.0f %6.3f %3.0f  %3.0f %6.3f %6.3f %6.3f %4d",
					ZP,AP,RP0,ZT, AT, RT0,Crup,k_up,ikGup);
	if(key_vNN<2)
	{
		fprintf(f_exn,"\nM3Y:   ECM  key_exc key_vNN key_DD key_UC");
	    fprintf(f_exn,"\n      %6.2f    %2ld     %2ld      %2ld     %2ld",ECM,key_exc,key_vNN,key_DD,key_UC);
	    if(key_vNN==0)fprintf(f_exn,"\nReid NN-forces");
	    if(key_vNN==1)fprintf(f_exn,"\nParis NN-forces");
	    if(key_exc==0)fprintf(f_exn,"; delta exchange forces");
	    if(key_exc==1)fprintf(f_exn,"; finite range exchange forces, eps_iter=%9.2e",eps_iter);
	    if(key_DD ==0)fprintf(f_exn,";\nno density dependence in exchange forces");
	    if(key_DD > 0)
	    {
			fprintf(f_exn,";\ndensity dependent exchange forces:\nCDD    alDD   beDD   gDD   ");
			fprintf(f_exn,"\n%6.4f %6.4f %6.4f %6.4f",CDDdim[key_DD],alDDdim[key_DD],beDDdim[key_DD],gDDdim[key_DD]);
	    }
	    if(key_exc==0)fprintf(f_exn,"\n       del000");
	    if(key_exc==1)fprintf(f_exn,"\n       finDD%1ld",key_DD);
	}
    if(key_vNN==2)	
	{
		fprintf(f_exn,"\nMIG:  Mig_fex M_fexprime Mig_fin M_finprime M_C_MF");
		fprintf(f_exn,"\n      %7.3f %7.3f   %7.3f   %7.3f   %7.3f ",Mig_fex,Mig_fexprime,Mig_fin,Mig_finprime,Mig_C_MF);
	}
	if(key_vNN>2)	
    {
		fprintf(f_exn,"\nRMF:  m_om/MeV  m_ro/MeV   m_si/MeV  ");
		fprintf(f_exn,"\n   %10.3f %10.3f %10.3f", m_om,m_ro,m_si);

		fprintf(f_exn,"\nRMF:  g_om      g_ro      g_si     g_2/fm^-1    g_3       ksi    Adel");
		fprintf(f_exn,"\n  %9.3f %9.3f %9.3f %10.3f %9.3f %9.3f %9.3f ",
					g_om,g_ro,g_si,g_2,g_3,ksi,Adel);
	}	 
	return;
}

void FUN_key_vNN(FILE *Out)
{	
fprintf(Out,"%4d ",NUM);	for(i1=0;i1<70;i1++)fprintf(Out,"%c",Title[i1]);
	if(key_vNN==11)fprintf(Out,"<NL1_DD%1ld",key_DD);
	if(key_vNN==12)fprintf(Out,"<NL2_DD%1ld",key_DD);
	if(key_vNN==13)fprintf(Out,"<NL3_DD%1ld",key_DD);
	if(key_vNN==14)fprintf(Out,"<FSU_DD%1ld",key_DD);
	if(key_vNN==21)fprintf(Out,"<TM1_DD%1ld",key_DD);
	if(key_vNN==23)fprintf(Out,"<HS__DD%1ld",key_DD);
	if(key_vNN==2)fprintf(Out,"<MIG_MIG");
	if(key_exc==0 && key_vNN==0)fprintf(Out,"<RdelDD%1ld",key_DD);
	if(key_exc==0 && key_vNN==1)fprintf(Out,"<PdelDD%1ld",key_DD);
	if(key_exc==1 && key_vNN==0)fprintf(Out,"<RfinDD%1ld",key_DD);
	if(key_exc==1 && key_vNN==1)fprintf(Out,"<PfinDD%1ld",key_DD);
	fprintf(Out,"  <ver%3.0f>",ver+alittle);
return;
}
