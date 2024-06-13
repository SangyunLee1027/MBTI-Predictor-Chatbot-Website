import {useRef, useState, useEffect} from 'react';
import React from 'react';
import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from 'react-router-dom';
import axios from '../api/axios';


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,22}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


const REGISTER_URL = '/auths/register';



const RegisterPage = () => {
    
    const userRef = useRef();
    const errRef = useRef();

    
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const[success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        
        setValidEmail(result);
    })

    useEffect(() => {
        const result = USER_REGEX.test(user);
        
        setValidName(result);
        

    }, [user])


    useEffect(() => {
        const result = PWD_REGEX.test(pwd);

        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);

    }, [pwd, matchPwd])


    useEffect(() => {
        setErrMsg('');
    }, [email, user, pwd, matchPwd])


    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
        //     const response = await fetch('http://127.0.0.1:8000/auths/register', {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //         'email': email,
        //         'name': user,
        //         'password' : pwd
        //     })
        // })
        
        // if (response.status !== 200){
        //     console.log(response.email)
        //     const content = await response.json();
        //     setErrMsg(content.email[0]);
            

        //     errRef.current.focus();
        // }   else {
        //     setSuccess(true);
        // }

            await axios.post(REGISTER_URL, 
                JSON.stringify({
                    'email': email,
                    'name': user,
                    'password' : pwd
                }),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            setSuccess(true);
            
        } catch (err) {
            if (!err?.response){
                setErrMsg('No Server Response');
            } else if(err.response?.status === 409){
                setErrMsg('Username Taken');
            }   else if (err.response.data.email){
                setErrMsg(err.response.data.email[0]);
            } else {
                setErrMsg('Registration Failed');
            }

            errRef.current.focus();
        }

    }

    // const handleSubmit = async(e) =>{
    //     e.preventDefault();

    //     const v1 = USER_REGEX.test(user);
    //     const v2 = PWD_REGEX.test(pwd);
    //     if(!v1 || !v2) {
    //         setErrMsg("Invalid Entry");
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(REGISTER_URL,
    //             JSON.stringify({user , pwd }),
    //             {
    //                 headers: {'Content-Type': 'application/json'},
    //                 withCredentials: true
    //             }
    //         );
            
    //         console.log(response.data);
    //         console.log(response.accessToken);
    //         console.log(JSON.stringify(response));
    //         setSuccess(true);
    //     } catch (err) {
    //         if (!err?.response){
    //             setErrMsg('No Server Response');
    //         } else if(err.response?.status === 409){
    //             setErrMsg('Username Taken');
    //         }   else {
    //             setErrMsg('Registration Failed');
    //         }

    //         errRef.current.focus();
    //     }


    // }

  return (
    <>
    
    {success ? (
        <section className='bg-purple-600 p-6 w-full max-w-md mx-auto mt-20 pb-10 rounded-lg shadow-md'>
            <h1 className="text-green-500 text-2xl font-medium">Sucess!</h1>
            <p>
                <Link className="underline text-white text-md" to='/signin'>Sign In</Link>
            </p>
        </section>
    ) : (

    <section className='bg-purple-600 p-6 w-full max-w-md mx-auto mt-20 rounded-lg shadow-md'>
      <p ref={errRef} className={errMsg ? "bg-red-100 text-red-700 p-2" : "hidden"} aria-live="assertive"> {errMsg} </p>
        <h1 className='text-lg font-bold text-white mb-4'>Register</h1>
        <form onSubmit={handleSubmit}>
            
        <div>
                <label htmlFor="email" className='block text-md font-medium text-white'>
                    Email: 
                    <span className={validEmail ? "text-green-600 text-lg pl-2" : "hidden"}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>

                    <span className={validEmail || !email ? "hidden" : "text-red-600 text-lg pl-2"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>

                <input 
                    type="text" 
                    id="email" 
                    ref={userRef}  
                    autoComplete="off" 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    aria-invalid={validEmail ? "false" : "true"} 
                    aria-describedby="uidnote" 
                    onFocus={() => setEmailFocus(true)} 
                    onBlur={() => setEmailFocus(false)} 
                    className='mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm' 
                />

                <p id="uidnote" className={emailFocus && email && !validEmail ? "text-white font-medium p-1.5 bg-black rounded-md mt-2" : "hidden"}> 
                    Must be in Email format
                </p>

            </div>
            
            <div>
                <label htmlFor="username" className='block text-md font-medium text-white'>
                    Username: 
                    <span className={validName ? "text-green-600 text-lg pl-2" : "hidden"}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>

                    <span className={validName || !user ? "hidden" : "text-red-600 text-lg pl-2"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>

                <input 
                    type="text" 
                    id="username" 
                    autoComplete="off" 
                    onChange={(e) => setUser(e.target.value)} 
                    required 
                    aria-invalid={validName ? "false" : "true"} 
                    aria-describedby="uidnote" 
                    onFocus={() => setUserFocus(true)} 
                    onBlur={() => setUserFocus(false)} 
                    className='mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm' 
                />

                <p id="uidnote" className={userFocus && user && !validName ? "text-white font-medium p-1.5 bg-black rounded-md mt-2" : "hidden"}> 
                    4 to 24 characters. <br/> 
                    Must begin with a letter. <br/>
                    Letters, numbers, underscores, hyphens allowed.

                </p>

            </div>

            <div className=''>
                <label htmlFor="password" className='block text-md font-medium text-white'>
                    Password: 
                    <span className={validPwd ? "text-green-600 text-lg pl-2" : "hidden"}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>

                    <span className={validPwd || !pwd ? "hidden" : "text-red-600 text-lg pl-2"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>

                <input 
                    type="password" 
                    id="password" 
                    autoComplete="off" 
                    onChange={(e) => setPwd(e.target.value)} 
                    required 
                    aria-invalid={validPwd ? "false" : "true"} 
                    aria-describedby="pwdnote" 
                    onFocus={() => setPwdFocus(true)} 
                    onBlur={() => setPwdFocus(false)} 
                    className='mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm' 
                />

                <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "text-white font-medium p-1.5 bg-black rounded-md mt-2"  : "hidden"}> 
                    8 to 24 characters. <br/> 
                    Must include uppercase and lowercase letters, a number, and a special character. <br/>
                    Allowed special characters: <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> 
                    <span aria-label="percent">%</span>

                </p>

            </div>

            <div>
                <label htmlFor="pwd_confirm" className='block text-md font-medium text-white'>
                    Password Confirmation: 
                    <span className={validMatch && matchPwd ? "text-green-600 text-lg pl-2" : "hidden"}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>

                    <span className={validMatch || !matchPwd ? "hidden" : "text-red-600 text-lg pl-2"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>

                <input 
                    type="password" 
                    id="pwd_confirm" 
                    autoComplete="off" 
                    onChange={(e) => setMatchPwd(e.target.value)} 
                    required 
                    aria-invalid={validMatch ? "false" : "true"} 
                    aria-describedby="pwdmatchnote" 
                    onFocus={() => setMatchFocus(true)} 
                    onBlur={() => setMatchFocus(false)} 
                    className='mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm' 
                />

                <p id="pwdmatchnote" className={matchFocus && matchPwd && !validMatch ? "text-white font-medium p-1.5 bg-black rounded-md mt-2" : "hidden"}> 
                    It is not matched with Password. <br/> 
                   

                </p>

            </div>

            <button type='submit' className="bg-gray-100 mt-5 shadow-md w-full rounded-md border-gray-300 text-lg p-2" disabled={!validEmail || !validName || !validPwd || !validMatch ? true : false}>Sign Up</button>

        </form>

        <p className="text-white mt-4 text-md">
            Already Registered? <br />
            <span className="underline">
                <Link to="/signin">Sign In</Link>
            </span>
        </p>

    </section>
    ) }
    </>
  )
}

export default RegisterPage

