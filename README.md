# Blogs API

JSON-Based API for Managing and Creating Blog Posts with User Authentication and Authorization.



## Prerequisites

| Binaries | Version          |
| -------- | ---------------- |
| NodeJS   | >= 14.17.6 - LTS |
| NPM      | 8.12..1          |

```sh
# Clone the Repo
git clone git@github.com:Ahmad-Abdalmageed/blog.git
cd ./blog/

# Install the Dependencies listed in the package.json 
# You could also use npm install
npm install
```

For local testing of the API you'll need to create a `.env` file with the following variables,

```sh
PORT=8000
db={MongoDB Connection String for dev DB}
db_test={MongoDB Connection String for test DB}
bcrypt_pass=dealapp
token_secret=deal
bcrypt_salt=10
node_env=dev
base_url=http://localhost:8000/
```

To start Local Server hit `npm run start` in terminal, also provided a `Nodemon`watcher for development using `npm run watch`.

## Users

### Create User

User Authentication start with a Request for `{base_url}/user/signup` with the following description. User name and Password is sent in the body of the request.

```sh
POST http://localhost:8000/user/signup/
Content-Type: application/json
Accept: */*
 
{
	"email": {email},
	"password": {password}
}
```

On Successful Invoke the API Responds with the Verification link and the newly created user entry. For `ADMIN` role users add a parameter `role: 'ADMIN'` to the Request Body

### Login User

For user login start a Request at `{base_url}/user/login` with the following description, The endpoint then responds with the Generated JWT for this user for further Authorizations.

```sh
POST http://localhost:8000/user/login/
Content-Type: application/json
Accept: */*
 
{
	"email": {email},
	"password": {password}
}
```



## Posts

### Create Post

Posts Creates requires an Authorization header with `Bearer Auth` in order to create a single post. The JWT Response from user login is used to generate the Token and is send along with the request to create the post, The body of the Post is a required attribute. This Endpoint is accessible only by the Users.

```sh
POST http://localhost:8000/posts/
Authorization: bearer {token}
Content-Type: application/json
Accept: */*
 
{
	'title': {Post Title},
	'body': {Post Body}
}
```

### List All Posts

Users can List the posts available on the Blog (Approved by Admins only) while admins will list all posts for approval. 

```sh
GET http://localhost:8000/posts/
Authorization: bearer {token}
Content-Type: application/json
Accept: */*
```

The endpoint then responds with an object with the following description

```json
{
  "data": [{
      "title": "POST TITLE",
	  "body": "POST BODY",
      "status": "POST STATUS",
      "createdAt": "POST CREATION DATE",
      "createdBy": {
      "_id": "USER ID",
      "email": "USER EMAIL",
      "role": "USER ROLE"
    },
    "interactions": {
        "INTERACTION": "{COUNT}"
    }
  }],
  "total": "Number",
  "page": "Number",
  "limit": "Number",
  "totalPages": "Number",
  "hasNextPage": "Boolean",
  "hasPrevPage": "Boolean"
}
```



## Admin Panel

### Statistics

Blog Admins can get blog statistics listing the number of posts, comments, interactions and users. 

```
GET http://localhost:8000/admin/statistics
Authorization: bearer {token}
Content-Type: application/json
Accept: */*
```

The Endpoint responds with data with the following format

```json
{
	"posts": {
        "APPROVED": "Number",
        "PENDING": "Number",
        "REJECTED": "uNmber",
        "total": "Number"
    },
    "comments": {
        "total": "Number"
    },
    "interactions": {
        "interactionsOnPosts": "Nmber",
        "interactionsOnComments": "Number",
        "total": "Number"
    }    
}
```

## Swagger 

For the OpenAPI Documentation start a request at `{base_url}/api-docs`



## Testing

Well the best tool to spin up this API is to use Postman, you can setup the endpoints and pass in the payloads required. However we have a Testing Directory with all the Required Test just by running the following command:

```sh
npm run test-offline
```

This manages running the test db provided in the `.env` file and test the API with the Identified Payloads
