import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate()
    const [roomId, setRoomId] = useState('');
    const [username, setUserName] = useState('');
    

    const createNewRoom = (e) => {
        e.preventDefault()
        const id = uuid();
        setRoomId(id);
        toast.success('Room Created')
    }

    const joinRoom = (e) => {
        if (!roomId || !username) {
            toast.error('Please fill all the fields')
            return
        }
        navigate(`/editor/${roomId}`, {
            state: {
                username: username,
            }
        })

    };

    const handleInputEnter = (e) => {
        if (e.key === 'Enter') {
            joinRoom()
        }
    }

  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <h4 className='mainLabel'>Paste Invitation Room Id</h4>
            <div className='inputGroup'>
                <input type='text' className='inputBox' value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Room Id' onKeyUp={handleInputEnter}/>
                <input type='text' className='inputBox'value={username} onChange={(e) => setUserName(e.target.value)} placeholder='Username' onKeyUp={handleInputEnter}/>
                <button className='btn joinBtn' onClick={joinRoom}>Join Room</button>
                <span className='createInfo'>
                    If you don't have an id then create
                    <a onClick={createNewRoom} href='' className='createNewBtn'> new room</a>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Home