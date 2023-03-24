import Layout from "../components/Layout";
import { NextPage } from "next";
import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import Decomposeur from "../components/Decomposeur";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

const IndexPage: NextPage = () => {
	const [local, setLocal] = useState<boolean>(true);
	return (
		<Layout
			title="Facteurs premiers"
			home_invisible
		>
			<Toaster />
			<Typography
				variant="h6"
				className="text-center font-bold text-teal-800"
			>
				{" "}
				♻️ ♻️ Décomposition en facteurs premiers 👋
			</Typography>
			<br />
			<Box textAlign={'center'}>
				<FormControlLabel
					control={<Switch defaultChecked />}
					label="exécuter sur le serveur"
					onChange={() => {
						setLocal(!local);
					}}
				/>
				<Typography>
					on est sur le serveur : {local?'vrai':'faux'}
				</Typography>
			</Box>
			<Decomposeur action={local} />
			<div className="mb-14" />
		</Layout>
	);
};

export default IndexPage;
