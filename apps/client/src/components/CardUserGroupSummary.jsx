import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {selectedGroupActions} from '../store/selectedGroupSlice'

const CardUserGroupSummary = () => {
  const navigate = useNavigate()
  const userGroups = useSelector((state)=>state.userSummary.groupList)
  const loggedInUser = useSelector((state)=>state.user)
  const dispatch = useDispatch()

  const totalGroups = userGroups?.length;

  const handleAddGroupClick = () => {navigate('/group/register')}

  const handleGroupClick = (groupId) => {
    return () => {
      console.log("GroupId", groupId)
      fetch('/api/groups/details',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({groupId})
      }).then((res)=>{
        // console.log(res)
        if (res.status !== 200){
          throw new Error({msg:"Some comm error"})
        }
        return res.json()
      }).then ((data)=>{
        // console.log(data)
        dispatch(selectedGroupActions.updateSelectedGroup({groupId, name:data.name, description:data.description, userList:data.userDetails, netAmount:data.netAmount}))
        navigate('/detailedpages/group/details')
      }).catch((error)=>{
        console.log(error)
      })
      }
  }

  return (
    <div>
      <Card variant="light">
        <Card.Header className='text-center'>Your Groups – {totalGroups}</Card.Header>
        <Card.Body>
          <ul>
            <Card.Text>            
              {userGroups.map((group, idx) => (
                <Button key={idx} style={{minWidth:"130px"}} className='m-2' onClick={handleGroupClick(group._id)}>{group.name}</Button>
              ))}
              <Button className='d-block text-center mx-auto mt-3' variant='secondary' onClick={handleAddGroupClick}>Create a New group</Button>            
            </Card.Text>
          </ul>      
        </Card.Body>
      </Card>
    </div>
  );
};

export default CardUserGroupSummary;
