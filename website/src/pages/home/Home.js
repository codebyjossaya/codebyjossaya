import React from 'react';
import ScrollAnimation from '../../components/scrollanimation/ScrollAnimation';
import './Home.css';
import my_face from '../../assets/143653842.jpg'
import Grid from '../../components/grid/Grid';
import Button, {link} from '../../components/button/Button';
import GridItem from '../../components/grid/GridItem';

//import {useSpring,animated} from '@react-spring/web'
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
                <Button label={"Learn more"} onClick={link('./about')} />
            </div>
        </ScrollAnimation>
        <ScrollAnimation>
            <div className='banner'>
                <h2>Projects</h2>
                <p>Here are some of the projects I've worked on:</p>
                <Grid>
                    <GridItem 
                        title="WebWrite"
                        description="A text-to-HTML converter that will allow users to write text and convert it to HTML code."
                        buttonLabel={"GitHub"}
                        buttonLink="https://github.com/jcamille2023/webwrite"
                    />

                    <GridItem 
                        title="Arc"
                        description="Arc is a online chat app using Firebase services and pure JavaScript to deliver a social experience for users."
                        buttonLabel={"GitHub"}
                        buttonLink={'https://github.com/chat-on-arc/chat-on-arc.github.io'}
                    />
                </Grid>
            </div>
        </ScrollAnimation>
        
    </>
    );

}

export default Home;