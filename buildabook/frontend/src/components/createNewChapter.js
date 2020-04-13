import React from 'react'
import axios from 'axios'
import { Modal, 
    Button, 
    Form, 
    Message,
    Segment,
} from 'semantic-ui-react'
import cookie from 'js-cookie'
import Login from '../pages/Login'

const isLoggedIn = cookie.get("token")
const INITIAL_CHAPTER = {
    title: "",
    text: "",
    author: "",
    upvoteCount: 1
}

function CreateNewChapter(props) {
    const [modalOpen, setModalOpen] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [disabled, setDisabled] = React.useState(false)
    const [chapter, setChapter] = React.useState(INITIAL_CHAPTER)

    //If modal is opened or closed, it resets the state of the form
    React.useEffect(() => { 
        setError(false)
        setSuccess(false)
        setLoading(false)
        setDisabled(false)
        setChapter(INITIAL_CHAPTER)
    },[modalOpen])


    //Creates a timer on form success
    React.useEffect(() => {
        if (Boolean(success)) {
            const timer = setTimeout(() => { setModalOpen(false) }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    //handles change in the form to populate chapter fields
    function handleChange (event) {
        const {name, value} = event.target
        setChapter(prevstate => ({ ...prevstate, [name]: value }))
    }

    //handles submitting the chapter entry
    async function handleSubmit (event) {
        event.preventDefault()
        try {
            setLoading(true)
            setDisabled(true)
            setSuccess(false)
            setError(false)
            //set Author to chapter
            const {title, text} = chapter
            const author = JSON.parse(cookie.get('token')).user.id
            const chapter = props.book.chaptersArray[props.book.chaptersArray.length - 1]
            const payload = {title, text, author, chapter}
            console.log(payload)
            //post chapter to database
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/chapter/add`, payload)
            setSuccess(response.message)
            setChapter(INITIAL_CHAPTER)
        } catch (error) {
            setError(error)
        } finally {
            setDisabled(false)
            setLoading(false)
        }
    }

    return (
        <>
            <Modal  trigger={
                                <Button 
                                    attached='bottom'
                                    icon='pencil'  
                                    content='Add Chapter' 
                                    color='green'
                                    floated='right'
                                    onClick={ () => {
                                        setModalOpen(true)
                                        setError("")
                                        setSuccess("")
                                    }}
                                />
                            }
                    open={modalOpen}
                    onClose={() => setChapter(INITIAL_CHAPTER)}
                    closeOnDimmerClick={() => setModalOpen(false)}
            >
            
                {isLoggedIn ?
                    (
                        <>
                        <Segment>
                            <Message 
                                attached
                                icon='book'
                                header='Submit Your Chapter'
                                color='green'
                            />
                            <br />
                            <Form error={Boolean(error)} success={Boolean(success)} loading={loading} onSubmit={handleSubmit} disabled={loading}>
                                <Message success header="Success: " content={success} />
                                <Message error header="Oops! " content={error} />
                                <Form.Input 
                                    required
                                    label='Title'
                                    placeholder='Title'
                                    name='title'
                                    value={chapter.title}
                                    onChange={handleChange}
                                />
                                <Form.Field
                                    required
                                    control='textarea'
                                    label="Chapter Submission"
                                    placeholder="Write your entry here"
                                    name="text"
                                    value={chapter.text} 
                                    onChange={handleChange}
                                />
                                <Button 
                                    disabled={disabled || loading}
                                    icon="send"
                                    type="submit"
                                    color="green"
                                    content="Submit"
                                />
                                <Button
                                    onClick={ () => {
                                            setModalOpen(false)
                                            setChapter(INITIAL_CHAPTER)
                                        }
                                    }
                                    icon="window close outline"
                                    color="red"
                                    content="Cancel"
                                />
                            </Form>
                        </Segment>
                        </>
                    ) : (
                        <Login />
                    )

                }
            </Modal>
        </>
    )
}

export default CreateNewChapter