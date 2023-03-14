import React, { useReducer, useEffect } from "react";
//allows us to manage state in a component and update state on re-renders via some callback
// (for more complex connected state)

//validate function from this util reducer logic
import { validate } from "../../util/validators";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state, //creates a copy of the old state objects w keyValue pairs into this new object
        value: action.val, //overwrites selected keys and values stored onto this action obj
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  //second argument is the initial state we want to set up
  //useReducer it returns an array with exactly two elements(in our destructured array)
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  //we get all these things from outside via props
  //expect some function here onInput()

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  //whenever when one of these things changes we will call onInput here on some prop with some outside function
  useEffect(() => {
    onInput(id, value, isValid);
  }, [onInput, id, value, isValid]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators, //configure this in the higher component
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //this element const is either an input or text-area
  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeHolder}
        onBlur={touchHandler}
        onChange={changeHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onBlur={touchHandler}
        onChange={changeHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
