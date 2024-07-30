import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username !== 'admin' || password !== 'password123') {
      navigate('/login');
    }

    axios.get('https://helloradio.lk/data').then(response => setData(response.data));

    socket.on('dataUpdate', (newData) => {
      setData(prevData => [...prevData, newData]);
    });

    return () => {
      socket.off('dataUpdate');
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    navigate('/login');
  };

  useEffect(() => {
    // Apply animation class and scroll to the last element after data updates
    data.forEach((item, index) => {
      const element = document.getElementById(`item-${index}`);
      if (element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });

    // Scroll to the last element in the list
    if (data.length > 0) {
      const lastElement = document.getElementById(`item-${data.length - 1}`);
      if (lastElement) {
        lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [data]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <button onClick={handleLogout} className="btn btn-danger mb-4">Logout</button>
      <h4 className="mb-4">H-Beat Radio Live Comments</h4>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <ul className="list-group">
          {data.map((item, index) => (
            <li
              key={index}
              id={`item-${index}`}
              className="list-group-item"
              style={{
                transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
                opacity: '0',
                transform: 'translateY(-20px)',
                wordBreak: 'break-word', // Ensure long words break to the next line
                whiteSpace: 'pre-wrap', // Preserve whitespace and wrap text
              }}
            >
              <strong>{item.name}</strong> - {item.location} - {item.message}
            </li>
          ))}
        </ul>
      </div>
      <style>
        {`
          .list-group-item:nth-child(even) {
            background-color: #f8f9fa;
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
