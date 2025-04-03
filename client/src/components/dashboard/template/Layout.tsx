import React from 'react'
import { Outlet } from 'react-router-dom'
import Template from './Template'

const Layout: React.FC = () => {
    return (
        <div>
            <Template>
                <div className='bg-white w-full h-full'>

                    <Outlet />
                </div>
            </Template>
        </div>
    )
}

export default Layout
