# PawLog

PawLog is an application for pet owners to connect and share their experiences and advice about their favourite furry friends. Our application will provide users the ability to interact with a community of like-minded people through the creation of posts about their favourite pet, as well as commenting on and browsing other people’s posts.

# Table of Contents

1. Setup
    - [Install client dependencies](#install-client-dependencies)
    - [Install server dependencies](#install-server-dependencies)
    - [Create env file](#create-env-file)
    - [Load mock data](#load-mock-data)
    - [Create local-start script](#create-local-start-script)
2. Running the project
    - [Start the client](#start-the-client)
    - [Setup SSH tunneling](#setup-ssh-tunneling)
    - [Start the server](#start-the-server)

## Setup

### Install client dependencies

Navigate to the client directory.

```
cd client
```

Install all `npm` dependencies.

```
npm install
```

### Install server dependencies

Navigate to the server directory.

```
cd server
```

Install all `npm` dependencies.

```
npm install
```

### Create `.env` file

Navigate to the server directory.

```
cd server
```

Using the `.env.example` [file](https://github.com/jamiema1/pawlog/blob/main/server/.env.example) as a template, create a `.env` file and replace the placeholders with the correct values.

```
# TODO: replace <cwl>
ORACLE_USER=ora_<cwl>
# TODO: replace <student_number>
ORACLE_PASS=a<student_number> 
PORT=80 
# -------------- The three lines below should be left unaltered -------------- 
ORACLE_HOST=localhost 
ORACLE_PORT=50000
ORACLE_DBNAME=stu 
```

### Load mock data

Navigate to the server scripts directory.

```
cd server\scripts
```

Copy the sql script `pawlog.sql` to the remote server.

```
scp pawlog.sql <cwl>@remote.students.cs.ubc.ca:<dir_path>
```

Follow the prompts.

```
<cwl>@remote.students.cs.ubc.ca's password: <password>
```

SSH into the remote server.

```
ssh <cwl>@remote.students.cs.ubc.ca
```

Follow the prompts.

```
<cwl>@remote.students.cs.ubc.ca's password: <password>
```

Launch SQL*Plus.

```
rlwrap sqlplus ora_<cwl>/a<student_number>@stu
```

Run `pawlog.sql`

```
start <dir_path>/pawlog.sql
```

Finally, exit out of SQL*Plus to prevent `ORA-02391: exceeded simultaneous SESSIONS_PER_USER limit` when running the server.

### Create local-start script

Follow the instructions [here](https://www.students.cs.ubc.ca/~cs-304/resources/javascript-oracle-resources/node-setup.html#:~:text=Oracle%20Instant%20Client%20Installation%20and%20Configuration%3A) to download the Oracle Instant Client.

Navigate to the server scripts directory.

```
cd server\scripts
```

Run the following command.

```
instantclient-setup.cmd
```

Follow the prompts.

```
Please enter the absolute path to the Oracle Instant Client directory: <absolute_path>
```

## Running the project

### Start the client

Navigate to the client directory.

```
cd client
```

Run the following command.

```
npm run dev
```

### Setup SSH tunneling

Navigate to the server scripts directory.

```
cd server\scripts
```

Run the following command.

```
db-tunnel.cmd
```

Follow the prompts.

```
Enter your CWL name: <cwl>
<cwl>@remote.students.cs.ubc.ca's password: <password>
```

### Start the Server

Navigate to the server directory.

```
cd server
```

Then run the following command.

```
local-start.cmd
```
