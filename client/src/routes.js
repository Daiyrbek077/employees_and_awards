import Admin from "./pages/Admin"
import Auth from "./pages/Auth"
import Edit from "./pages/Edit"
import EmployeePage from "./pages/EmployeePage"
import InfoPage from "./pages/InfoPage"
import { ADMIN_ROUTE, EDIT_ROUTE, EMPLOYEE_ROUTE, INFOPAGE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from "./utils/consts"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        element: <Admin/>

    },
    {
        path: EDIT_ROUTE,
        element: <Edit/>

    }

]


export const publicRoutes = [
    {
        path: INFOPAGE_ROUTE,
        element: <InfoPage/>

    },
    {
        path: LOGIN_ROUTE,
        element: <Auth/>

    },
    {
        path: REGISTRATION_ROUTE,
        element: <Auth/>

    },
    {
        path: EMPLOYEE_ROUTE + '/:id',
        element: <EmployeePage/>

    }
    
]