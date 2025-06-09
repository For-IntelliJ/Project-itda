import React from 'react';

const PasswordInput = ({ onChange }) => {
    const handleChange = (e) => {
        const value = e.target.value;
        onChange(value);
    };

    return (
        <div className="mb-2 w-full">
            <p className="mb-1 text-font">비밀번호</p>
            <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="비밀번호"
                className="w-full rounded border border-hover p-2 transition duration-200 hover:border-2 hover:border-hover focus:border-2 focus:border-hover focus:outline-none"
                required
            />
        </div>
    );
};

export default PasswordInput;
