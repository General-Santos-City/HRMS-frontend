import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { isEmpty } from "lodash"

import { useDispatch, useSelector } from "react-redux"
import {
  fetchSelectedByAppointingAuth,
  fetchApplicants,
  fetchEndorsedApplicants,
  fetchShortlistedApplicants,
  fetchPsbDetails,
  fetchPsbSummary
} from "store/actions"

import { Modal } from "react-bootstrap"
import {
  Col,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table
} from "reactstrap"
import LoadingIndicator from "components/LoaderSpinner/LoadingIndicator"
import ToastrNotification from "components/Notifications/ToastrNotification"

import classnames from "classnames"
import AppliedApplicants from "./AppliedApplicants"
import EndorsedApplicants from "./EndorsedApplicants"
import ShortlistedApplicants from "./ShortlistedApplicants"
import HiredApplicants from "./HiredApplicants"
import HrmpsbSummary from "./HrmpsbSummary"
import HrmpsbDetails from "./HrmpsbDetails"

const PublicationDetails = props => {
  const { showPublicationDetails, handleClosePublicationDetails, modalData } =
    props
  const dispatch = useDispatch()
  const [activeTab, setactiveTab] = useState("1")

  // redux state for all errors that each individual dispatch
  const { errorApplicants,
    errorSelectedByAppointingAuth,
    errorEndorsedApplicants,
    errorShortlistedApplicants,
    errorPsbDetails,
    errorPsbSummary,
  } = useSelector(
    state => ({
      errorApplicants: state.applicants.error.errorApplicants,
      errorSelectedByAppointingAuth: state.personnelSelectionBoard.error.errorSelectedByAppointingAuth,
      errorEndorsedApplicants: state.applicants.error.errorEndorsedApplicants,
      errorShortlistedApplicants: state.applicants.error.errorShortlistedApplicants,
      errorPsbDetails: state.personnelSelectionBoard.error.errorPsbDetails,
      errorPsbSummary: state.personnelSelectionBoard.error.errorPsbSummary,
    })
  )

  // set active tab from toggling the navigation
  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  // get list of endorsed applicants
  useEffect(() => {
    if (showPublicationDetails) {
      dispatch(fetchApplicants(modalData.vppId))
      dispatch(fetchEndorsedApplicants(modalData.vppId))
      dispatch(fetchShortlistedApplicants(modalData.vppId))
      dispatch(fetchPsbDetails(modalData.vppId))
      dispatch(fetchPsbSummary(modalData.vppId))

      dispatch(fetchSelectedByAppointingAuth(modalData.vppId))
    }
  }, [showPublicationDetails])

  return (
    <>
      <Modal
        show={showPublicationDetails}
        onHide={handleClosePublicationDetails}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Publication Details</Modal.Title>
        </Modal.Header>

        {/* Error Notif */}
        {errorSelectedByAppointingAuth ? (
          <ToastrNotification
            toastType={"error"}
            notifMessage={errorSelectedByAppointingAuth}
          />
        ) : null}

        {errorApplicants ? (
          <ToastrNotification
            toastType={"error"}
            notifMessage={errorApplicants}
          />
        ) : null}

        {errorEndorsedApplicants ? (
          <ToastrNotification
            toastType={"error"}
            notifMessage={errorEndorsedApplicants}
          />
        ) : null}

        {errorShortlistedApplicants ? (
          <ToastrNotification
            toastType={"error"}
            notifMessage={errorShortlistedApplicants}
          />
        ) : null}

        {errorPsbDetails ? (
          <ToastrNotification
            toastType={"error"}
            notifMessage={errorPsbDetails}
          />
        ) : null}

        {errorPsbSummary ? (
          <ToastrNotification
            toastType={"error"}
            notifMessage={errorPsbSummary}
          />
        ) : null}

        <Modal.Body>
          <Row>
            <Col>
              {/* Tab Navigations */}
              <Nav tabs>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: activeTab === "1",
                    })}
                    onClick={() => {
                      toggle("1")
                    }}
                  >
                    Applied Applicants
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: activeTab === "2",
                    })}
                    onClick={() => {
                      toggle("2")
                    }}
                  >
                    Endorsed Applicants
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: activeTab === "3",
                    })}
                    onClick={() => {
                      toggle("3")
                    }}
                  >
                    Shortlisted Applicants
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: activeTab === "4",
                    })}
                    onClick={() => {
                      toggle("4")
                    }}
                  >
                    HRMPSB Details
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: activeTab === "6",
                    })}
                    onClick={() => {
                      toggle("6")
                    }}
                  >
                    HRMPSB Summary
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: activeTab === "5",
                    })}
                    onClick={() => {
                      toggle("5")
                    }}
                  >
                    Hired Applicants
                  </NavLink>
                </NavItem>
              </Nav>

              {/* Tab Contents */}
              <TabContent activeTab={activeTab} className="p-3 text-muted">
                {/* Applied Applicants */}
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <AppliedApplicants />
                    </Col>
                  </Row>
                </TabPane>

                {/* Endorsed Applicants */}
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <EndorsedApplicants />
                    </Col>
                  </Row>
                </TabPane>

                {/* Shortlisted Applicants */}
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <ShortlistedApplicants />
                    </Col>
                  </Row>
                </TabPane>

                {/* PSB Details */}
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <HrmpsbDetails />
                    </Col>
                  </Row>
                </TabPane>

                {/* PSB Summary */}
                <TabPane tabId="6">
                  <Row>
                    <Col sm="12">
                      <HrmpsbSummary />
                    </Col>
                  </Row>
                </TabPane>

                {/* Hired Applicants */}
                <TabPane tabId="5">
                  <Row>
                    <Col sm="12">
                      <HiredApplicants />
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            color="info"
            onClick={() => handleClosePublicationDetails()}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

PublicationDetails.propTypes = {
  showPublicationDetails: PropTypes.bool,
  handleClosePublicationDetails: PropTypes.func,
  modalData: PropTypes.object,
}

export default PublicationDetails