import React from 'react';
import './ipDashboard.css';
import { v4 as uuid } from 'uuid';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const randomId = uuid();

function IpDashboard({ socket }) {
    const [ipList, setIpList] = useState([]);
    const consoleRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;

        // Écoute de l'événement `ip-update` pour recevoir les IPs du serveur
        socket.on('ip-update', (data) => {
            setIpList((prevList) => [...prevList, data]); // Ajoute la nouvelle IP à la liste
        });

        // Nettoyage de l'écouteur à la déconnexion
        return () => {
            socket.off('ip-update');
        };
    }, [socket]);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [ipList]);

    return (
        <div className='ip-dashboard'>
            <div className='header'>
                <h1 className='dashboard-h1'>IP Dashboard</h1>
                <button className='back-button' onClick={() => navigate('/')}>Back &gt;</button>
            </div>
            <div className='console' ref={consoleRef}>
                {ipList.map((ip, index) => (
                    <p key={index}><span>{randomId} $&gt;</span> {ip}</p>
                ))}
            </div>
        </div>
    );
}

export default IpDashboard;