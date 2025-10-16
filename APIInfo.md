# API Documentation

## Function Name
- **HTTP Method**: GET/POST
- **Endpoint**: /api/endpoint/path
- **Parameters**: [param1:type, param2?:type] or {json:structure} * a question marks for un-require?
- **Response**: {json:structure}

## Login
- **HTTP Method**: POST
- **Endpoint**: /api/user/Login
- **Parameters**: [id:string, pw:string]
- **Response**: {
    "userName": "string",
    "userID": "string"
  }

 ## PatientMainInfo
- **HTTP Method**: GET
- **Endpoint**: /api/patient/PatientMainInfo
- **Parameters**: [hn:string, ocm?:string]
- **Response**:   {
    "HN": "string",
    "ShowHN": "string",
    "PatName": "string",
    "Age": "string",
    "LastVisit": "string",
    "CurrentVist": "string"
  }