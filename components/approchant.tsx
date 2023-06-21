import { Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ApproxData } from "../pages/api/approx";

type Props = {
	nombre: string;
	storeValue: (val: string) => void;
};

const Approchant = (props: Props) => {
	const param = props.nombre;
	const [val, setVal] = useState<number | "">("");
	const [prem, setPrem] = useState(["-1","-2","-3","-4"]);
	const [affdetail, setAffdetail] = useState(false);
	const [erreur, setErreur] = useState(false);

	useEffect(() => {
		if (param) {
			if (param === "") {
				setVal(param);
			} else {
				setVal(Number(param));
			}
		}
	}, []);

	const chercheNb =  async (nombre: number) => {
		const resp = await axios
			.post<ApproxData>("/api/approx", {
				nombre: nombre,
			});
		if (resp.data) {
			
			const n1 = resp.data.nombre_avant;
			const in1 = resp.data.index_nombre_avant;
			const n2 = resp.data.nombre_apres;
			const in2 = resp.data.index_nombre_apres;

			let aff_n1 = n1 + "";
			let aff_n2 = n2 + "";
			let aff_in1 = in1 + "° nombre premier";
			let aff_in2 = in2 + "° nombre premier";

			if (n1 === -1) {
				aff_n1 = "pas de nombre premier";
				aff_in1 = "//";
			}
			if (n2 === -1) {
				aff_n2 = "pas de nombre premier";
				aff_in2 = "//";
			}
			setPrem(() => {
				return (
					[
						aff_n1,
						aff_in1,
						aff_n2,
						aff_in2
					]
				)
			});
		} else {
			setErreur(true);
			setPrem(() => {
				return ["erreur", "//", "erreur", "//"];
			})
		}
	};

	const Detail = () => {
		return (
			<>
				{" "}
				<Typography color={erreur ? "red" : "blue"}>
					voici les deux nombres premiers proches de {val}
				</Typography>
				<br />
				<Typography
					variant="body1"
					className="text-blue-900 border border-lime-400 p-2 rounded-lg"
				>
					{prem[0]}
				</Typography>
				<Typography
					variant="body1"
					className="text-blue-900 border border-lime-50 p-2 rounded-lg"
				>
					{prem[1]}
				</Typography>
				<Typography
					variant="body1"
					className="text-blue-900 border border-lime-400 p-2 rounded-lg"
				>
					{prem[2]}
				</Typography>
				<Typography
					variant="body1"
					className="text-blue-900 border border-lime-50 p-2 rounded-lg"
				>
					{prem[3]}
				</Typography>
			</>
		);
	};

	return (
		<>
			<Typography className="mt-3">
				Trouvez les deux nombres premiers les plus proches d'un nombre donné
			</Typography>
			<Container maxWidth="md">
				<div className="flex flex-col">
					<TextField
						variant="outlined"
						label="nombre à approcher"
						sx={{ height: "100%", maxWidth: "80%", marginTop: "15px" }}
						onChange={(e) => {
							e.preventDefault();
							setAffdetail(false);
							const val = e.target.value;
							if (val === "0" || val === "") {
								setVal("");
								props.storeValue(val);
								return;
							}
							let vel_num: number;
							try {
								vel_num = Number(val);
								setVal(vel_num);
								props.storeValue(val);
							} catch (error) {
								vel_num = 0;
							}
						}}
						value={val}
					/>
					<Button
						variant="contained"
						className="bg-blue-700 text-white"
						sx={{ maxWidth: "80%", marginTop: "8px" }}
						onClick={(e) => {
							e.preventDefault();
							if (val === "") {
								return;
							}
							if (val > 0) {
								chercheNb(val);
								setAffdetail(true);
							}
						}}
						disabled={val === 0 || val === ""}
					>
						Approcher
					</Button>
				</div>
			</Container>
			<br />
			<Container maxWidth="sm">{affdetail ? <Detail /> : null}</Container>
		</>
	);
};

export default Approchant;
