import {useRef, useState, useEffect} from 'react';
import React from 'react';
import useAuth from '../hooks/useAuth';
import {Link, Navigate} from 'react-router-dom';
import axios from '../api/axios';


const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const SIGNIN_URL = '/auths/signin'


const SigninPage = () => {
    
    const userRef = useRef();
    const errRef = useRef();

    const {setAuth} = useAuth();
    
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const[success, setSuccess] = useState(false);

    const[redirect, setRedirect] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        
        setValidEmail(result);
    })

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);

        setValidPwd(result);

    }, [pwd])


    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])


    const handleSubmit = async(e) => {
        e.preventDefault();

        try {

        const response = await axios.post(SIGNIN_URL, 
            JSON.stringify({
                'email': email,
                'password' : pwd
            }),
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }
        );
        
        const accessToken = response?.data?.token;
        const name = response?.data?.name;
        
        setAuth({email, name, accessToken});

        setRedirect(true);

        } catch (err) {
            if (!err?.response){
                console.log(err)
                setErrMsg('No Server Response');
            } else if (err.response.data.detail){
                setErrMsg(err.response.data.detail);
            }  else {
                setErrMsg('Signin Failed');
            }

            errRef.current.focus();
        }

    };

    
    if(redirect){
        return <Navigate to='/' replace />;
    } 

  return (
    <>
    <section className='bg-purple-600 p-6 w-full max-w-md mx-auto mt-20 rounded-lg shadow-md'>
      <p ref={errRef} className={errMsg ? "bg-red-100 text-red-700 p-2" : "hidden"} aria-live="assertive"> {errMsg} </p>
        <h1 className='text-lg font-bold text-white mb-4'>Sign In</h1>
        <form onSubmit={handleSubmit}>
        

        <div>
                <label htmlFor="email" className='block text-md font-medium text-white'>
                    Email: 
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
                    className='mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm' 
                />

            </div>
            
            

            <div className=''>
                <label htmlFor="password" className='block text-md font-medium text-white'>
                    Password: 
                </label>

                <input 
                    type="password" 
                    id="password" 
                    autoComplete="off" 
                    onChange={(e) => setPwd(e.target.value)} 
                    required 
                    aria-invalid={validPwd ? "false" : "true"} 
                    aria-describedby="pwdnote" 
                    className='mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm' 
                />

            </div>

            <button type='submit' className="bg-gray-100 mt-5 shadow-md w-full rounded-md border-gray-300 text-lg p-2" disabled={!validEmail || !validPwd ? true : false}>Sign In</button>

        </form>

        <p className="text-white mt-4 text-md">
            Have't Registered yet? <br />
            <span className="underline">
                <Link to="/register">Sign Up</Link>
            </span>
        </p>

    </section>
    </>
  )
}

export default SigninPage

