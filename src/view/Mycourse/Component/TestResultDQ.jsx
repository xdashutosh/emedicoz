

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../API/axiosConfig';

const TestResultDQ = ({getdata}) => {


  const { id } = useParams();
 const user_id = id.split("s")[0];
 const test_segment_id = id.split("s")[1];

const [sol,setsol] = useState(null);
const [questions,setque] = useState([]);
const [chosenOptions,setchos]= useState(null);
const [testid,settestid]=useState(null);



useEffect(() => {

  const getResult = async()=>{
    const response = await axiosInstance.post(`/v1_data_model/courses/Test_series/get_test_series_basic_result_qbank`,{test_segment_id:test_segment_id,user_id:user_id});
    console.log("resultttttttttt",response.data.data);
    settestid(response?.data?.data?.test_series_id);
    setchos(response?.data.data?.question_dump);
    console.log(response?.data.data?.question_dump);

    const response1 = await axiosInstance.post(
      `https://d85g0bvcnm0si.cloudfront.net/v1_data_model/courses/test_series/get_test_series_with_id_app/`,
      { user_id: user_id, test_series_id: response?.data?.data?.test_series_id }
    );
    console.log("solutionsss",response1.data.data);
    setsol(response1?.data?.data);
    setque(response1?.data?.data?.question_bank);

  }

  getResult();
 
  
}, [])


if (questions) {
  questions.forEach(question => {
    const chosenOption = chosenOptions.find(option => option.question_id == question.id);
    if (chosenOption) {
      question.choosed_option = chosenOption.answer;
    } else {
      question.choosed_option = null;
    }
  });
}
console.log(questions);


  return (
    <div className='container' style={{paddingTop:'20px'}}>

    <section className="solutionTab">
      <div className="">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="questionHead">
              <h2>{sol?.basic_info?.test_series_name}</h2>
              <h3> Question Wise Report</h3>
            </div>

            {questions?.map((data,index)=>(
              <div className="questionBox">
 <h4><b>Question:</b> {index+1}<div dangerouslySetInnerHTML={{ __html: data.question }} /></h4>
 <div className="questionMid">
   <div className="list-group">
     <a href="javascriptvoid:(0)" className="list-group-item list-group-item-action"   style={{ backgroundColor: (data.choosed_option ==1) ? 'skyblue' : (data.answer ==1 ? '#90EE90' : 'white') }}><span className="qsnNumbr">A</span>{data.option_1}</a>
     <a href="javascriptvoid:(0)" className="list-group-item list-group-item-action" style={{ backgroundColor: (data.choosed_option ==2) ? 'skyblue' : (data.answer ==2 ? '#90EE90' : 'white') }}><span className="qsnNumbr">B</span>{data.option_2}</a>
     <a href="javascriptvoid:(0)" className={`list-group-item list-group-item-action`} style={{ backgroundColor: (data.choosed_option ==3) ? 'skyblue' : (data.answer ==3 ? '#90EE90' : 'white') }}><span className="qsnNumbr rigthqsn">C</span>{data.option_3}</a>
     <a href="javascriptvoid:(0)" className="list-group-item list-group-item-action" style={{ backgroundColor: (data.choosed_option ==4) ? 'skyblue' : (data.answer ==4 ? '#90EE90' : 'white') }}><span className="qsnNumbr">D</span>{data.option_4}</a>
   </div>
   <h5>{data.correct_attempt_percentage}% People got this right</h5>
   <h6><span className="fontExp">Explanation:</span>
    
    <div dangerouslySetInnerHTML={{ __html: data.description }} />
   </h6>
 </div>
</div>
            ))}
           
          </div>
        </div>
      </div>
    </section>
            </div>
  )
}

export default TestResultDQ
