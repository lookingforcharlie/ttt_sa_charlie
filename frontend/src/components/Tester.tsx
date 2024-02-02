import React, { useEffect } from 'react';

export const Tester = () => {
  // useEffect(() => {
  // socket.on('send_result', (data) => {
  // Handle the data received from the backend
  // console.log(data)
  // });
  // }, [socket]);
  return (
    <div>
      <h1>Tester</h1>
      <input className='border p-2' />
      <button>Send Message</button>
    </div>
  );
};
