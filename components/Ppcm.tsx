import React from "react";
import {
	ResuDecomp,
	affiche_analyse,
	detPPCM,
	isMonofacteur,
	valeur_analyse,
} from "../lib/resudecomp";
import { Card, CardContent, Typography } from "@mui/material";

type Props = {
	dec1: ResuDecomp;
	dec2: ResuDecomp;
};

const PPCM = (props: Props) => {
	const aff1 = affiche_analyse(props.dec1);
	const aff2 = affiche_analyse(props.dec2);
	const n1 = valeur_analyse(props.dec1);
	const n2 = valeur_analyse(props.dec2);
	const le_ppcm = detPPCM(props.dec1, props.dec2);
	const aff_ppcm = affiche_analyse(le_ppcm);
	const val_ppcm = valeur_analyse(le_ppcm);
	
	return (
		<Card className="flex flex-col p-2 m-2 bg-green-100 max-w-screen-sm justify-center align-middle flex-grow">
			<CardContent>
				<Typography className="bg-green-300 rounded-lg text-center p-2 font-bold">
					PPCM - LCM
				</Typography>
				<Typography>
					{n1} = {aff1}
				</Typography>
				<Typography>
					{n2} = {aff2}
				</Typography>
				<Typography className="bg-slate-500 text-white font-bold p-2 rounded-lg">
					PPCM =
					{isMonofacteur(le_ppcm) ? " " + aff_ppcm : " " + aff_ppcm + " = " + val_ppcm}
					
				</Typography>
			</CardContent>
		</Card>
	);
};

export default PPCM;
