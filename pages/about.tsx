import { Box, Typography } from "@mui/material";
import Layout from "../components/Layout";

type Props = {};

const About = (_props: Props) => {
	return (
		<Layout
			title="A Propos..."
			about_invisible
		>
			<Typography variant="h6">A propos de cette belle appli ! </Typography>
			<Typography
				variant="body1"
				className="mt-4 text-justify"
			>
				Cette application permet de décomposer un ou deux nombres en produit
				de facteurs premiers.
			</Typography>
			<Typography
				variant="body1"
				className="mt-4 text-justify"
			>
				Les nombres peuvent être très grands car c'est le type{" "}
				<code className="text-blue-800 font-black">bigint</code> qui est
				utilisé.
			</Typography>
			<Typography
				variant="body1"
				className="mt-4 text-justify"
			>
				Mais il y a un inconvénient majeur : comme l'algorithme utilisé pour
				trouver les facteurs premiers est l'algorithme d'
				<span className="text-blue-800 font-bold">Euclide</span>, le temps
				mis pour décomposer des nombres comportant plus de 15 chiffres peut
				être excessivement long.
			</Typography>
			<Typography
				variant="body1"
				className="mt-4 text-justify"
			>
				Si j'ai le temps, je programmerai un bouton pour annuler une
				opération trop longue à finir (utilisation des <code>promise</code>{" "}
				de JavaScript en programmation asynchrone )!
			</Typography>

			<Typography
				variant="body1"
				className="mt-4 text-blue-800 font-mono"
			>
				Programmé par Etienne en mars 2023
			</Typography>
		</Layout>
	);
};

export default About;
