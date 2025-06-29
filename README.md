# ShortLi
This is URL shortening tool. This service takes http url link and returns random sequence. This is helps shorting big URL link into small one.

## Core functions:
1. URL shortening
2. URL redirection
3. Link analytics

![url_short](https://github.com/user-attachments/assets/83900e39-2eee-43c9-b6db-a72410b7e568)

## API Endpoints:

1. POST /api/shorten
Request:
  {
    long_url: (string)
  }
Response:
{
  short_url: (string)
}

2. GET /api/geturl?{shorturl}
Response:
{
  long_url: (string)
}
