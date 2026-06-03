import requests


def call_external_api(

    url: str,

    method: str = "GET",

    headers: dict = None,

    payload: dict = None,

    timeout: int = 10

):

    try:

        if method == "GET":

            response = requests.get(

                url,

                headers=headers,

                timeout=timeout
            )

        elif method == "POST":

            response = requests.post(

                url,

                json=payload,

                headers=headers,

                timeout=timeout
            )

        else:

            return {

                "success": False,

                "message": "Unsupported HTTP Method"
            }

        return {

            "success": True,

            "status_code":
            response.status_code,

            "data":
            response.json()
        }

    except Exception as e:

        return {

            "success": False,

            "message": str(e)
        }