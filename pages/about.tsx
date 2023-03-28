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
				produits de facteurs premiers. Elle est codée en TypeScript
				(JavaScript typé).
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
				Les nombres à décomposer peuvent être de taille illimitée : au début
				j'utilisais le type{" "}
				<code className="text-blue-800 font-black">number</code> (limite de
				15 chiffres max) et j'utilise maintenant le type{" "}
				<code className="text-blue-800 font-black">BigInt</code>, qui n'est
				plus limité !!
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
				, le temps mis pour décomposer des nombres comportant plus de 17
				chiffres devient excessivement long (sur mon PC). Vous pouvez
				choisir d'exécuter cet algorithm au niveau du client (votre ordi,
				tablette ou téléphone !) ou alors sur le serveur qui sert cette page
				web. Attention, le serveur web étant gratuit, il ne calcule que
				durant 10 secondes max : cela empêche la décomposition des nombres
				de plus de 15 chiffres.
			</Typography>
			<br />
			<Typography
				variant="body1"
				className="text-justify"
			>
				Pour améliorer encore la vitesse, il faut arriver à comprendre
				l'algorithme de Pollard-Strassen (Pomerance 1982; Hardy et al. 1990)
				... et l'implémenter. Mais de toutes façons, on n'arrivera pas à
				casser les codes de Cartes Bleues en travaillant séquentiellement !
				Peut être que les algos quantiques le permettront ?
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
