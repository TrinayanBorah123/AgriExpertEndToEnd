import "../ComponentsAdmin/UnSolQues.css";
import SidebarAdmin from "../Sidebar/Sidebar";
import SearchBox from "./Search";
import Table from "../Table/Table";
import Services from '../../Shared/HttpRequests';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"

const UnsolvedQuestionscolumns = [
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
        width: 180,
        editable: true
    },
    {
        field: "questionsTopicVariety",
        headerName: "Variety",
        width: 180,
        editable: true
    },
    {
        field: "questionTopicName",
        headerName: "Topic",
        width: 180,
        editable: true
    },
];

const UnSolved = () => {
    const navigate = useNavigate();
    const [serverResponse, setserverResponse] = useState([]);
    const [isLoaded, setisLoaded] = useState(false);
    useEffect(() => {
        validateAuthToken();
    }, []);
    const validateAuthToken = () => {
        const token = sessionStorage.getItem('authToken')
        const authToken = !!token
        if (authToken) {
            fetchResponse();
        } else {
            navigate(`/admin`)
        }
    }
    const fetchResponse = async () => {
        const token = sessionStorage.getItem("authToken");
        let authTokenURL = await Services.authConfigurations.getAuthURL('/question', token)
        let data = await Services.questionConfigurations.getAllQuestions(authTokenURL);
       
        if (data == 401 || data == 400 || data == 500) {
            sessionStorage.clear()
            navigate(`/admin`)
        } else {
            data = data.map(value => {
                if (value.questionStatus == "NotAnswered")
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
            setisLoaded(true);
        }
    }
    const handleRowSeleted = (flag) => {
        setState({
            ...state,
            oneRowSelected: flag,
        })
    }
  return (
      isLoaded ?<div className="Dashboard">
      <div className="AppGlass">
              <SidebarAdmin />
              <div>
                  <Table columns={UnsolvedQuestionscolumns} data={serverResponse} role={"Admin"} tab={"Unsolved"} rowSeleted={handleRowSeleted} />
        </div>
      </div>
    </div>:<></>
  );
};

export default UnSolved;
