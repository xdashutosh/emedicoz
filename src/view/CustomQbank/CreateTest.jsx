import { Button, Radio } from 'antd';
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../API/axiosConfig';
import "../../assets/css/bookmark/style.css";

const CreateTest = () => {
    const [noque, setnoque] = useState(10);
    const [level, setlevel] = useState("1,2,3");
    const [from, setfrom] = useState(1);
    const [step, setstep] = useState(1);
    const [allselected, setallselected] = useState(true);
    const [allsub, setallsub] = useState([]);
    const [visibleSubjectId, setVisibleSubjectId] = useState(null);
    const course_id =localStorage.getItem("course_Id");
    console.log(step);
    const user_id = sessionStorage.getItem("id");

    const [selectedIds, setSelectedIds] = useState('');
    const [myselectid, setmyselectid] = useState('');
    const [myselectid1, setmyselectid1] = useState('');
    const [topid, settopid] = useState('');
    const [mode,setmode]=useState(1);

    const getAllTopicIds = (subjects) => {
        // Flatten all topic IDs into a single array
        const allTopicIds = subjects.flatMap(subject => 
          subject.topics.map(topic => topic.id)
        );
      
        // Join the IDs into a comma-separated string
        return allTopicIds.join(',');
      };

    useEffect(() => {
        const getsubjects = async () => {
            const res = await axiosInstance.post("/v1_data_model/courses/Custom_qbank/get_qbank_subject_v2", { "user_id": user_id });
            console.log(res);
            setallsub(res?.data?.data);
           
            const allIds = res?.data?.data?.map(subject => subject.id).join(',');
            const alltopid = res?.data?.data?.map(subject => subject.topicid).join(',');
            setSelectedIds(allIds);
            settopid(alltopid)
            console.log(allIds)
        }
        getsubjects();
        // When the component mounts, check all checkboxes and store their IDs

    }, [allselected]);

    console.log(selectedIds)

    const handleCheckboxChange1 = (id) => {
        setmyselectid(prev => {
            if (!prev) {
                // If `prev` is empty, just return the `id` as the first value
                return id;
            }
            const idsArray = prev.split(',');
            if (idsArray.includes(id)) {
                // Remove the ID if it's already in the list
                return idsArray.filter(item => item !== id).join(',');
            } else {
                // Add the new ID
                return [...idsArray, id].join(',');
            }
        });
    };

    const handleCheckboxChange2 = (id) => {
        setmyselectid1(prev => {
            if (!prev) {
                // If `prev` is empty, just return the `id` as the first value
                return id;
            }
            const idsArray = prev.split(',');
            if (idsArray.includes(id)) {
                // Remove the ID if it's already in the list
                return idsArray.filter(item => item !== id).join(',');
            } else {
                // Add the new ID
                return [...idsArray, id].join(',');
            }
        });
    };


    const handleCheckboxChange = (id, tid) => {
        setSelectedIds(prev => {
            if (!prev) {
                return id;
            }
            const idsArray = prev.split(',');
            if (idsArray.includes(id)) {
                return idsArray.filter(item => item !== id).join(',');
            } else {
                return [...idsArray, id].join(',');
            }
        });
    
        settopid(prev => {
            if (!prev) {
                return tid;
            }
            const idsArray = prev.split(',');
            if (idsArray.includes(tid)) {
                return idsArray.filter(item => item !== tid).join(',');
            } else {
                return [...idsArray, tid].join(',');
            }
        });
    };
    

    const handleSeeTopics = (subjectId, topics) => {

        setVisibleSubjectId(prev => (prev === subjectId ? null : subjectId));
        // const allIds = ?.map(subject => subject.id).join(',');

    };

    console.log("subjects--",myselectid);
    console.log("topics--",myselectid1);

    const handleCreate = async()=>{
        if(allselected)
        {
            const res = await axiosInstance.post("/v1_data_model/courses/Custom_qbank/create_qbank",{"user_id":user_id,"no_of_ques":noque,"defficulty_lvl":level,"ques_from":from,"subject":selectedIds,"topics":getAllTopicIds(allsub),"mode":mode,"tags":"","course_id":course_id.slice(1,-1)});
            console.log(res);
            window.location.reload();
        }
        else{
            const res = await axiosInstance.post("/v1_data_model/courses/Custom_qbank/create_qbank",{"user_id":user_id,"no_of_ques":noque,"defficulty_lvl":level,"ques_from":from,"subject":myselectid,"topics":myselectid1,"mode":mode,"tags":"","course_id":course_id.slice(1,-1)});
        console.log(res);
        window.location.reload();

        }
        
    }

    

    return (
        <div className='customQBank'>
            <div className='container'>
                <div className="qbankInner">
                    {step == 1 &&
                        (<div className="qbankChild">
                            {/* <h3 style={{marginTop:'5px'}}>Create Custom Test</h3> */}
                            <div >
                                <h6>No. of Questions:</h6>
                                <select style={{ borderRadius: '8px' }}  onChange={(e) => setnoque(e.target.value)} >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>

                            <div style={{ marginTop: '25px' }}>
                                <h6>Difficulty Level:</h6>
                                <select style={{ borderRadius: '8px' }}  onChange={(e) => setlevel(e.target.value)} >
                                    <option value={"1,2,3"}>All</option>
                                    <option value={1}>Easy</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>Hard</option>
                                </select>
                            </div>

                            <div style={{ marginTop: '25px' }}>
                                <h6>Question From:</h6>
                                <select style={{ borderRadius: '8px' }}  onChange={(e) => setfrom(e.target.value)} >
                                    <option value={1}>All Qbank MCQs</option>
                                    <option value={2}>Bookmarked QBank MCQs</option>
                                    <option value={3}>Incorrect qBank MCQs</option>
                                    <option value={4}>Attempted QBank MCQs</option>
                                    <option value={5}>UnAttempted QBank MCQs</option>
                                    <option value={6}>Previous Year QBank MCQs</option>

                                </select>
                            </div>
                        </div>)
                    }

                    {
                        step == 2 &&
                        (

                            <div className="groupbtndata">
                                <div className="btndataset">
                                    <button onClick={() => setallselected(true)} style={{ backgroundColor: allselected ? "orange" : '#fff' }} >All Subjects</button>
                                    <button  onClick={() => setallselected(false)} style={{ backgroundColor: allselected ? "white" : 'orange' }} >Select Subjects</button>
                                </div>
                                {/* <h3 style={{marginTop:'5px'}}>Create Custom Test</h3> */}

                                {
                                    allselected ? (<div className='allSelectedData'>
                                        {allsub?.map(subject => (<div className='allSubMap'>
                                            <div className='allSubInner'  key={subject.id}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds?.includes(subject?.id)}
                                                    onChange={() => handleCheckboxChange(subject?.id, subject?.topicid)}
                                                />
                                                <span className="selectName">{subject.name}</span>
                                                <button className="btndefinedata" onClick={() => handleSeeTopics(subject.id, subject.topics)}>
                                                    {visibleSubjectId === subject.id ? 'Hide Topics' : 'See Topics'}
                                                </button>
                                            </div>

                                            {visibleSubjectId === subject.id ? (
                                                <div className='leftData'>
                                                    {subject?.topics.map((top) => (
                                                        <div className='allSubInner' key={top.id}>
                                                            <input
                                                                type="checkbox"
                                                                checked={topid.includes(top.subject_id)}

                                                            //  onChange={() => handleCheckboxChange3(top.id)} 
                                                            />
                                                            <span className="selectName">{top.topic}</span>

                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (<></>)}

                                        </div>

                                        ))}


                                    </div>) :

                                        (<div className='allSelectedData'>

                                            {allsub?.map(subject => (
                                                <div className='allSubMap'>
                                                    <div className='allSubInner' key={subject.id} >
                                                        <input 
                                                            type="checkbox"
                                                            checked={myselectid.includes(subject.id)}
                                                            onChange={() => handleCheckboxChange1(subject.id)}
                                                        />
                                                        <span className="selectName" >{subject.name}</span>
                                                        <button className="btndefinedata"  onClick={() => handleSeeTopics(subject.id, subject.topics)}>
                                                            {visibleSubjectId === subject.id ? 'Hide Topics' : 'See Topics'}
                                                        </button>
                                                    </div>

                                                    {visibleSubjectId === subject.id ? (
                                                <div className='allSelectedData1'>
                                                    {subject?.topics.map((top) => (
                                                        <div className='allSubInner' key={top.id}>
                                                            <input
                                                                type="checkbox"
                                                                checked={myselectid1.includes(top.id)}
                                                                onChange={() => handleCheckboxChange2(top.id)}
                                                            
                                                            />
                                                            <span className="selectName">{top.topic}</span>

                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (<></>)}
                                                </div>
                                            ))}

                                        </div>)
                                }



                            </div>
                        )
                    }

                    {
                        step ==3 && (
                            <div className='choosepredata'>
                                <h4>Choose Your Preferences</h4>
                                <h6>Select Mode:</h6>
                                <div className='examModeData'>
                                    <div className='modeInner' >
                                        <h5>Exam Mode</h5>
                                        <p>Review answer only after completing the module</p>
                                    </div>
                                    <input checked={mode==1} onChange={()=>setmode(1)}  type='checkbox' value={1}/>
                                </div>
                                <div className='examModeData'>
                                    <div className='modeInner'>
                                        <h5>Regular</h5>
                                        <p>See answer and explanations after solving each MCQ</p>
                                    </div>
                                    <input checked={mode==2} onChange={()=>setmode(2)}  type='checkbox' value={2}/>
                                </div>
                            </div>
                        )
                    }

                    <div className="bottomNext">
                        {step != 1 && (
                            <Button style={{ backgroundColor: '#071952', color: 'white' }} onClick={() => setstep(prev => prev - 1)} >Prev</Button>
                        )}
                        {
                            step<3 ?(

                                <Button style={{ backgroundColor: '#071952', color: 'white' }} onClick={() => setstep(prev => prev + 1)}>Next</Button>
                            ):(
                                <Button style={{ backgroundColor: '#071952', color: 'white' }} onClick={handleCreate}>Create Test</Button> 
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateTest