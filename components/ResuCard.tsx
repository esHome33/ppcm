import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import React from "react";
import { Decomposition } from "../utils/decompose";
import { affiche_analyse, analyse_decomposition } from "../lib/resudecomp";

type Props = {
	nombre1: bigint | number;
	decomp1: Decomposition;
	decomp1_nb: string;
	nombre2: bigint | number;
	decomp2: Decomposition;
	decomp2_nb: string;
	duree?: string | undefined;
};

const ResuCard = (props: Props) => {
	const val_nb1 = props.nombre1;
	const val_nb2 = props.nombre2;
	const dec1 = props.decomp1;
	const dec2 = props.decomp2;

	const affiche_decomp = (d: Decomposition) => {
		if (d.length === 0) {
			return "RIEN";
		} else {
			let resu: string = "";
			d.forEach((elt) => {
				resu += elt + " * ";
			});
			resu = resu.slice(0, resu.length - 3);
			return resu;
		}
	};

	const produit_contenu = (
		v1: number | bigint,
		v2: Decomposition,
		v3: string,
		position: 1 | 2
	) => {
		if (v1 === 0n) {
			return (
				<Typography
					width={"100%"}
					variant="body2"
					fontStyle={"italic"}
				>
					Nombre {position} non indiqué
				</Typography>
			);
		} else {
			return (
				<Typography width={"100%"}>
					{v1.toString()}
					<br /> {" = " + affiche_decomp(v2)}
					<br /> {" = " + affiche_analyse(analyse_decomposition(v2))}
					<br /> {" = " + v3}
				</Typography>
			);
		}
	};

	return (
		<Card
			className="bg-orange-50 w-full"
			variant="outlined"
			sx={{ width: "100%", borderWidth: "3px" }}
		>
			<CardHeader
				className="bg-orange-200 text-teal-800 italic"
				title={"Résultat :"}
			/>
			<CardContent>
				{produit_contenu(val_nb1, dec1, props.decomp1_nb, 1)}
				<br></br>
				{produit_contenu(val_nb2, dec2, props.decomp2_nb, 2)}
				<br />
				<Typography variant="body2">
					{props.duree
						? "Trouvé en " + props.duree + "."
						: "Chrono en panne !"}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default ResuCard;
