import { Button } from "antd";
import React, { useEffect, useState } from "react";
import "../../assets/css/home-page/style.css";
import axiosInstance from "../../API/axiosConfig";

const Faculties = () => {
  const [specialist, setSpecialist] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [tabValue, setTabValue] = useState("");

  const getListHandler = async () => {
    try {
      const { data } = await axiosInstance.post("/v1_data_model/getFaculties");
      setSpecialist(data?.data?.specialist);
      setTabValue(data?.data?.specialist[0].faculties_type);
    } catch (error) {
      console.log(error);
    }
  };

  const getFacultiesHandler = async () => {
    try {
      const { data } = await axiosInstance.post("/v1_data_model/getFaculties", {
        faculties_type: tabValue,
      });

      const sortedFacultyData = [...data?.data?.faculties].sort(
        (a, b) => a.image_position - b.image_position
      );
      // console.log(data?.data?.faculties)
      setFaculties(sortedFacultyData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListHandler();
  }, []);

  useEffect(() => {
    if (Object.keys(tabValue).length > 0) {
      getFacultiesHandler();
    }
  }, [tabValue]);

  return (
    <>
      <section className="Facsectiondata">
        <div className="container">
          <div className="tabData">
            {specialist.map((itm, i) => (
              <Button
                key={i}
                onClick={() => setTabValue(itm.faculties_type)}
                style={{
                  background:
                    itm.faculties_type === tabValue ? "#071952" : "#eee",
                  color: itm.faculties_type === tabValue ? "#fff" : "#757575",
                }}
              >
                {itm.faculties_type}
              </Button>
            ))}
          </div>

          <div className="facltyData">
            {faculties.length < 1 && <p>No Data</p>}
            <div className="groupdata">
              {faculties?.map((itm, i) => (
                <div className="imgwidth" key={i}>
                  <img src={itm?.image_url} alt={itm?.faculties_name} />
                  <div className="titleText">
                    <h3>{itm?.faculties_name}</h3>
                    <p>{itm?.specialist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Faculties;
