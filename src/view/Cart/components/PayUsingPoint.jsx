const PayUsingPoint = () => {
  return (
    <>
      <div className="paypoints">
        <div className="row">
          <div className="col-9 col-sm-9 col-md-6 col-lg-6 col-xl-6">
            <ul>
              <li className="borderbg"></li>
              <li>
                Pay using points{" "}
                <span className="d-block balpo" id="available_point_display">
                  Balance Coins 0
                </span>
              </li>
              <input
                type="hidden"
                name="available_point"
                id="available_point"
                value="0"
              />
              <input
                type="hidden"
                name="one_point_in_rupee"
                id="one_point_in_rupee"
                value="0.01"
              />
            </ul>
          </div>
          <div className="col-3 col-sm-3 col-md-6 col-lg-6 col-xl-6 text-right">
            <label className="switch">
              <input type="checkbox" name="paycoin" id="paycoin" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="col-md-12 ug" style={{ display: "none" }}></div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 togglebtn">
            <div className="special-reward">
              <div id="accordion" className="accordion">
                <div className="card mb-0">
                  <div
                    className="card-header collapsed"
                    data-toggle="collapse"
                    href="#collapseOne"
                  >
                    <a className="card-title">Special Rewards </a>
                  </div>
                  <div
                    id="collapseOne"
                    className="card-body collapse"
                    data-parent="#accordion"
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
export default PayUsingPoint;
