import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchFunctionalCompetencies } from "store/actions"
import { Can } from "casl/Can"
import { Navigate } from "react-router-dom"

import { Card, CardBody, Col, Container, Row } from "reactstrap"
import InRowAction from "components/InRowAction/InRowAction"
import EditCompetencyModelModal from "components/Modal/Competency/EditCompetencyModelModal"
import TableCompetencyModel from "components/Table/TableCompetencyModel"
import { SelectColumnFilter } from "components/Filters/SelectColumnFilter"
import Breadcrumbs from "components/Common/Breadcrumb"
import LoadingIndicator from "components/LoaderSpinner/LoadingIndicator"
import ToastrNotification from "components/Notifications/ToastrNotification"

// style
import "styles/custom_gscwd/global.scss"

const FunctionalModels = () => {
  const dispatch = useDispatch()

  const tblColumns = [
    {
      Header: "ID",
      accessor: "competencyId",
      disableGlobalFilter: true,
    },
    {
      Header: "Occupation",
      accessor: "occupationCode",
      Filter: SelectColumnFilter,
      filter: "includes",
    },
    {
      Header: "Code",
      accessor: "code",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Definition",
      accessor: "desc",
    },
    {
      Header: "Actions",
      disableGlobalFilter: true,
      Cell: function ActionDropdown(cell) {
        return <InRowAction cell={cell} editCompetencyModel={editModal} />
      },
    },
  ]

  const { functionalModels, isLoading, error } = useSelector(state => ({
    functionalModels: state.competencyModel.functionalModels,
    isLoading: state.competencyModel.loading.loadingFunctionalModels,
    error: state.competencyModel.error.errorFunctionalModels,
  }))

  const columns = useMemo(() => tblColumns, [])
  const functionalModelData = useMemo(
    () => functionalModels,
    [functionalModels]
  )

  useEffect(() => {
    dispatch(fetchFunctionalCompetencies())
  }, [dispatch])

  /**
   * Modal
   */
  const [modalData, setModalData] = useState({})

  // Edit Modal
  const [showEdt, setShowEdt] = useState(false)

  const handleCloseEdt = () => setShowEdt(false)
  const handleShowEdt = () => setShowEdt(true)

  const editModal = rowData => {
    setModalData(rowData)
    handleShowEdt()
  }

  return (
    <React.Fragment>
      <Can I="access" this="Competency_models">
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title="Model"
              breadcrumbItem="Functional Competency Models"
            />
            <Container fluid={true}>
              <Row>
                <Col>
                  <Card className="card-table tabular">
                    <CardBody>
                      {error ? (
                        <ToastrNotification
                          toastType={"error"}
                          notifMessage={error}
                        />
                      ) : null}

                      {isLoading ? (
                        <LoadingIndicator />
                      ) : (
                        <TableCompetencyModel
                          columns={columns}
                          data={functionalModelData}
                        />
                      )}

                      <EditCompetencyModelModal
                        showEdt={showEdt}
                        modalData={modalData}
                        handleCloseEdt={handleCloseEdt}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </Can>

      <Can not I="access" this="Competency_models">
        <Navigate to="/page-404" />
      </Can>
    </React.Fragment>
  )
}

export default FunctionalModels
