import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import ChatsList from '../ChatsList/ChatsList.js'
import ChatWindow from '../ChatWindow/ChatWindow.js'
import Pusher from 'pusher-js';

const App = () => {

    const user = localStorage.getItem("user")
    const [data, setData] = useState()
    const [isDataLoading, setIsDataLoading] = useState(true)

    const AppWindow = () => {

        return (
            <div>
                <ChatsList data={data} />
                <ChatWindow />
            </div>
        )
    }

    const connectPusher = () => {
        const pusher = new Pusher('7c2eabd6eb5ada00a377', {
            cluster: 'eu',
        });
        const chats = pusher.subscribe('chats')
        const channels = pusher.subscribe('channels')
        chats.bind('newMessage', response => {
            handleChatUpdates(response)
        });
        channels.bind('newMessage', response => {
            handleChatUpdates(response)
        });
        setIsDataLoading(true)
    }


    const handleChatUpdates = (response) => {
        const modified = data.find(element => element._id === response.id && element.type === response.collection.slice(0, -1))
        if (modified.messagesCount < response.length) {
            const index = data.indexOf(modified)
            const newArrayElement = data[index]
            newArrayElement.lastMessage.text = response.data.text
            newArrayElement.lastMessage.timestamp = response.data.timestamp
            newArrayElement.lastMessage.author = response.data.author
            setData([
                ...data.slice(0, index),
                newArrayElement,
                ...data.slice(index + 1, data.length)
            ]);
        }
    }

    const getData = () => {
        fetch('http://localhost:3001/main', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => { return response.json() })
            .then((response) => {
                if (response.data) {
                    setData(response.data)
                    setIsDataLoading(false)
                }
                if (response.error)
                    console.log(response.error)
            }
            )
    }


    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (!isDataLoading)
            connectPusher()
    })

    return (
        !user ?
            <Navigate to='/register' />
            : <AppWindow />
    )
}

export default App