import { useState } from 'react'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useAlert } from 'react-alert';

const API_KEY = process.env.REACT_APP_API_KEY;
function ChatGPT(props) {
    const alert = useAlert()
    const [predefindMsg, setPredefindPsg] = useState([])
    const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
        "role": "system", "content": "You are MobileStoreGPT. You are here to help everyone buy mobile phones easier."
    }
    const { products } = useSelector(state => state.products)
    const [messages, setMessages] = useState([
        {
            message: "Hi!",
            direction: 'outgoing',
            sender: "user"
        },
        {
            message: "Hello, I'm MobileStoreGPT! Ask me anything!",
            sentTime: "just now",
            sender: "ChatGPT"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    useEffect(() => {
        pushNewSetup()
    }, [products])

    const pushNewSetup = () => {
        if (!products) return
        const newMessage = [
            {
                role: "user",
                content: `For example the mobile store got these products: ${JSON.stringify(products)}, can you remember them all and answer when asked ?`,
            },
            {
                role: "assistant",
                content: `Yes. I can remember all those products`,
            }]
        setPredefindPsg(newMessage)
    }
    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);

        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
        // Format messages for chatGPT API
        // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
        // So we need to reformat
        try {
            let apiMessages = chatMessages.map((messageObject) => {
                let role = "";
                if (messageObject.sender === "ChatGPT") {
                    role = "assistant";
                } else {
                    role = "user";
                }
                return { role: role, content: messageObject.message }
            });


            // Get the request body set up with the model we plan to use
            // and the messages which we formatted above. We add a system message in the front to'
            // determine how we want chatGPT to act. 
            const apiRequestBody = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    systemMessage,
                    ...predefindMsg,  // The system message DEFINES the logic of our chatGPT
                    ...apiMessages // The messages from our chat with ChatGPT
                ]
            }

            await fetch("https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + API_KEY,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(apiRequestBody)
                }).then((data) => {
                    return data.json();
                }).then((data) => {
                    console.log(data.choices[0].message.content);
                    setMessages([...chatMessages, {
                        message: data.choices[0].message.content,
                        sender: "ChatGPT"
                    }]);
                    setIsTyping(false);
                });
        } catch (error) {
            console.log(error)
            setIsTyping(false)
            alert.error("ChatGPT is overloaded with requests right now ! Please try again !")
        }

    }
    if (!props.visible) return null
    return (


        <MainContainer style={{ width: "400px", position: "fixed", top: "50%", right: "10%", transform: "translateY(-50%)", backgroundColor: "#fff", zIndex: 9999 }}>
            <ChatContainer>
                <MessageList
                    autoScrollToBottom={true}
                    scrollBehavior='auto'
                    typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
                >
                    {messages.map((message, i) => {
                        return <Message key={i} model={message} />
                    })}
                </MessageList>
                <MessageInput placeholder="Type message here" onSend={handleSend} />
            </ChatContainer>
        </MainContainer>


    )
}

export default ChatGPT