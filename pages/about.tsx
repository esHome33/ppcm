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
				className="text-justify"
			>
				Cette application permet de décomposer un et/ou deux nombres en
				produits de facteurs premiers.
			</Typography>
			<br />
			<Typography
				variant="body1"
				className="text-justify"
			>
				Du coup, on peut aussi facilement trouver les PPCM et PGCD !
			</Typography>
			<br />
			<Typography
				variant="body1"
				className="text-justify"
			>
				Les nombres sont limités à 15 chiffres car c'est le type{" "}
				<code className="text-blue-800 font-black">number</code> qui est
				utilisé.
			</Typography>
			<br />
			<Typography
				variant="body1"
				className="text-justify"
			>
				Mais il y a un inconvénient majeur : comme l'algorithme utilisé pour
				trouver les facteurs premiers est l'algorithme du{" "}
				<span className="text-blue-800 font-bold">
					crible d'Eratosthène
				</span>
				, le temps mis pour décomposer des nombres comportant plus de 9
				chiffres devient excessivement long (même si le JavaScript tourne
				sur le serveur maintenant !!).
			</Typography>
			<br />
			<Typography
				variant="body1"
				className="text-justify"
			>
				Avant, j'avais intégré le code de l'algorithme d'Eratosthène au
				niveau du client (votre ordi, tablette ou téléphone !) ... ce
				n'était pas vraiment le top. Le code est maintenant exécuté sur le
				serveur qui devrait avoir de meilleures perfos que votre machine !
				Pour améliorer encore la vitesse, il faut arriver à comprendre
				l'algorithme de Pollard-Strassen (Pomerance 1982; Hardy et al.
				1990)...
			</Typography>
			<br />
			<hr />
			<br />
			<Typography
				variant="body2"
				className="text-blue-800 font-mono text-justify"
			>
				Programmé par Etienne en mars 2023 avec le framework{" "}
				<a
					href={"https://nextjs.org/"}
					className="text-red-700 font-extrabold"
				>
					NextJS
				</a>
			</Typography>
			<div className="mb-14" />
		</Layout>
	);
};

export default About;
