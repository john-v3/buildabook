import React from 'react'
import axios from 'axios'
import { Modal, 
    Button, 
    Form, 
    Message,
    Segment,
    Select, 
    Input,
    Image } from 'semantic-ui-react'
import cookie from 'js-cookie'
import Login from '../pages/Login'

const isLoggedIn = cookie.get("token")

const INITIAL_BOOK = {
    title: "",
    author: "",
    numberOfChapters: 0,
    duration: 0,
    image: "",
    writingPrompt: "",
    genre: ""
}

function CreateNewBook() {
    const [modalOpen, setModalOpen] = React.useState(false)
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [disabled, setDisabled] = React.useState(false)
    const [mediaPreview, setMediaPreview] = React.useState("");
    const [book, setBook] = React.useState(INITIAL_BOOK)
    const [message, setMessage] = React.useState("")

    React.useEffect(() => {
        if (Boolean(success)) {
            const timer = setTimeout(() => { setModalOpen(false) }, 2000);
            return () => clearTimeout(timer);
        }
      }, [success]);

    const durationOptions = [
        {key: 's', text: "1 minute", value: 2 },
        {key: 'm', text: "5 minutes", value: 3 },
        {key: 'h', text: "1 hour", value: 4 },
    ]
    const chapterOptions = [
        {key: '1', text: "1", value: 1},
        {key: '2', text: "2", value: 2},
        {key: '3', text: "3", value: 3},
        {key: '4', text: "4", value: 4},
        {key: '5', text: "5", value: 5},
    ]

    const genreOptions = [
        {key: 'Adventure', text: 'Adventure', value: 'Adventure'},
        {key: 'Comedy', text: 'Comedy', value: 'Comedy'},
        {key: 'Contemporary', text: 'Contemporary', value: 'Contemporary'},
        {key: 'Fantasy', text: 'Fantasy', value: 'Fantasy'},
        {key: 'Historic', text: 'Historic', value: 'Historic'},
        {key: 'Horror', text: 'Horror', value: 'Horror'},
        {key: 'Realistic Fiction', text: 'Realistic Fiction', value: 'Realistic Fiction'},
        {key: 'Romance', text: 'Romance', value: 'Romance'},
        {key: 'Science Fiction', text: 'Science Fiction', value: 'Science Fiction'},
        {key: 'Thriller', text: 'Thriller', value: 'Thriller'}    
    ]
    
    //Handles the change for the input fields
    function handleInputChange(event) {
        const { name, value, files } = event.target;
        if (name === "image") {
            setBook(prevState => ({ ...prevState, image: files[0] }));
            setMediaPreview(window.URL.createObjectURL(files[0]));
        } else {
            setBook(prevState => ({ ...prevState, [name]: value }));
        }
    }

    //Handles the change for the select fields
    function handleSelectChange(event, result) {
        const {name, value} = result
        setBook(prevState => ({ ...prevState, [name]: value }))
    }


    //Get Cloudinary Url
    async function handleImageUpload() {
        console.log(book.image)
        const data = new FormData();
        data.append("file", book.image);
        data.append("upload_preset", "buildabook");
        data.append("cloud_name", "ddspck9tx")
        
        const response = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, data);
        const mediaUrl = response.data.url;
        console.log(response.data.url)
        return mediaUrl;
      }

    async function handleSubmit(event) {
        event.preventDefault()
        const author = JSON.parse(cookie.get('token')).user.username
        console.log(book)
        try {    
            setLoading(true)
            setDisabled(true)
            setError(false)
            setSuccess(false)
            //Upload the image to cloudinary or if one does not exist, use default book picture
            let image;
            if (book.image) {
                image = await handleImageUpload()
            } else {
                image = "https://png.pngtree.com/png-vector/20190307/ourlarge/pngtree-vector-open-book-icon-png-image_782619.jpg"
            }
            //Create the payload
            const {title, numberOfChapters, duration, writingPrompt, genre} = book
            const payload = {title, numberOfChapters, duration, writingPrompt, author, image, genre}
            console.log(payload)
            //Call the API
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/book/add`, payload)

            //Set Messages and reset the book state
            setSuccess(true)
            //setMessage(response.data.message)
            setBook(INITIAL_BOOK)
            //Move to appropriate book page
            try {
                const response2 = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/book/getByTitle?title=${title}`)
                console.log(response2.data._id)
                window.location.href = `/books/${response2.data._id}`
            } catch (e) {
                console.error(e)
            }
        } catch(error) {
            setError(true)
            setMessage(error)
            console.log(error)
        } finally {
            setLoading(false)
            setDisabled(false)
        }
    }

    return (
        <>
            <Modal 
                trigger={<Button color='green' floated='right' onClick={ () => 
                    {
                        setModalOpen(true); 
                        setBook(INITIAL_BOOK);
                        setSuccess(false)
                        setError(false)
                    }}>+BuildABook</Button>} 
                open={modalOpen}
            >
            {isLoggedIn ?  
                (
                <Segment>
                    <Message 
                        attached
                        icon="book"
                        header="Build a Book!"
                        color='green'  
                    />
                    <br />
                        <Form error={Boolean(error)} success={Boolean(success)} loading={loading} onSubmit={handleSubmit} disabled={loading}>
                            <Message success header="Success:" content="Your Book Has Been Posted" />
                            <Message error header="Oops!" content="Your Book Has Not Been Posted.  Please try again later." />
                            
                            <Form.Group>
                                <Form.Field
                                    width={8}
                                    control="input"
                                    required
                                    label="Title"
                                    placeholder="Title"
                                    name="title"
                                    value={book.title} 
                                    onChange={handleInputChange}
                                />

                                <Form.Field 
                                    width={4}
                                    required
                                    control={Select}
                                    options={chapterOptions}
                                    label="Number of Chapters"
                                    placeholder="Number of Chapters"
                                    name="numberOfChapters"
                                    value={book.numberOfChapters} 
                                    onChange={handleSelectChange}
                                />
                                <Form.Field 
                                    width={2}
                                    required
                                    control={Select}
                                    options={durationOptions}
                                    label="Duration"
                                    placeholder="Duration"
                                    name="duration"
                                    value={book.duration} 
                                    onChange={handleSelectChange}
                                />
                            </Form.Group>
                            <Form.Field 
                                width={2}
                                required
                                control={Select}
                                options={genreOptions}
                                label="Genre"
                                placeholder="Genre"
                                name="genre"
                                value={book.genre} 
                                onChange={handleSelectChange}
                            />
                            <Form.Field
                                control={Input}
                                name="image"
                                type="file"
                                label="Media"
                                accept="image/*"
                                content="Select Image"
                                onChange={handleInputChange}
                            />
                            <Image src={mediaPreview} rounded centered size="medium" inline />
                            <Form.Field
                                required
                                control='textarea'
                                label="Prompt"
                                placeholder="What is your book about?"
                                name="writingPrompt"
                                value={book.writingPrompt} 
                                onChange={handleInputChange}
                            />
                            <Button 
                                disabled={disabled || loading}
                                icon="send"
                                type="submit"
                                color="green"
                                content="Submit"
                            />
                            <Button 
                                disabled={disabled || loading}
                                icon='cancel'
                                color='red'
                                content='Cancel'
                                onClick={() => {setModalOpen(false); setBook(INITIAL_BOOK);}}
                            />
                        </Form>
                    </Segment>
                    ):(
                        <Segment>
                            <Login />
                        </Segment>
                    )}
            </Modal>
        </>
    )
}

export default CreateNewBook