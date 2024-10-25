import React, { useEffect, useState } from 'react'
import axiosInstance from '../../API/axiosConfig';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import CreateTest from './CreateTest';
import "../../assets/css/bookmark/style.css";

const CustomQ = () => {
    const user_id = sessionStorage.getItem("id");
    const [qdata,setqdata]=useState(null);
    const navigate = useNavigate();
    useEffect(()=>{
        const checkqbank = async()=>{
            const res =await axiosInstance.post("/v1_data_model/courses/Custom_qbank/check_qbank",{"user_id":user_id})
            console.log(res);
            setqdata(res?.data?.data);
        }
        checkqbank();
    },[]);

    const ResultView = () => {
        try {
            const width = screen.availWidth;
            const height = screen.availHeight;
            const left = 0;
            const top = 0;
            const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;
            // Open the new window
            window.open(`/testresult`, "_blank", features);
          } catch (error) {
            console.log(error);
          }
       
      };
    const handleStartExam = (test_series_id)=>{
        
            try {
                const width = screen.availWidth;
                const height = screen.availHeight;
                const left = 0;
                const top = 0;
                const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;
                // Open the new window
                window.open(`/exam-mode/${user_id}t${test_series_id}`, "_blank", features);
              } catch (error) {
                console.log(error);
              }
    }

    const handleStartReg = (test_series_id)=>{
        
        try {
            const width = screen.availWidth;
            const height = screen.availHeight;
            const left = 0;
            const top = 0;
            const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;
            // Open the new window
            window.open(`/reg-mode/${user_id}t${test_series_id}`, "_blank", features);
          } catch (error) {
            console.log(error);
          }
}
    const handledelete =async(tid)=>{
        const res = await axiosInstance.post("/v1_data_model/courses/Custom_qbank/discard_qbank",{"user_id":user_id,"test_series_id":tid});
        window.location.reload();
    }
    
    if(qdata?.length==0)
    {
        return(
            <div className='customQBank'>
                <div className='container-fluid'>
                    <div>
                        <CreateTest/>
                    </div>
                </div>
            </div>
        )
    }
    else{
  return (
    <div className='customQBank'>
        <div className='container'>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Number of Subjects</th>
                            <th>Number of Topics</th>
                            <th>Number of Questions</th>
                            <th>Difficulty</th>
                            <th>Test Mode</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{qdata?.subjects}</td>
                            <td>{qdata?.topics}</td>
                            <td>{qdata?.no_of_question}</td>
                            <td>{qdata?.difficulty}</td>
                            <td>{qdata?.mode==1?"Exam mode":"Regular"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="custombtn">
                <Button style={{backgroundColor:'#1f1f1f',color:'white'}} onClick={()=>handledelete(qdata?.id)}>Delete and Create New Module</Button>
                {qdata?.test_result ?
                (
                <Button style={{backgroundColor:'#071952',color:'white'}} onClick={ResultView} >Review</Button>
                ): qdata?.mode==1?(
                    <Button style={{backgroundColor:'#071952',color:'white'}} onClick={()=>handleStartExam(qdata?.id)} >Start Test</Button>
                ):(<Button style={{backgroundColor:'#071952',color:'white'}} onClick={()=>handleStartReg(qdata?.id)} >Start Test</Button>)}
                
            </div>
        </div>
    </div>
  )
}
}

export default CustomQ