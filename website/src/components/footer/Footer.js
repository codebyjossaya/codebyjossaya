import React from "react";
import Grid from "../grid/Grid";
import './Footer.css'
function Footer() {
    return (
        <div className="footer">
            <p><strong>Jossaya Camille</strong></p>
            <p>Website made using React.</p>
            <Grid>
                <a href="https://github.com/jcamille2023"><img src="https://i.pinimg.com/originals/48/e0/73/48e07378e01dd719c060c1f2f2b5cb00.png" alt="GitHub" style={{ width: "30px", height: "30px" }} /></a>
                <a href="https://twitter.com/jcamille2023"><img src="https://i.pinimg.com/736x/c1/4e/a3/c14ea380b013465cb3819d9389b0e3a8.jpg" alt="Twitter" style={{ width: "30px", height: "30px" }} /></a>
                <a href="https://linkedin.com/in/jossayacamille"><img src="https://image.similarpng.com/very-thumbnail/2020/07/Linkedin-logo-on-transparent-PNG-.png" alt="LinkedIn" style={{ width: "30px", height: "30px" }} /></a>
                <a href="https://instagram.com/jcamille3"><img src="https://i.pinimg.com/originals/24/37/73/2437730f7e3a5705e205e67fa2cd1020.jpg" alt="Instagram" style={{ width: "30px", height: "30px" }} /></a>
            </Grid>
        </div>
    )
}

export default Footer;