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
    max_loan_amount DECIMAL(15,2) NOT NULL,
    repayment_plan SMALLINT NOT NULL,
    total_interest_paid DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES Client(client_id)
);

INSERT INTO Currency (currency_code, currency_name) VALUES ('USD', 'United States Dollar');
INSERT INTO Currency (currency_code, currency_name) VALUES ('BYN', 'Belarusian Ruble');
INSERT INTO Currency (currency_code, currency_name) VALUES ('PLN', 'Polish Zloty');
INSERT INTO Currency (currency_code, currency_name) VALUES ('EUR', 'Euro');
INSERT INTO Currency (currency_code, currency_name) VALUES ('GBP', 'British Pound Sterling');


INSERT INTO Client (username, password, salary, preferred_currency_id) VALUES ('admin', 'admin', 1, 1);


INSERT INTO Loan (client_id, desired_interest_rate, max_loan_amount, repayment_plan, total_interest_paid) VALUES (1, 1, 1, 1, 1);
