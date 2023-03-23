import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import React from "react";
import { Decomposition } from "../utils/decompose";

type Props = {
	nombre1: bigint;
	decomp1: Decomposition;
	nombre2: bigint;
	decomp2: Decomposition;
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
            d.forEach(elt => {
                resu += elt + " * ";
            });
            resu = resu.slice(0, resu.length - 3);
            return resu;
        }
    }

	return (
		<Card
			className="bg-orange-50"
			variant="elevation"
		>
			<CardHeader
				className=" text-sm text-teal-700"
				title={"Résultat :"}
			/>
			<CardContent>
				<Typography>
					{val_nb1.toString() + " = " + affiche_decomp(dec1)}
				</Typography>
				<Typography>
					<br></br>
				</Typography>
				<Typography>
					{val_nb2.toString() + " = " + affiche_decomp(dec2)}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default ResuCard;
