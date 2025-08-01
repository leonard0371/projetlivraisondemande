import React, { useEffect } from 'react';
import { RxCross1, RxHamburgerMenu } from 'react-icons/rx';
import "./SideNavComponent.scss"
import { useSelector } from 'react-redux';
import { CiUser } from 'react-icons/ci';
// import NavBar from './NavBar';
// import { navMenu } from '../../navMenu';
import { Nav } from 'rsuite';

const SideNavComponent = ({ width, setWidth, expanded, setExpanded, activeKey, setActiveKey }) => {
    // const PatientInfo = useSelector((e) => e.show.patientInformation);
    // const PracticePermission = useSelector((e) => e.show.practicePermissions);
    // const applicationUrl = process.env.REACT_APP_APPLICATION_URL;

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);

        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    //   const checkPermission = (data) => {
    //     var flag = false;
    //     if (data?.length > 0) {
    //       data?.forEach((obj) => {

    //         if (PracticePermission[obj]) {
    //           // console.log(PracticePermission, 'datadatadata p')
    //           // console.log(obj, 'datadatadata o')
    //           flag = true;
    //         }
    //       })
    //     }
    //     return flag;
    //   }
    useEffect(() => {
        if (width <= 900) {
            setExpanded(false);
        } else {
            setExpanded(true);
        }
        // console.log(width, expanded, 'dasdjkaldjkasldjask')
    }, [width]);


    return (
        <>

            <div className={`${expanded ? "sidebar-main-div " : "sideBarPadding"}`} style={{ backgroundColor: 'yellow' }}>

                {expanded &&

                    <div className='side-bar-container'>
                        {width <= 900 && expanded &&
                            <i className="d-flex justify-content-end p-2"
                                onClick={() => setExpanded(!expanded)}
                                eventKey="1">
                                <RxCross1 color="#3d848f" />
                            </i>
                        }

                        <span className="d-flex justify-content-center mt-2 mb-1">
                            {/* {PatientInfo?.ProfilePicturePath !== null &&
                PatientInfo?.ProfilePicturePath ? (
                <img
                  // src={applicationUrl + "/" + uploadFile?.data}
                  src={
                    PatientInfo?.ProfilePicturePath &&
                    applicationUrl + "/" + PatientInfo?.ProfilePicturePath
                  }
                  alt="Patient Profile "
                  className="patient-image-sidebar"
                />
              ) : (
            
                  <span className="d-flex justify-content-center mt-1 pt-1">
                    <CiUser color="#398ABF" className="patient-image-sidebar" />
                  </span>
                
              )} */}
                        </span>
                        {/* {PatientInfo && expanded && (
              <span className="d-flex justify-content-center  mb-3 patient-name-sidebar">
                {PatientInfo?.LastName + " " + PatientInfo?.Firstname}
              </span>
            )} */}
                        <div className='showSidebarMenu'>
                            <Nav
                                activeKey={activeKey}
                                onSelect={setActiveKey}>
                                <h6>H1</h6>
                                <h6>H2</h6>
                                <h6>H3</h6>

                            </Nav>
                        </div>

                    </div>}


            </div>


        </>
    )
}

export default SideNavComponent
