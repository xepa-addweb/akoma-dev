import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Modal, Container, Row, Col, UncontrolledTooltip, Button, Media, UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Nav, NavItem, NavLink, TabContent, TabPane, Card, Form, FormGroup, InputGroup, InputGroupAddon } from "reactstrap";
import classnames from 'classnames';


//Import Scrollbar
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

//Import Images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import axios from 'axios'
import moment from 'moment'

//socket client
import socketIOClient from "socket.io-client";
// import { delete } from 'request-promise';
const ENDPOINT = "http://127.0.0.1:4000";

const instance = axios.create();

class Chat extends Component {
    constructor(props) {
        super(props);

        const userObj = JSON.parse(localStorage.getItem("authUser"))
        console.log('AUTHUSER')
        console.log(userObj.client[0])
        var commonTwitterPayload = {}
        if(userObj.client[0]) {
            var twitter_consumer_key = userObj.client[0].twitter_consumer_key ? userObj.client[0].twitter_consumer_key : ''
            var twitter_consumer_secret = userObj.client[0].twitter_consumer_secret ? userObj.client[0].twitter_consumer_secret : ''
            var twitter_access_token = userObj.client[0].twitter_access_token ? userObj.client[0].twitter_access_token : ''
            var twitter_access_token_secret = userObj.client[0].twitter_access_token_secret ? userObj.client[0].twitter_access_token_secret : ''
            
            commonTwitterPayload = {
                twitter_consumer_key : twitter_consumer_key,
                twitter_consumer_secret : twitter_consumer_secret,
                twitter_access_token : twitter_access_token,
                twitter_access_token_secret : twitter_access_token_secret
            }
        }
        //socket client connection
        const socket = socketIOClient(ENDPOINT);
        socket.on("follow_event", data => {
        console.log('follow_event-'+data);
        instance.post('http://localhost:4000/twitter/followers', commonTwitterPayload)
        .then(response => {
            console.log('FOLLOWERS')
            console.log(response.data)
            var followCount = this.state.followCount
            var followCountInc = parseInt(followCount) + 1
            this.setState({followers : response.data, followCount : followCountInc})
            
        })
        .catch(function (error){
            console.log(error);
        })
        });

        socket.on("tweet_event", data => {
        console.log('tweet_event-'+data);
        instance.post('http://localhost:4000/twitter/tweets', commonTwitterPayload)
        .then(response1 => {
            console.log('TWEETS')
            console.log(response1.data)
            var tweetCount = this.state.tweetCount
            var tweetCountInc = parseInt(tweetCount) + 1
            this.setState({tweets : response1.data, tweetCount : tweetCountInc})
            
        })
        .catch(function (error){
            console.log(error);
        })
        });

        //Followers
        instance.post('http://localhost:4000/twitter/followers', commonTwitterPayload)
        .then(response => {
            console.log('FOLLOWERS')
            console.log(response.data)
            this.setState({followers : response.data})
            
        })
        .catch(function (error){
            console.log(error);
        })

        //Tweets
        instance.post('http://localhost:4000/twitter/tweets', commonTwitterPayload)
        .then(response1 => {
            console.log('TWEETS')
            console.log(response1.data)
            this.setState({tweets : response1.data})
            
        })
        .catch(function (error){
            console.log(error);
        })       
        


        //Socket chat call
        socket.on("new_direct_message", data => {
            var chatCount = this.state.chatCount
            var chatCountInc = chatCount + 1
            this.setState({chatCount : chatCountInc})

            console.log('new_direct_message-');
            console.log(data)
            var dataRes = data
            console.log(this.state.messages)
            var currentMessageObj =  this.state.messages
            console.log(this.state.currentChatId)
            // console.log()
            if(this.state.currentChatId === dataRes.direct_message_events[0].message_create.sender_id) {
                console.log('Yes the same user')
                // currentMessageObj.push({id :isRight : false, })
                var sentTime = new Date(dataRes.created_timestamp * 1000); 
                console.log(sentTime.toLocaleString())
                var sentDate = sentTime.toLocaleString()
                var mediaURL = ''
                if(dataRes.direct_message_events[0].message_create.message_data.attachment) {
                    if(dataRes.direct_message_events[0].message_create.message_data.attachment.type == 'media') {
                         mediaURL = dataRes.direct_message_events[0].message_create.message_data.attachment.media.media_url_https
                    }
                }
                currentMessageObj.push({id : dataRes.direct_message_events[0].id, isRight: false, name: 'Xepa', message: dataRes.direct_message_events[0].message_create.message_data.text, time: sentDate, withChatUser : dataRes.direct_message_events[0].message_create.sender_id, mediaURL:mediaURL })
                this.setState({messages : currentMessageObj})
            } else {
                console.log('CHATS')
                var chatBoxArr = this.state.userChats
                var checkIdExist = chatBoxArr.some(function(o){return o["id"] === dataRes.direct_message_events[0].message_create.sender_id;})
                console.log('checkIDExist')
                console.log(checkIdExist)
                var senderData = []
                instance.post('http://localhost:4000/twitter/lookup/'+dataRes.direct_message_events[0].message_create.sender_id, commonTwitterPayload)
                .then(response3 => {
                    console.log('USERS')
                    console.log(response3.data)
                    var sendDataObj = response3.data
                    var conversation = this.state.messages
                    var sentTime = new Date(dataRes.created_timestamp * 1000); 
                    console.log(sentTime.toLocaleString())
                    var sentDate = sentTime.toLocaleString()
                    var mediaURL = ''
                    if(dataRes.direct_message_events[0].message_create.message_data.attachment) {
                        if(dataRes.direct_message_events[0].message_create.message_data.attachment.type == 'media') {
                            mediaURL = dataRes.direct_message_events[0].message_create.message_data.attachment.media.media_url_https
                        }
                    }
                    conversation.push({id : dataRes.direct_message_events[0].id, isRight: false, name: sendDataObj.name, message: dataRes.direct_message_events[0].message_create.message_data.text, time: sentDate, withChatUser : dataRes.direct_message_events[0].message_create.sender_id, mediaURL : mediaURL })
                    
                    console.log("CONVO")
                    console.log(conversation)
                    if(!checkIdExist) {
                    chatBoxArr.push({id : dataRes.direct_message_events[0].message_create.sender_id, name: sendDataObj.name, screen_name: sendDataObj.screen_name, profile_image_url_https:sendDataObj.profile_image_url_https, description: sendDataObj.description, ownerId : '1281552432514859008', conversation : conversation})          
                    } else {
                        setInterval(start => {
                                //Chats
                                var chatArray = []
                                instance.post('http://localhost:4000/twitter/chats', commonTwitterPayload)
                                .then(response1 => {
                                    console.log('CHATS')
                                // console.log(response1.data)
                                var chatData = response1.data
                                
                                chatData.forEach(function(cd) {
                                    instance.post('http://localhost:4000/twitter/lookup/'+cd.id, commonTwitterPayload)
                                    .then(response2 => {
                                        console.log('USERS')
                                        console.log(response2.data)
                                        cd.name = response2.data.name
                                        cd.screen_name = response2.data.screen_name
                                        cd.profile_image_url_https = response2.data.profile_image_url_https
                                        cd.description = response2.data.description
                                        
                                        // this.setState({chats : cd})
                                        instance.post('http://localhost:4000/twitter/lookup/'+cd.ownerId, commonTwitterPayload)
                                        .then(response3 => {
                                            console.log('USERS')
                                            console.log(response3.data)
                                            cd.ownerName = response3.data.name
                                            chatArray.push(cd)
                                            this.setState({ownerName : response3.data.name})
                                            // this.setState({chats : cd})
                                            
                                        })
                                        .catch(function (error){
                                            console.log(error);
                                        })
                                        
                                    })
                                    .catch(function (error){
                                        console.log(error);
                                    }) 

                                    
                                })
                                
                                
                            })
                            .catch(function (error){
                                console.log(error);
                            })
                            console.log('CHATARRAY1w---')
                            console.log(chatArray)
                            this.setState({userChats : chatArray})
                            this.toggleTab('1')
                        }, 60000)
                    }
                    this.setState({userChats:chatBoxArr})

                    
                })
                .catch(function (error){
                    console.log(error);
                })
                
            }          
            
        });
    


        this.state = {
            chatCount : 0,
            tweetCount : 0,
            followCount : 0,
            userObj : userObj,
            followers : [],
            tweets: [],
            tweetMediaDetails: [],
            tweetData: [],
            userChats: [],
            showMessageContent: false,
            currentChatId: '',
            ownerName: '',
            tweetMessage: '',
            reTweetMessage: '',
            chats: [
               ],
            groups: [
                ],
            contacts: [
                {
                    category: "A",
                    child: [
                       
                    ]
                },
                {
                    category: "B",
                    child: [
                       
                    ]
                },
                {
                    category: "C",
                    child: [
                        
                    ]
                },
                {
                    category: "D",
                    child: [
                        
                    ]
                },
            ],
            messages: [
                ],
            notification_Menu: false,
            search_Menu: false,
            settings_Menu: false,
            other_Menu: false,
            activeTab: '1',
            Chat_Box_Username: "Steven Franklin",
            Chat_Box_Username2: "Henry Wells",
            Chat_Box_User_Status: "online",
            Chat_Box_User_isActive: false,
            curMessage: "",
            selectedFile: "",
            selectFileName: "",
            modal_standard: false,
            replyTweet: '',
            in_reply_to_status_id: '',
            selectTweetFileName: "",
            reTweet: '',
            reTweetId : '',
            chatMediaURL : '',
            commonTwitterPayload : commonTwitterPayload
        };
     //   this.toggleNotification = this.toggleNotification.bind(this);
    //    this.toggleSearch = this.toggleSearch.bind(this);
     //   this.toggleSettings = this.toggleSettings.bind(this);
      //  this.toggleOther = this.toggleOther.bind(this);
       this.toggleTab = this.toggleTab.bind(this);
       this.tog_standard = this.tog_standard.bind(this);
        this.UserChatOpen = this.UserChatOpen.bind(this);
       //this.UserTweetOpen = this.UserTweetOpen.bind(this);
        //this.addMessage = this.addMessage.bind(this);
    }

    componentDidMount() {
        //Chats
        var chatArray = []
        instance.post('http://localhost:4000/twitter/chats', this.state.commonTwitterPayload)
        .then(response1 => {
            console.log('CHATS')
            // console.log(response1.data)
            var chatData = response1.data
            
            chatData.forEach(function(cd) {
                instance.post('http://localhost:4000/twitter/lookup/'+cd.id, this.state.commonTwitterPayload)
                .then(response2 => {
                    console.log('USERS')
                    console.log(response2.data)
                    cd.name = response2.data.name
                    cd.screen_name = response2.data.screen_name
                    cd.profile_image_url_https = response2.data.profile_image_url_https
                    cd.description = response2.data.description
                    
                    // this.setState({chats : cd})
                    instance.post('http://localhost:4000/twitter/lookup/'+cd.ownerId, this.state.commonTwitterPayload)
                    .then(response3 => {
                        console.log('USERS')
                        console.log(response3.data)
                        cd.ownerName = response3.data.name
                        chatArray.push(cd)
                        this.setState({ownerName : response3.data.name})
                        // this.setState({chats : cd})
                        
                    })
                    .catch(function (error){
                        console.log(error);
                    })
                    
                })
                .catch(function (error){
                    console.log(error);
                }) 

                 
            })
            
            
        })
        .catch(function (error){
            console.log(error);
        })
        console.log('CHATARRAY1w---')
        console.log(chatArray)
        this.setState({userChats : chatArray})
        this.toggleTab('2')
    }

    toggleNotification() {
        this.setState(prevState => ({
            notification_Menu: !prevState.notification_Menu
        }));
    }

    //Toggle Chat Box Menus
    toggleSearch() {
        this.setState(prevState => ({
            search_Menu: !prevState.search_Menu
        }));
    }

    toggleSettings() {
        this.setState(prevState => ({
            settings_Menu: !prevState.settings_Menu
        }));
    }

    toggleOther() {
        this.setState(prevState => ({
            other_Menu: !prevState.other_Menu
        }));
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
        if(tab == '1') {
            this.setState({showMessageContent : true, chatCount : 0})
        } else {
            this.setState({showMessageContent : false})
        }
        if(tab == '3') {
            this.setState({followCount : 0})
        }
        if(tab == '2') {
            this.setState({tweetCount : 0})
        }
    }

    //Use For Chat Box
    UserChatOpen = (chat) => {
        this.setState({showMessageContent : true})
        console.log('UserChat')
        console.log(chat)
        // let chatModule = [...this.state.chats];

        // for (let k = 0; k < 6; k++) { chatModule[k].isActive = false; } // Enable All Option First
        // chatModule[id - 1].isActive = true;

        // let msg = [{ id: "39", isRight: true, name: "Henry Wells", message: "How are you ?", time: "10:07" },
        // { id: "40", isRight: false, name: name, message: "I am fine, What about you ?", time: "10:09" },
        // ];
        this.setState({currentChatId : chat.id})
        var conversation = chat.conversation
        var msg = []
        var conversationLatest = conversation.reverse()
        conversationLatest.forEach(async function(cc) {
            console.log('Yesss conv1')
            console.log(cc.text)
            var isRight = false
            var userName = chat.name
            if(cc.isFrom == false) {
                isRight = true
                userName = chat.ownerName
                // this.setState({ownerName : userName})

            }
            var mediaURL = ''
            var mediaImgData = ''
            if(cc.media) {
                mediaURL = cc.media  
                               
                
                const getResponse = await axios.get(mediaURL, { headers: {
                    Authorization: 'OAuth oauth_consumer_key="F8xqPxo7D4A5Og4EeJyQKkY9m",oauth_token="1281552432514859008-kEz3AQd9J1GH9R8qju99YG42RwuGcm",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1604494480",oauth_nonce="ahqvsp",oauth_version="1.0",oauth_signature="kLk1ewZRHOM8TPsI5DUBrLNSnqA%3D"'
                  }});
                var finalMediaData = getResponse.data
                console.log('sdsd%^%^%^')
                console.log(finalMediaData)
            }
            
            if(cc.toId == chat.id || cc.fromId == chat.id) {
                console.log(cc.send_time)
                var dateC = cc.send_time
                var sentTime = moment.unix(dateC); 
                console.log(sentTime)
                var sentDate = sentTime.toLocaleString()
            msg.push({id : cc.id, isRight: isRight, name: userName, message: cc.text, time: sentDate, withChatUser : chat.id, mediaURL : mediaURL })
            
        }
        })
        this.setState({ Chat_Box_Username: chat.name, Chat_Box_User_Status: 'Online', messages: msg })
    }

    //use for tweet details box
    UserTweetOpen = (tweetDetails) => {
        console.log("Tweet cLick")
        console.log(tweetDetails.text)
        if(tweetDetails.entities.media) {
        this.setState({tweetMediaDetails : tweetDetails.entities.media, tweetData : tweetDetails, showMessageContent: false})
        }

        // let chatModule = [...this.state.chats];

        // for (let k = 0; k < 6; k++) { chatModule[k].isActive = false; } // Enable All Option First
        // chatModule[id - 1].isActive = true;

        // let msg = [{ id: "39", isRight: true, name: "Henry Wells", message: "How are you ?", time: "10:07" },
        // { id: "40", isRight: false, name: name, message: "I am fine, What about you ?", time: "10:09" },
        // ];
        // this.setState({ Chat_Box_Username: name, Chat_Box_User_Status: status, messages: msg, chats: chatModule })
    }

    // addMessage(chatId) {
    //     let d = new Date();
    //     var n = d.getSeconds();
    //     let demoMsg = this.state.messages;
    //     demoMsg.push({ isRight: true, name: this.state.Chat_Box_Username2, message: this.state.curMessage, time: "00:" + n });
        
    // }

    onTweetFileChange = event => { 
     
        // Update the state 
        // this.setState({ selectedFile: event.target.files[0] }); 
        event.preventDefault();       
        const data = new FormData()
        data.append('file', event.target.files[0])
        console.log('File Data')
        console.log(data)
        
        instance.post("http://localhost:4000/twitter/media/upload", data, { // receive two parameter endpoint url ,form data 
        })
        .then(res => { // then print response status
            console.log(res.data.filename)
            this.setState({selectTweetFileName : res.data.filename})          
            console.log(res.statusText)
        })
        .catch(error => {
            console.log(error)
            // e.target.reset();
            // console.log(error.response.data.error)
        }); 
       
    }; 

    onFileChange = event => { 
     
        // Update the state 
        this.setState({ selectedFile: event.target.files[0] }); 
        event.preventDefault();       
        const data = new FormData()
        data.append('file', event.target.files[0])
        console.log('File Data')
        console.log(data)
        
        instance.post("http://localhost:4000/twitter/media/upload", data, { // receive two parameter endpoint url ,form data 
        })
        .then(res => { // then print response status
            console.log(res.data.filename)
            this.setState({selectFileName : res.data.filename})          
            console.log(res.statusText)
        })
        .catch(error => {
            console.log(error)
            // e.target.reset();
            // console.log(error.response.data.error)
        }); 
       
    }; 

    sendTweet(){
        var modal_standard = this.state.modal_standard
        var in_reply_to_status_id = this.state.in_reply_to_status_id
        // alert(in_reply_to_status_id)
        var tweetMediaName = ''
        if(this.state.selectTweetFileName != '') {
            tweetMediaName = this.state.selectTweetFileName
        }
        var payload
        if(in_reply_to_status_id != '') {
            payload = {
                text : this.state.tweetMessage,
                in_reply_to_status_id : in_reply_to_status_id,
                tweetMediaName : tweetMediaName,
                twitter_access_token : this.state.commonTwitterPayload.twitter_access_token,
                twitter_access_token_secret : this.state.commonTwitterPayload.twitter_access_token_secret,
                twitter_consumer_key : this.state.commonTwitterPayload.twitter_consumer_key,
                twitter_consumer_secret : this.state.commonTwitterPayload.twitter_consumer_secret
            }
        } else {
            payload = {
                text : this.state.tweetMessage,
                tweetMediaName : tweetMediaName,
                twitter_access_token : this.state.commonTwitterPayload.twitter_access_token,
                twitter_access_token_secret : this.state.commonTwitterPayload.twitter_access_token_secret,
                twitter_consumer_key : this.state.commonTwitterPayload.twitter_consumer_key,
                twitter_consumer_secret : this.state.commonTwitterPayload.twitter_consumer_secret
                
            }
        }

        console.log(payload)
        
        instance.post("http://localhost:4000/twitter/tweet/new", payload, { // receive two parameter endpoint url ,form data 
        })
        .then(res => { 
            if(modal_standard == true) {
                this.setState({modal_standard : false})
            }
            this.setState({tweetMessage : ''})    
        })
        .catch(error => {
            console.log(error)
        }); 
    }

    sendReTweet(){
        var modal_standard = this.state.modal_standard
        var reTweetMessage = this.state.reTweetMessage
        // var in_reply_to_status_id = this.state.in_reply_to_status_id
        // alert(in_reply_to_status_id)
        var tweetMediaName = ''
        if(this.state.selectTweetFileName != '') {
            tweetMediaName = this.state.selectTweetFileName
        }        
        
        var payload = {
            text : this.state.reTweetMessage,
            tweetMediaName : tweetMediaName,
            tweetId : this.state.reTweetId,
            twitter_access_token : this.state.commonTwitterPayload.twitter_access_token,
            twitter_access_token_secret : this.state.commonTwitterPayload.twitter_access_token_secret,
            twitter_consumer_key : this.state.commonTwitterPayload.twitter_consumer_key,
            twitter_consumer_secret : this.state.commonTwitterPayload.twitter_consumer_secret                
        }

        console.log(payload)
        
        instance.post("http://localhost:4000/twitter/retweet", payload, { // receive two parameter endpoint url ,form data 
        })
        .then(res => { 
            if(modal_standard == true) {
                this.setState({modal_standard : false})
            }
            this.setState({reTweetMessage : '', reTweet : ''})    
        })
        .catch(error => {
            console.log(error)
        }); 
    }

    likeTweet(tweet) {
        var payload = {
            tweetId : tweet.id_str,
            twitter_access_token : this.state.commonTwitterPayload.twitter_access_token,
            twitter_access_token_secret : this.state.commonTwitterPayload.twitter_access_token_secret,
            twitter_consumer_key : this.state.commonTwitterPayload.twitter_consumer_key,
            twitter_consumer_secret : this.state.commonTwitterPayload.twitter_consumer_secret
        }
        instance.post("http://localhost:4000/twitter/tweet/like", payload, { // receive two parameter endpoint url ,form data 
        })
        .then(res => { 
            
        })
        .catch(error => {
            console.log(error)
        }); 
    }
    
    unlikeTweet(tweet) {
        var payload = {
            tweetId : tweet.id_str,
            twitter_access_token : this.state.commonTwitterPayload.twitter_access_token,
            twitter_access_token_secret : this.state.commonTwitterPayload.twitter_access_token_secret,
            twitter_consumer_key : this.state.commonTwitterPayload.twitter_consumer_key,
            twitter_consumer_secret : this.state.commonTwitterPayload.twitter_consumer_secret
        }
        instance.post("http://localhost:4000/twitter/tweet/unlike", payload, { // receive two parameter endpoint url ,form data 
        })
        .then(res => { 
            
        })
        .catch(error => {
            console.log(error)
        }); 
    }

    sendMessage(chatId) {
        console.log("Yrdy")
        let d = new Date();
        var n = d.getSeconds();
        // let demoMsg = this.state.messages;
        // demoMsg.push({ isRight: true, name: this.state.Chat_Box_Username2, message: this.state.curMessage, time: "00:" + n });
        // this.setState({ messages: demoMsg, curMessage: "" });
        // console.log(this.state.curMessage)
        console.log(this.state.selectFileName)
        var messagePayload = {
            recipient_id : chatId,
            message : this.state.curMessage,
            filename : this.state.selectFileName,
            twitter_access_token : this.state.commonTwitterPayload.twitter_access_token,
            twitter_access_token_secret : this.state.commonTwitterPayload.twitter_access_token_secret,
            twitter_consumer_key : this.state.commonTwitterPayload.twitter_consumer_key,
            twitter_consumer_secret : this.state.commonTwitterPayload.twitter_consumer_secret
        }

        console.log('PAYLOAD')
        instance.post('http://localhost:4000/twitter/direct_message', messagePayload)
        .then(res => {
            console.log("DIRECT MESSAGE RE")
            // console.log()
            console.log(res.data)
            var messageResponse = res.data
            if(messageResponse.status == 200) {
                let appendMsg = this.state.messages;
                var msgText = messageResponse.data.message_create.message_data.text
                var mediaURL = ''
                if(messageResponse.data.message_create.message_data.attachment) {
                    if(messageResponse.data.message_create.message_data.attachment.type == 'media') {
                         mediaURL = messageResponse.data.message_create.message_data.attachment.media.media_url_https
                    }
                }
                console.log('APPEND')
                console.log(appendMsg)
                appendMsg.push({id : messageResponse.data.id, isRight: true, name: this.state.ownerName, message: msgText, withChatUser: chatId, time: "00:07", mediaURL:mediaURL });
                this.setState({ messages: appendMsg, curMessage : "" });
                document.getElementById('media_upload').value = null;


            }
            
        })
        .catch(error => {
            console.log(error)
            // e.target.reset();
            // console.log(error.response.data.error)
            //Chats
            // instance.get('http://localhost:4000/twitter/chats')
            // .then(response1 => {
            //     console.log('CHATS')
            //     // console.log(response1.data)
            //     var chatData = response1.data
            //     var chatArray = []
            //     chatData.forEach(function(cd) {
            //         instance.get('http://localhost:4000/twitter/lookup/'+cd.id)
            //         .then(response2 => {
            //             console.log('USERS')
            //             console.log(response2.data)
            //             cd.name = response2.data.name
            //             cd.screen_name = response2.data.screen_name
            //             cd.profile_image_url_https = response2.data.profile_image_url_https
            //             cd.description = response2.data.description
                        
            //             // this.setState({chats : cd})
            //             instance.get('http://localhost:4000/twitter/lookup/'+cd.ownerId)
            //             .then(response3 => {
            //                 console.log('USERS')
            //                 console.log(response3.data)
            //                 cd.ownerName = response3.data.name
            //                 chatArray.push(cd)
            //                 // this.setState({chats : cd})
                            
            //             })
            //             .catch(function (error){
            //                 console.log(error);
            //             })
                        
            //         })
            //         .catch(function (error){
            //             console.log(error);
            //         }) 

                    
            //     })
            //     console.log('CHATARRAY---')
            //     console.log(chatArray)
            //     this.setState({userChats : chatArray})
                
            // })
            // .catch(function (error){
            //     console.log(error);
            // })
        }); 
    }

    tog_standard(tweet) {
        console.log(tweet)
        // alert(this.state.modal_standard)
        this.setState({modal_standard : true, replyTweet : tweet, in_reply_to_status_id : tweet.id_str})
        this.removeBodyCss();

    }

    reTweet(tweet) {
        console.log(tweet)
        // alert(this.state.modal_standard)
        this.setState({modal_standard : true, reTweet : tweet, reTweetId : tweet.id_str})
        this.removeBodyCss();

    }
    removeBodyCss() {
        document.body.classList.add("no_padding");
      }
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumb */}
                        <Breadcrumbs title="Skote" breadcrumbItem="Chat" />

                        <Row>
                            <Col lg="12">
                                <div className="d-lg-flex">
                                    <div className="chat-leftsidebar mr-lg-4">
                                        <div className="">
                                            <div className="py-4 border-bottom">
                                                <Media>
                                                    <div className="align-self-center mr-3">
                                                        <img src={this.state.userObj.profile_image ? this.state.userObj.profile_image : avatar1} className="avatar-xs rounded-circle" alt="" />
                                                    </div>
                                                    <Media body>
                                                        <h5 className="font-size-15 mt-0 mb-1">{this.state.userObj.username}</h5>
                                                        <p className="text-muted mb-0"><i className="mdi mdi-circle text-success align-middle mr-1"></i> Active</p>
                                                    </Media>

                                                    <div>
                                                        <Dropdown isOpen={this.state.notification_Menu} toggle={this.toggleNotification} className="chat-noti-dropdown active">
                                                            <DropdownToggle className="btn" tag="i">
                                                                <i className="bx bx-bell bx-tada"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu right>
                                                                <DropdownItem href="#">Action</DropdownItem>
                                                                <DropdownItem href="#">Another action</DropdownItem>
                                                                <DropdownItem href="#">Something else here</DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                </Media>
                                            </div>

                                            <div className="search-box chat-search-box py-4">
                                                <div className="position-relative">
                                                    <Input type="text" className="form-control" placeholder="Search..." />
                                                    <i className="bx bx-search-alt search-icon"></i>
                                                </div>
                                            </div>

                                            <div className="chat-leftsidebar-nav">
                                                <Nav pills justified>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '1' })}
                                                            onClick={() => { this.toggleTab('1'); }}
                                                        >
                                                            <i className="bx bx-chat font-size-20 d-sm-none"></i>
                                                            <span className="d-none d-sm-block">Chat<span className='badge badge-pill badge-success float-right'>{this.state.chatCount > 0 ? this.state.chatCount : ''}</span></span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '2' })}
                                                            onClick={() => { this.toggleTab('2'); }}
                                                        >
                                                            <i className="bx bx-group font-size-20 d-sm-none"></i>
                                                            <span className="d-none d-sm-block">Tweets<span className='badge badge-pill badge-success float-right'>{this.state.tweetCount > 0 ? this.state.tweetCount : ''}</span></span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink
                                                            className={classnames({ active: this.state.activeTab === '3' })}
                                                            onClick={() => { this.toggleTab('3'); }}
                                                        >
                                                            <i className="bx bx-book-content font-size-20 d-sm-none"></i>
                                                            <span className="d-none d-sm-block">Followers<span className='badge badge-pill badge-success float-right'>{this.state.followCount > 0 ? this.state.followCount : ''}</span></span>
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                                <TabContent activeTab={this.state.activeTab} className="py-4">
                                                    <TabPane tabId="1">
                                                        <div>
                                                            <h5 className="font-size-14 mb-3">Recent</h5>
                                                            <ul className="list-unstyled chat-list">
                                                                <PerfectScrollbar style={{ height: "410px" }}>
                                                                    {
                                                                        this.state.userChats.map((chat) =>
                                                                            <li key={chat.id} className={chat.isActive ? "active" : ""}>
                                                                                <Link to="#" onClick={() => { this.UserChatOpen(chat) }}>
                                                                                    <Media>
                                                                                        <div className="align-self-center mr-3">
                                                                                            <i className={chat.status === "online"
                                                                                                ? "mdi mdi-circle text-success font-size-10"
                                                                                                : chat.status === "intermediate" ? "mdi mdi-circle text-warning font-size-10" : "mdi mdi-circle font-size-10"
                                                                                            }></i>
                                                                                        </div>
                                                                                        <div className="align-self-center mr-3">
                                                                                            <img src={chat.profile_image_url_https} className="rounded-circle avatar-xs" alt="" />
                                                                                        </div>

                                                                                        <Media className="overflow-hidden" body>
                                                                                            <h5 className="text-truncate font-size-14 mb-1">{chat.name}</h5>
                                                                                            <p className="text-truncate mb-0">{chat.description}</p>
                                                                                        </Media>
                                                                                        <div className="font-size-11">{chat.time}</div>
                                                                                    </Media>
                                                                                </Link>
                                                                            </li>
                                                                        )
                                                                    }
                                                                </PerfectScrollbar>
                                                            </ul>
                                                        </div>
                                                    </TabPane>

                                                    <TabPane tabId="2">
                                                        <h5 className="font-size-14 mb-3">Tweets</h5>
                                                        <ul className="list-unstyled chat-list">
                                                            {/* <PerfectScrollbar style={{ height: "410px" }}> */}
                                                                {/* {
                                                                    this.state.tweets.map((tweet) =>
                                                                        <li key={"test" + tweet.id}>
                                                                            <Link to="#" onClick={() => { this.UserTweetOpen(tweet) }} >
                                                                                <Media className="align-items-center">
                                                                                   

                                                                                    <Media body>
                                                                                        <h5 className="font-size-14 mb-0">{tweet.text}</h5>
                                                                                    </Media>
                                                                                </Media>
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                } */}
                                                            {/* </PerfectScrollbar> */}
                                                        </ul>
                                                    </TabPane>

                                                    <TabPane tabId="3">
                                                        <h5 className="font-size-14 mb-3">Followers</h5>
                                                        <ul className="list-unstyled chat-list">
                                                            <PerfectScrollbar style={{ height: "410px" }}>
                                                                {
                                                                    this.state.followers.map((follow) =>
                                                                        <li key={"test" + follow.id}>
                                                                            <Link to="#" >
                                                                                <Media className="align-items-center">
                                                                                    
                                                                                    <div className="align-self-center mr-3">
                                                                                        <img src={follow.profile_image_url_https} className="rounded-circle avatar-xs" alt="" />
                                                                                    </div>

                                                                                    <Media body>
                                                                                        <h5 className="font-size-14 mb-0">{follow.name}</h5>
                                                                                    </Media>
                                                                                </Media>
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                }
                                                            </PerfectScrollbar>
                                                        </ul>

                                                    </TabPane>
                                                </TabContent>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-100 user-chat">
                                        <Card>
                                            <div className="p-4 border-bottom ">
                                                <Row>
                                                    <Col md="4" xs="9">
                                                        <h5 className="font-size-15 mb-1">{this.state.showMessageContent ? this.state.Chat_Box_Username : this.state.tweetData.text}</h5>
                                                        
                                                        {!this.state.showMessageContent &&
                                                        <p></p>
                                                        }
                                                        {this.state.showMessageContent &&
                                                        <p className="text-muted mb-0">
                                                            <i className={this.state.Chat_Box_User_Status === "online"
                                                                ? "mdi mdi-circle text-success align-middle mr-1"
                                                                : this.state.Chat_Box_User_Status === "intermediate" ? "mdi mdi-circle text-warning align-middle mr-1" : "mdi mdi-circle align-middle mr-1"
                                                            }></i>
                                                        {this.state.Chat_Box_User_Status}</p>
                                                        }
                                                    </Col>
                                                    <Col md="8" xs="3">
                                                        <ul className="list-inline user-chat-nav text-right mb-0">
                                                            <li className="list-inline-item d-none d-sm-inline-block">
                                                                <Dropdown isOpen={this.state.search_Menu} toggle={this.toggleSearch}>
                                                                    <DropdownToggle className="btn nav-btn" tag="i">
                                                                        <i className="bx bx-search-alt-2"></i>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu className="dropdown-menu-md" right>
                                                                        <Form className="p-3">
                                                                            <FormGroup className="m-0">
                                                                                <InputGroup>
                                                                                    <Input type="text" className="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                                                                                    <InputGroupAddon addonType="append">
                                                                                        <Button color="primary" type="submit"><i className="mdi mdi-magnify"></i></Button>
                                                                                    </InputGroupAddon>
                                                                                </InputGroup>
                                                                            </FormGroup>
                                                                        </Form>
                                                                    </DropdownMenu>
                                                                </Dropdown>
                                                            </li>
                                                            <li className="list-inline-item  d-none d-sm-inline-block">
                                                                <Dropdown isOpen={this.state.settings_Menu} toggle={this.toggleSettings}>
                                                                    <DropdownToggle className="btn nav-btn" tag="i">
                                                                        <i className="bx bx-cog"></i>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu right>
                                                                        <DropdownItem href="#">View Profile</DropdownItem>
                                                                        <DropdownItem href="#">Clear chat</DropdownItem>
                                                                        <DropdownItem href="#">Muted</DropdownItem>
                                                                        <DropdownItem href="#">Delete</DropdownItem>
                                                                    </DropdownMenu>
                                                                </Dropdown>
                                                            </li>
                                                            <li className="list-inline-item">
                                                                <Dropdown isOpen={this.state.other_Menu} toggle={this.toggleOther}>
                                                                    <DropdownToggle className="btn nav-btn" tag="i">
                                                                        <i className="bx bx-dots-horizontal-rounded"></i>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu right>
                                                                        <DropdownItem href="#">Action</DropdownItem>
                                                                        <DropdownItem href="#">Another Action</DropdownItem>
                                                                        <DropdownItem href="#">Something else</DropdownItem>
                                                                    </DropdownMenu>
                                                                </Dropdown>
                                                            </li>

                                                        </ul>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div>
                                                <div className="chat-conversation">
                                                    <ul className="list-unstyled">
                                                        <PerfectScrollbar style={{ height: "470px" }}>
                                                            {this.state.showMessageContent &&
                                                            <li>
                                                                <div className="chat-day-title">
                                                                    <span className="title">Today</span>
                                                                </div>
                                                            </li>
                                                            }
                                                            {this.state.showMessageContent &&
                                                                this.state.messages.map((message) =>
                                                                    <li key={"test_k" + message.id} className={message.isRight ? "right" : ""}>
                                                                        <div className="conversation-list">
                                                                            <UncontrolledDropdown>
                                                                                <DropdownToggle href="#" className="btn nav-btn" tag="i">
                                                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                                                </DropdownToggle>
                                                                                <DropdownMenu direction="right">
                                                                                    <DropdownItem href="#">Copy</DropdownItem>
                                                                                    <DropdownItem href="#">Save</DropdownItem>
                                                                                    <DropdownItem href="#">Forward</DropdownItem>
                                                                                    <DropdownItem href="#">Delete</DropdownItem>
                                                                                </DropdownMenu>
                                                                            </UncontrolledDropdown>
                                                                            <div className="ctext-wrap">
                                                                                <div className="conversation-name">{message.name}</div>
                                                                                <p>
                                                                                    {message.message}<br></br>
                                                                                   
                                                                                    <img src={message.mediaURL} className="avatar-lg" alt="" />
                                                                                    
                                                                                </p>
                                                                                <p className="chat-time mb-0"><i className="bx bx-time-five align-middle mr-1"></i> {message.time}</p>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                )
                                                            }
                                                            {/* {
                                                                this.state.tweetMediaDetails.map((media) =>
                                                                    <li key={"test_key" + media.id} className="right">
                                                                        <div className="conversation-list">                                                                           
                                                                            <div>                                                                                
                                                                                <p>
                                                                                <img src={media.media_url_https} className="avatar-lg" alt="" />

                                                                                </p>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                )
                                                            } */}
                                                            {!this.state.showMessageContent &&
                                                                this.state.tweets.map((tweet) =>
                                                                    <li key={"tweet" + tweet.id} className="media-list">
                                                                                                                                                   
                                                                        <Media className="">
                                                                            <div className="d-flex p-2">
                                                                                <div className=" mr-3 media-img">
                                                                                    <img src={tweet.user.profile_image_url_https} className="rounded-circle avatar-xs" alt="" />
                                                                                </div>

                                                                                <Media body>
                                                                                    <div className="d-flex align-items-center">
                                                                                        <h5 className="font-size-14 mb-0 mr-1 ">{tweet.user.name}{' @'+tweet.user.screen_name}</h5>{' . '}
                                                                                        <div>{' '+moment(tweet.created_at).format('ll')}</div>
                                                                                    </div>

                                                                                    <div className="d-flex mb-2">{tweet.text}</div>
                                                                                    {tweet.entities.media &&
                                                                                    tweet.entities.media.map((tmedia) => 
                                                                                   
                                                                                    <div  key={"tweet_media" + tmedia.id} className="mb-2 d-flex"> 
                                                                                        <img src={tmedia.media_url_https} className="avatar-lg" alt="" /> 
                                                                                    </div>
                                                                                   
                                                                                    )}
                                                                                    <div className="d-flex justify-content-between align-items-center icons-wrap">
                                                                                    
                                                                                    
                                                                                    <i className='bx bx-message-rounded' onClick={(e) => this.tog_standard(tweet)}
                                                                                        data-toggle="modal"
                                                                                        data-target="#myModal"></i>{' '}
                                                                                        <i className='bx bx-repost'  onClick={(e) => this.reTweet(tweet)}
                                                                                        data-toggle="modal"
                                                                                        data-target="#myRetweetModal">{tweet.retweet_count > 0 ? tweet.retweet_count : ''}</i>{' '}
                                                                                        {tweet.favorite_count <= 0 &&
                                                                                        <i className='bx bx-heart'  onClick={(e) => this.likeTweet(tweet)}></i>
                                                                                        }
                                                                                        {tweet.favorite_count > 0 &&
                                                                                        <i className='bx bxs-heart' onClick={(e) => this.unlikeTweet(tweet)}>{tweet.favorite_count}</i>
                                                                                        }
                                                                                    </div>
                                                                                </Media>
                                                                            </div>
                                                                        </Media>

                                                                        
                                                                    </li>
                                                                )
                                                            }
                                                        </PerfectScrollbar>
                                                    </ul>
                                                    {this.state.activeTab == '2' &&
                                                    <div className="p-3 chat-input-section">
                                                        <Row>
                                                            <Col>
                                                                <div className="position-relative">
                                                                    <input type="text" value={this.state.tweetMessage} onChange={(e) => { this.setState({ tweetMessage: e.target.value }) }} className="form-control chat-input" placeholder="Enter Message..." />
                                                                    <div className="chat-input-links">
                                                                        <ul className="list-inline mb-0">
                                                                            <li className="list-inline-item">
                                                                                <Link to="#">
                                                                                    <i className="mdi mdi-emoticon-happy-outline" id="Emojitooltip"></i>
                                                                                    <UncontrolledTooltip placement="top" target="Emojitooltip">
                                                                                        Emojis
                                                                                    </UncontrolledTooltip >
                                                                                </Link>
                                                                            </li>
                                                                            <li className="list-inline-item">
                                                                                
                                                                                    <i className="mdi mdi-file-image-outline" id="Imagetooltip" ><input type="file" id="media_upload" onChange={this.onTweetFileChange}/></i>
                                                                                    <UncontrolledTooltip placement="top" target="Imagetooltip">
                                                                                        Images
                                                                                    </UncontrolledTooltip >
                                                                                
                                                                            </li>
                                                                            <li className="list-inline-item">
                                                                                <Link to="#">
                                                                                    <i className="mdi mdi-file-document-outline" id="Filetooltip"></i>
                                                                                    <UncontrolledTooltip placement="top" target="Filetooltip">
                                                                                        Add Files
                                                                                    </UncontrolledTooltip >
                                                                                </Link>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col className="col-auto">
                                                                <Button type="button" color="primary" onClick={(e) => this.sendTweet()} className="btn-rounded chat-send w-md waves-effect waves-light"><span className="d-none d-sm-inline-block mr-2">Tweet</span> <i className="mdi mdi-send"></i></Button>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    }
                                                </div>
                                                {this.state.showMessageContent && 
                                                <div className="p-3 chat-input-section">
                                                    <Row>
                                                        <Col>
                                                            <div className="position-relative">
                                                                <input type="text" value={this.state.curMessage} onChange={(e) => { this.setState({ curMessage: e.target.value }) }} className="form-control chat-input" placeholder="Enter Message..." />
                                                                <div className="chat-input-links">
                                                                    <ul className="list-inline mb-0">
                                                                        <li className="list-inline-item">
                                                                            <Link to="#">
                                                                                <i className="mdi mdi-emoticon-happy-outline" id="Emojitooltip"></i>
                                                                                <UncontrolledTooltip placement="top" target="Emojitooltip">
                                                                                    Emojis
                                                                                </UncontrolledTooltip >
                                                                            </Link>
                                                                        </li>
                                                                        <li className="list-inline-item">
                                                                            
                                                                                <i className="mdi mdi-file-image-outline" id="Imagetooltip"><input type="file" id="media_upload" onChange={this.onFileChange}/></i>
                                                                                <UncontrolledTooltip placement="top" target="Imagetooltip">
                                                                                    Images
                                                                                </UncontrolledTooltip >
                                                                            
                                                                        </li>
                                                                        <li className="list-inline-item">
                                                                            <Link to="#">
                                                                                <i className="mdi mdi-file-document-outline" id="Filetooltip"></i>
                                                                                <UncontrolledTooltip placement="top" target="Filetooltip">
                                                                                    Add Files
                                                                                </UncontrolledTooltip >
                                                                            </Link>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col className="col-auto">
                                                            <Button type="button" color="primary" onClick={(e) => this.sendMessage(this.state.currentChatId)} className="btn-rounded chat-send w-md waves-effect waves-light"><span className="d-none d-sm-inline-block mr-2">Send</span> <i className="mdi mdi-send"></i></Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                }
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                {/* Modal */}
                <Modal
                    isOpen={this.state.modal_standard}
                    toggle={this.tog_standard}
                    >
                    <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myModalLabel">
                        
                    </h5>
                        <button
                        type="button"
                        onClick={() =>
                            this.setState({ modal_standard: false, replyTweet : '' })
                        }
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        >
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                    {this.state.replyTweet != '' && 
                    <li key={"r_tweet" + this.state.replyTweet.id} className="media-list">
                                                                                                
                        <Media className="">
                            <div className="d-flex p-2">
                                <div className=" mr-3 media-img">
                                    <img src={this.state.replyTweet.user.profile_image_url_https} className="rounded-circle avatar-xs" alt="" />
                                </div>

                                <Media body>
                                    <div className="d-flex align-items-center">
                                        <h5 className="font-size-14 mb-0 mr-1 ">{this.state.replyTweet.user.name}{' @'+this.state.replyTweet.user.screen_name}</h5>{' . '}
                                        <div>{' '+moment(this.state.replyTweet.created_at).format('ll')}</div>
                                    </div>

                                    <div className="d-flex mb-2">{this.state.replyTweet.text}</div>
                                    {this.state.replyTweet.entities.media &&
                                    this.state.replyTweet.entities.media.map((tmedia) => 
                                    
                                    <div  key={"rtweet_media" + tmedia.id} className="mb-2 d-flex"> 
                                        <img src={tmedia.media_url_https} className="avatar-lg" alt="" /> 
                                    </div>
                                    
                                    )}
                                    <div className="d-flex justify-content-between align-items-center icons-wrap">
                                    {/* <button
                                        type="button"
                                        onClick={this.tog_standard}
                                        className="btn btn-primary waves-effect waves-light"
                                        data-toggle="modal"
                                        data-target="#myModal"
                                    >
                                        Standard Modal
                                    </button>
                                    
                                    <i className='bx bx-message-rounded'></i>{' '}
                                        <i className='bx bx-repost'></i>{' '}
                                        <i className='bx bx-heart'></i> */}
                                        
                                    </div>
                                </Media>
                            </div>
                        </Media>                        
                    </li>
                    }
                    {this.state.replyTweet != '' && 
                    <li key={"rt_tweet" + this.state.replyTweet.id} className="media-list">
                                                                                                    
                        <Media className="">
                            <div className="d-flex p-2">
                                <div className=" mr-3 media-img">
                                    <img src={this.state.replyTweet.user.profile_image_url_https} className="rounded-circle avatar-xs" alt="" />
                                </div>

                                <Media body>
                                    <input type="textarea" value={this.state.tweetMessage} onChange={(e) => { this.setState({ tweetMessage: e.target.value }) }} className="form-control chat-input" placeholder="Enter Message..." />
                                   
                                </Media>
                            </div>
                        </Media>                        
                    </li>
                    }

                    {this.state.reTweet != '' && this.state.replyTweet == '' &&
                    <li key={"r_tweet" + this.state.reTweet.id} className="media-list">
                                                                                                
                        <Media className="">
                            <div className="d-flex p-2">

                                <Media body>
                                    <div className=" mr-3 media-img">
                                        <img src={this.state.reTweet.user.profile_image_url_https} className="rounded-circle avatar-xs" alt="" />
                                        <input type="text" value={this.state.reTweetMessage} onChange={(e) => { this.setState({ reTweetMessage: e.target.value }) }} className="form-control chat-input" placeholder="Add a comment.." />

                                    </div>
                                    <div className="d-flex align-items-center">

                                        <h5 className="font-size-14 mb-0 mr-1 ">{this.state.reTweet.user.name}{' @'+this.state.reTweet.user.screen_name}</h5>{' . '}
                                        <div>{' '+moment(this.state.reTweet.created_at).format('ll')}</div>
                                    </div>

                                    <div className="d-flex mb-2">{this.state.reTweet.text}</div>
                                    {this.state.reTweet.entities.media &&
                                    this.state.reTweet.entities.media.map((tmedia) => 
                                    
                                    <div  key={"rtweet_media" + tmedia.id} className="mb-2 d-flex"> 
                                        <img src={tmedia.media_url_https} className="avatar-lg" alt="" /> 
                                    </div>
                                    
                                    )}
                                    <div className="d-flex justify-content-between align-items-center icons-wrap">
                                    {/* <button
                                        type="button"
                                        onClick={this.tog_standard}
                                        className="btn btn-primary waves-effect waves-light"
                                        data-toggle="modal"
                                        data-target="#myModal"
                                    >
                                        Standard Modal
                                    </button>
                                    
                                    <i className='bx bx-message-rounded'></i>{' '}
                                        <i className='bx bx-repost'></i>{' '}
                                        <i className='bx bx-heart'></i> */}
                                        
                                    </div>
                                </Media>
                            </div>
                        </Media>                        
                    </li>
                    }
                    </div>
                    {this.state.replyTweet != '' && 
                    <div className="modal-footer">                        
                    <Col className="col-auto">
                        <Button type="button" color="primary" onClick={(e) => this.sendTweet()} className="btn-rounded chat-send w-md waves-effect waves-light"><span className="d-none d-sm-inline-block mr-2">Tweet</span> <i className="mdi mdi-send"></i></Button>
                    </Col>
                    </div>
                    }
                    {this.state.reTweet != '' && this.state.replyTweet == '' &&
                    <div className="modal-footer">                        
                    <Col className="col-auto">
                        <Button type="button" color="primary" onClick={(e) => this.sendReTweet()} className="btn-rounded chat-send w-md waves-effect waves-light"><span className="d-none d-sm-inline-block mr-2">Retweet</span> <i className="mdi mdi-send"></i></Button>
                    </Col>
                    </div>
                    }
                    </Modal>
            </React.Fragment>
        );
    }
}

export default Chat;