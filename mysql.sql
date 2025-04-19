CREATE TABLE form8843_data (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(100) NOT NULL, 
    "visaType" VARCHAR(50) NULL, 
    "citizen" VARCHAR(50)  NULL, 
    "wantToFile2021" VARCHAR(100)  NULL, 
    "wantToFile2022" VARCHAR(100)  NULL, 
    "wantToFile2023" VARCHAR(100)  NULL, 
    "wantToFile2024" VARCHAR(100)  NULL, 
    "passportNumber" VARCHAR(20)  NULL, 
    "firstEntry" DATE  NULL, 
    "universityName" VARCHAR(100)  NULL, 
    "universityAdvisorName" VARCHAR(100) NULL, 
    "universityCity" VARCHAR(50) NULL, 
    "universityStreet" VARCHAR(100) NULL, 
    "universityZipcode" VARCHAR(20) NULL, 
    "universityAdvisorNumber" VARCHAR(20) NULL, 
    "universityState" VARCHAR(50) NULL, 
    "noOfDaysUSA" JSONB[] NULL ,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON form8843_data TO "harikrishnanr";

GRANT USAGE, SELECT, UPDATE ON SEQUENCE form8843_data_id_seq TO "harikrishnanr";

CREATE TABLE transactions (
    "id" SERIAL PRIMARY KEY,
    "userId" VARCHAR(100) NOT NULL, 
    "paymentId" VARCHAR(300) NOT NULL, 
    "amount" INTEGER NOT NULL, 
    "currency" VARCHAR(50) NOT NULL, 
    "status" VARCHAR(50) NOT NULL, 
    "liveMode" BOOLEAN NOT NULL, 
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON transactions TO "harikrishnanr";

GRANT USAGE, SELECT, UPDATE ON SEQUENCE transactions TO "harikrishnanr";