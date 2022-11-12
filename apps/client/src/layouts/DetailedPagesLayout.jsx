import {Outlet} from 'react-router-dom'
import Header from '../components/Header'

const DetailedPagesLayout = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}

export default DetailedPagesLayout