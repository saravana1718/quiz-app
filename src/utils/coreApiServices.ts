interface location {
  [key: string]: string | number;
}
const parsedUserData = localStorage.getItem("userData");
const userData =
  typeof parsedUserData === "string" ? JSON.parse(parsedUserData) : null;

export const baseUrl = "http://34.58.159.191:8000/";
export const attachDefaultContentType = (header: {
  [key: string]: string | number;
}) => {
  if (header["Content-Type"] === null || header["Content-Type"] === undefined) {
    header["Content-Type"] = "application/json";
  }
  return header;
};
export const get = async (api: string, headers = {}) => {
  headers = attachDefaultContentType(headers);

  try {
    const response = await fetch(api, {
      cache: "no-store",
      method: "GET",
      headers: headers,
    });

    const data = await response.json();

    return {
      data: data,
      status: response.status,
    };
  } catch (error) {
    console.log(error);
  }
};
export const xformPost = async (
  api: string,
  body: { [key: string]: string | number | boolean | string[] | undefined },
  headers = {},
  isLogin?: boolean
) => {
  headers = {
    ...headers,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    if (!isLogin) {
      await checkAccessToken();
    }

    const formBody = new URLSearchParams();
    for (const key in body) {
      if (body[key] !== undefined) {
        formBody.append(key, String(body[key]));
      }
    }

    const response = await fetch(api, {
      method: "POST",
      headers,
      body: formBody.toString(),
      cache: "no-store",
    });

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error(error);
  }
};

export const post = async (
  api: string,
  body: {
    [key: string]:
      | string
      | number
      | location
      | boolean
      | string[]
      | undefined
      | any;
  },
  headers = {},
  isLogin?: boolean
) => {
  headers = attachDefaultContentType(headers);

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();
    // console.log(headers, body, response);
    return { data, status: response.status };
  } catch (error) {
    console.log(error);
  }
};
export const verifyToken = async () => {
  const response = await fetch(`${baseUrl}token/verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: localStorage.getItem("truvissToken") }),
  })
    .then((response) => response.json())
    .then((actualData) => actualData);
  return await response;
};
export const getAccessToken = async (payload: { refresh: string | null }) => {
  const response = await fetch(`${baseUrl}auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((actualData) => actualData);
  return await response;
};
export const checkAccessToken = async () => {
  const res = await verifyToken();
  if (res.detail) {
    await setToken();
  } else {
    return;
  }
};
const setToken = async () => {
  const res = await getAccessToken({
    refresh: userData?.refresh,
  });
  if (res.access) {
    localStorage.setItem("truvissToken", res.access);
  } else {
    localStorage.removeItem("truvissToken");
    localStorage.removeItem("userData");

    window.location.reload();
  }
};
