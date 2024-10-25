import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./view/Homepage/Index";
import OurTeam from "./view/OurTeam/OurTeam";
import About from "./view/About/About";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import CoursePlan from "./components/course/CoursePlan";
import Contactus from "./view/Contact/Cotactus";
import Career from "./view/Career/Career";
import Helpandsupport from "./view/Helpsupport/Helpandsupport";
import RaiseQuery from "./view/Helpsupport/RaiseQuery";
import QueueTicket from "./view/Helpsupport/QueueTicket";
import FindCenter from "./view/FindCenter/Findcenter";
import Franchise from "./view/Franchise/Franchise";
import Csr from "./view/CSR/Csr";
import Sitemap from "./view/Sitemap/Sitemap";
import Privacypolicy from "./view/PrivacyPolicy/Privacypolicy";
import Disclaimer from "./view/Disclaimer/disclaimer";
import Termsconditions from "./view/Termsconditions/Termsconditions";
import Newsandarticle from "./view/Newsandarticle/Newsandarticle";
import Educator from "./view/Educator/Educator";
import Studentinfo from "./view/Studentinfo/Studentinfo";
import Blogs from "./view/Blogs/Blogs";
import Eventlist from "./view/Event/Eventlist";
import Eventbooking from "./view/Event/Component/Eventbooking";
import PublishBook from "./view/PublishBook/PublishBook";
import PublishbookForm from "./view/PublishBook/PublishbookForm";
import EbookSale from "./view/MyBookSale/EbookSale";
import LiveQuiz from "./view/LiveQuiz/LiveQuiz";
import HostChallenge from "./view/LiveQuiz/HostChallenge";
import Eventcenter from "./view/Event/Component/Eventcenter";
import Cbtlist from "./view/Cbt/Cbtlist";
import TestInstruction from "./view/Cbt/TestInstruction";
import ProfileUpdate from "./view/Cbt/ProfileUpdate";
import SelectLocation from "./view/Cbt/SelectLocation";
import Mypayment from "./view/Mypayment/Mypayment";
import Myorder from "./view/Myorder/Myorder";
import MyAddress from "./view/MyAddress/MyAddress";
import UserReg from "./components/header/UserReg";
import Store from "./view/Ecommerce/Store";
import Detail from "./view/Ecommerce/Component/Details";
import ProductList from "./view/Ecommerce/Component/ProductList";
import QuickBuy from "./view/Ecommerce/Component/QuickBuySellAllList";
import BestSellingSell from "./view/Ecommerce/Component/BestSellingSeeAllList";
import SubCategory from "./view/Ecommerce/SubCategoryList";
import SubSubCategory from "./view/Ecommerce/SubSubCategoryList";
import SubCategoryProduct from "./view/Ecommerce/SubCategoryProductList";
import CategoryProductList from "./view/Ecommerce/CategoryProductList";
import Ovalpodcast from "./view/OvalwindowPodcast/Ovalpodcast";
import Sidebar from "./view/OvalwindowPodcast/components/Sidebar";
import CourseCategory from "./components/course/CourseCategory";
import CourseCategoryList from "./components/course/CourseCategoryList";
import AddNewAddress from "./view/MyAddress/component/AddNewAddress";
import EditNewAddress from "./view/MyAddress/component/EditNewAddress";
import NewsArticledetails from "./components/LatestNews/NewsArticledetails";
import Bookmarklist from "./view/BookMark/BookMark";
import ScoreCard from "./view/MyScorecard/ScoreCardList";
import MyCourse from "./view/Mycourse/MyCourse";
import Cart from "../src/view/Cart/Cart";
import TopperszoneList from "./view/TopperZone/TopperZoneList";
import CoursesDqb from "./view/Mycourse/CoursesDqb";
import DqbTestAll from "./view/Mycourse/Component/DqbTestAll";
import TestSeries from "./view/Mycourse/TestSeries";
import CourseDetail from "./view/Mycourse/CourseDetail";
import ClassSchedulesDetails from "./view/Mycourse/Component/ClassSchedulesDetails";
import RecordedSession from "./view/Mycourse/RecordedSession";
import RecordedTopic from "./view/Mycourse/RecordedTopic";
import ReferenceList from "./view/PublishBook/PublishReference";
import ProfileEditFile from "./components/ProfileEdit/EditProfile";
import TestHome from "./components/Test_Series/TestHome";
import TestPanel from "./components/Test_Series/TestPanel";
import TestResult from "./components/Test_Series/TestResult";
import PaymentSucess from "./view/Paymentstatus/PaymentSucess";
import TestHomeDQB from "./components/DailyQuiz/TestHomeDQB";
import TestPanelDQB from "./components/DailyQuiz/TestPanelDQB";
import TestResultDQB from "./components/DailyQuiz/TestResultDQB";
import PausedTestPanel from "./components/Test_Series/PausedTestPanel";
import TestHomeCHO from "./view/Mycourse/Component/TestHomeCHO";
import TestPanelCHO from "./view/Mycourse/Component/TestPanelCHO";
import TestResultCHO from "./view/Mycourse/Component/TestResultCHO";
import TestHomeDQ from "./view/Mycourse/Component/TestHomeDQ";
import TestResultDQ from "./view/Mycourse/Component/TestResultDQ";
import TestPanelDQ from "./view/Mycourse/Component/TestPanelDQ";
import PausedTestPanelDQ from "./view/Mycourse/Component/PausedTestPanelDQ";
import TestWait from "./view/Mycourse/TestWait";
import AllLounge from "./components/DoctorLounge/AllLounge";
/* new page add*/
import Lounge from "./components/DoctorLounge/Lounge";
import Ordertracking from "./view/Myorder/OrderTracking";
import Invoice from "./view/Myorder/Invoice";
import CbtComboList from "./view/Cbt/CbtComboList";
import CbtComboReport from "./view/Cbt/CbtComboReport";
import AdmitCard from "./view/Cbt/AdmitCard";
import AdmitCardDetail from "./view/Cbt/AdmitCardDetail";

import NursingHome from "./view/NursingTest/NursingHome";
import NursingPanel from "./view/NursingTest/NursingPanel";
import NursingResult from "./view/NursingTest/NursingResult";
import Scheduler from "./view/Mycourse/Scheduler";

import PausedNursingPanel from "./view/NursingTest/PausedNursingPanel";
import Nav from "./components/Navbar/Nav";
import { Attendence } from "../index";
import ReferEarn from "./view/Refer/ReferEarn";
import Cashrefund from "./view/Cart/CashRefund";

import ProfileNew from "./view/Profile/ProfileNew";
import Completed from "./view/Profile/Completed";
import AddCart from "./view/AddToCart/AddCart";
import CbtEnrolledSuccess from "./view/Paymentstatus/CbtEnrolledSuccess";
import PaymentFailed from "./view/Paymentstatus/PaymentFailed";
import ReferCongra from "./view/Refer/ReferCongra";
import ReferList from "./view/Refer/ReferList";

import Join from "./view/Affiliate/Join";

import { isDesktop, isMobile, isTablet } from "react-device-detect";
import SharedVideo from "./components/DoctorLounge/SharedVideo";
import SharedItem from "./view/Ecommerce/Component/SharedItem";
import AllDailyQuiz from "./components/DailyQuiz/new/AllDailyQuiz";
import Bookmarks from "./view/CustomQbank/Bookmarks";
import CustomQ from "./view/CustomQbank/CustomQ";
import ExamModeTest from "./view/CustomQbank/ExamModeTest";
import ExamModeResult from "./view/CustomQbank/ExamModeResult";
import RegModeTest from "./view/CustomQbank/RegModeTest";
import UpgradePlan from "./view/Mycourse/UpgradePlan";
import Performance from "./view/Performance/Performance";

import DamsDeck from "./view/Mycourse/DamsDeck";
import ReviewCard from "./view/Mycourse/Component/ReviewCard";
import AllCards from "./view/Mycourse/Component/AllCards";
import ReadCard from "./view/Mycourse/Component/ReadCard";
import DeckProgress from "./view/Mycourse/Component/DeckProgress";
import SubjectWiseCard from "./view/Mycourse/Component/SubjectWiseCard";
import SubjwiseProgress from "./view/Mycourse/Component/SubwiseProgress";
const Router = () => {
  const isauth = sessionStorage.getItem("id");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log(isMobile);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {isMobile ? (
            <Route exact path="/Completed" element={<Completed />}></Route>
          ) : (
            <Route
              exact
              path="/Completed"
              element={
                <Layout>
                  <Completed />
                </Layout>
              }
            ></Route>
          )}

          <Route
            exact
            path="/all-daily-quiz"
            element={
              <Layout>
                <AllDailyQuiz />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/join-affiliate"
            element={
              <Layout>
                <Join />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/refer-list"
            element={
              <Layout>
                <ReferList />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/refer-earn-successfully"
            element={
              <Layout>
                <ReferCongra />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/refer-earn"
            element={
              <Layout>
                <ReferEarn />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/scheduler"
            element={
              <Layout>
                <Scheduler setIsAuthenticated={setIsAuthenticated} />
              </Layout>
            }
          ></Route>

          <Route
            exact
            path="/"
            element={
              <Layout>
                <Homepage
                  setIsAuthenticated={setIsAuthenticated}
                  isAuthenticated={isAuthenticated}
                />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/our-team"
            element={
              <Layout>
                <OurTeam />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          ></Route>

          <Route
            exact
            path="/courseplan/:name"
            element={
              <Layout>
                <CoursePlan setIsAuthenticated={setIsAuthenticated} />
              </Layout>
            }
          />
          <Route
            exact
            path="/contact"
            element={
              <Layout>
                <Contactus />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/career"
            element={
              <Layout>
                <Career />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/course_category"
            element={
              <Layout>
                <CourseCategory setIsAuthenticated={setIsAuthenticated} />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/course-category-list"
            element={
              <Layout>
                <CourseCategoryList setIsAuthenticated={setIsAuthenticated} />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/help-and-support"
            element={
              <Layout>
                <Helpandsupport setIsAuthenticated={setIsAuthenticated} />
              </Layout>
            }
          ></Route>
          {isDesktop ? (
            <Route
              exact
              path="/raise-query/:id"
              element={isauth ? <RaiseQuery /> : <Navigate to="/" />}
            ></Route>
          ) : (
            <Route
              exact
              path="/raise-query/:id"
              element={<RaiseQuery />}
            ></Route>
          )}
          <Route exact path="/ticket/:id" element={<QueueTicket />}></Route>
          <Route
            exact
            path="/my-course"
            element={
              <Layout>
                <MyCourse />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/find_center"
            element={
              <Layout>
                <FindCenter />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/franchise-opportunity"
            element={
              <Layout>
                <Franchise />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/csr"
            element={
              <Layout>
                <Csr />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="sitemap"
            element={
              <Layout>
                <Sitemap />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="privacy-policy"
            element={
              <Layout>
                <Privacypolicy />
              </Layout>
            }
          ></Route>
          {/*for mobile use*/}
          <Route exact path="privacy" element={<Privacypolicy />}></Route>
          <Route
            exact
            path="privacy-policy-mobile"
            element={<Privacypolicy />}
          ></Route>
          <Route
            exact
            path="/disclaimer"
            element={
              <Layout>
                <Disclaimer />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/terms_conditions"
            element={
              <Layout>
                <Termsconditions />
              </Layout>
            }
          ></Route>
          {/*for mobile use*/}
          <Route
            exact
            path="/termsconditions"
            element={<Termsconditions />}
          ></Route>
          <Route
            exact
            path="/terms_conditions-mobile"
            element={<Termsconditions />}
          ></Route>
          {/*for mobile use*/}
          <Route
            exact
            path="/news-and-article"
            element={
              <Layout>
                <Newsandarticle />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/educator"
            element={
              <Layout>
                <Educator />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/Studentinfo"
            element={
              <Layout>
                <Studentinfo />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/blogs"
            element={
              <Layout>
                <Blogs />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/addToCart"
            element={
              isauth ? (
                <Layout>
                  <AddCart />
                </Layout>
              ) : (
                <Navigate to="/" />
              )
            }
          ></Route>
          <Route
            exact
            path="/event"
            element={
              <Layout>
                <Eventlist />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/eventcenter"
            element={
              <Layout>
                <Eventcenter />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/eventbooking"
            element={
              <Layout>
                <Eventbooking />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/publishbook"
            element={
              <Layout>
                <PublishBook />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/ebooksale"
            element={
              <Layout>
                <EbookSale />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/livequiz"
            element={
              <Layout>
                <LiveQuiz />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/myorder"
            element={
              <Layout>
                <Myorder />
              </Layout>
            }
          ></Route>
          <Route exact path="/invoice/:id" element={<Invoice />}></Route>
          <Route
            exact
            path="/myaddress"
            element={
              <Layout>
                <MyAddress />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/addnewaddress"
            element={
              <Layout>
                <AddNewAddress />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/editaddress"
            element={
              <Layout>
                <EditNewAddress />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/podcast"
            element={
              <Layout>
                <Ovalpodcast />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/sidebar"
            element={
              <Layout>
                <Sidebar />
              </Layout>
            }
          ></Route>

          <Route
            exact
            path="/hostChallenge"
            element={
              <Layout>
                <HostChallenge />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/publishbookform"
            element={
              <Layout>
                <PublishbookForm />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/cbt"
            element={
              <Layout>
                <Cbtlist />
              </Layout>
            }
          ></Route>

          <Route
            exact
            path="/cbt-instruction/:cbtid"
            element={
              <Layout>
                <TestInstruction />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/profile-update"
            element={
              <Layout>
                <ProfileUpdate />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/select-location"
            element={
              <Layout>
                <SelectLocation />
              </Layout>
            }
          ></Route>

          {isMobile || isTablet ? (
            <Route
              exact
              path="/profilenew/:id"
              element={<ProfileNew />}
            ></Route>
          ) : (
            <Route
              exact
              path="/profilenew/:id"
              element={
                <Layout>
                  <ProfileNew />
                </Layout>
              }
            ></Route>
          )}

          <Route
            exact
            path="/my-payment"
            element={
              <Layout>
                <Mypayment />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/user-registration"
            element={
              <Layout>
                <UserReg />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/store"
            element={
              <Layout>
                <Store />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/order-tracking"
            element={
              <Layout>
                <Ordertracking />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/product-detail"
            element={
              isauth ? (
                <Layout>
                  <Detail></Detail>
                </Layout>
              ) : (
                <Navigate to="/" />
              )
            }
          ></Route>
          {/* <Route
            exact
            path="/item/:id"
            element={
              <Layout>
                <SharedItem setIsAuthenticated={setIsAuthenticated}/>
              </Layout>
            }
          ></Route> */}
          <Route
            exact
            path="/product-list"
            element={
              <Layout>
                <ProductList />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/quick-buy"
            element={
              <Layout>
                <QuickBuy />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/best-selling"
            element={<BestSellingSell />}
          ></Route>
          <Route
            exact
            path="/sub-category"
            element={
              <Layout>
                <SubCategory />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/sub-sub-category"
            element={
              <Layout>
                <SubSubCategory />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/category-product"
            element={
              <Layout>
                <CategoryProductList />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/sub-category-product"
            element={
              <Layout>
                <SubCategoryProduct />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/topper-zone"
            element={
              <Layout>
                <TopperszoneList />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/news-article/:id"
            element={
              <Layout>
                <NewsArticledetails />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/my-course/course-dqb"
            element={
              <Layout>
                <CoursesDqb />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/dqb-test-all"
            element={
              <Layout>
                <DqbTestAll />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/bookmark"
            element={
              <Layout>
                <Bookmarklist />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/score-card/:id"
            element={
              <Layout>
                <ScoreCard />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/test-series"
            element={
              <Layout>
                <TestSeries />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/course-detail"
            element={
              <Layout>
                <CourseDetail />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/class-schedules-details"
            element={
              <Layout>
                <ClassSchedulesDetails />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/recorded-session"
            element={
              <Layout>
                <RecordedSession />
              </Layout>
            }
          ></Route>

          <Route
            exact
            path="/recorded-topic"
            element={
              <Layout>
                <RecordedTopic />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/reference-list"
            element={
              <Layout>
                <ReferenceList />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/edit_profile"
            element={
              <Layout>
                <ProfileEditFile />
              </Layout>
            }
          ></Route>

          <Route
            exact
            path="/cashrefund"
            element={
              <Layout>
                <Cashrefund />
              </Layout>
            }
          ></Route>

          {/* <Route
            exact
            path="/profilenew"
            element={
              <Layout>
                <ProfileNew />
              </Layout>
            }
          ></Route> */}

          <Route path="/test-home/:id" element={<TestHome />}></Route>
          <Route path="/test-home/dqb/:id" element={<TestHomeDQB />}></Route>
          <Route path="/test-home/cho/:id" element={<TestHomeCHO />}></Route>
          <Route path="/test-home/nur/:id" element={<NursingHome />}></Route>
          <Route path="/test-home/dq/:id" element={<TestHomeDQ />}></Route>
          <Route path="/test-panel/:id" element={<TestPanel />}></Route>
          <Route path="/test-panel/dqb/:id" element={<TestPanelDQB />}></Route>
          <Route path="/test-panel/cho/:id" element={<TestPanelCHO />}></Route>
          <Route path="/test-panel/nur/:id" element={<NursingPanel />}></Route>
          <Route path="/test-panel/dq/:id" element={<TestPanelDQ />}></Route>
          <Route
            path="/test-panel/paused/:id"
            element={<PausedTestPanel />}
          ></Route>

          <Route
            path="/test-panel/nur/paused/:id"
            element={<PausedNursingPanel />}
          ></Route>

          <Route
            path="/test-panel/dq/paused/:id"
            element={<PausedTestPanelDQ />}
          ></Route>
          <Route path="/testresult/dqb/:id" element={<TestResultDQB />}></Route>
          <Route path="/testresult/cho/:id" element={<TestResultCHO />}></Route>
          <Route path="/testresult/dq/:id" element={<TestResultDQ />}></Route>
          <Route path="/testresult/:id" element={<TestResult />}></Route>
          <Route path="/testwait/:id" element={<TestWait />}></Route>
          <Route path="/testresult/dq/:id" element={<TestResultDQ />}></Route>
          <Route path="/testresult/nur/:id" element={<NursingResult />}></Route>
          <Route path="/scheduler" element={<Scheduler />}></Route>
          <Route path="/sucess/:id" element={<PaymentSucess />} />
          <Route path="/sucess_cbt" element={<CbtEnrolledSuccess />} />

          <Route
            exact
            path="/all-lounge"
            element={
              <Layout>
                <AllLounge />
              </Layout>
            }
          ></Route>

          <Route exact path="video/:id" element={<SharedVideo />}></Route>

          <Route
            exact
            path="/lounge/:id"
            element={
              <Layout>
                <Lounge />
              </Layout>
            }
          ></Route>

          <Route path="/success/:id" element={<PaymentSucess />} />
          <Route path="/failed/:id" element={<PaymentFailed />} />
          <Route path="/sucess_cbt/:id" element={<CbtEnrolledSuccess />} />
          <Route
            exact
            path="/cbtcombo"
            element={
              <Layout>
                <CbtComboList />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/cbtcomboreport"
            element={
              <Layout>
                <CbtComboReport />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/admit-card"
            element={
              <Layout>
                <AdmitCard />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/admit-card-detail"
            element={
              <Layout>
                <AdmitCardDetail />
              </Layout>
            }
          ></Route>

          <Route
            exact
            path="/attendance"
            element={
              <Layout>
                <Attendence />
              </Layout>
            }
          ></Route>

          <Route
            exact
            path="/bookmarks"
            element={
              <Layout>
                <Bookmarks />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/performance"
            element={
              <Layout>
                <Performance />
              </Layout>
            }
          ></Route>

          <Route
            exact
            path="/custom-qbank"
            element={
              <Layout>
                <CustomQ />
              </Layout>
            }
          ></Route>
          <Route
            path="/plan/:id"
            element={
              <Layout>
                <UpgradePlan />
              </Layout>
            }
          ></Route>
          <Route
            path="/damsdeck"
            element={
              <Layout>
                <DamsDeck />
              </Layout>
            }
          ></Route>
          <Route
            path="/review-card"
            element={
              <Layout>
                <ReviewCard />
              </Layout>
            }
          ></Route>
          <Route
            path="/allcards/:id"
            element={
              <Layout>
                <AllCards />
              </Layout>
            }
          ></Route>
          <Route
            path="/readcard/:id"
            element={
              <Layout>
                <ReadCard />
              </Layout>
            }
          ></Route>
          <Route
            path="/deckprogress"
            element={
              <Layout>
                <DeckProgress />
              </Layout>
            }
          ></Route>
          <Route
            path="/subwise"
            element={
              <Layout>
                <SubjectWiseCard />
              </Layout>
            }
          ></Route>

          <Route
            path="*"
            element={
              <Layout>
                <Homepage
                  setIsAuthenticated={setIsAuthenticated}
                  isAuthenticated={isAuthenticated}
                />
              </Layout>
            }
          ></Route>

          <Route
            path="/subwise-progress"
            element={
              <Layout>
                <SubjwiseProgress />
              </Layout>
            }
          ></Route>

          <Route exact path="/exam-mode/:id" element={<ExamModeTest />}></Route>
          <Route exact path="/reg-mode/:id" element={<RegModeTest />}></Route>
          <Route exact path="/testresult" element={<ExamModeResult />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

function Layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <div>
      <Header
        setIsAuthenticated={setIsAuthenticated}
        isAuthenticated={isAuthenticated}
      />
      {children}
      <Footer setIsAuthenticated={setIsAuthenticated} />
    </div>
  );
}

export default Router;
