# youtube-layer
## Description:
A cloud-based collaboration platform enabling YouTubers and Editors to collaborate securely on video content without granting full access to YouTube accounts. The platform uses YouTube APIs for video uploads and Azure Vaults to secure channel credentials, ensuring secure and efficient workflow.

## Features:
### User Management:
- Secure registration and authentication for YouTubers and Editors.
- Unique username assignment based on user roles (y- for YouTubers, e- for Editors).
- JWT-based authentication for secure API access.
### Collaboration Management:
- YouTubers can search and send collaboration requests to registered Editors.
- Editors can accept or reject collaboration requests.
- Notifications for collaboration requests and status updates.
### Video Management:
- Editors can upload videos to the portal for YouTubers to review.
- YouTubers can stream the uploaded videos directly on the portal.
- Upon approval, videos are automatically uploaded to the YouTuber's channel using YouTube API.
- Rejected videos trigger an email notification to Editors with the reasons provided by the YouTubers.
### Security and Compliance:
- Azure Key Vaults used to securely store YouTuber channel credentials.
- All user credentials (Email, Password, Mobile No.) securely stored in an Azure SQL Database with encryption.
- Private access level for Azure Blob Storage to ensure video file security.
## Technologies Used:
### Backend:
- Express.js: RESTful API development.
-  MSSQL: Azure SQL Database for user and video metadata storage.
- Azure Key Vault: Secure storage for YouTube channel credentials.
- Azure Blob Storage: Secure and scalable storage for video files.
### Frontend:
- React.js: Dynamic and responsive user interface.
## Authentication and Authorization:
- JWT: Secure token-based authentication.
## File Handling and Uploads:
- Multer: Middleware for handling multipart/form-data for file uploads.
- Azure Storage Blob SDK: Upload and manage video files in Azure Blob Storage.
## Email Notifications:
- Nodemailer: Sending email notifications for collaboration updates.
## Key Achievements:
- Ensured secure collaboration without exposing sensitive YouTube credentials.
- Leveraged cloud services to build a scalable and reliable system.
- Implemented a robust authentication and authorization mechanism to protect user data.
- Streamlined video review and approval process, enhancing workflow efficiency for YouTubers and Editors.


This project demonstrates the ability to design and implement secure, cloud-based solutions, integrating various Azure services for storage, security, and scalability.










