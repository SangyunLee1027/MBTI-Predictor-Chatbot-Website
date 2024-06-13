import React from 'react'
import Card from './Card'
import {Link} from 'react-router-dom'


const HomeCards = () => {
  return (
    <section className="py-4">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <Card>
            <h2 className="text-2xl font-bold">Haven't Signed Up yet?</h2>
            <p className="mt-2 mb-4">
              Sign up and start your chat today.
            </p>
            <Link
              to="/register"
              className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
            >
              Sign Up
            </Link>
          </Card>
          <Card bg='bg-purple-100'>
            <h2 className="text-2xl font-bold">Already Signed Up?</h2>
                <p className="mt-2 mb-4">
                  Sign in and continue your chat for better prediction.
                </p>
                <Link
                to="/signin"
                className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
                >
                  Sign In
                </Link>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeCards
