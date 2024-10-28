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
  const { state, takeAction } = useContext(featuresTabHook);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authRoute = action.primary === login ? "authenticate" : "register";
      const sessionMail = sessionStorage.getItem('email');
      const mail = sessionMail? sessionMail : email
      const response = await apiUrl.post(`/${authRoute}/${mail}?password=${password}`);
      if (response.data.isAuthenticated) {
        const accessToken = response.data.token;
        sessionStorage.setItem('token', accessToken);
        sessionStorage.setItem('email', mail);
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
      console.error("Authentication failed:", error);
      setError(error.response.data.message != null ? error.response.data.message : "Login Failed, Please Try Again");
    }
    e.target.reset();
    setEmail('');
    setPassword('');
  };

  function changeUserAuth(e) {
    e.preventDefault();
    let a1 = action.primary;
    let a2 = action.secondary;
    changeAction({ primary: a2, secondary: a1 });
  }

  return (
    <div className='homepage'>
      <div className='appTitleContainer'>
        <h1 className='appTitle'>Workspace</h1>
        <div className='captionContainer'>
        <p className='appCaption'>lan, Act, Complete, Enjoy</p>
        </div>
      </div>
      <div className='authContainer' style={{ color: 'black'}}>
        <div className='loginSetup'>
          <h1 className='loginTitle'>{action.primary}</h1>
          <form className="userInfoForm" onSubmit={handleSubmit}>
            <div className='emailContainer'>
              <FaEnvelope className='inputIcon' /> 
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
            <button className='demoButton' style={{borderBottom: '1px solid black'}} >Demo</button>
          </div>
          <div className='authFailContainer'>
            {error && <p className='errorText'>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
