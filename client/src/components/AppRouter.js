import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authRoutes, publicRoutes } from '../routes'
import { INFOPAGE_ROUTE } from '../utils/consts'
import { Context } from '../index'
import { observer } from 'mobx-react-lite'

const AppRouter = observer(() => {
  const { user } = useContext(Context)
  return (
    <Routes>
        {user.isAuth &&  authRoutes.map(({path, element}) =>
          <Route key={path} path={path} element={element} /> // заменяем Component на element
         )}
        {publicRoutes.map(({ path, element }) => 
          <Route key={path} path={path} element={element} /> // заменяем Component на element
        )}
        <Route path='*' element={<Navigate to={INFOPAGE_ROUTE} />} />
    </Routes>
  )
})

export default AppRouter
