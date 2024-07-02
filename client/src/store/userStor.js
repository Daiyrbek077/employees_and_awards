import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._edit = false
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }
    setEdit(bool) {
        this._edit = bool
    }

    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
    get edit() {
        return this._edit
    }
}
