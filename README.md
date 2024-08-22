# Finance Advisor Documentation

## Content

1. Description
2. Technical requirements
3. Base URL
4. API Documentation
5. Install
6. Run

---

## Description

This project is a finance management application that allows users to plan and manage their loans. The application provides endpoints for creating, retrieving, updating, and deleting records in the system, and it supports secure access via JWT authentication.

---

## Technical requirements

- Programming language - NodeJS
- Database - PostgreSQL
- Docker

---

## Base URL

`http://localhost:3000`

---

## API Documentation

### 1. Endpoint `login`

- Endpoint: `login`
- Standard: JWT
- Server should answer with status code 403 if login data is invalid and redirect to the homepage with 200 status, if a new user created successfully.

> Request
>
> ```
> curl -X 'POST' \\\\
> ‘/login’ \\\\
> {
>   "username": "admin",
>   "password": "admin"
> }
> 
> ```

> Response body(in cookies)
>
> ```
> 
> {
>   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJzYWxhcnkiOiIxLjAwIiwicHJlZmVycmVkX2N1cnJlbmN5X2lkIjoxLCJpYXQiOjE3MjM0OTQzODIsImV4cCI6MTcyMzQ5NTM4Mn0.Riwr3cU3vNev_nsVgJaEBpaYiQxPflWf0IvyN7A7ugw"
> }
> 
> ```

### 2. Endpoint  `logout`

- Endpoint: `logout`
- Standard: JWT

 Request
>
> ```
> curl -X 'POST' \\\\
> ‘/logout’ \\\\
> {
>   No content
> }
> 
> ```

> Response body
>
> ```
> No content
> 
> ```

### 1. Endpoint `register`

- Endpoint: `register`
- Standard: JWT
- Server should answer with status code 403 if user with similar username exists and redirect to the homepage with 200 status, if a new user created successfully.

> Request
>
> ```
> curl -X 'POST' \\\\
> ‘/login’ \\\\
> {
>   "username": "admin",
>   "password": "admin"
> }
> 
> ```

> Response body
>
> ```
>
	No content

> ```
>
### 2. Endpoint `api/client`

- GET `api/client` - get all users
  - Server should answer with status code 200 and all users records.

> Request
>
> ```
> curl -X 'GET' \\\\
> ‘api/client’ \\\\
> 
> ```

> Response body
>
> ```
> [
>   {
>       "client_id": 1,
>        "username": "admin",
>        "password": "admin",
>        "salary": "1.00",
>        "preferred_currency_id": 1
>    },
>    {
>        "client_id": 2,
>        "username": "adfad",
>        "password": "123",
>        "salary": "12342.00",
>        "preferred_currency_id": 3
>    },
>    {
>        "client_id": 3,
>        "username": "mikita",
>        "password": "123123",
>        "salary": "123123.00",
>        "preferred_currency_id": 5
>    },
>    {
>        "client_id": 4,
>        "username": "mikita1",
>        "password": "123123",
>        "salary": "1233.00",
>        "preferred_currency_id": 4
>    }
>]
> ```

- GET `api/client/{id}` - get one user by ID
  - Server should answer with status code 200 and record with id === userId if it exists
  - Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

|Parameter|Type|Required|Description|
|---|---|---|---|
|userId|string|yes|user's ID|

> Request
>
> ```
> curl -X 'GET' \\\\
> ‘api/client/1’ \\\\
> 
> ```

> Response body
>
> ```
> {
    "client_id": 1,
    "username": "admin",
    "password": "admin",
    "salary": "1.00",
    "preferred_currency_id": 1
}
>
> ```

- POST `api/client` - create record about new user and put it in database. The request body should contain the required information.
  - Server should answer with status code 201 and newly created record

> Request
>
> ```
> curl -X 'POST' \\\\
> ‘api/client’  \\\\
> -d '{
    "username": "test",
    "password": "tsst",
    "salary": 228,
    "preferred_currency_id": 1
> }'
>
> ```

> Response body
>
> ```
> {
    "client_id": 5,
    "username": "test",
    "password": "tsst",
    "salary": "228.00",
    "preferred_currency_id": 1
}
>
> ```

- PUT `api/client/{id}` - update existing user. The request body should contain the updated information for the product.
  - Server should answer with status code 200 and update the record
  - Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

|Parameter|Type|Required|Description|
|---|---|---|---|
|userId|string|yes|user's ID|

> Request
>
> ```
> curl -X 'PUT' \\\\
> ‘api/client’  \\\\
> -d '{
    "id": 3,
    "username": "mikita"
}'
>
> ```

> Response body
>
> ```
> {
    "client_id": 3,
    "username": "mikita",
    "password": "123123",
    "salary": "123123.00",
    "preferred_currency_id": 5
}
>
> ```

- DELETE `api/client/{userId}` - delete existing user from database
  - Server should answer with status code 204 if the record was found and delete the record, returning deleted record
  - Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

> Request
>
> ```
> curl -X 'DELETE' \\\\
> ‘api/client/1’ \\\\
> 
> ```

> Response body
>
> ```
>{
    No content
  }
>
> ```

### 3. Endpoint `api/loan

- POST `api/loan` -  - create record about new user and put it in database. The request body should contain the required information.
  - Server should answer with status code 201 and newly created record

> Request
>
> ```
> curl -X 'POST' \\\\
> ‘api/loan’
> -d '{
    "client_id": 2,
    "desired_interest_rate": "1",
    "max_loan_amount": "1",
    "repayment_plan": "1",
    "total_interest_paid": "1"
} \\\\
>
> ```

> Response body
>
> ```
>{
    "loan_id": 4,
    "client_id": 2,
    "desired_interest_rate": "1.00",
    "max_loan_amount": "1.00",
    "repayment_plan": 1,
    "total_interest_paid": "1.00"
}
>
> ```

- GET `api/loan/{client_id}` - get all the loans of a user
  - Server should answer with status code 200 and records of a user
  - Server should answer with status code 404 and corresponding message if loans of user with client_id provided is not found
  - Server should answer with status code 500 and corresponding message if there was an error fetching loans

> Request
>
> ```
> curl -X 'GET' \\\\
> ‘api/loan/2’ \\\\
> 
> ```
>
> Response body
>
> ```
> {
    "2": {
        "loan_id": 2,
        "client_id": 2,
        "desired_interest_rate": "23.00",
        "max_loan_amount": "1514.10",
        "repayment_plan": 11,
        "total_interest_paid": "319.20"
    },
    "3": {
        "loan_id": 3,
        "client_id": 2,
        "desired_interest_rate": "99.00",
        "max_loan_amount": "2449.70",
        "repayment_plan": 11,
        "total_interest_paid": "2223.10"
    }
    }
>
> ```

- DELETE `api/loan/{id}` - delete existing loan from database
  - Server should answer with status code 204 if the record was found and delete the record, returning deleted record
  - Server should answer with status code 404 and corresponding message if record doesn't exist

> Request:
>
> ```
> curl -X 'DELETE' \\\\
> 'api/loan/2
> 
> ```

> Response body
>
> ```
>{
    "loan_id": 2,
    "client_id": 2,
    "desired_interest_rate": "23.00",
    "max_loan_amount": "1514.10",
    "repayment_plan": 11,
    "total_interest_paid": "319.20"
}
>
> ```

### Install

Clone this repo with command

```
git clone https://github.com/polemicos/PersonalFinanceAdvisorProj.git

```

Go to project folder

```
cd PersonalFinanceAdvisorProj

```

Install dependencies

```
npm install

```

### Run in docker container

For running application in Docker container you should have docker installed on your system and running.

Build the image

```
docker build -t financeproj .

```

Run app

```
docker compose up -d

```

At this moment everything is ready. Please, visit the base url the very first time running the app, because the db setup is dependent on this.

Stop app

```
docker compose down

```
