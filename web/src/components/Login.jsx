import React, { useState, useContext } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from "react-router-dom";
import featuresTabHook from './Noncomponents';
import { apiUrl } from './Noncomponents';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; 

export default function Login() {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = "Login";
  const signUp = "Create an Account";
  const [action, changeAction] = useState({ primary: login, secondary: signUp });
  const [error, setError] = useState(" ");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { state, takeAction } = useContext(featuresTabHook);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authRoute = action.primary === login ? "authenticate" : "register";
      const sessionMail = sessionStorage.getItem('email');
      const mail = sessionMail ? sessionMail : email.toLowerCase();
      const response = await apiUrl.post(`/${authRoute}/${mail}?password=${password}`);
      if (response.data.isAuthenticated) {
        setLoading(true); 
        const accessToken = response.data.token;
        sessionStorage.setItem('token', accessToken);
        sessionStorage.setItem('email', mail);
        const currentDate = new Date().toISOString().split('T')[0];
        localStorage.setItem('lastClearedDate', JSON.stringify({date: currentDate, email: mail}));
        apiUrl.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        const status = signIn({
          auth: {
            token: accessToken,
            type: "Bearer",
          },
          userState: { id: mail },
        });
        takeAction({ type: "changeEmailId", payload: mail });

        if (status) {
          navigate("/current-schedule");
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed, Please Try Again");
    } finally {
      setLoading(false); 
      e.target.reset();
      setEmail('');
      setPassword('');
    }
  };

  const demoAuth = async (e) => {
    e.preventDefault();
    try {
      const mail = 'demouser@gmail.com'
      const response = await apiUrl.post(`/authenticate/${mail}`);
      if (response.data.isAuthenticated) {
        setLoading(true); 
        const accessToken = response.data.token;
        sessionStorage.setItem('token', accessToken);
        sessionStorage.setItem('email', mail);
        const currentDate = new Date().toISOString().split('T')[0];
        localStorage.setItem('lastClearedDate', JSON.stringify({date: currentDate, email: mail}));
        apiUrl.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        const status = signIn({
          auth: {
            token: accessToken,
            type: "Bearer",
          },
          userState: { id: mail },
        });
        takeAction({ type: "changeEmailId", payload: mail });
        if (status) {
          navigate("/current-schedule");
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed, Please Try Again");
    } finally {
      setLoading(false); 
      setEmail('');
      setPassword('');
    }
  }

  function changeUserAuth(e) {
    e.preventDefault();
    const a1 = action.primary;
    const a2 = action.secondary;
    changeAction({ primary: a2, secondary: a1 });
  }

  return (loading ? (
    <div className="loadingScreen">
      <p className='loadingText' style={{color: state.darkMode? 'white' : 'black'}}>Logging you in...</p>
    </div>
  ) : ( <div className='homepage'>
      <div className='appTitleContainer'>
        <h1 className='appTitle'>Workspace</h1>
      </div>
      <div className='authContainer' style={{ color: 'black'}}>
        <div className='loginSetup'>
          <h1 className='loginTitle'>{action.primary}</h1>
          <form className="userInfoForm" onSubmit={handleSubmit}>
            <div className='emailContainer'>
              <FaEnvelope className='inputIcon emailIcon' /> 
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className='emailInput' placeholder='Enter Email Address'/>
            </div>
            <div className='passwordContainer'>
              <FaLock className='inputIcon' style={{marginLeft:"5px"}}/>
              <input type={showPassword? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className='passwordInput' placeholder='Enter Password'/>
              <span 
                className='togglePassword' 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className='inputIcon' style={{marginRight:"5px"}}/> : <FaEye className='inputIcon' style={{marginRight:"5px"}}/>}
              </span>
            </div>
            <div className='loginSubmitButtonContainer'>
              <button className='loginSubmitButton' type="submit">{action.primary === login ? login : "Sign Up"}</button>
            </div>
          </form>
          <div className='signUpNDemoContainer'>
            <button className='signUpButton' style={{borderBottom: '1px solid black'}} onClick={changeUserAuth}>{action.secondary}</button>
            <button className='demoButton' style={{borderBottom: '1px solid black'}} onClick={demoAuth}>Demo</button>
          </div>
          <div className='authFailContainer'>
            {error && <p className='errorText'>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  ))
};
