var mongoose = require("mongoose");
var Event = require("./models/event.js");
var Comment = require("./models/comment.js");

var data =[
    {
        name: "Robo Wars",
        image: "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=1949",
        description: "The competition is carried out in a tournament format. Competitors bring their robots ready to battle and are pitted against their competitors’ robots in one-on-one matches where the aim is to push the opponent’s robot off the arena and scoring maximum points. The robots can be Manual or autonomous.",
        venu: "RGIT",
        date: "11/11/17",
        time: "10:30 AM",
        cost: "50"
    },    
    {
        name: "DJ Night",
        image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1950",
        description: "Whether you’re single, a couple or a group, you’ll find a warm and friendly welcome. Our DJs play a great variety of music from ’80s to date and there are always lots of new people to meet. And once you’re a member, you can claim free entry whenever you introduce a newcomer! So brighten up your social life and come along to one of our party nights very soon. We, our team and our members, are looking forward to meeting you. Don't forget to enjoy the DJ!!",
        venu: "RGIT Ground",
        date: "12/11/17",
        time: "7 PM",
        cost: "0"
    },    
    {
        name: "LAN Gaming",
        image: "https://www.bleedingcool.com/wp-content/uploads/2017/05/Dota2Logo.jpg",
        description: "Love to play games ?? Whether it would be online or on lan join this event and show everyone who is the boss of gaming here. There will be games like DOTA, Counter Strike, Mini Militia, FIFA on console and many more ! You can contact the organizers for more information.",
        venu: "RGIT Computer Hall",
        date: "11/11/17",
        time: "11 AM",
        cost: "25"
    },    
    {
        name: "Zodies",
        image: "https://images.unsplash.com/photo-1498150614243-8fea6f0d39d5?w=1955",
        description: "Zodies is the most awaited event of zodiac. It is a replica of famous TV reality show roadies. If you ever wanted to be a part roadies, then this event is for you. Don't miss the thrill.",
        venu: "RGIT Campus",
        date: "11/11/17",
        time: "12 PM",
        cost: "50"
    }, 
    {
        name: "RGIT Got Talent",
        image: "https://images.unsplash.com/photo-1493849749377-e4f82d0a8319?w=1948",
        description: "Do you feel that you are gifted with a special talent? Comm'on then show it to us and win exciting prizes. ( A participant can sing, write poetry, play guitar or do anything that can entertain people )",
        venu: "RGIT Ground",
        date: "13/11/17",
        time: "11 AM",
        cost: "20"
    }, 
    {
        name: "Treasure Hunt",
        image: "https://images.unsplash.com/photo-1470506926202-05d3fca84c9a?w=1950",
        description: "Our treasure hunts are information-based scavenger hunts, or puzzle hunts, in which teams use their collective brainpower to solve clues. Each team is presented with a group of puzzles, or clues, which teams must solve in order to find a piece of information. Each clue leads to a location within walking distance, where players must find and use a vital piece of information to answer a question. This information could be words from a historical plaque, a series of numbers or an address, a landmark, or any other unique item that many of us walking down the street might merely pass by, unless we were looking for it. Teams travel through the streets of the playing area racing to see who will be first to find all of the information. After solving all the clues teams will return their answer sheets to the designated endpoint. The earliest entry with the most correct answers wins.",
        venu: "RGIT Campus",
        date: "12/11/17",
        time: "10 AM",
        cost: "20"
    }, 
    {
        name: "'Blue Ticks' the show by Mukhavate",
        image: "https://images.unsplash.com/photo-1505823212735-223f81435f4e?w=2022",
        description: "The internet has simplified 'finding love' but complicated 'staying in it'. Relationships have transformed from cozy couples to curious love triangles, boy, girl and the notorious smartphone. Blue Ticks explores this bizarre chemistry between friendship and technology and takes you back to the good old days where communication were intimate and real. Come join one of the most popular plays among youngster, Roll on the floor laughing with the actors in this rib tickling performance that is sure to leave you feeling nostalgic.",
        venu: "RGIT Campus",
        date: "12/11/17",
        time: "3 PM",
        cost: "0"
    },
    {
        name: "The Dance Maniac",
        image: "https://images.unsplash.com/photo-1504647164485-1d91e1d0a112?w=1950",
        description: "You always felt that there's an artist within you, right? Yeaa.. so now it's your time to explore the stage. Here's an opportunity to showcase your dancing talent. Winners would get prize worth Rs 3000. Don't wait, get yourself registered.",
        venu: "RGIT Campus",
        date: "13/11/17",
        time: "6 PM",
        cost: "30"
    }
];

function seedDB(){
    //Remove all events
    Event.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("All data removed");
        //Add events
        data.forEach(function(seed){
            Event.create(seed, function(err, event){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added a event");
                }
            });
        });
    });
}

module.exports = seedDB;