
import Layout from '../components/Layout'
import { NextPage } from 'next'
import { Typography } from '@mui/material'
import Decomposeur from '../components/Decomposeur'
import { Toaster } from 'react-hot-toast'

const IndexPage: NextPage = () => {
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

			<Decomposeur />
			<div className="mb-14" />
		</Layout>
  );
}

export default IndexPage
