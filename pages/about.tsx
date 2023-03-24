import { Typography } from "@mui/material";
import Layout from "../components/Layout";

type Props = {};

const About = (_props: Props) => {
	return (
		<Layout
			title="A Propos..."
			about_invisible
		>
			<Typography variant="h6">A propos de cette belle appli ! </Typography>
			<br />
			<hr />
			<br />
			<Typography
				variant="body1"
				className="mt-4 text-justify"
			>
				Cette application permet de décomposer un ou deux nombres en produit
				de facteurs premiers.
			</Typography>
			<br />
			<Typography
				variant="body1"
				className="mt-4 text-justify"
			>
				Les nombres sont limités à 15 chiffres car c'est le type{" "}
				<code className="text-blue-800 font-black">number</code> qui est
				utilisé.
			</Typography>
			<br />
			<Typography
				variant="body1"
				className="mt-4 text-justify"
			>
				Mais il y a un inconvénient majeur : comme l'algorithme utilisé pour
				trouver les facteurs premiers est l'algorithme du{" "}
				<span className="text-blue-800 font-bold">
					crible d'Eratosthène
				</span>
				, le temps mis pour décomposer des nombres comportant plus de 9
				chiffres devient excessivement long (pour information, le JavaScript tourne sur votre machine !!).
			</Typography>
			<br />
			<Typography
				variant="body1"
				className="mt-4 text-justify"
			>
				Si j'ai le temps, je programmerai un bouton pour annuler une
				opération trop longue à finir (utilisation des <code>promise</code>{" "}
				de JavaScript en programmation asynchrone )!
			</Typography>
			<br />
			<hr />
			<br />
			<Typography
				variant="body1"
				className="mt-4 text-blue-800 font-mono"
			>
				Programmé par Etienne en mars 2023 avec le framework{" "}
				<a
					href={"https://nextjs.org/"}
					className="text-red-700"
				>
					NextJS
				</a>
			</Typography>
			<div className="mb-14"/>
		</Layout>
	);
};

export default About;
