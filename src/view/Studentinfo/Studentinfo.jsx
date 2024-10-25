import React, { useEffect } from "react";
//import "../../assets/newjs/style.css"
import "../../assets/css/student-info/style.css"
import "../../assets/css/student-info/responsive.css"

const Studentinfo=()=>{
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: "instant" 
        });
      }, []);
    
  return(
        <div className="Studentinfo">
            <div className="page-content position-relative">
                <div className="breadcrumb-row">
                    <div className="container">
                        <ul className="list-inline">
                            <li><a href={'/'}>Home</a></li>
                            <li>Student Information </li>
                        </ul>
                    </div>
                </div>
            </div>
            <section className="Student-info">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className="imgSec">
                                {/* <img src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/student-info/student-baner.jpg" /> */}
                                <img src={`${window.IMG_BASE_URL}/student-banner.png`} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className="info-text">
                                <h1>STUDENT INFORMATION</h1>
                                <p>Students please insist on seeking a fees receipt for every payment. DAMS genuine fees receipts can only be in the following format:</p>
                                <h4>DAMS ERP Generated Fee Receipt:</h4>
                                <p>Student please be informed that any receipt other than, the ERP generated format and generated from DAMS ERP software is not valid and shall not be considered in case of any disputes or for any discounts and other benefits from DAMS in future. Also, after your enrolment please login to cloud.damsdelhi.com and check if your profile and personal details are correctly entered in our database.</p>
                                <p>Please note as a policy DAMS encourages students to pay using demand draft/pay in favor of Delhi Academy of Medical Sciences Pvt. Ltd. or DAMS Sky Pvt. Ltd. whichever applicable.</p>
                            </div>
                        </div>
                    </div>

                    <div className="dams-img">
                        <div className="row">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <div className="left-erp-generated">
                                    <h2>ERP Generated Reciept</h2>
                                    <p>The ERP generated receipt is the above format is the only valid receipt. Receipt is any other format / Manual receipts are INVALID and will not be Honoured.</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 reciptImg">
                                    <img src={`${window.IMG_BASE_URL}/receipt-img.png`} />
                            </div>
                        </div>
                    </div>
                    <div className="get-touch">
                        <a href={'https://api.whatsapp.com/send?phone=919899664533&amp;text=Hello,%20I%20have%20a%20question'} target="_blank">
                        <img src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/student-info/whats-app.png"/></a>
                    </div>
                </div>
            </section>
        </div>
  );
}
export default Studentinfo