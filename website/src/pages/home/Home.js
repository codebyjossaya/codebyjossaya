import React from 'react';
import ScrollAnimation from '../../components/scrollanimation/ScrollAnimation';
import './Home.css';
import my_face from '../../assets/143653842.jpg'
import Grid from '../../components/grid/Grid';
import Button, {link} from '../../components/button/Button';
import GridItem from '../../components/grid/GridItem';
import { RenderOtherElement } from '../../App';
import About from '../about/About';
//import Footer from '../../components/footer/Footer';

//import {useSpring,animated} from '@react-spring/web'
function Home() {
    return (
    <>
        <ScrollAnimation>
        <div className='banner' style={{display:"grid", gridTemplateColumns:"50% 50%"}}>
                    <div>
                    <h1>Jossaya Camille</h1>
                    <p>A high school student and aspiring computer engineer with a lot of free time.</p>
                    </div>
                    <img style={{borderRadius: "50%", width: "40%", marginLeft:"50%"}}src={my_face} alt="my face" />
                    
        </div>  
        </ScrollAnimation>
            <div style={{color: 'white', margin: "100px",padding:"20px"}}>
                <h1>About Me</h1>
                <p>I'm a high school student planning to pursue a career in computer science & engineering.</p>
                <p>I have previous research experience with AI, computer vision, and web development.</p>
                <p>I'm currently looking to expand my skills into low-level programming, UI design, cybersecurity, computer design, and further AI work.</p>

                <Button label={"Learn more"} onClick={() => {
                    RenderOtherElement({children: <About />})
                }} />
            </div>
            <div style={{color: 'white', margin: "100px",paddingLeft:"20px",paddingRight:"20px",marginBottom:"5px"}}>
            <h1>Projects</h1>
            <p>Here are some of the projects I've worked on:</p>
            </div>
            
            <div className='banner' style={{marginTop:"0px"}}>
                <Grid>
                    <GridItem 
                        title="WebWrite"
                        description="A text-to-HTML converter that will allow users to embed their writing in formats suitable for the web."
                        buttonLabel={"GitHub"}
                        buttonLink="https://github.com/jcamille2023/webwrite"
                    />

                    <GridItem 
                        title="Arc"
                        description="Arc is a online chat app using Firebase services and pure JavaScript to deliver a social experience for users."
                        buttonLabel={"GitHub"}
                        buttonLink={'https://github.com/chat-on-arc/chat-on-arc.github.io'}

                    >
                        <Button label={"Try Arc"} onClick={link('https://chat-on-arc.github.io')} />
                    </GridItem>
                    <GridItem 
                        title="ALSET Solar Cybersedan Software"
                        description={"Myself and a team of 3 others built a comprehensive software ecosystem for the SolarCybersedan as part of the FAU High School Advanced Experimental Vehicles club. Learn more on the GitHub page."}
                        buttonLabel={"GitHub"}
                        buttonLink={'https://github.com/YamanDevelopment/AEV-Software'}
                    />
                </Grid>
                <br></br>
                <Button label={"View more on the Projects page"} onClick={link('./projects')} />
            </div>
      
        
    </>
    );

}

export default Home;