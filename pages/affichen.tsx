import { Button, Container, TextField, Typography } from "@mui/material";
import Layout from "../components/Layout";
import { useState } from "react";
import axios from "axios";
import { Result } from "./api/prime";

const Affichen = () => {
	const [val, setVal] = useState(0);
	const [prem, setPrem] = useState("");

	const chercheNb = (nb: number) => {
		axios
			.get<Result>("/api/prime?n=" + nb)
			.then((resp) => {
				const une_erreur = resp.data.isError;
				if (une_erreur) {
					setPrem("Erreur survenue");
				} else {
					setPrem(resp.data.premier);
				}
			})
			.catch((err) => {
				setPrem(err.message);
			});
	};

	return (
		<>
			<Layout
				title="Afficher un nombre premier"
				about_invisible
			>
				<Container
					sx={{
						display: "flex",
						flexDirection: "column",
						width: "80%",
					}}
				>
					<TextField
						variant="outlined"
						label="numéro du nombre premier cherché"
						sx={{ height: "100%", maxWidth: "80%" }}
						onChange={(e) => {
							e.preventDefault();
							const val = e.target.value;
							let vel_num: number;
							try {
								vel_num = Number(val);
								setVal(vel_num);
							} catch (error) {
								vel_num = 0;
							}
						}}
					/>
					<Button
						variant="contained"
						className="bg-blue-700 text-white"
						sx={{ maxWidth: "80%", marginTop: "8px" }}
						onClick={(e) => {
							e.preventDefault();
							if (val > 0) {
								chercheNb(val);
							}
						}}
					>
						Cherche
					</Button>
				</Container>
				<br />
				<Typography className="mt-4">
					Je cherche le {val}° nombre premier :
				</Typography>
				<br />
				{prem === "" ? null : (
					<Typography>
						C'est{" "}
						<span className="font-extrabold text-lg text-blue-800">
							{prem}
						</span>
					</Typography>
				)}
			</Layout>
		</>
	);
};

export default Affichen;
