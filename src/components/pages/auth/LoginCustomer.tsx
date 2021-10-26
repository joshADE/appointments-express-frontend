import React from 'react'
import { Link } from 'react-router-dom';
import { Left } from './Left';
import useDigitInput, { InputAttributes } from 'react-digit-input';
import { Button } from '../../shared/Button';
import { useLoginCustomerMutation } from '../../../app/services/appointments';

interface LoginCustomerProps {
    customerId: number;
}

const LoginCustomer: React.FC<LoginCustomerProps> = ({
    customerId
}) => {
    const [value, onChange] = React.useState('');
    const [loginCustomer, { isLoading }] = useLoginCustomerMutation();
    const digits = useDigitInput({
        acceptedCharacters: /^[0-9]$/,
        length: 6,
        value,
        onChange,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginCustomer({ customerId, passcode: value })
        .unwrap()
        .then(res => console.log(JSON.stringify(res)))
        .catch(err => { 
            let message = "Error signing into to the account. ";
            if (err?.data?.errors){
                message = message + err.data.errors;
            }
            alert(message);
        });
    }

        return (
            <section className="w-screen h-screen overflow-auto flex flex-col lg:flex-row">
                <Left />
                <div className="w-full lg:w-1/2 h-3/4 lg:h-full p-10 font-roboto">
                    <h1 className="text-center font-oswald text-4xl mb-10">Enter your passcode:</h1>
                    <p className="text-sm text-center text-gray-500 mb-10">Change your mind? <Link to="/" className="text-green-600">Go back home</Link></p>
                    <form className="mt-20 text-center" onSubmit={handleSubmit}>
                        <DigitInput autoFocus attributes={digits[0]} />
                        <DigitInput attributes={digits[1]} />
                        <DigitInput attributes={digits[2]} />
                        <DigitInput attributes={digits[3]} />
                        <DigitInput attributes={digits[4]} />
                        <DigitInput attributes={digits[5]} />
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="block mx-auto mt-10 mb-5 text-gray-500 hover:text-gray-900"
                        >Submit</Button>
                    </form>
                </div>
            </section>
        );
}

export default LoginCustomer;


interface DigitInputProps {
    attributes: InputAttributes;
    autoFocus? : boolean;
}

const DigitInput: React.FC<DigitInputProps> = ({
    attributes,
    autoFocus
}) => {
    return (<input 
        inputMode="decimal" 
        autoFocus={autoFocus}
        required
        className="w-8 text-xl text-center border-b-2 border-gray-600 mr-2 focus:outline-none focus:border-green-600"
        {...attributes}
    />);

}
