import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import Calculator from "./Calculator";

let calc;
let buttons;
let output;
const buttonNames = [
    "op-add", "op-mul", "op-div", "op-sub",  "clear", "eq",
    ...Array(10).fill().map((e, i) => `digit-${i}`),
];

const getButtons = calc =>
    buttonNames.reduce((accumulator, btn) => {
        accumulator[btn] = calc.find("." + btn);
        return accumulator;
    }, {})
;

describe('Calculator', () => {


    it('should render an element with class name "output"', () => {
        calc = mount(<Calculator />);
      //  buttons = getButtons(calc);
    });
});