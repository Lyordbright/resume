import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../contexts/AuthContexts'
import { toast } from 'sonner'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectedRoute = () => {
    const { isAuth } = useContext(authContext)
    const navigate = useNavigate()
    const [checked, setChecked] = useState(false)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const verifyUser = async () => {
            const authState = await isAuth()
            if (!authState) {
                toast.error("You have to be logged in")
                navigate("/login")
            } else {
                setAuthorized(true)
            }
            setChecked(true)
        }
        verifyUser()
    }, [])

    if (!checked) return null // or a loading spinner

    return <>{authorized ? <Outlet /> : null}</>
}

export default ProtectedRoute