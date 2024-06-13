import React from 'react'
import Card from './Card'
import {Link} from 'react-router-dom'
import useAuth from "../hooks/useAuth"
import axios from '../api/axios';


const SIGNOUT_URL = '/auths/signout'



const HomeCards_SignIn = () => {


  const { auth, setAuth } = useAuth();

  const Logout= async() =>{
    try {

      const response = await axios.post(SIGNOUT_URL, 
        {   
          withCredentials: true,
        }
      );
      
      setAuth({});

      console.log(response.data.message)
      

    } catch (err) {
      console.error(err);
    }
  }


  return (
    <section className="py-4">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <Card>
            <h2 className="text-2xl font-bold">You are Ready!</h2>
            <p className="mt-2 mb-4">
              Now try your MBTI!
            </p>
            <Link
              to="/chatpage"
              className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
            >
              To Chatbot
            </Link>
          </Card>

          <Card bg='bg-purple-100'>
            <h2 className="text-2xl font-bold">You wanna leave?</h2>
                <p className="mt-2 mb-4">
                  Come Back Anywhen!
                </p>
                <Link
                onClick = {Logout}
                to="/"
                className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
                >
                  Logout
                </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default HomeCards_SignIn
