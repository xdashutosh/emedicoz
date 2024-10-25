const EarnPoint = () => {
  return (
    <>
      <div className="paypoints_earn">
        <div className="row">
          <div className="col-9 col-sm-9 col-md-6 col-lg-6 col-xl-6">
            <ul>
              <li className="borderbg"></li>
              <li>Earn offer on purchase of course</li>
            </ul>
          </div>

          <div className="col-md-12 ug" style={{ display: "none" }}></div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 togglebtn1">
            <div className="special-reward">
              <div id="accordion_earn" className="accordion">
                <div className="card mb-0">
                  <div
                    className="card-header collapsed"
                    data-toggle="collapse"
                    href="#collapseOne_earn"
                  >
                    <a className="card-title">Earn Points </a>
                  </div>

                  <div
                    id="collapseOne_earn"
                    className="card-body collapse"
                    data-parent="#accordion_earn"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EarnPoint;
