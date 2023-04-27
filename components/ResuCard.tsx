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
				<Typography width={"100%"}>
					{val_nb1.toString()}
					<br /> {" = " + affiche_decomp(dec1)}
					<br /> {" = " + affiche_analyse(analyse_decomposition(dec1))}
					<br /> {" = " + props.decomp1_nb}
				</Typography>
				<Typography>
					<br></br>
				</Typography>
				<Typography width={"100%"}>
					{val_nb2.toString()}
					<br /> {" = " + affiche_decomp(dec2)}
					<br /> {" = " + affiche_analyse(analyse_decomposition(dec2))}
					<br /> {" = " + props.decomp2_nb}
				</Typography>
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
