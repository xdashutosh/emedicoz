import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../API/axiosConfig'
const DamsDeck = () => {
  const user_id= sessionStorage.getItem("id");
  const [deckcards,setdeck]=useState([]);
    useEffect(()=>{
      const getdata = async()=>{
        const res = await axiosInstance.post("/v1_data_model/flashcard/flashcard/deck",{"user_id":user_id});
        console.log(res?.data?.data);
        setdeck(res?.data?.data);
      }
      getdata();
    },[user_id])
  return (
    <div className='Damsdeck'>
        <div className="page-content position-relative">
            {/* <div className="breadcrumb-row">
                <div className="container">
                    <ul className="list-inline">
                        <li><a href={'/'}>Home</a></li>
                        <li>Dams Deck </li>
                    </ul>
                </div>
            </div> */}
        </div>
          <div className='container'>
            <div className='Boxdata'>
              <div className='BoxInner'>
                {/* <img src='https://i.ibb.co/K62WtDV/newCard.png' alt='new card' /> */}
               
                {/* <img src={Newcard} /> */}
                <img src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/newCard.png" alt="" />

                <h4>New Card</h4>
              </div>
              <Link to={'/review-card'}>
                <div className='BoxInner'>
                  {/* <img src='https://static.thenounproject.com/png/20461-200.png' alt='review card' /> */}
                  <img src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/Cardreview.png" alt="" />
                  <h4>Review Card</h4>
                </div>
              </Link>
            </div>
            <div className='bottomBtn'>
                <button >Randomize Cards</button>
                <Link to={'/allcards/1'}>
                  <button >All Cards</button>
                </Link>
                <Link to={'/allcards/2'} >
                  <button>Bookmarked Card</button>
                </Link>
                <Link to={'/allcards/3'}>
                  <button>Suspended Card</button>
                </Link>
                <Link to="/deckprogress">
                  <button>My Progress</button>
                </Link>
            </div>

            <div className='notFoundImg'>
              {deckcards?.length>0?deckcards?.map((card,i)=>(
                <div>
                  <img src={card?.image} style={{height:'50px',width:'50px'}} alt='banner'/>
                  <h4>{card?.title}</h4>
                </div>
              )):(
                <div className="notFoundtext">
                  <img src='https://i.pinimg.com/originals/ae/8a/c2/ae8ac2fa217d23aadcc913989fcc34a2.png' alt='nocard' />
                  <h1>No Card Found!</h1>
                </div>
              )}
            </div>
        </div>
        
    </div>
  )
}

export default DamsDeck