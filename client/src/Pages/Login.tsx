




import React, { useState, useEffect  } from 'react'
import { useNavigate } from "react-router-dom";
import './CSS/Login.css'



const Login:React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();





    const userLogin = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('');
        try {
          const response = await fetch('http://localhost:3001/login', {
            method: "POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password }),
            credentials: 'include'
          });
          const data = await response.json()
          setLoading(false)
          if(!response.ok) {
            setError(data.message || 'Login failed.')
            return;
          }

          setTimeout(() => navigate('/welcome'), 3000);
        }catch(error) {
          setLoading(false);
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
   

   <div className={'login-container'}>
    <div className={'login-wrapper'}>
      <div>
        <form onSubmit={userLogin}>
          <div><input type="email" id='inputLogin' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          </div>
          <div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          </div>
          <div><button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button> </div>
                {error && <p className="error">{error}</p>}
        </form>
      </div>



    </div>
   </div>
   
   
   
   
   
   
   
   </>
  )
}

export default Login
