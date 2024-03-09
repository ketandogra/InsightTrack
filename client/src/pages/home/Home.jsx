import { Col, Container, Row } from 'reactstrap'
import'./home.scss'
import InfoSide from '../../components/infoSide/InfoSide'
import MonitoringSide from "../../components/monitoringSide/MonitoringSide"
import AutoRefresh from '../../components/autoRefresh/AutoRefresh'

const Home = () => {

  return (
    <div className="home">
        <Container>
            <Row>
                <Col lg='4' md='12' className="infoWrapperSide">
                <AutoRefresh/>
                    <InfoSide/>
                </Col>
                <Col lg='8' md='12' className="monitoringWrapperSide">
                <AutoRefresh/>
                  <MonitoringSide />
                </Col>

            </Row>
        </Container>
    </div>
  )
}

export default Home