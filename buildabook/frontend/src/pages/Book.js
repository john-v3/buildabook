import React, { useState, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'
import Chapter from '../components/chapter'
import CreateNewChapter from '../components/createNewChapter'

import bookData from '../placeholder data/book'
import chapterData from '../placeholder data/chapter'
import { Icon, Image, Card, Label, Tab, Header, Modal, Button } from 'semantic-ui-react'


function Book() {
    const match = useRouteMatch()

    const [book, setBook] = useState({})
    const [chapters, setChapters] = useState([])
    const [chapterPane, setChapterPane] = useState([])
    const [contenders, setContenders] = useState([])
    const [contendersPane, setContendersPane] = useState([])
    const [contendersArrayLength, setContendersArrayLength] = useState(0)
    

    useEffect(() => {
        
        //Get Book data
        const fetchBook = async () => {
        //const response = await axios.get(`${process.env.BASE_URL}/api/book?=${match.params._id}`)
        //setBook(response.data)
        setBook(bookData[0])
        
        //On first load, React renders undefined objects.
        //This sets the length of the chapter array to show
        if (Object.keys(book).length) {
            setContendersArrayLength(book.contenders.length)
        }

        //Placeholder data. Will need to call API.
        setChapters(chapterData)
        setContenders(chapterData)

        //Build the tabs for each chapter in the chapter list
        function getChapterPane () {
            const pane = _.map(chapters, (chapter, i) => (
                {
                    menuItem: `Chapter ${i+1}`,
                    render: () => <Tab.Pane key={chapter._id}><Chapter chapter={chapter}/></Tab.Pane>
                }
            ))
            return pane
        }
        setChapterPane(getChapterPane)    

        //Build the tabs for the contenders of the latest chapter
        function getContendersPane () {
            const pane = _.map(contenders, (contender, i) => (
                {
                    menuItem: ` ${contender.author}`, 
                    render: () => <Tab.Pane key={contender._id}><Chapter chapter={contender}/></Tab.Pane>
                }
            ))
                return pane
            }
            setContendersPane(getContendersPane)
        }
        fetchBook();
    },[book])


    
    return (
        <>
        <h1>This is {book.title}'s Book Page</h1>
            <Card>
                <Card.Content>
                    <Image src={book.image} />
                    <Card.Header>
                        {book.title}
                    </Card.Header>
                    <Icon name='users' />
                        Authors: {_.map(book.authorArray, (author) => (
                                <Label key={author} as='a' href={`/user/${author}`} >
                                    <Image avatar spaced='right' src={author.profilePic} />
                                    {author}
                                </Label>
                            ))}  
                </Card.Content>
                <Card.Description>
                    {book.writingPrompt}
                </Card.Description>
            </Card>

            <Tab panes={chapterPane} />
            
            <Header as='h3'>
                Contenders for Chapter {contendersArrayLength}
            </Header>
            <Tab panes={contendersPane} />
            <br />
            <CreateNewChapter />
        </>
    )   

}

export default Book