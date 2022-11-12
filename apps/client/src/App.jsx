import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import RegisterUser from './pages/RegisterUser'
import UpdateUser from './pages/UpdateUser'
import GroupRegister from './pages/GroupRegister'
import GroupUpdate from './pages/GroupUpdate'
import TransactionRegister from './pages/TransactionRegister'
import DetailedPagesLayout from './layouts/DetailedPagesLayout'
import UserHome from './pages/UserHome'
import UserGroupsSummary from './pages/UserGroupsSummary'
import GroupDetails from './pages/GroupDetails'
import GroupTransactions from './pages/GroupTransactions'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            <Route index element={<Login/>}/>
            <Route path="/users/register"  element={<RegisterUser/>}/>
            <Route path="/users/edit" element={<UpdateUser/>}/>
            <Route path="/group/register" element={<GroupRegister/>}/>
            <Route path="/group/edit" element={<GroupUpdate/>}/>
            <Route path='/transaction/register' element={<TransactionRegister/>}/>
            <Route path='/detailedpages' element={<DetailedPagesLayout/>}>
              <Route path='/detailedpages/user/home' element={<UserHome/>}/>
              <Route path='/detailedpages/groups/summary' element={<UserGroupsSummary/>}/>
              <Route path='/detailedpages/group/details' element={<GroupDetails/>}/>
              <Route path='/detailedpages/group/transactions' element={<GroupTransactions/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
