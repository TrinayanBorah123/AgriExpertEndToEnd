import SidebarCus from "../SidebarCustomer/SidebarCus.jsx";
import "../ComponentsCustomer/solquescus.css";
import Services from '../../Shared/HttpRequests';
import Table from "../../DashboardAdmin/Table/Table";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"

const SolvedQuestionscolumns = [
    { field: "id", headerName: "Question ID", width: 180 },
    {
        field: "questionContext",
        headerName: "Question Title",
        width: 200,
        editable: true
    },
    {
        field: "questionStatus",
        headerName: "Status",
        width: 150,
        editable: true
    },
    {
        field: "questionAnswer",
        headerName: "Answer",
        width: 180,
        editable: true
    },
    {
        field: "questionTopicName",
        headerName: "Topic",
        width: 180,
        editable: true
    },
    {
        field: "answeredBy",
        headerName: "Assigned To(Expert)",
        width: 180,
        editable: true
    },
];
const SolQuesCus = () => {
    const navigate = useNavigate();
    const [serverResponse, setserverResponse] = useState([]);
    const [expertData, setexpertData] = useState([]);
    const [isLoaded, setisLoaded] = useState(false);
    useEffect(() => {
        //validateAuthToken();
        fetchResponse()
    }, []);
    const validateAuthToken = () => {
        const token = sessionStorage.getItem('authExpertToken')
        const authToken = !!token
        if (authToken) {
            fetchResponse();
        } else {
            navigate(`/expertsignin`)
        }
    }
    const fetchResponse = async () => {
        //const token = sessionStorage.getItem("authExpertToken");
        //const expertId = sessionStorage.getItem("expertlLoggedInId");
        //let authTokenURL = await Services.authConfigurations.getAuthURL(`/question/expert/${expertId}`, token)
        //let data = await Services.questionConfigurations.getAllQuestionsWithExpertID(expertId, authTokenURL);
        let data = await Services.questionConfigurations.getAllQuestionsWithCustomerID('81cd9a99-60ca-44b2-8438-5611a72dc50d', '');
        console.log(data)
        if (data == 401 || data == 400 || data == 500) {
            sessionStorage.clear()
            navigate(`/signup`)
        } else {
            data = data.map(value => {
                if (value.questionStatus == "Answered")
                    return value;
            })

            let len = data.length;
            for (let i = 0; i <= len; i++) {
                var myIndex = data.indexOf(undefined);
                if (myIndex !== -1) {
                    data.splice(myIndex, 1);
                }
            }
            setserverResponse(data);
            //let authTokenExpertURL = await Services.authConfigurations.getAuthURL(`/customer/81cd9a99-60ca-44b2-8438-5611a72dc50d`, token);
            //let expertData = await Services.expertConfigurations.getExpertData(expertId, authTokenExpertURL);
            //setexpertData(expertData);
            setisLoaded(true);
        }
    }
  return (
      isLoaded ?<div className="Dashboard">
      <div className="AppGlass">
        <SidebarCus />
              <div> <Table columns={SolvedQuestionscolumns} data={serverResponse} role={"Customer"} tab={"Solved"} expertData={expertData} /></div>
        <div></div>
      </div>
    </div>:<></>
  );
};

export default SolQuesCus;
