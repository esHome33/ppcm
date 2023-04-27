import { Typography } from "@mui/material";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { ResuDecomp, analyse_decomposition } from "../lib/resudecomp";
import Nombre from "../components/Nombre";
import PGCD from "../components/Pgcd";
import PPCM from "../components/Ppcm";
import { useState } from "react";

const Analyse = () => {
	const router = useRouter();

	const q1 = router.query.dec1;
	const q2 = router.query.dec2;
	const [affichage_active, setAffichage_active] = useState(false);

	let query_1: ResuDecomp = { coeffs_prems: [], liste_prems: [] };
	let query_2: ResuDecomp = { coeffs_prems: [], liste_prems: [] };

	const traitement_initial = new Promise((resolve) => {
		const traite_entree = (elt: string) => {
			if (!elt) {
				let resu: ResuDecomp = {
					liste_prems: [],
					coeffs_prems: [],
				};
				return resu;
			}
			const splite = elt.split(",");
			const ana = analyse_decomposition(splite);
			return ana;
		};
		query_1 = traite_entree(q1 as string);
		query_2 = traite_entree(q2 as string);
		resolve(true);
	});

	traitement_initial
		.then(() => {
			setAffichage_active(true);
		})
		.catch(() => {});

	return (
		<>
			<Layout
				title="Analyse"
				about_invisible
			>
				{affichage_active ? (
					<>
						<Typography
							variant="h4"
							textAlign={"center"}
							className="rounded-md p-3"
							fontFamily={"sans-serif"}
							fontWeight={"bold"}
						>
							ANALYSE
						</Typography>

						<div className="flex flex-col sm:flex-row justify-center">
							<Nombre
								dec={query_1}
								cle={"1"}
							/>

							<br />
							<Nombre
								dec={query_2}
								cle={"2"}
							/>
						</div>
						<br />
						<div className="flex flex-col sm:flex-row justify-center">
							<PGCD
								dec1={query_1}
								dec2={query_2}
							/>
							<PPCM
								dec1={query_1}
								dec2={query_2}
							/>
						</div>
					</>
				) : (
					<div className="text-center">Calculs en cours ...</div>
				)}
				<div className="mb-12" />
			</Layout>
		</>
	);
};

export default Analyse;
