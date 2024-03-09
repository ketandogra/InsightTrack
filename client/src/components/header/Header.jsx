import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import "./header.scss";
import CheckForm from "../checkForm/CheckForm";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(true);
  const [isOpened, setIsOpended] = useState(false);
  const [isHome, setIsHome] = useState(
    location.pathname.startsWith("/history") ? false : true
  );
  const [formType, setFormType] = useState("");
  const navList = [{ id: 1, name: "Home", link: "/" }];
  useEffect(() => {
    setIsHome(location.pathname.startsWith("/history") ? false : true);
  }, [location.pathname]);

  const handleForm = (e) => {
    setIsOpended(!isOpened);
    const value = e.target.name;
    if (value == "editService") {
      setFormType("editService");
    } else if (value == "maintenance") {
      setFormType("maintenance");
    } else {
      setFormType("addService");
    }
  };
  return (
    <>
      {isOpened && (
        <div className="formWrapper">
          <CheckForm
            isOpened={isOpened}
            setIsOpended={setIsOpended}
            formType={formType}
          />
        </div>
      )}
      {isHome && (
        <div className="header">
          <Container>
            <Row>
              <div className="headerWrapper">
                <h1>Monitoring Dashboard</h1>
                <img
                  src="https://www.ensemblehp.com/wp-content/uploads/2022/09/EnsembleLogo_Reversed-300x65.png"
                  alt=""
                  srcset=""
                />
              </div>
            </Row>
          </Container>
        </div>
      )}
      <div className="navbar">
        <Container lg="12">
          <Row>
            <div className="navwrapper">
              <div className="navLeft">
                {navList.map((item, id) => {
                  return (
                    <>
                      <div key={id}>
                        <Link to={item.link}>
                          <span>{item.name}</span>
                        </Link>
                      </div>
                    </>
                  );
                })}
              </div>
              <div className="navRight">
                {/* <button className="button">Sign in to your account</button> */}
                {location.pathname.startsWith("/history") ? (
                  <>
                    <button
                      className="button"
                      onClick={handleForm}
                      name="editService"
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </button>
                    <button
                      className="button"
                      name="maintenance"
                      onClick={handleForm}
                    >
                      Schedule Maintenance
                    </button>
                  </>
                ) : (
                  isAuth && (
                    <button
                      className="button"
                      name="addService"
                      onClick={handleForm}
                    >
                      Add new check
                    </button>
                  )
                )}
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Header;
