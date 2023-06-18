import Layout from "../components/Layout";
import { NextPage } from "next";
import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import Decomposeur from "../components/Decomposeur";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

const IndexPage: NextPage = () => {
	const [local, setLocal] = useState<boolean>(true);
	const txt_serveur = "exécuter sur le serveur";
	const txt_local = "exécuter en local";
	const [texteLieu, setTexteLieu] = useState<string>(txt_serveur);
	const [disabled, setDisabled] = useState(false);

	const toggle = () => {
		setDisabled((action) => {
			return !action;
		});
	};

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
				♻️ ♻️ Décomposition en facteurs premiers 👋😉
			</Typography>
			<br />
			<Box
				textAlign={"center"}
				visibility={disabled ? "collapse" : "visible"}
			>
				<FormControlLabel
					control={<Switch defaultChecked />}
					label={texteLieu}
					onChange={() => {
						if (local) {
							setTexteLieu(txt_local);
							setLocal(false);
						} else {
							setTexteLieu(txt_serveur);
							setLocal(true);
						}
					}}
				/>
			</Box>
			<Decomposeur
				local={local}
				disable_function={toggle}
			/>
			<div className="mb-14" />
		</Layout>
	);
};

export default IndexPage;
