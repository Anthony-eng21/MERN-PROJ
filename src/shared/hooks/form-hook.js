import { useCallback, useReducer } from "react";

//Form Reducer Logic lives in this hook
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      //ensures that any validity in this form breaks then this will yield false and the form validity becomes false
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) { //checks for undefined properties in different forms
          //work around in our auth form for skipping undefined fields
          continue; //continue continue continue
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      //makes sure we update all of the form validity and input state
      return {
        ...state,
        inputs: {
          ...state.inputs,
          //dynaimcally updates our values in one of our inputs values
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

//arguments are for configurability from outside this hook
export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    //initial state of our reducer and for when we call this hook
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  //for setting our initial form data
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  //data we want to use on our hook from outside
  return [formState, inputHandler, setFormData];
};
