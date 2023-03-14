import React, { useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";

const Auth = () => {
  const authCtx = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { error, isLoading, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    //case not in login mode when we set this data
    if (!isLoginMode) {
      //drop name field
      setFormData(
        {
          ...formState.inputs, //keep same state for toher fields then drop this name field
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.email.isValid
      );
    } else {
      //cant be valid cus we add the name field for when we change to signin mode
      setFormData(
        {
          ...formState.inputs, //keep same state then add this new name field logic
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode); //state inversion lol for logged in logged out state
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log(formState.inputs);

    if (isLoginMode) {
      //login mode
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        authCtx.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    } else {
      //signup mode with the form data format and not json
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value); //look for image key on backend on our req body key
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );

        authCtx.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Username"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <Card>
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Please provide an image, preferably a small portrait."
              />
            </Card>
          )}
          <Card>
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password, at least 6 characters."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? "Login" : "Signup"}
            </Button>
          </Card>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch To {isLoginMode ? "Signup" : "Login"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
