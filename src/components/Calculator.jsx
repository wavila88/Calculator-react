import React from 'react';
import './Calculator.css'

export default class Calculator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			output: '',
			operatorArray: [],
			equalValue: ''
		};

		this.insertNumber = this.insertNumber.bind(this);
		this.clearDisplay = this.clearDisplay.bind(this);
		this.addToOperatorNumberToArray = this.addToOperatorNumberToArray.bind(this)
		this.resolveProblem = this.resolveProblem.bind(this);
		this.operations = this.operations.bind(this);
		this.fixArrays = this.fixArrays.bind(this);
	}

	insertNumber(number) {
		let cleanCalculator
		const alreadyOperationResolve = this.state.equalValue !== '' && this.state.operatorArray.length === 0;
		if (alreadyOperationResolve)
			cleanCalculator = this.cleanCalculator(alreadyOperationResolve);
		//remove un necessary inputs
		let newNumber = this.state.output === '0' ? number : cleanCalculator ? number : this.removeZero(this.state.output.concat(number));
		this.setState(state => ({
			output: newNumber,
			equalValue: cleanCalculator ? '' : this.state.equalValue
		}));
	};



	cleanCalculator() {
		let cleanOperation = false;
		const cleanOperationResolve = this.state.output.indexOf('+') === -1 && this.state.output.indexOf('*') === -1
			&& this.state.output.indexOf('/') === -1;

		if (cleanOperationResolve) {
			const result = this.state.output.indexOf('-');
			//Validate if '-' is for substract to not reset output
			if (result === -1) {
				return cleanOperation = true;
			} else if (result === (this.state.output.length - 1)) {
				return cleanOperation = false;
			}
		}

		return cleanOperation;
	};

	clearDisplay() {
		this.setState(state => ({
			output: ''
		}));
	};

	addToOperatorNumberToArray(opt) {
		const isSubstract = this.state.output === '-';
		let printOperator = this.state.output === '' && opt !== '-' ? false : true;
		printOperator = isSubstract ? false : printOperator;
		if (printOperator) {
			const operator = this.state.operatorArray;
			if (opt !== '-')
				operator.push(opt);
			let newOutPut = this.removeJoinedOperators(this.state.output.concat(opt));
			this.setState(state => ({
				output: newOutPut,
				operatorArray: operator,
			}));
		}
	}

	removeZero(outPut) {
		let array;
		if (outPut !== '') {
			array = outPut.split('');
			const arrayPositions = this.myIndexOf(array, '0');
			arrayPositions.forEach(element => {
				if (element !== '0') {
					const before = array[element - 1];
					const after = array[element + 1];

					if (isNaN(parseInt(before)) && !isNaN(parseInt(after))) {
						array.splice(element, 1);
					}
				}
			});
		}
		return array.join('');
	}

	removeJoinedOperators(outPut){
		let array;
		if (outPut !== '') {
			array = outPut.split('');
			const substractPositions = this.myIndexOf(array, '-');
			const plusPositions = this.myIndexOf(array, '+');
			const dividePositions = this.myIndexOf(array, '/');
			const multiplyPositions = this.myIndexOf(array, '*');

			array = this.removeOperator(substractPositions,array);
			array = this.removeOperator(plusPositions,array);
			array = this.removeOperator(dividePositions,array);
			array = this.removeOperator(multiplyPositions,array);
		}
		return array.join('');
	}

	removeOperator(operatorPositions, array){
		operatorPositions.forEach(element => {
			if (element !== '0') {
				const before = array[element - 1];
				const after = array[element + 1];
				const actual = array[element]
				if (!isNaN(parseInt(before)) && isNaN(parseInt(after)) && after !== undefined) {
					if( after !== '-'){
						array.splice(element, 1);
					} 
					if(actual === '+' && after === '-'){
						array.splice(element, 1);
					}
					if(actual === '-' && after === '-'){
						array.splice(element, 1);
					}
				} else if(isNaN(parseInt(before)) && isNaN(parseInt(after))){
					if(after === '-'){
						array.splice(element, 1);
					}
					if(isNaN(parseInt(actual))){
						array.splice(element+1, 1);
					} 
				}
			}
		});
		return array;
	}

	resolveProblem() {
		let result = this.state.equalValue === '' ? undefined : this.state.equalValue.toString();
		const optArray = this.state.operatorArray;
		let numberArray = this.state.output.replace('+', ' ').replace('/', ' ').replace('*', ' ').split(' ');
		debugger;
		const fixedArrays = this.fixArrays(numberArray, optArray);
		if (fixedArrays.numbers[fixedArrays.numbers.length - 1] === '') {
			alert('You need to add a number');
			return;
		} else {
			for (let i = 0; i < fixedArrays.operators.length; i++) {
				result = result === undefined ? fixedArrays.numbers[i] : result;
				result = this.operations(fixedArrays.operators[i], parseInt(result), parseInt(fixedArrays.numbers[i + 1]));
			}
			debugger;
			this.setState(state => ({
				output: result.toString(),
				operatorArray: [],
				equalValue: result.toString()
			}));
		}

	}

	operations(operator, num1, num2) {
		let result;
		switch (operator) {
			case '+':
				result = num1 + num2;
				break;
			case '-':
				result = num1 - num2;
				break;
			case '*':
				result = num1 * num2;
				break;
			case '/':
				if (num2 !== 0) {
					result = Math.floor(num1 / num2);
				} else {
					result = '';
				}
				break;
			default:
				result = num1 + num2;
				break;
		}
		return result;
	}



	fixArrays(array, optArray) {
		let fixedArray = { numbers: [], operators: [] };
		let initNegative = false;
		fixedArray.operators = fixedArray.operators.concat(optArray);
		for (let i = 0; i < array.length; i++) {

			const issubstracterPosition = array[i].indexOf('-');
			if (issubstracterPosition !== -1) {
				if (issubstracterPosition === 0) {
					initNegative = true;
					fixedArray.numbers.push(array[i])
				} else {
					const dividedElement = array[i].replace('-', ' ').split(' ');
					fixedArray.numbers = fixedArray.numbers.concat(dividedElement);
					fixedArray.operators.unshift('-');
				}

			} else {
				fixedArray.numbers.push(array[i]);
			}
		}
		return fixedArray;
	}

	myIndexOf(collection, target) {
		let index = 0;
		let arrayPositions = [];
		for (var val in collection) {
			if (collection[val] === target) {
				arrayPositions.push(index);
			}
			index++;
		}
		return arrayPositions;
	}

	render() {
		return (
			<div className='calculator'>
				<div className='output'>
					<textarea id='output' className='output-text' placeholder={'Enter Number'} value={this.state.output} />
				</div>
				<div className='button digit-0' onClick={this.insertNumber.bind(this, "0")}>
					0
            </div>
				<div className='button digit-1' onClick={this.insertNumber.bind(this, "1")}>
					1
            </div>
				<div className='button digit-2' onClick={this.insertNumber.bind(this, "2")}>
					2
            </div>
				<div className='button digit-3' onClick={this.insertNumber.bind(this, "3")}>
					3
            </div>
				<div className='button digit-4' onClick={this.insertNumber.bind(this, "4")}>
					4
            </div>
				<div className='button digit-5' onClick={this.insertNumber.bind(this, "5")}>
					5
            </div>
				<div className='button digit-6' onClick={this.insertNumber.bind(this, "6")}>
					6
            </div>
				<div className='button digit-7' onClick={this.insertNumber.bind(this, "7")}>
					7
            </div>
				<div className='button digit-8' onClick={this.insertNumber.bind(this, "8")}>
					8
            </div>
				<div className='button digit-9' onClick={this.insertNumber.bind(this, "9")}>
					9
            </div>
				<div className='button op-add' onClick={this.addToOperatorNumberToArray.bind(this, "+")}>
					+
            </div>
				<div className='button op-mul' onClick={this.addToOperatorNumberToArray.bind(this, "*")}>
					*
            </div>
				<div className='button op-div' onClick={this.addToOperatorNumberToArray.bind(this, "/")}>
					/
            </div>
				<div className='button op-sub' onClick={this.addToOperatorNumberToArray.bind(this, "-")}>
					-
            </div>
				<div className='button clear' onClick={this.clearDisplay}>
					c
            </div>
				<div className='button eq' onClick={this.resolveProblem}>
					=
            </div>


			</div>
		);
	}
};

