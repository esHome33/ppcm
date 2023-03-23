
import Layout from '../components/Layout'
import { NextPage } from 'next'
import { Typography } from '@mui/material'
import Decomposeur from '../components/Decomposeur'

const IndexPage: NextPage = () => {
  return (
    <Layout title="Facteurs premiers" home_invisible>
      <Typography variant='h6'
        className='text-center font-bold text-teal-800'
      > ♻️ ♻️ Décomposition en facteurs premiers 👋</Typography>
    
      <Decomposeur />
    </Layout>
  )
}

export default IndexPage
