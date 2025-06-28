import { useEffect } from 'react';
import {useParams} from 'react-router-dom'
import axios from 'axios';

function GetLinkPage(props)
{
    const {shorturl} = useParams();



    useEffect(() => {

        axios.get(`http://redirect_service:3001/api/geturl?short_url=${shorturl}`).then((resp) => {

            window.location.href = resp.data['url'];

        }).catch((error) => {
            console.log(error);
        });

        return () => {};

    }, []);

    return(
        <h2>Redirecting to another link</h2>
    )

}

export default GetLinkPage;