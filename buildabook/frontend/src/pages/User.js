import React, { useState, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'
import bookData from '../placeholder data/book'
import userData from '../placeholder data/user'
import chapterData from '../placeholder data/chapter'
import { Icon, Image, Card, Label, Tab, Header, Modal, Button, Placeholder, Segment, Table, Grid, Form } from 'semantic-ui-react'
import ContributionsTable from '../components/ContributionsTable'



function User() {
    const match = useRouteMatch()
    const [books, setBooks] = React.useState([]);
    const [user, setUsers] = useState([])
    const [loading, setLoading] = React.useState(true)
   
   
   


    useEffect(() => {
       
        //Get Book data
        const fetchUser = async () => {
            setUsers(userData[0])
         
        }
        fetchUser();
    },[user])


//Placeholder get data
if (loading) {
  setBooks(bookData)
  setLoading(false)
}


   
    return (
        <>    


<h4 class="ui horizontal divider header">
        <i class="address card icon"></i>
  User Information
 

        </h4>
       
        <img class="ui centered medium circular image"  src={user.profilePic}></img>

        <Segment>
        <Grid>
        <Grid.Column textAlign="center">
        <button class="ui primary button">
        Follow
        </button>
        </Grid.Column>
        </Grid>
        </Segment>

     <Table celled striped>
       
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell textAlign="center" colSpan='3'>Basic Information </Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell collapsing>
          <Icon name='calendar icon' /> Member Since
        </Table.Cell>
        <Table.Cell></Table.Cell>
       
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Icon name='user icon' /> Username
        </Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
       
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Icon name='edit outline' /> Bio
          
        </Table.Cell>
        
        <Table.Cell>{user.bio}</Table.Cell>
        

      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Icon name='dollar sign' /> Account Type
        </Table.Cell>
        <Table.Cell>Free (Premium Coming Soon!)</Table.Cell>
     
      </Table.Row>
      <Table.Row>
       

      </Table.Row>
    </Table.Body>
  </Table>




  <h4 class="ui horizontal divider header">
        <i class="pencil alternate icon"></i>


  Contributions
 
</h4>
<h4>This is currently just pulling every book, need to edit to make it display particular users contributions</h4>
      <>
        <Segment raised loading={loading}>

          <ContributionsTable books={books} />
        </Segment>
      </>

      <p></p>
      <h4 class="ui horizontal divider header">
        <i class="comments icon"></i>
 Comments
</h4>
           
        </>
    )  

}

export default User