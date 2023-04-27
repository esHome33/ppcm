import { Card, Typography } from "@mui/material";
import {
	ResuDecomp,
	TYPE_NOMBRE,
	affiche_analyse,
	isPrime,
	valeur_analyse,
} from "../lib/resudecomp";

type Props = {
	dec: ResuDecomp;
	cle: string;
};

const Nombre = (props: Props) => {
	const message_premier = (dec: ResuDecomp, nom: string) => {
		const type_dec: TYPE_NOMBRE = isPrime(dec);

		if (type_dec === "COMPOSE") {
			return (
				<span className="text-blue-700 bg-blue-50 p-2 rounded-md shadow-md border border-blue-900">
					{nom} nombre composé
				</span>
			);
		} else if (type_dec === "ERREUR") {
			return (
				<span className="text-yellow-50 bg-red-900 p-2 rounded-md shadow-md">
					{nom} erreur
				</span>
			);
		} else {
			return (
				<span className="text-green-700 p-2 rounded-md shadow-xl font-bold border-green-700 border-2">
					{nom} nombre premier
				</span>
			);
		}
	};

	const val = valeur_analyse(props.dec);
	const aff_type = message_premier(props.dec, "");
	const aff_dec = affiche_analyse(props.dec);
	const numero = "N" + props.cle;

	return (
		<Card
			sx={{ backgroundColor: "#e2e8f0", textAlign: "center" }}
			className="flex flex-col p-4 m-2 bg-slate-200 max-w-screen-md justify-center align-middle flex-grow"
		>
			<Typography
				variant="body1"
				className="mx-auto"
				sx={{ marginY: "5px" }}
			>
				{numero} = {val}
			</Typography>
			<Typography
				className="mx-auto"
				variant="body1"
				sx={{ marginY: "5px" }}
			>
				{aff_dec}
			</Typography>
			<Typography
				variant="body1"
				className="mx-auto mb-2 mt-2"
			>
				{aff_type}
			</Typography>
		</Card>
	);
};

export default Nombre;
