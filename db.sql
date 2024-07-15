CREATE TABLE Currency (
    currency_id SERIAL PRIMARY KEY,
    currency_code VARCHAR(3) NOT NULL UNIQUE,
    currency_name VARCHAR(50) NOT NULL
);

CREATE TABLE Client (
    client_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    preferred_currency_id INT NOT NULL,
    FOREIGN KEY (preferred_currency_id) REFERENCES Currency(currency_id)
);

CREATE TABLE Loan (
    loan_id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    desired_interest_rate DECIMAL(4,2) NOT NULL,
    max_loan_amount DECIMAL(10,2) NOT NULL,
    repayment_plan TEXT NOT NULL,
    total_interest_paid DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES Client(client_id)
);


