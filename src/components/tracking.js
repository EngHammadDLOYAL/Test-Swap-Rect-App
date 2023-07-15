import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import moment from 'moment'

const Tracking = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [responseStatus, setResponseStatus] = useState('Loading...')

    

    const isTimeExpired = 1691415177 // 1 Month

          
    useEffect(() => {
        const postData = async () => {
            try {
                
                const obj = {};
                    for (let param of queryParams.entries()) {
                    const [key, value] = param;
                    obj[key] = value;
                }            
                if (moment().unix() <= isTimeExpired) {
                    const response = await axios.post('backend-endpoint', obj);
                    setResponseStatus("Transaction Success full")
                } else {
                    setResponseStatus('Time expired, returning without making the request.')
                    console.log('Time expired, returning without making the request.');


                }
            } catch (error) {
                setResponseStatus(`Something went wrong, Api request failed `)
                console.error(error);
            }
        };

        postData();
    }, []);


    return (
        <>
            <div style={{ width: "100vw", height: '100vh', display: "flex", justifyContent: "center", alignItems: 'center' }}>
                <h2>
                
                {responseStatus}
                </h2>
            </div>

        </>
    )
}

export default Tracking