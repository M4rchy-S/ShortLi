# ShortLi
This is URL shortening tool. This service takes http url link and returns random sequence. This is helps shorting big URL link into small one.

## Core functions:
1. URL shortening
2. URL redirection
3. Link analytics

![url_short](https://github.com/user-attachments/assets/83900e39-2eee-43c9-b6db-a72410b7e568)

## API Endpoints:

1. POST /api/shorten
<pre>
Request:
  {
    long_url: (string)
  }
  
Response:
  {
    short_url: (string)
  }
</pre>


3. GET /api/geturl?{shorturl}
<pre>
Response:
  {
    long_url: (string)
  }
</pre>

## Hot to run
1. Install docker
2. Enter project folder
3. Use terminal command: <code>docker-compose up</code>
