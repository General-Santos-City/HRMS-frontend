import PropTypes from "prop-types"
import React, { useEffect } from "react"

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link } from "react-router-dom"

// Formik validation
import * as Yup from "yup"
import { useFormik } from "formik"

// actions
import { loginSuperUser } from "store/actions"

// import images
import profile from "assets/images/profile-img.png"
import logo from "assets/images/main_logo_transparent.png"

// style
import "styles/custom_gscwd/pages/login.scss"

// Import Cookies
import Cookies from "universal-cookie"

const SuperAdminLogin = props => {
  const dispatch = useDispatch()

  const cookies = new Cookies()

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: "SuperUserAdmin" || "",
      password: "password" || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: values => {
      dispatch(loginSuperUser(values, props.history))
    },
  })

  const { response, isLoading, error } = useSelector(state => ({
    response: state.SuperUserLogin.response,
    isLoading: state.SuperUserLogin.isLoading,
    error: state.SuperUserLogin.error,
  }))

  useEffect(() => {
    if (Object.keys(response).length) {
      const isSuperUser = response.isSuperUser
      cookies.set("isSuperUser", isSuperUser)

      const userId = response.userId
      cookies.set("userId", userId)

      const userName = response.username
      localStorage.setItem("username", userName)
    }
  }, [response])

  return (
    <React.Fragment>
      <title>Login | GSCWD HRIS</title>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Hey Super User!</h5>
                        <p>Sign in to continue to HRIS.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={e => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      {isLoading ? (
                        <Alert
                          color="info"
                          className="alert-dismissible fade show mb-2"
                          role="alert"
                        >
                          <i className="mdi mdi-loading mdi-spin mr-2"></i>{" "}
                          Verifying Credentials
                        </Alert>
                      ) : null}

                      {error ? <Alert color="danger">{error}</Alert> : null}

                      <div className="mb-3">
                        <Label className="form-label">Username</Label>
                        <Input
                          name="username"
                          className="form-control"
                          placeholder="Enter username"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ""}
                          invalid={
                            validation.touched.username &&
                            validation.errors.username
                              ? true
                              : false
                          }
                        />
                        {validation.touched.username &&
                        validation.errors.username ? (
                          <FormFeedback type="invalid">
                            {validation.errors.username}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Log In
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>© {new Date().getFullYear()} HRIS by GSCWD</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(SuperAdminLogin)

SuperAdminLogin.propTypes = {
  history: PropTypes.object,
}
