import {
	Container,
	Tab,
	Tabs,
} from "@mui/material";
import Layout from "../components/Layout";
import { useState } from "react";
import Quantieme from "../components/quantieme";
import Approchant from "../components/approchant";

const Affichen = () => {
	const [tabnum, setTabnum] = useState(1);
	const [nbSaisi1, setNbSaisi1] = useState("");
	const [nbSaisi2, setNbSaisi2] = useState("");

	const storeValue1 = (val: string) => {
		setNbSaisi1(val);
	}

		const storeValue2 = (val: string) => {
			setNbSaisi2(val);
		};


	return (
		<>
			<Layout
				title="Recherche premiers"
				about_invisible
			>
				<Container maxWidth="lg">
					<Tabs
						value={tabnum}
						onChange={(e, newval) => {
							e.preventDefault();
							setTabnum(newval);
						}}
						
					>
						<Tab
							value={1}
							label={"Nème premier"}
						/>

						<Tab
							value={2}
							label={"premier approchant"}
						/>
					</Tabs>

					{tabnum === 1 && (
						<Quantieme
							nombre={nbSaisi1}
							storeValue={storeValue1}
						/>
					)}
					{tabnum === 2 && (
						<Approchant
							nombre={nbSaisi2}
							storeValue={storeValue2}
						/>
					)}
				</Container>
				<br />
				<br />
			</Layout>
		</>
	);
};

export default Affichen;
