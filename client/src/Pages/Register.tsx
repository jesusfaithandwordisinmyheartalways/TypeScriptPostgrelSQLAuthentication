



import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import './CSS/Register.css'




const Register:React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();



    const userRegister = async(e:React.FormEvent<HTMLFormElement >) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
          const response = await fetch('http://localhost:3001/register', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ username, password, email }),
             credentials: 'include'
          });
              const data = await response.json()
              setLoading(false)
              if(!response.ok) {
                setError(data.message || 'user registration failed')
                return;
              }
              setTimeout(() => navigate('/login'), 3000)
        }catch(error) {
              setLoading(false)
              setError('An error occurred. Please try again.');
        }

    }




    useEffect(() => { 
      window.onload = function() {
        document.getElementById('inputLogin')?.focus()
      }
  }, [])



  


  return (
    <>
    
    <div className={'form-container'}>
        <div className={'form-wrapper'}>
          
           <div className="content">

           <form onSubmit={userRegister}> 
             <div><h3>PostgresSQL TypeScript User Login</h3></div>
            <div>
            <input type="text" id='inputLogin' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            </div>
            <div> <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            </div>

            <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            </div>

            <div><button type="submit" disabled={loading}> {loading? 'Registering...' : 'User Register'} </button> </div>
            </form>
                    {error && <p className="error">{error}</p>}


           </div>

            







        </div>
    </div>
    
    
    
    
    </>
  )
}

export default Register
