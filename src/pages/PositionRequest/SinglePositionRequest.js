import React, { useEffect } from "react"
import dayjs from "dayjs"
import { isEmpty } from "lodash"
import PropTypes from "prop-types"
import { Can } from "casl/Can"
import { Link, Navigate, useParams } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { getSinglePRF, fetchPRFTrail } from "store/actions"

import {
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Row,
  Table,
  Alert,
  Button,
} from "reactstrap"
import LoadingIndicator from "components/LoaderSpinner/LoadingIndicator"
import ToastrNotification from "components/Notifications/ToastrNotification"
import Breadcrumbs from "components/Common/Breadcrumb"
import PrfSignatory from "components/Trail/PrfSignatory/PrfSignatory"

import "flatpickr/dist/themes/material_blue.css"

const SinglePositionRequest = props => {
  const dispatch = useDispatch()
  const { prfId } = useParams()

  // redux state for PRF details
  const { prfDetails, loadingPrf, errorPrf } = useSelector(state => ({
    prfDetails: state.positionRequest.prfDetails,
    loadingPrf: state.positionRequest.loading.loadingPrf,
    errorPrf: state.positionRequest.error.errorPrf,
  }))

  // redux state for PRF trail
  const { prfTrail, loadingPrfTrail, errorPrfTrail } = useSelector(state => ({
    prfTrail: state.positionRequest.prfTrail,
    loadingPrfTrail: state.positionRequest.loading.loadingPrfTrail,
    errorPrfTrail: state.positionRequest.error.errorPrfTrail,
  }))

  const formatDate = assignedDate => dayjs(assignedDate).format("MMMM DD, YYYY")

  const renderStatus = status => {
    if (status === "Pending") {
      return (
        <Alert
          color="warning"
          role="alert"
          style={{ textAlign: "center", textTransform: "uppercase" }}
        >
          {status}
        </Alert>
      )
    } else if (status === "For Signing") {
      return (
        <Alert
          color="info"
          role="alert"
          style={{ textAlign: "center", textTransform: "uppercase" }}
        >
          {status}
        </Alert>
      )
    } else if (status === "Disapproved") {
      return (
        <Alert
          color="danger"
          role="alert"
          style={{ textAlign: "center", textTransform: "uppercase" }}
        >
          {status}
        </Alert>
      )
    } else if (status === "Approved") {
      return (
        <Alert
          color="success"
          role="alert"
          style={{ textAlign: "center", textTransform: "uppercase" }}
        >
          {status}
        </Alert>
      )
    } else {
      return (
        <Alert
          color="info"
          role="alert"
          style={{ textAlign: "center", textTransform: "uppercase" }}
        >
          {status}
        </Alert>
      )
    }
  }

  useEffect(() => {
    dispatch(getSinglePRF(prfId))
    dispatch(fetchPRFTrail(prfId))
  }, [dispatch])

  return (
    <React.Fragment>
      <Can I="access" this="Prf_list">
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="Position Request List"
              titleUrl="/prf-list"
              breadcrumbItem="Position Request Details"
            />

            {/* Notifications */}
            {errorPrf ? (
              <ToastrNotification toastType={"error"} notifMessage={errorPrf} />
            ) : null}

            {errorPrfTrail ? (
              <ToastrNotification
                toastType={"error"}
                notifMessage={errorPrfTrail}
              />
            ) : null}

            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    {loadingPrf ? (
                      <LoadingIndicator />
                    ) : (
                      <>
                        {renderStatus(prfDetails.status)}

                        <div className="table-responsive ">
                          <Table className="table table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td>
                                  <span className="fw-medium">PRF No.: </span>
                                  &nbsp;{prfDetails.prfNo}
                                </td>
                                <td>
                                  <span className="fw-medium">
                                    Date Requested:{" "}
                                  </span>
                                  &nbsp;{formatDate(prfDetails.dateRequested)}
                                </td>
                                <td>
                                  <span className="fw-medium">
                                    With examination:{" "}
                                  </span>
                                  &nbsp;{prfDetails.withExam ? "Yes" : "No"}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span className="fw-medium">For: </span>
                                  &nbsp;{prfDetails.for.name}
                                </td>
                                <td>
                                  <span className="fw-medium">From: </span>
                                  &nbsp;{prfDetails.from.name}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Requested Positions */}
            <Row>
              <Col lg={12}>
                <Card>
                  <h5 className="card-header bg-transparent border-bottom">
                    Requested Positions
                  </h5>
                  <CardBody>
                    <Row className="mt-2">
                      {!isEmpty(prfDetails.prfPositions) ? (
                        <>
                          {prfDetails.prfPositions.map(position => (
                            <Col md={4} key={position.positionId}>
                              <Link
                                to={{
                                  pathname: `/plantilla/${position.positionId}`,
                                }}
                                className="text-dark"
                                target="_blank"
                              >
                                <Card
                                  outline
                                  color="primary"
                                  className="border"
                                >
                                  <CardBody>
                                    <h5 className="bg-transparent border-bottom pb-2">
                                      {position.positionTitle}
                                    </h5>
                                    <CardText className="mb-0">
                                      {position.itemNumber}
                                    </CardText>
                                    <CardText>{position.designation}</CardText>
                                  </CardBody>
                                </Card>
                              </Link>
                            </Col>
                          ))}
                        </>
                      ) : null}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              {/* PRF Trail */}
              <Col md={12}>
                <Card>
                  <h5 className="card-header bg-transparent border-bottom">
                    Trail
                  </h5>
                  <CardBody>
                    {loadingPrfTrail ? (
                      <LoadingIndicator />
                    ) : (
                      <PrfSignatory
                        prfTrail={prfTrail}
                        prfDetails={prfDetails}
                        formatDate={formatDate}
                      />
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Printables */}
            <Row>
              {prfDetails.status === "Approved" ? (
                <Col md={6}>
                  <Card>
                    <h5 className="card-header bg-transparent border-bottom">
                      Printables
                    </h5>
                    <CardBody>
                      <Row>
                        <Col md={12}>
                          <Row>
                            <Col md={6}>
                              <Link
                                to={{
                                  pathname: `/prf-pdf/${prfId}`,
                                }}
                                target="_blank"
                              >
                                <Button
                                  color="info"
                                  className="btn-block"
                                  style={{ width: "100%" }}
                                >
                                  Position Request Form
                                </Button>
                              </Link>
                            </Col>
                            <Col md={6}>
                              <Link
                                to={{
                                  pathname: `/publication-pdf/${prfId}`,
                                }}
                                target="_blank"
                              >
                                <Button
                                  color="info"
                                  className="btn-block"
                                  style={{ width: "100%" }}
                                >
                                  Publication
                                </Button>
                              </Link>
                            </Col>
                          </Row>
                          <ul className="list-unstyled">
                            <li></li>

                            <li className="mt-3"></li>

                            <li className="mt-3">
                              <h6>Position Descriptions</h6>
                            </li>

                            {prfDetails.prfPositions.map(position => (
                              <li key={position.positionId} className="mt-1">
                                <Link
                                  to={{
                                    pathname: `/position-description-pdf/${prfId}/${position.positionId}`,
                                  }}
                                  target="_blank"
                                >
                                  <Button
                                    color="info"
                                    className="btn-block"
                                    style={{ width: "100%" }}
                                  >
                                    {position.itemNumber}
                                  </Button>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ) : null}
            </Row>
          </Container>
        </div>
      </Can>

      <Can not I="access" this="Prf_list">
        <Navigate to="/page-404" />
      </Can>
    </React.Fragment>
  )
}

export default SinglePositionRequest
