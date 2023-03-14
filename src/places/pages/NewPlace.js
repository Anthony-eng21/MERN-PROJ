import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

// //input action
// const formReducer = (state, action) => {
//   switch (action.type) {
//     case "INPUT_CHANGE":
//       //ensures that any validity in this form breaks then this will yield false and the form validity becomes false
//       let formIsValid = true;
//       for (const inputId in state.inputs) {
//         if (inputId === action.inputId) {
//           formIsValid = formIsValid && action.isValid;
//         } else {
//           formIsValid = formIsValid && state.inputs[inputId].isValid;
//         }
//       }
//       //makes sure we update all of the form validity and input state
//       return {
//         ...state,
//         inputs: {
//           ...state.inputs,
//           //dynaimcally updates our values in one of our inputs values
//           [action.inputId]: { value: action.value, isValid: action.isValid },
//         },
//         isValid: formIsValid,
//       };
//     default:
//       return state;
//   }
// };

const NewPlace = () => {
  const authCtx = useContext(AuthContext);
  const { error, isLoading, sendRequest, clearError } = useHttpClient();
  // const [formState, dispatch] = useReducer(formReducer, {
  //   //initial state of our reducer
  //   inputs: {
  //     title: {
  //       value: "",
  //       isValid: false,
  //     },
  //     description: {
  //       value: "",
  //       isValid: false,
  //     },
  //     address: {
  //       value: "",
  //       isValid: false,
  //     },
  //   },
  //   isValid: false,
  // });

  const [formState, inputHandler] = useForm(
    //pass our inputs orginal state here
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
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

  //use this navigate after we try some logic
  const history = useHistory();

  // const inputHandler = useCallback((id, value, isValid) => {
  //   dispatch({
  //     type: "INPUT_CHANGE",
  //     value: value,
  //     isValid: isValid,
  //     inputId: id,
  //   });
  // }, []);

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    //send data to server
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(process.env.REACT_APP_BACKEND_URL + "/places", "POST", formData, {
        //attach this token to the header request then we can makes posts
        Authorization: "Bearer " + authCtx.token,
      }); //success case
      history.push("/");
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={placeSubmitHandler} className="place-form">
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]} //this will return validator config objects when called here for this prop on our input element
          errorText="please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]} //this will return validator config objects when called here for this prop on our input element
          errorText="please enter a valid description (at least 5 five characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]} //this will return validator config objects when called here for this prop on our input element
          errorText="please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          center
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button on type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
