import './MainPage.css';

import axios from 'axios';
import { useState } from 'react';


function MainPage()
{
    const [link, setLink] = useState(null);

    async function handle_form(event)
    {
        event.preventDefault();
        const long_url = event.target.long_url.value;

        axios.post('http://shorting_url_service:3002/api/shorten', {
            long_url: long_url
        }).then((resp) => {

            console.log(resp);
            setLink(window.location.origin + '/get/' + resp.data['short_url']);

        }).catch((error) => {
            console.log(error);
            alert(error);
        });

    }

    return(
        <div className="center-container">

            <h1>ShortLi</h1>

            <h2>Shorten a long link</h2>

            <form onSubmit={handle_form} className="shorten-form">
                <h3>Paste your link here</h3>
                <input className="inputForm" type="text" name="long_url" />
                <button className="submitButton" type="submit"> Get your link </button>
            
                {
                    link && 
                    <>
                        <h3>Your link is {link} </h3>
                    </>
                }

            </form>


        </div>
    )

}

export default MainPage;