

TypeScript PostgrelSQL Authentication Form.



Overview: 





Features:
	Uses pg.Client to connect to PostgreSQL with credentials from environment variables.
	•	Logs PostgreSQL configuration for debugging.
	•	Handles connection errors.

 
 Queries PostgreSQL to verify user credentials.
	•	Uses bcrypt.compare() to validate passwords.
	•	Issues a JWT upon successful authentication.

JSON User Storage:
	•	Reads and writes user data to user.json.
	•	Periodically logs the JSON user data every 5 seconds.
	•	Creates an empty user.json file if it doesn’t exist.
	•	CSV User Storage:
	•	Appends user data to users.csv.
	•	Creates a CSV file with a header (Username,Email,Password) if it doesn’t exist.
	•	Reads and logs CSV data.



 Helmet: Enhances security by setting various HTTP headers.
	•	CORS: Restricts resource access to http://localhost:3000 with credentials support.
	•	bcrypt: Hashes passwords for secure storage.
	•	jsonwebtoken (JWT): Implements token-based authentication with cookies.
	•	cookieParser: Parses cookies to manage authentication tokens.
	•	Environment Variables (dotenv): Protects sensitive credentials like PostgreSQL and JWT secrets.


 








![mongodb screenshot](https://github.com/user-attachments/assets/b59c343b-6bc4-401a-86ee-9cb38a85dce9)
![postgrelformjsonsnapshot](https://github.com/user-attachments/assets/0ae11e7e-22ee-4adf-86ee-b6d5466517c0)
![TypeScriptPostgrelSQLAuthentication_two](https://github.com/user-attachments/assets/a5424420-ca6f-4c21-85d7-10048d520370)
![TypeScriptPostgrelSQLAuthentication](https://github.com/user-attachments/assets/f07ee3d1-23e5-4ec2-ac54-7f283c712ff7)
