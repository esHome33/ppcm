import React from "react";
import {
	ResuDecomp,
	affiche_analyse,
	detPGCD,
	isMonofacteur,
	valeur_analyse,
} from "../lib/resudecomp";
import { Card, CardContent, Typography } from "@mui/material";

type Props = {
	dec1: ResuDecomp;
	dec2: ResuDecomp;
};

const PGCD = (props: Props) => {
	const aff1 = affiche_analyse(props.dec1);
	const aff2 = affiche_analyse(props.dec2);
	const n1 = valeur_analyse(props.dec1);
	const n2 = valeur_analyse(props.dec2);
	const le_pgcd = detPGCD(props.dec1, props.dec2);
	const aff_pgcd = affiche_analyse(le_pgcd);
	const val_pgcd = valeur_analyse(le_pgcd);
	const aff_prems_entre_eux = () => {
		if (
			le_pgcd.liste_prems.length === 1 &&
			le_pgcd.liste_prems[0] === "1" &&
			le_pgcd.coeffs_prems[0] === 1
		) {
			return "Ces nombres sont premiers entre eux";
		}
		return "";
	};

	return (
		<Card className="flex flex-col flex-grow p-2 m-2 bg-orange-100 max-w-screen-sm justify-center align-middle">
			<CardContent>
				<Typography className="bg-orange-300 rounded-lg text-center p-2 font-bold">
					PGCD - GCF
				</Typography>
				<Typography>
					{n1} = {aff1}
				</Typography>
				<Typography>
					{n2} = {aff2}
				</Typography>
				<Typography className="bg-slate-500 text-white font-bold p-2 rounded-lg">
					{isMonofacteur(le_pgcd)
						? "PGCD = " + aff_pgcd
						: "PGCD = " + aff_pgcd + " = " + val_pgcd}
					<br /> {aff_prems_entre_eux()}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default PGCD;
