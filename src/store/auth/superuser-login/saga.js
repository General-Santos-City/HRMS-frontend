import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { SU_LOGIN_USER, SU_LOGOUT_USER } from "./actionTypes"
import { apiError, loginSuperUserSuccess } from "./actions"

//Helper Files
import * as url from "helpers/url_helper"
import { postSuLogin } from "helpers/auth_helper"

import Cookies from "universal-cookie"

const domainUrl = process.env.REACT_APP_HRISDOMAIN
const cookies = new Cookies()

function* loginUser({ payload: { user, history } }) {
  const loginDetails = {
    ...user,
    clientId: process.env.REACT_APP_CLIENTID,
    secret: process.env.REACT_APP_SECRET,
  }

  try {
    const response = yield call(
      postSuLogin,
      domainUrl + url.POST_SU_LOGIN,
      loginDetails
    )

    yield put(loginSuperUserSuccess(response))

    history.push("/module-dashboard")
    // window.location.reload()
  } catch (error) {
    yield put(apiError(error))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    cookies.remove("userId")
    cookies.remove("isSuperUser")
    localStorage.clear()
    // localStorage.removeItem("authUser")

    history.push("/admin-login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* SuperUserAuthSaga() {
  yield takeEvery(SU_LOGIN_USER, loginUser)
  yield takeEvery(SU_LOGOUT_USER, logoutUser)
}

export default SuperUserAuthSaga
