import React, { useEffect, useState } from 'react'
import API_INSTANCE from '../services/api'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { SET_AUTH } from '../redux/slices/authSlice'
import SideBar from './SideBar'
import Sidebar2 from './Sidebar2'

function PrivateRoute() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    let token = useSelector((state) => state.auth.token)
    if (!token) {
        navigate('/login')
    }

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isValidating, setIsValidating] = useState(false)

    async function checkToken() {
        try {
            setIsValidating(false)
            let response = await API_INSTANCE.post('/user/auth/validate', { token });
            // console.log('from auth api:::', response.data.data)
            dispatch(SET_AUTH(response.data.data))
            setIsAuthenticated(true)
            setIsValidating(true)
        } catch (error) {
            navigate('/login')
        }
    }

    useEffect(() => {
        checkToken()
    }, [])


    return (
        <>
            {
                isValidating && (isAuthenticated ?

                    <div className='grid grid-cols-1 md:grid-cols-9 w-full'>
                        <div className='hidden md:block md:col-span-2 sticky top-0 h-screen'>
                            <SideBar />
                        </div>
                        {/* <div className='col-span-1 md:col-span-5 w-full md:w-[550px] xl:w-[650px] '> */}
                        <div className='col-span-1 md:col-span-5 w-full  '>
                            <Outlet />
                        </div>
                        <div className='hidden lg:block md:col-span-2 sticky top-0 h-screen'>
                            <Sidebar2 />
                        </div>
                        {/*mobile */}
                        <div className='md:hidden'>
                            <SideBar />
                        </div>
                    </div>
                    :
                    <Navigate to='/login' />)
            }
        </>
    )
}

export default PrivateRoute