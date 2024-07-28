import React, { useEffect, useState, useRef } from 'react';
import ScrollAnimation from '../scrollanimation/ScrollAnimation';
import './Home.css';
import my_face from '../assets/143653842.jpg'
function Home() {
    return (
    <>
        <ScrollAnimation>
        <div className='banner'>
                    <img style={{borderRadius: "50%", width: "20%"}}src={my_face} alt="my face" />
                    <h1>Jossaya Camille</h1>
                    <p>A high school student and aspiring software engineer with a lot of free time.</p>
        </div>
        </ScrollAnimation>
        <ScrollAnimation>
            <div className='banner'>
                <h2>About Me</h2>
                <p>I am an FAU High School student seeking to major in either Computer Science or Computer Engineering.</p>
                <p>I'm currently learning C++ as part of the university curriculum and am planning to learn React Native</p>
                <p>I've learned Python, C, JavaScript, TypeScript, and React.</p>
            </div>
        </ScrollAnimation>
        <ScrollAnimation>
            <div className='banner'>
                <h2>Projects</h2>
                <p>Here are some of the projects I've worked on:</p>
                <ul>
                    <li>My personal website</li>
                    <li>Tic Tac Toe Online</li>
                    <li>Arc</li>
                    <li>WebWrite</li>
                    <li>Ping Pong Online</li>
                </ul>
            </div>
        </ScrollAnimation>
        
    </>
    );

}

export default Home;