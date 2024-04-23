import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useRouter } from "next/navigation";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const router = useRouter();
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const [token, setToken_] = useState("");

  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
      router.push("/");
      return;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  const initialize = async () => {
    setToken_(localStorage.getItem("token"));
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = token !== null;
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      function getUserInformation() {
        // Retrieving the JWT payload from local storage
        var token = localStorage.getItem("token");

        if (!token) {
          console.error("Token not found");
          return null;
        }

        var payload;
        try {
          // Parsing the JWT payload to get the first_name and last_name and email values
          //1 is payload and that will become JSON object
          //payload = JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          console.error("Error decoding token: ", e);
          return null;
        }

        // Getting the first_name, last_name and email values
        var firstName = payload.first_name;
        var lastName = payload.last_name;
        var email = payload.email;

        const user = {
          //avatar: "/assets/avatars/avatar-anika-visser.png",
          name: firstName + lastName,
          first_name: firstName,
          last_name: lastName,
          email: email,
        };
      }

      dispatch({
        type: HANDLERS.INITIALIZE,
        //payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signIn = async (userResponse) => {
    // if (email !== "demo@devias.io" || password !== "Password123!") {
    //   throw new Error("Please check your email and password");
    // }
    try {
      window.sessionStorage.setItem("authenticated", "true");
      localStorage.setItem("token", userResponse.token);
      setToken_(userResponse.token);
    } catch (err) {
      console.error(err);
    }

    let token = userResponse.token;

    // axios
    //   .post("http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/userdata/", {
    //     headers: {
    //       authorization: token,
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     return response.data;
    //   })
    //   .catch((error) => {
    //     console.error("Error deleting resource:", error);
    //   });

    const user = {
      //id: "5e86809283e28b96d2d38537",
      // avatar: "/assets/avatars/avatar-anika-visser.png",
      name: userResponse.first_name + " " + userResponse.last_name,
      first_name: userResponse.first_name,
      last_name: userResponse.last_name,
      email: userResponse.email,
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signUp = async (email, name, password) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
        contextValue,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
