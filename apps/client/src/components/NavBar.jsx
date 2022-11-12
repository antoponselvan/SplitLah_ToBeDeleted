import {useSelector, useDispatch} from 'react-redux'
import { userActions } from '../store/userSlice'
import {useNavigate} from 'react-router-dom'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import "../App.css"

const NavBar = () => {
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const userLoggedIn = !(user.id === "")
  const initialUserState = {id:"", name:"", email:""}

  const handleBrandTxtClick = () => {navigate('/')}
  const handleDashboardTxtClick = () => {navigate('/detailedpages/user/home')}
  const handleGroupsTxtClick = () => {navigate('/detailedpages/groups/summary')}
  const handleLogOutButtonClick = () => {
    fetch('/api/users/logout',{
      method:"POST"
    }).then((res)=>{
      if (res.status === 202) {
        dispatch(userActions.updateLoggedInUser(initialUserState))
        navigate('/')
      }
    }).catch ((error)=>{
      console.log(error)
    })
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand={"sm"}>
      <Container fluid>
        <Navbar.Brand  style={{cursor:'pointer'}} onClick={handleBrandTxtClick}>Split-Lah!</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {userLoggedIn && <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link onClick={handleDashboardTxtClick}>My Dashboard</Nav.Link>
            <Nav.Link onClick={handleGroupsTxtClick}>My Groups</Nav.Link>
          </Nav>}
        </Navbar.Collapse>
          {userLoggedIn && <Nav className="ms-auto">
            {userLoggedIn && <div><p className='text-light text-center p-0 m-0 mx-1 d-none d-sm-block'>Hi! </p> <p className='text-light text-center p-0 m-0 mx-1'>{user.name}</p></div>}
            {userLoggedIn && <Button  onClick={handleLogOutButtonClick} variant="danger">Log out</Button>}
          </Nav>}
      </Container>
      </Navbar>

      {/* <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand className="float-left" onClick={handleBrandTxtClick}>SPLITLAH!</Navbar.Brand>
          <Nav className="mx-auto">
            {userLoggedIn && <Nav.Link onClick={handleDashboardTxtClick}>My Dashboard</Nav.Link>}
            {userLoggedIn && <Nav.Link onClick={handleGroupsTxtClick}>My Groups</Nav.Link>}
          </Nav>
          <Nav className="ms-auto">
            {userLoggedIn && <p className='text-light'>Hi! {user.name}</p>}
            {userLoggedIn && <Button  onClick={handleLogOutButtonClick} variant="danger">Log out</Button>}
          </Nav>
        </Container>
      </Navbar> */}
    </>
  );
}

export default NavBar